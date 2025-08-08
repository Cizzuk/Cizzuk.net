#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { minify as htmlMinify } from 'html-minifier-terser';
import { minify as jsMinify } from 'terser';
import * as yaml from 'js-yaml';

interface BuilderConfig {
    processAssets: {
        enabled: boolean;
        filters: string[];
    };
    minifyFiles: {
        enabled: boolean;
        html: boolean;
        xml: boolean;
        xmlPatterns: string[];
    };
    cleanup: {
        enabled: boolean;
        removeEmptyAtoms: boolean;
    };
}

interface JekyllConfig {
    destination?: string;
    languages?: string[];
    builder?: BuilderConfig;
}

class WebsiteBuilder {
    private siteDir: string;
    private readonly rootDir: string;
    private readonly config: BuilderConfig;

    constructor() {
        console.log('🚀 Starting website build process...');
        this.rootDir = process.cwd();
        
        const jekyllConfig = this.loadJekyllConfig();
        this.siteDir = jekyllConfig.destination || './_site';
        this.config = this.loadBuilderConfig(jekyllConfig);
    }

    /**
     * Load Jekyll configuration from _config.yml using js-yaml
     */
    private loadJekyllConfig(): JekyllConfig {
        const configPath = path.join(this.rootDir, '_config.yml');
        
        if (!fs.existsSync(configPath)) {
            console.warn('⚠️  _config.yml not found, using defaults');
            return {};
        }

        try {
            const configContent = fs.readFileSync(configPath, 'utf8');
            const config = yaml.load(configContent) as JekyllConfig;
            return config || {};
        } catch (error) {
            console.warn('⚠️  Failed to parse _config.yml:', error);
            return {};
        }
    }

    /**
     * Load builder configuration from Jekyll config with defaults
     */
    private loadBuilderConfig(jekyllConfig: JekyllConfig): BuilderConfig {
        const defaultConfig: BuilderConfig = {
            processAssets: {
                enabled: true,
                filters: ['*.png', '*.jpg', '*.svg', '*.webp', '*.gif', '*.mp3', '*.wav', '*.m4a', '*.css', '*.js']
            },
            minifyFiles: {
                enabled: true,
                html: true,
                xml: true,
                xmlPatterns: ['*.atom', '*.rss', '*.xml']
            },
            cleanup: {
                enabled: true,
                removeEmptyAtoms: true
            }
        };

        // If builder config exists in Jekyll config, merge it with defaults
        if (jekyllConfig.builder) {
            console.log('📋 Using builder configuration from _config.yml');
            return this.mergeConfigs(defaultConfig, jekyllConfig.builder);
        }

        console.log('📋 No builder configuration found, using defaults');
        return defaultConfig;
    }

    /**
     * Deep merge builder configurations
     */
    private mergeConfigs(defaultConfig: BuilderConfig, userConfig: Partial<BuilderConfig>): BuilderConfig {
        return {
            processAssets: {
                ...defaultConfig.processAssets,
                ...userConfig.processAssets
            },
            minifyFiles: {
                ...defaultConfig.minifyFiles,
                ...userConfig.minifyFiles
            },
            cleanup: {
                ...defaultConfig.cleanup,
                ...userConfig.cleanup
            }
        };
    }

    /**
     * Run Jekyll build
     */
    private runJekyllBuild(): void {
        console.log('📦 Building Jekyll site...');
        try {
            execSync('JEKYLL_ENV=production jekyll build', { stdio: 'inherit' });
            console.log('✅ Jekyll build completed');
        } catch (error) {
            console.error('❌ Jekyll build failed:', error);
            process.exit(1);
        }
    }

    // =================================================================
    // File Minification Methods (Step 2)
    // =================================================================

    /**
     * Minify HTML and XML files in the site directory
     */
    private async minifyFiles(): Promise<void> {
        if (!this.config.minifyFiles.enabled) {
            console.log('🗜️  File minification disabled, skipping...');
            return;
        }
        
        console.log('🗜️  Minifying files...');

        await Promise.all([
            this.minifyHtmlFiles(),
            this.minifyXmlFiles(),
            this.minifyJsFiles()
        ]);
    }

