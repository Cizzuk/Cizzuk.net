#!/usr/bin/env node

import { createServer, type IncomingMessage, type ServerResponse } from 'http';
import { readFile, existsSync, statSync, readFileSync } from 'fs';
import { join, extname, dirname, resolve } from 'path';
import { gzip, brotliCompress } from 'zlib';
import { promisify } from 'util';

// === Types ===
interface ServerConfig {
  port: number;
  devMode: boolean;
  docRoot: string;
}

interface Rule {
  pattern: RegExp;
  placeholders: string[];
}

interface RedirectRule extends Rule {
  target: string;
  status: number;
}

interface HeaderRule extends Rule {
  setHeaders: Map<string, string[]>;
  unsetHeaders: Set<string>;
}

// === Constants ===
const MIME_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.atom', 'application/atom+xml; charset=utf-8'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.ico', 'image/x-icon'],
  ['.webp', 'image/webp'],
]);

const COMPRESSIBLE_TYPES = new Set([
  'text/html', 'text/css', 'application/javascript', 'application/json',
  'text/plain', 'application/xml', 'application/atom+xml', 'image/svg+xml'
]);

const MIN_COMPRESSION_SIZE = 1024;
const DEFAULT_404_CONTENT = '404 Page Not Found';

// Promisified compression functions
const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotliCompress);

