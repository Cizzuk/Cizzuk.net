import fs from "node:fs";
import path from "node:path";
import * as sass from "sass";
import { findFiles } from "./files.js";
import { log } from "./log.js";

export const compileSass = (root, outputRoot) => {
  for (const input of findFiles(root, (filePath) => filePath.endsWith(".scss"))) {
    const relative = path.relative(root, input).replace(/\.scss$/, ".css");
    const output = path.join(outputRoot, relative);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, sass.compile(input, { style: "compressed", sourceMap: false }).css);
    log(`Compile sass ${relative}`);
  }
};
