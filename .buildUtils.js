"use strict";

const fs = require("node:fs");
const path = require("node:path");
const sass = require("sass");
const csso = require("csso");
const htmlMinifier = require("html-minifier-terser");
const Terser = require("terser");
const { DateTime } = require("luxon");

// -------- Date helpers --------
const toDT = (value, tz) => {
  if (!value) {
    return DateTime.now().setZone(tz);
  }
  if (value instanceof Date) {
    return DateTime.fromJSDate(value, { zone: tz });
  }
  if (typeof value === "string") {
    return DateTime.fromISO(value, { zone: tz });
  }
  return DateTime.fromISO(String(value), { zone: tz });
};

// -------- Template filters --------
const firstItems = (arr, n) => {
  if (!Array.isArray(arr)) {
    return arr;
  }

  const count = Number(n);
  if (Number.isNaN(count)) {
    return arr;
  }

  if (count < 0) {
    return arr.slice(count);
  }

  return arr.slice(0, count);
};

const getCurrentYear = (tz) => DateTime.now().setZone(tz).toFormat("yyyy");

const ensureDateFromFilename = (item) => {
  if (!item || !item.data) {
    return;
  }
  if (!item.data.date) {
    const match = item.inputPath && item.inputPath.match(/(\d{4}-\d{2}-\d{2})-/);
    if (match) {
      item.data.date = match[1];
    }
  }
};

const sortByDateDesc = (a, b) => {
  const ad = a.data?.date || a.date;
  const bd = b.data?.date || b.date;
  return new Date(bd) - new Date(ad);
};

// -------- Build helpers --------
const cleanDir = (dirPath) => {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: false });
    }
  } catch (e) {
    console.warn("Failed to clean dir:", dirPath, e.message);
  }
};

const compileSass = (srcFile, outFile, { style = "expanded", sourceMap = false } = {}) => {
  if (!fs.existsSync(srcFile)) return;
  const outDir = path.dirname(outFile);
  const result = sass.compile(srcFile, { style, sourceMap });
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, result.css);
};

// -------- Minifiers --------
const minifyHtml = async (content) => {
  return htmlMinifier.minify(content, {
    collapseWhitespace: true,
    conservativeCollapse: false,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    keepClosingSlash: true,
    sortAttributes: true,
    sortClassName: true,
  });
};

const minifyJs = async (content) => {
  const min = await Terser.minify(content, {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ["console.log", "console.info"],
    },
    mangle: true,
    format: { comments: false },
  });
  return min.code || content;
};

const minifyCss = (content) => {
  return csso.minify(content).css;
};

const minifyXml = (content) => {
  return content
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .trim();
};

// -------- File system utils --------
const walkDir = async (dir, onFile) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const childPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(childPath, onFile);
    } else {
      await onFile(childPath);
    }
  }
};

// -------- Hashing (CRC32 -> Base32) --------
const makeCrc32Table = (() => {
  let table;
  return () => {
    if (table) return table;
    table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c >>> 0;
    }
    return table;
  };
})();

const crc32Uint32 = (buf) => {
  const table = makeCrc32Table();
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i];
    crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xff];
  }
  return (crc ^ -1) >>> 0;
};

const uint32ToBytesLE = (n) => {
  const b = new Uint8Array(4);
  b[0] = n & 0xff;
  b[1] = (n >>> 8) & 0xff;
  b[2] = (n >>> 16) & 0xff;
  b[3] = (n >>> 24) & 0xff;
  return b;
};

const base32Alphabet = "abcdefghijklmnopqrstuvwxyz234567"; // lowercase, RFC 4648 without padding

const base32Encode = (bytes) => {
  let bits = 0;
  let value = 0;
  let output = "";
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      const index = (value >>> (bits - 5)) & 31;
      output += base32Alphabet[index];
      bits -= 5;
    }
  }
  if (bits > 0) {
    const index = (value << (5 - bits)) & 31;
    output += base32Alphabet[index];
  }
  return output; // no padding
};

const hashFileCRC32Base32 = (filePath) => {
  const buf = fs.readFileSync(filePath);
  const crc = crc32Uint32(buf);
  const bytes = uint32ToBytesLE(crc);
  return base32Encode(bytes);
};

// -------- Asset renaming and HTML rewrite --------
const renameAssetsAndRewriteHtml = async ({
  outRoot,
  assetsSubdir = "assets",
  includeExts = [".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".avif", ".bmp", ".tif", ".tiff"],
  renamePattern = "{name}-{hash}-opt{ext}",
}) => {
  const assetsRoot = path.join(outRoot, assetsSubdir);
  if (!fs.existsSync(assetsRoot)) return;

  // 1) Rename assets and build mapping of old web paths => new web paths
  const mapping = new Map();
  const filesToRename = [];

  await walkDir(assetsRoot, async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!includeExts.includes(ext)) return;

    const relFromAssets = path.relative(assetsRoot, filePath).split(path.sep).join("/");
    const parsed = path.parse(filePath);
    const dir = parsed.dir;
    const name = parsed.name; // without ext

    // Skip if already like *-opt.* to avoid multiple suffixing
    if (/-opt\.[^/]+$/i.test(parsed.base)) return;

    const hash = hashFileCRC32Base32(filePath);
    const newBase = renamePattern
      .replace("{name}", name)
      .replace("{hash}", hash)
      .replace("{ext}", parsed.ext);
    const newPath = path.join(dir, newBase);

    filesToRename.push([filePath, newPath]);

    const oldWeb = `/${assetsSubdir}/${relFromAssets}`;
    const relNew = path.relative(assetsRoot, newPath).split(path.sep).join("/");
    const newWeb = `/${assetsSubdir}/${relNew}`;
    mapping.set(oldWeb, newWeb);
  });

  for (const [oldPath, newPath] of filesToRename) {
    fs.renameSync(oldPath, newPath);
  }

  if (mapping.size === 0) return;

  // 2) Rewrite HTML references under outRoot
  await walkDir(outRoot, async (filePath) => {
    if (!filePath.endsWith(".html")) {
      return;
    }

    let html = fs.readFileSync(filePath, "utf8");
    let changed = false;

    for (const [oldWeb, newWeb] of mapping.entries()) {
      // Replace absolute "/assets/..." and relative "assets/..."
      const relOld = oldWeb.replace(/^\//, "");
      if (html.includes(oldWeb)) {
        html = html.split(oldWeb).join(newWeb);
        changed = true;
      }
      if (html.includes(relOld)) {
        const relNew = newWeb.replace(/^\//, "");
        html = html.split(relOld).join(relNew);
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, html);
    }
  });
};

module.exports = {
  // date
  toDT,
  getCurrentYear,
  ensureDateFromFilename,
  sortByDateDesc,
  // build
  cleanDir,
  compileSass,
  // minifiers
  minifyHtml,
  minifyJs,
  minifyCss,
  minifyXml,
  // fs
  walkDir,
  // hashing & rename
  hashFileCRC32Base32,
  renameAssetsAndRewriteHtml,
  // filters
  firstItems,
};
