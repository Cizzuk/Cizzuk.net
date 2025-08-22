module.exports = function(eleventyConfig) {
  const { DateTime } = require("luxon");
  const fs = require("node:fs");
  const path = require("node:path");
  const sass = require("sass");
  const csso = require("csso");
  const htmlMinifier = require("html-minifier-terser");
  const Terser = require("terser");

  const TZ = "Asia/Tokyo";

  // Filters
  const toDTJST = (value) => {
    if (!value) return DateTime.now().setZone(TZ);
    if (value instanceof Date) return DateTime.fromJSDate(value, { zone: TZ });
    if (typeof value === "string") return DateTime.fromISO(value, { zone: TZ });
    return DateTime.fromISO(String(value), { zone: TZ });
  };
  eleventyConfig.addFilter("date", (v) => toDTJST(v).toFormat("MMMM d, yyyy"));
  eleventyConfig.addFilter("dateJA", (v) => toDTJST(v).toFormat("yyyy年 M月 d日"));
  eleventyConfig.addFilter("dateISO", (v) => toDTJST(v).toFormat("yyyy-MM-dd"));

  eleventyConfig.addFilter("head", (arr, n) => {
    if (!Array.isArray(arr)) return arr;
    const count = Number(n);
    if (Number.isNaN(count)) return arr;
    return count < 0 ? arr.slice(count) : arr.slice(0, count);
  });

  // Shortcodes
  eleventyConfig.addShortcode("currentYear", () => DateTime.now().setZone(TZ).toFormat("yyyy"));

  // Collections (exclude items with hidden: true)
  eleventyConfig.addCollection("projects", (api) => {
    const items = api.getFilteredByGlob("./src/projects/*.md");
    const bySlug = new Map(items.map((p) => [p.fileSlug, p]));
    const order = require("./src/_data/projectOrder");
    return order
      .map((id) => bySlug.get(id))
      .filter((p) => p && !p.data.hidden);
  });

  const ensureDateFromFilename = (item) => {
    if (!item.data.date) {
      const m = item.inputPath.match(/(\d{4}-\d{2}-\d{2})-/);
      if (m) item.data.date = m[1];
    }
  };

  const sortByDateDesc = (a, b) => {
    const ad = a.data.date || a.date;
    const bd = b.data.date || b.date;
    return new Date(bd) - new Date(ad);
  };

  eleventyConfig.addCollection("posts", (api) => {
    const items = api.getFilteredByGlob("./src/posts/**/*.md");
    items.forEach(ensureDateFromFilename);
    return items.filter((i) => !i.data.hidden).sort(sortByDateDesc);
  });

  eleventyConfig.addCollection("notes", (api) => {
    const items = api.getFilteredByGlob("./src/notes/**/*.md");
    items.forEach(ensureDateFromFilename);
    return items.filter((i) => !i.data.hidden).sort(sortByDateDesc);
  });

  // Static & assets
  eleventyConfig.addPassthroughCopy({ public: "/" });
  eleventyConfig.addWatchTarget("public");

  const compileSass = () => {
    const src = path.join(__dirname, "public", "assets", "styles.scss");
    if (!fs.existsSync(src)) return;
    const outDir = path.join(__dirname, "_site", "assets");
    const outFile = path.join(outDir, "styles.css");
    const result = sass.compile(src, { style: "compressed", sourceMap: false });
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, result.css);
  };

  const cleanOutputDir = () => {
    const outRoot = path.join(__dirname, "_site");
    try {
      if (fs.existsSync(outRoot)) fs.rmSync(outRoot, { recursive: true, force: false });
    } catch (e) {
      console.warn("Failed to clean _site:", e.message);
    }
  };

  eleventyConfig.on("beforeBuild", cleanOutputDir);
  eleventyConfig.on("beforeBuild", compileSass);
  eleventyConfig.on("beforeWatch", compileSass);
  eleventyConfig.addWatchTarget("public/assets/styles.scss");

  // Minify helpers (simple XML minifier; no special HTML island handling)
  const minifyXML = (content) =>
    content
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/>\s+</g, "><")
      .trim();

  // Transforms
  eleventyConfig.addTransform("minify-output", async (content, outputPath) => {
    if (!outputPath) return content;

    if (outputPath.endsWith(".html")) {
      try {
        return await htmlMinifier.minify(content, {
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
      } catch (e) {
        console.warn("HTML minify failed for", outputPath, e.message);
        return content;
      }
    }

    if (outputPath.endsWith(".js")) {
      try {
        const min = await Terser.minify(content, {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ["console.log", "console.info"],
          },
          mangle: true,
          format: { comments: false },
        });
        if (min.code) return min.code;
      } catch (e) {
        console.warn("JS minify failed for", outputPath, e.message);
      }
      return content;
    }

    if (outputPath.endsWith(".xml")) {
      try {
        return minifyXML(content);
      } catch (e) {
        console.warn("XML minify failed for", outputPath, e.message);
        return content;
      }
    }

    return content;
  });

  // Minify passthrough assets in _site
  eleventyConfig.on("afterBuild", async () => {
    const outRoot = path.join(__dirname, "_site");
    if (!fs.existsSync(outRoot)) return;

    const walk = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else processFile(p);
      }
    };

    const processFile = (filePath) => {
      if (filePath.endsWith(".css")) {
        try {
          const css = fs.readFileSync(filePath, "utf8");
          const min = csso.minify(css).css;
          fs.writeFileSync(filePath, min);
        } catch (e) {
          console.warn("CSS minify failed for", filePath, e.message);
        }
      } else if (filePath.endsWith(".js")) {
        try {
          const js = fs.readFileSync(filePath, "utf8");
          const min = Terser.minify(js, {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.log", "console.info"],
            },
            mangle: true,
            format: { comments: false },
          });
          if (min.code) fs.writeFileSync(filePath, min.code);
        } catch (e) {
          console.warn("JS minify failed for", filePath, e.message);
        }
      } else if (filePath.endsWith(".xml")) {
        try {
          const xml = fs.readFileSync(filePath, "utf8");
          const min = minifyXML(xml);
          fs.writeFileSync(filePath, min);
        } catch (e) {
          console.warn("XML minify failed for", filePath, e.message);
        }
      }
    };

    walk(outRoot);
  });

  return {
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};