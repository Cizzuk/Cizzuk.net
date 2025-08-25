module.exports = function(eleventyConfig) {
  const path = require("node:path");
  const fs = require("node:fs");
  const {
    // date helpers
    toDT,
    getCurrentYear,
    ensureDateFromFilename,
    sortByDateDesc,
    // build helpers
    cleanDir,
    compileSass,
    // minifiers
    minifyHtml,
    minifyJs,
    minifyXml,
    // hashing & rewrite
    renameAssetsAndRewriteHtml,
    // filters
    firstItems,
    // logging
    logTag,
  } = require("./.buildUtils");


  // -------- Configurable Settings --------
  const TZ = "Asia/Tokyo";
  const DIRS = {
    input: "src",
    includes: "_includes",
    data: "_data",
    output: "_site",
    public: "public",
    assetsSubdir: "assets",
  };
  const ASSETS = {
    // Primary stylesheet compilation
    scssEntry: path.join(__dirname, DIRS.public, DIRS.assetsSubdir, "styles.scss"),
    cssOut: path.join(__dirname, DIRS.output, DIRS.assetsSubdir, "styles.css"),
    // File types to hash-and-rename after minify
    hashIncludeExts: [
      ".css",
      ".js",
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".webp",
      ".svg",
      ".ico",
      ".avif",
      ".bmp",
      ".tif",
      ".tiff",
    ],
    renamePattern: "{name}-{hash}-opt{ext}",
  };


  // -------- Filters --------
  eleventyConfig.addFilter("date", (value) => {
    return toDT(value, TZ).toFormat("MMMM d, yyyy");
  });

  eleventyConfig.addFilter("dateJA", (value) => {
    return toDT(value, TZ).toFormat("yyyy年 M月 d日");
  });

  eleventyConfig.addFilter("dateISO", (value) => {
    return toDT(value, TZ).toFormat("yyyy-MM-dd");
  });

  // return first N items
  eleventyConfig.addFilter("firstItems", firstItems);


  // -------- Shortcodes --------
  eleventyConfig.addShortcode("currentYear", () => getCurrentYear(TZ));


  // -------- Collections -------- (exclude items with hidden: true)
  eleventyConfig.addCollection("projects", (api) => {
    const items = api.getFilteredByGlob("./src/projects/*.md");
    const bySlug = new Map(items.map((project) => [project.fileSlug, project]));

    const order = require("./src/_data/projectOrder");

    const orderedVisible = order
      .map((id) => bySlug.get(id))
      .filter((project) => project && !project.data.hidden);

    // Attach keyed access: collections.projects.<fileSlug>
    for (const project of orderedVisible) {
      orderedVisible[project.fileSlug] = { ...project.data, url: project.url };
    }

    return orderedVisible;
  });

  eleventyConfig.addCollection("posts", (api) => {
    const items = api.getFilteredByGlob("./src/posts/**/*.md");
    items.forEach(ensureDateFromFilename);

    const visible = items.filter((item) => !item.data.hidden);
    const sorted = visible.sort(sortByDateDesc);
    return sorted;
  });

  eleventyConfig.addCollection("notes", (api) => {
    const items = api.getFilteredByGlob("./src/notes/**/*.md");
    items.forEach(ensureDateFromFilename);

    const visible = items.filter((item) => !item.data.hidden);
    const sorted = visible.sort(sortByDateDesc);
    return sorted;
  });


  // -------- Static & assets --------
  eleventyConfig.addPassthroughCopy({ [DIRS.public]: "/" });
  eleventyConfig.addWatchTarget(DIRS.public);

  const outRoot = path.join(__dirname, DIRS.output);

  function compileSassTask() {
    compileSass(ASSETS.scssEntry, ASSETS.cssOut, {
      style: "compressed",
      sourceMap: false,
    });
  }

  eleventyConfig.on("beforeBuild", () => {
    cleanDir(outRoot);
  });
  eleventyConfig.on("beforeBuild", compileSassTask);
  eleventyConfig.on("beforeWatch", compileSassTask);
  eleventyConfig.addWatchTarget(path.join(DIRS.public, DIRS.assetsSubdir, "styles.scss"));


  // -------- Transforms --------
  eleventyConfig.addTransform("minify-output", async (content, outputPath) => {
    if (!outputPath) {
      return content;
    }

    if (outputPath.endsWith(".html")) {
      try {
        const out = await minifyHtml(content);
        logTag("minify", `HTML ${outputPath}`);
        return out;
      } catch (e) {
        console.warn("HTML minify failed for", outputPath, e.message);
        return content;
      }
    }

    if (outputPath.endsWith(".js")) {
      try {
        const out = await minifyJs(content);
        logTag("minify", `JS ${outputPath}`);
        return out;
      } catch (e) {
        console.warn("JS minify failed for", outputPath, e.message);
        return content;
      }
    }

    if (outputPath.endsWith(".xml")) {
      try {
        const out = minifyXml(content);
        logTag("minify", `XML ${outputPath}`);
        return out;
      } catch (e) {
        console.warn("XML minify failed for", outputPath, e.message);
        return content;
      }
    }

    return content;
  });


  // -------- Minify assets --------
  eleventyConfig.on("afterBuild", async () => {
    if (!fs.existsSync(outRoot)) {
      return;
    }

    // First pass: minify passthrough CSS/JS/XML
    const { walkDir, minifyCss } = require("./.buildUtils");
    await walkDir(outRoot, async (filePath) => {
      if (filePath.endsWith(".css")) {
        try {
          const css = fs.readFileSync(filePath, "utf8");
          const minified = minifyCss(css);
          fs.writeFileSync(filePath, minified);
          logTag("minify", `CSS ${filePath}`);
        } catch (e) {
          console.warn("CSS minify failed for", filePath, e.message);
        }
      } else if (filePath.endsWith(".js")) {
        try {
          const js = fs.readFileSync(filePath, "utf8");
          const minified = await minifyJs(js);
          fs.writeFileSync(filePath, minified);
          logTag("minify", `JS ${filePath}`);
        } catch (e) {
          console.warn("JS minify failed for", filePath, e.message);
        }
      } else if (filePath.endsWith(".xml")) {
        try {
          const xml = fs.readFileSync(filePath, "utf8");
          const minified = minifyXml(xml);
          fs.writeFileSync(filePath, minified);
          logTag("minify", `XML ${filePath}`);
        } catch (e) {
          console.warn("XML minify failed for", filePath, e.message);
        }
      }
    });

    // Second pass: rename cacheable assets + rewrite HTML
    await renameAssetsAndRewriteHtml({
      outRoot,
      assetsSubdir: DIRS.assetsSubdir,
      includeExts: ASSETS.hashIncludeExts,
      renamePattern: ASSETS.renamePattern,
    });
  });

  
  return {
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: DIRS.input,
      includes: DIRS.includes,
      data: DIRS.data,
      output: DIRS.output,
    },
  };
};