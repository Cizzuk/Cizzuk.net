import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { IdAttributePlugin } from "@11ty/eleventy";

import { ensureDateFromFilename, firstItems, getCurrentYear, sortByDateAndFilenameDesc, toDT } from "./dates.js";
import { renameAssetsAndRewriteHtml } from "./assets.js";
import { cleanDir, findFiles } from "./files.js";
import { minifyHtml, minifyJs, minifyXml } from "./minify.js";
import { compileSass } from "./sass.js";
import { log } from "./log.js";

import projectOrder from "./projectOrder.js";

const timezone = "Asia/Tokyo";
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url))); // ../
const dirs = {
  input: "src",
  includes: "_includes",
  data: "_data",
  output: "_site",
  public: "public",
  assets: "assets",
};
const outRoot = path.join(root, dirs.output);
const assetExtensions = [
  ".css", ".js",
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".avif", ".bmp",
  ".tif", ".tiff",
];

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(IdAttributePlugin, {
    // Custom slugify for Japanese
    slugify: (text) => text.trim().toLowerCase()
      .replace(/[^\p{L}\p{N}_-]+/gu, "-")
      .replace(/^-+|-+$/g, ""),
  });

  eleventyConfig.addFilter("date", (value) => toDT(value, timezone).toFormat("MMMM d, yyyy"));
  eleventyConfig.addFilter("dateJA", (value) => toDT(value, timezone).toFormat("yyyy年 M月 d日"));
  eleventyConfig.addFilter("dateISO", (value) => toDT(value, timezone).toFormat("yyyy-MM-dd"));
  eleventyConfig.addFilter("firstItems", firstItems);
  eleventyConfig.addShortcode("currentYear", () => getCurrentYear(timezone));

  // --- Collections ---

  eleventyConfig.addCollection("notes", (api) => {
    const items = api.getFilteredByGlob(`./src/notes/**/*.md`);
    items.forEach(ensureDateFromFilename);
    return items.filter((item) => !item.data.hidden).sort(sortByDateAndFilenameDesc);
  });

  eleventyConfig.addCollection("posts", (api) => {
    const items = api.getFilteredByGlob(`./src/posts/**/*.md`);
    items.forEach(ensureDateFromFilename);
    return items.filter((item) => !item.data.hidden).sort(sortByDateAndFilenameDesc);
  });

  eleventyConfig.addCollection("projects", (api) => {
    const projects = api.getFilteredByGlob("./src/projects/*.md");
    const bySlug = new Map(projects.map((project) => [project.fileSlug, project]));
    const visible = projectOrder
      .map((id) => bySlug.get(id))
      .filter((project) => project && !project.data.hidden);

    for (const project of visible) {
      visible[project.fileSlug] = { ...project.data, url: project.url };
    }
    return visible;
  });

  eleventyConfig.addPassthroughCopy({ [dirs.public]: "/" });

  eleventyConfig.on("beforeBuild", () => {
    cleanDir(outRoot);
    compileSass(path.join(root, dirs.input, dirs.assets), path.join(outRoot, dirs.assets));
  });

  eleventyConfig.addTransform("minify-output", async (content, outputPath) => {
    if (!outputPath) return content;
    try {
      if (outputPath.endsWith(".html")) {
        log(`Minifying HTML ${path.relative(outRoot, outputPath)}`);
        return await minifyHtml(content);
      }
    } catch (error) {
      console.warn(`Minify failed for ${outputPath}: ${error.message}`);
    }
    return content;
  });

  eleventyConfig.on("afterBuild", async () => {
    for (const filePath of findFiles(outRoot, (filePath) => /\.(js|xml)$/.test(filePath))) {
      if (filePath.endsWith(".js")) {
        log(`Minifying JS ${path.relative(outRoot, filePath)}`);
        fs.writeFileSync(filePath, await minifyJs(fs.readFileSync(filePath, "utf8")));
      } else {
        log(`Minifying XML ${path.relative(outRoot, filePath)}`);
        fs.writeFileSync(filePath, minifyXml(fs.readFileSync(filePath, "utf8")));
      }
    }

    // Rename assets for cache busting
    await renameAssetsAndRewriteHtml({
      outRoot,
      assetsSubdir: dirs.assets,
      includeExts: assetExtensions,
    });
  });

  return {
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: dirs.input,
      includes: dirs.includes,
      data: dirs.data,
      output: dirs.output,
    },
  };
}