// === Utilities ===
const logger = {
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  success: (msg: string) => console.log(`✅ ${msg}`),
  warn: (msg: string) => console.warn(`⚠️  ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
  debug: (msg: string, enabled: boolean) => enabled && console.log(`${msg}`),
};

function parseConfig(): ServerConfig {
  const args = process.argv.slice(2);
  let port = parseInt(process.env.PORT || '8080', 10);
  let devMode = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if ((arg === '-p' || arg === '--port') && args[i + 1]) {
      const parsed = parseInt(args[++i], 10);
      if (parsed > 0 && parsed <= 65535) port = parsed;
    } else if (arg === '--dev') {
      devMode = true;
    }
  }

  return {
    port,
    devMode,
    docRoot: resolve(process.cwd(), '_site'),
  };
}

function createPatternMatcher(pattern: string): Rule {
  const placeholders: string[] = [];
  
  const regexPattern = pattern
    .replace(/\//g, '\\/')
    .replace(/:(\w+)/g, (_, name) => {
      placeholders.push(name);
      return '([^/]+)';
    })
    .replace(/\*/g, () => {
      placeholders.push('splat');
      return '(.*)';
    });

  return {
    pattern: new RegExp(`^${regexPattern}$`),
    placeholders
  };
}

function interpolateValues(template: string, values: string[], placeholders: string[]): string {
  return placeholders.reduce((result, placeholder, index) => {
    const value = values[index] || '';
    const pattern = placeholder === 'splat' ? ':splat' : `:${placeholder}`;
    return result.replace(new RegExp(pattern, 'g'), value);
  }, template);
}

function getMimeType(filePath: string): string {
  return MIME_TYPES.get(extname(filePath)) || 'application/octet-stream';
}

function parseAcceptEncoding(header?: string): string[] {
  if (!header) return [];
  
  return header
    .split(',')
    .map(part => {
      const [encoding, qValue] = part.trim().split(';q=');
      return { encoding: encoding.trim(), quality: qValue ? parseFloat(qValue) : 1.0 };
    })
    .filter(({ quality }) => quality > 0)
    .sort((a, b) => b.quality - a.quality)
    .map(({ encoding }) => encoding);
}

async function compressContent(
  content: Buffer, 
  mimeType: string, 
  acceptEncoding?: string
): Promise<{ data: Buffer; encoding?: string }> {
  const baseType = mimeType.split(';')[0];
  
  if (content.length < MIN_COMPRESSION_SIZE || !COMPRESSIBLE_TYPES.has(baseType)) {
    return { data: content };
  }

  const encodings = parseAcceptEncoding(acceptEncoding);
  
  for (const encoding of encodings) {
    try {
      let compressed: Buffer;
      
      if (encoding === 'br') {
        compressed = await brotliAsync(content);
      } else if (encoding === 'gzip') {
        compressed = await gzipAsync(content);
      } else {
        continue;
      }

      if (compressed.length < content.length) {
        return { data: compressed, encoding };
      }
    } catch (error) {
      logger.warn(`Compression failed for ${encoding}: ${error}`);
    }
  }

  return { data: content };
}

// === Rule Parsers ===
function parseRedirects(filePath: string): RedirectRule[] {
  if (!existsSync(filePath)) return [];

  return readFileSync(filePath, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const [from, to, statusStr] = line.split(/\s+/);
      if (!from || !to) return null;
      
      const status = statusStr ? parseInt(statusStr, 10) : 301;
      const { pattern, placeholders } = createPatternMatcher(from);
      
      return { pattern, target: to, status, placeholders };
    })
    .filter((rule): rule is RedirectRule => rule !== null);
}

function parseHeaders(filePath: string): HeaderRule[] {
  if (!existsSync(filePath)) return [];

  const rules: HeaderRule[] = [];
  const lines = readFileSync(filePath, 'utf8').split('\n');
  let currentPattern: string | null = null;
  let currentSetHeaders = new Map<string, string[]>();
  let currentUnsetHeaders = new Set<string>();

  const commitRule = () => {
    if (currentPattern && (currentSetHeaders.size > 0 || currentUnsetHeaders.size > 0)) {
      const { pattern, placeholders } = createPatternMatcher(currentPattern);
      rules.push({ 
        pattern, 
        setHeaders: new Map(currentSetHeaders), 
        unsetHeaders: new Set(currentUnsetHeaders),
        placeholders 
      });
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (!line.startsWith(' ') && !line.startsWith('\t')) {
      commitRule();
      currentPattern = trimmed;
      currentSetHeaders = new Map();
      currentUnsetHeaders = new Set();
    } else if (currentPattern) {
      if (trimmed.startsWith('!')) {
        // Remove header: ! Header-Name
        const headerToRemove = trimmed.substring(1).trim();
        currentUnsetHeaders.add(headerToRemove);
      } else if (trimmed.includes(':')) {
        // Add header: Header-Name: value
        const [key, ...valueParts] = trimmed.split(':');
        const headerName = key.trim();
        const headerValue = valueParts.join(':').trim();
        
        if (!currentSetHeaders.has(headerName)) {
          currentSetHeaders.set(headerName, []);
        }
        currentSetHeaders.get(headerName)!.push(headerValue);
      }
    }
  }

  commitRule();
  return rules;
}

// === File Operations ===
function resolveFilePath(docRoot: string, requestPath: string): string {
  let filePath = join(docRoot, requestPath);
  
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }
  
  return filePath;
}

function findNotFoundPage(docRoot: string, requestPath: string): Buffer | null {
  let currentDir = dirname(join(docRoot, requestPath));

  while (currentDir.startsWith(docRoot)) {
    const notFoundPath = join(currentDir, '404.html');
    
    if (existsSync(notFoundPath) && statSync(notFoundPath).isFile()) {
      return readFileSync(notFoundPath);
    }
    
    if (currentDir === docRoot) break;
    currentDir = dirname(currentDir);
  }
  
  return null;
}

// === Main Server Class ===
class OptimizedStaticServer {
  private readonly config: ServerConfig;
  private redirectRules: RedirectRule[] = [];
  private headerRules: HeaderRule[] = [];

  constructor(config: ServerConfig) {
    this.config = config;
    this.loadConfigurations();
  }

  start(): void {
    const server = createServer(this.handleRequest.bind(this));
    
    server.listen(this.config.port, () => {
      logger.success(`Server running at http://localhost:${this.config.port}`);
      logger.info(`Serving: ${this.config.docRoot}`);
      logger.info(`Rules: ${this.redirectRules.length} redirects, ${this.headerRules.length} headers`);
      
      if (this.config.devMode) {
        logger.info('Dev mode: compression disabled, debug logging enabled');
      } else {
        logger.info('Production mode: Brotli & Gzip compression enabled');
      }
    });
  }

  private loadConfigurations(): void {
    const redirectsFile = join(this.config.docRoot, '_redirects');
    const headersFile = join(this.config.docRoot, '_headers');

    this.redirectRules = parseRedirects(redirectsFile);
    this.headerRules = parseHeaders(headersFile);

    if (existsSync(redirectsFile)) logger.success('Loaded redirect rules');
    if (existsSync(headersFile)) logger.success('Loaded header rules');
  }

  private handleRequest(req: IncomingMessage, res: ServerResponse): void {
    if (!req.url) {
      this.sendError(res, 400, 'Bad Request');
      return;
    }

    const requestPath = new URL(req.url, `http://${req.headers.host}`).pathname;

    // Check for redirects first
    const redirect = this.findRedirect(requestPath);
    if (redirect) {
      res.writeHead(redirect.status, { 'Location': redirect.target });
      res.end();
      logger.debug(`Redirect: ${requestPath} → ${redirect.target} (${redirect.status})`, this.config.devMode);
      return;
    }

    // Serve file
    this.serveFile(req, res, requestPath);
  }

  private findRedirect(requestPath: string): { target: string; status: number } | null {
    for (const rule of this.redirectRules) {
      const match = requestPath.match(rule.pattern);
      if (match) {
        const target = interpolateValues(rule.target, match.slice(1), rule.placeholders);
        return { target, status: rule.status };
      }
    }
    return null;
  }

  private computeHeaders(requestPath: string): Map<string, string> {
    const finalHeaders = new Map<string, string[]>();
    const removedHeaders = new Set<string>();
    
    for (const rule of this.headerRules) {
      const match = requestPath.match(rule.pattern);
      if (!match) continue;
      
      const values = match.slice(1);
      
      // Process header removals
      for (const headerName of rule.unsetHeaders) {
        const normalizedKey = headerName.toLowerCase();
        removedHeaders.add(normalizedKey);
        
        // Remove existing headers with same name (case-insensitive)
        for (const [existingKey] of finalHeaders) {
          if (existingKey.toLowerCase() === normalizedKey) {
            finalHeaders.delete(existingKey);
          }
        }
      }
      
      // Process header additions
      for (const [headerName, headerValues] of rule.setHeaders) {
        const normalizedKey = headerName.toLowerCase();
        
        if (removedHeaders.has(normalizedKey)) {
          removedHeaders.delete(normalizedKey);
        }
        
        // Find existing key with same name (case-insensitive) or use current key
        let finalKey = headerName;
        for (const existingKey of finalHeaders.keys()) {
          if (existingKey.toLowerCase() === normalizedKey) {
            finalKey = existingKey;
            break;
          }
        }
        
        if (!finalHeaders.has(finalKey)) {
          finalHeaders.set(finalKey, []);
        }
        
        // Add interpolated values
        const interpolatedValues = headerValues.map(value => 
          interpolateValues(value, values, rule.placeholders)
        );
        finalHeaders.get(finalKey)!.push(...interpolatedValues);
      }
    }
    
    // Convert to final format (join multiple values with comma)
    const result = new Map<string, string>();
    for (const [key, values] of finalHeaders) {
      result.set(key, values.join(', '));
    }
    
    return result;
  }

  private async serveFile(req: IncomingMessage, res: ServerResponse, requestPath: string): Promise<void> {
    const filePath = resolveFilePath(this.config.docRoot, requestPath);

    readFile(filePath, async (err, content) => {
      let statusCode = 200;
      let finalContent = content;
      let mimeType = getMimeType(filePath);

      // Handle 404
      if (err) {
        statusCode = 404;
        const notFoundContent = findNotFoundPage(this.config.docRoot, requestPath);
        
        if (notFoundContent) {
          finalContent = notFoundContent;
          mimeType = 'text/html; charset=utf-8';
        } else {
          finalContent = Buffer.from(DEFAULT_404_CONTENT, 'utf-8');
          mimeType = 'text/plain; charset=utf-8';
        }
      }

      // Prepare headers
      const customHeaders = this.computeHeaders(requestPath);
      const headers = new Map<string, string>([
        ['Content-Type', mimeType],
        ...customHeaders
      ]);

      // Apply compression (skip in dev mode)
      if (!this.config.devMode && statusCode === 200) {
        const { data, encoding } = await compressContent(
          finalContent, 
          mimeType, 
          req.headers['accept-encoding']
        );
        finalContent = data;
        
        if (encoding) {
          headers.set('Content-Encoding', encoding);
          logger.debug(`Compressed ${requestPath} with ${encoding}`, this.config.devMode);
        }
        
        headers.set('Vary', 'Accept-Encoding');
      }

      // Convert headers to object for response
      const responseHeaders: Record<string, string> = {};
      for (const [key, value] of headers) {
        responseHeaders[key] = value;
      }

      res.writeHead(statusCode, responseHeaders);
      res.end(finalContent);
      
      logger.debug(`${req.method} ${req.url} → ${statusCode}`, this.config.devMode);
    });
  }

  private sendError(res: ServerResponse, statusCode: number, message: string): void {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(message);
  }
}

// === Entry Point ===
async function main(): Promise<void> {
  try {
    const config = parseConfig();
    const server = new OptimizedStaticServer(config);
    server.start();
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
}

// Execute if this file is run directly
if (require.main === module) {
  main().catch(console.error);
}

export { OptimizedStaticServer, type ServerConfig };
