import fs from "node:fs";
import path from "node:path";
import { findFiles } from "./files.js";
import { log } from "./log.js";

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let value = i;
    for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    table[i] = value >>> 0;
  }
  return table;
})();

const hashFile = (filePath) => {
  let crc = -1;
  for (const byte of fs.readFileSync(filePath)) crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff];
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, (crc ^ -1) >>> 0, true);
  let value = 0;
  let bits = 0;
  let hash = "";
  const alphabet = "abcdefghijklmnopqrstuvwxyz234567";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      hash += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits) hash += alphabet[(value << (5 - bits)) & 31];
  return hash;
};

export const renameAssetsAndRewriteHtml = async ({
  outRoot,
  assetsSubdir,
  includeExts,
  renamePattern = "{name}-{hash}-opt{ext}",
}) => {
  const assetsRoot = path.join(outRoot, assetsSubdir);
  if (!fs.existsSync(assetsRoot)) return;

  const extensions = includeExts;

  const files = findFiles(assetsRoot, (filePath) => {
    const parsed = path.parse(filePath);
    return extensions.includes(parsed.ext.toLowerCase()) && !/-opt\.[^/]+$/i.test(parsed.base);
  });

  const mapping = new Map();

  const filesToRename = files.map((filePath) => {
    const parsed = path.parse(filePath);
    const relative = path.relative(assetsRoot, filePath).split(path.sep).join("/");
    const newPath = path.join(parsed.dir, renamePattern
      .replace("{name}", parsed.name)
      .replace("{hash}", hashFile(filePath))
      .replace("{ext}", parsed.ext));
      
    mapping.set(`/${assetsSubdir}/${relative}`, `/${assetsSubdir}/${path.relative(assetsRoot, newPath).split(path.sep).join("/")}`);
    return [filePath, newPath];
  });

  for (const [oldPath, newPath] of filesToRename) {
    fs.renameSync(oldPath, newPath);
    log(`Rename ${path.relative(outRoot, oldPath)} -> ${path.relative(outRoot, newPath)}`);
  }

  if (!mapping.size) return;

  const redirects = [...mapping].map(([oldPath, newPath]) => `${oldPath} ${newPath} 302\n`).join("");
  fs.appendFileSync(
    path.join(outRoot, "_redirects"),
    `${fs.existsSync(path.join(outRoot, "_redirects")) ? "\n" : ""}${redirects}`
  );

  for (const filePath of findFiles(outRoot, (filePath) => filePath.endsWith(".html"))) {
    let html = fs.readFileSync(filePath, "utf8");
    for (const [oldPath, newPath] of mapping) {
      html = html.replaceAll(oldPath, newPath).replaceAll(oldPath.slice(1), newPath.slice(1));
    }
    fs.writeFileSync(filePath, html);
  }
};
