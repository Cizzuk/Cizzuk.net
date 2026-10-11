import fs from "node:fs";
import path from "node:path";
import { log } from "./log.js";

export const cleanDir = (dir) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    log(`Clean ${dir}`);
  }
};

export const findFiles = (dir, filter = () => true) => {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...findFiles(filePath, filter));
    else if (filter(filePath, entry)) files.push(filePath);
  }
  return files;
};