    /**
     * Minify all HTML files
     */
    private async minifyHtmlFiles(): Promise<void> {
        if (!this.config.minifyFiles.html) {
            console.log('📄 HTML minification disabled');
            return;
        }

        const htmlFiles = this.findFilesByPattern(this.siteDir, '*.html');
        const promises = htmlFiles.map(async (htmlFile) => {
            try {
                const content = fs.readFileSync(htmlFile, 'utf8');
                const minified = await this.minifyHTML(content);
                fs.writeFileSync(htmlFile, minified);
                console.log(`✅ Minified HTML: ${path.basename(htmlFile)}`);
            } catch (error) {
                console.error(`❌ Failed to minify ${htmlFile}:`, error);
            }
        });

        await Promise.all(promises);
    }

    /**
     * Minify all XML files
     */
    private async minifyXmlFiles(): Promise<void> {
        if (!this.config.minifyFiles.xml) {
            console.log('📄 XML minification disabled');
            return;
        }

        const xmlFiles = this.config.minifyFiles.xmlPatterns
            .flatMap(pattern => this.findFilesByPattern(this.siteDir, pattern));
        
        // Remove duplicates
        const uniqueXmlFiles = [...new Set(xmlFiles)];

        for (const xmlFile of uniqueXmlFiles) {
            try {
                const content = fs.readFileSync(xmlFile, 'utf8');
                const minified = await this.minifyXML(content);
                fs.writeFileSync(xmlFile, minified);
                console.log(`✅ Minified XML: ${path.basename(xmlFile)}`);
            } catch (error) {
                console.error(`❌ Failed to minify ${xmlFile}:`, error);
            }
        }
    }

    /**
     * Minify all JavaScript files
     */
    private async minifyJsFiles(): Promise<void> {
        const jsFiles = this.findFilesByPattern(this.siteDir, '*.js');
        
        for (const jsFile of jsFiles) {
            try {
                const content = fs.readFileSync(jsFile, 'utf8');
                const minified = await this.minifyJS(content);
                fs.writeFileSync(jsFile, minified);
                console.log(`✅ Minified JS: ${path.basename(jsFile)}`);
            } catch (error) {
                console.error(`❌ Failed to minify ${jsFile}:`, error);
            }
        }
    }

    /**
     * Minify HTML content using html-minifier-terser
     */
    private async minifyHTML(content: string): Promise<string> {
        try {
            return await htmlMinify(content, {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
                minifyCSS: false,
                minifyJS: false,
                removeEmptyAttributes: true,
                removeOptionalTags: true,
                sortClassName: true,
                sortAttributes: true
            });
        } catch (error) {
            console.warn(`⚠️  HTML minification failed: ${error}`);
            return content;
        }
    }

    /**
     * Minify XML and HTML content marked with <!--html_content-->
     */
    private async minifyXML(content: string): Promise<string> {
        const parts: string[] = [];
        let lastIndex = 0;
        
        // Split into alternating XML/HTML parts
        for (const match of content.matchAll(/<!--html_content-->([\s\S]*?)<!--\/html_content-->/gi)) {
            const xmlPart = content.substring(lastIndex, match.index!);
            const htmlPart = match[1];
            parts.push(xmlPart, htmlPart);
            lastIndex = match.index! + match[0].length;
        }
        parts.push(content.substring(lastIndex));
        
        // Process: XML(even), HTML(odd)
        let result = '';
        for (let i = 0; i < parts.length; i++) {
            if (i % 2) {
                try {
                    result += await this.minifyHTML(parts[i]);
                } catch {
                    result += parts[i];
                }
            } else {
                result += parts[i]
                    .replace(/<!--[\s\S]*?-->/g, '') // Remove XML comments
                    .replace(/>\s+</g, '><')         // Remove whitespace between tags
                    .replace(/^\s+|\s+$/gm, '')      // Remove leading/trailing whitespace
                    .trim();
            }
        }
        return result;
    }

    /**
     * Minify JavaScript content using terser
     */
    private async minifyJS(content: string): Promise<string> {
        try {
            const result = await jsMinify(content, {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.info']
                },
                mangle: true,
                format: { comments: false }
            });
            return result.code || content;
        } catch (error) {
            console.warn(`⚠️  JavaScript minification failed: ${error}`);
            return content;
        }
    }

    // =================================================================
    // Asset Processing Methods (Step 3)
    // =================================================================

    /**
     * Process and rename asset files with hash for cache busting
     */
    private async processAssets(): Promise<void> {
        if (!this.config.processAssets.enabled) {
            console.log('📁 Asset processing disabled, skipping...');
            return;
        }
        
        console.log('🎨 Processing assets...');
        
        const assetsDir = path.join(this.siteDir, 'assets');
        if (!fs.existsSync(assetsDir)) {
            console.log('📁 No assets directory found, skipping asset processing');
            return;
        }

        const redirects: string[] = [];

        for (const filter of this.config.processAssets.filters) {
            const files = this.findFilesByPattern(assetsDir, filter);
            
            for (const file of files) {
                const hashedFile = await this.processAssetFile(file);
                if (hashedFile) {
                    redirects.push(this.createRedirectRule(file, hashedFile));
                    this.updateReferences(
                        this.getRelativePath(file),
                        this.getRelativePath(hashedFile)
                    );
                    console.log(`✅ Processed: ${path.basename(file)} -> ${path.basename(hashedFile)}`);
                }
            }
        }

        this.writeRedirectsFile(redirects);
    }

    /**
     * Process a single asset file with hash and optional minification
     */
    private async processAssetFile(filePath: string): Promise<string | null> {
        const crc32hash = this.calculateCRC32(filePath);
        const base32hash = this.hexToBase32(crc32hash);
        
        const dir = path.dirname(filePath);
        const baseName = path.basename(filePath, path.extname(filePath));
        const ext = path.extname(filePath);
        
        const newFilePath = path.join(dir, `${baseName}.${base32hash}-opt${ext}`);
        
        let content = fs.readFileSync(filePath);

        fs.writeFileSync(newFilePath, content);
        fs.unlinkSync(filePath);
        
        return newFilePath;
    }

    /**
     * Create a redirect rule for the processed asset
     */
    private createRedirectRule(oldPath: string, newPath: string): string {
        const oldRelative = this.getRelativePath(oldPath);
        const newRelative = this.getRelativePath(newPath);
        
        // Ensure paths start with / for proper redirect rules
        const oldUrl = oldRelative.startsWith('/') ? oldRelative : `/${oldRelative}`;
        const newUrl = newRelative.startsWith('/') ? newRelative : `/${newRelative}`;
        
        return `${oldUrl} ${newUrl} 302`;
    }

    /**
     * Get relative path from site directory
     */
    private getRelativePath(fullPath: string): string {
        // Normalize paths to handle different directory separators
        const normalizedFullPath = path.normalize(fullPath);
        const normalizedSiteDir = path.normalize(this.siteDir);
        
        // Use path.relative to get proper relative path
        const relativePath = path.relative(normalizedSiteDir, normalizedFullPath);
        
        // Convert backslashes to forward slashes for web URLs
        return relativePath.replace(/\\/g, '/');
    }

    /**
     * Write redirects to _redirects file
     */
    private writeRedirectsFile(redirects: string[]): void {
        if (redirects.length === 0) return;

        const redirectsFile = path.join(this.siteDir, '_redirects');
        const existingRedirects = fs.existsSync(redirectsFile) 
            ? fs.readFileSync(redirectsFile, 'utf8') 
            : '';
        
        fs.writeFileSync(redirectsFile, existingRedirects + '\n' + redirects.join('\n'));
    }

    /**
     * Update asset references in HTML files
     */
    private updateReferences(oldPath: string, newPath: string): void {
        const htmlFiles = this.findFilesByPattern(this.siteDir, '*.html');
        const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        
        for (const htmlFile of htmlFiles) {
            try {
                const content = fs.readFileSync(htmlFile, 'utf8');
                const updatedContent = content.replace(regex, newPath);
                
                if (content !== updatedContent) {
                    fs.writeFileSync(htmlFile, updatedContent);
                }
            } catch (error) {
                console.warn(`⚠️  Failed to update references in ${htmlFile}:`, error);
            }
        }
    }

    // =================================================================
    // Utility Methods
    // =================================================================

    /**
     * Convert hexadecimal string to base32 (optimized for short hashes)
     */
    private hexToBase32(hex: string): string {
        const chars = '0123456789abcdefghijklmnopqrstuv';
        const decimal = parseInt(hex, 16);
        
        if (decimal === 0) {
            return '0';
        }
        
        let result = '';
        let temp = decimal;
        
        while (temp > 0) {
            result = chars[temp % 32] + result;
            temp = Math.floor(temp / 32);
        }
        
        return result;
    }

    /**
     * Calculate CRC32 hash of a file for cache busting
     */
    private calculateCRC32(filePath: string): string {
        const fileBuffer = fs.readFileSync(filePath);
        let crc = 0xFFFFFFFF;
        
        for (const byte of fileBuffer) {
            crc ^= byte;
            for (let bit = 0; bit < 8; bit++) {
                crc = (crc >>> 1) ^ (0xEDB88320 & (-(crc & 1)));
            }
        }
        
        return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, '0');
    }

    /**
     * Find files matching a glob pattern recursively
     */
    private findFilesByPattern(dir: string, pattern: string): string[] {
        const files: string[] = [];
        const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\./g, '\\.'));
        
        const traverse = (currentDir: string): void => {
            try {
                const items = fs.readdirSync(currentDir);
                
                for (const item of items) {
                    const fullPath = path.join(currentDir, item);
                    const stat = fs.statSync(fullPath);
                    
                    if (stat.isDirectory()) {
                        traverse(fullPath);
                    } else if (regex.test(item)) {
                        files.push(fullPath);
                    }
                }
            } catch (error) {
                console.warn(`⚠️  Failed to read directory ${currentDir}:`, error);
            }
        };
        
        traverse(dir);
        return files;
    }
    
    // =================================================================
    // Cleanup Methods (Step 4)
    // =================================================================

    /**
     * Remove unnecessary files from the site
     */
    private cleanupFiles(): void {
        if (!this.config.cleanup.enabled) {
            console.log('🧹 Cleanup disabled, skipping...');
            return;
        }
        
        console.log('🧹 Cleaning up files...');

        if (this.config.cleanup.removeEmptyAtoms) {
            this.removeEmptyAtomFiles();
        }
    }

    /**
     * Remove empty atom files
     */
    private removeEmptyAtomFiles(): void {
        const atomFiles = this.findFilesByPattern(this.siteDir, '*.atom');
        
        for (const atomFile of atomFiles) {
            try {
                const stat = fs.statSync(atomFile);
                if (stat.size === 0) {
                    fs.unlinkSync(atomFile);
                    console.log(`🗑️  Removed empty atom file: ${path.basename(atomFile)}`);
                }
            } catch (error) {
                console.warn(`⚠️  Failed to check ${atomFile}:`, error);
            }
        }
    }

    // =================================================================
    // Main Build Process
    // =================================================================

    /**
     * Execute the complete build process
     */
    public async build(): Promise<void> {
        try {
            console.log('🔧 Step 1: Building Jekyll site...');
            this.runJekyllBuild();
            
            const sitePath = path.join(this.rootDir, '_site');
            if (!fs.existsSync(sitePath)) {
                throw new Error(`Site directory not found: ${sitePath}`);
            }
            
            // Switch to site directory for processing
            const originalDir = process.cwd();
            process.chdir(sitePath);
            this.siteDir = '.';
            
            try {
                console.log('🔧 Step 2: Minifying files...');
                await this.minifyFiles();
                
                console.log('🔧 Step 3: Processing assets...');
                await this.processAssets();
                
                console.log('🔧 Step 4: Cleaning up...');
                this.cleanupFiles();
                
                console.log('🎉 Build process completed successfully!');
            } finally {
                // Always return to original directory
                process.chdir(originalDir);
            }
            
        } catch (error) {
            console.error('❌ Build process failed:', error);
            process.exit(1);
        }
    }
}

// Initialize and run the website builder
const builder = new WebsiteBuilder();
builder.build().catch(console.error);
