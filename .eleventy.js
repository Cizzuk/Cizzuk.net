module.exports = function(eleventyConfig) {
  // --- Settings ---
  const TimeZone = "Asia/Tokyo";


  // --- Filters ---
  // date
  const { DateTime } = require("luxon");
  const toDTJST = (value) => {
    if (!value) return DateTime.now().setZone(TimeZone);
    if (value instanceof Date) return DateTime.fromJSDate(value, { zone: TimeZone });
    if (typeof value === "string") return DateTime.fromISO(value, { zone: TimeZone });
    return DateTime.fromISO(String(value), { zone: TimeZone });
  };
  eleventyConfig.addFilter("date", (dateString) => {
    return toDTJST(dateString).toFormat("MMMM d, yyyy");
  });
  eleventyConfig.addFilter("dateJA", (dateString) => {
    return toDTJST(dateString).toFormat("yyyy年 M月 d日");
  });
  eleventyConfig.addFilter("dateISO", (dateString) => {
    return toDTJST(dateString).toFormat("yyyy-MM-dd");
  });

  // head: return first N items
  eleventyConfig.addFilter("head", (arr, n) => {
    if (!Array.isArray(arr)) return arr;
    const count = Number(n);
    if (Number.isNaN(count)) return arr;
    return count < 0 ? arr.slice(count) : arr.slice(0, count);
  });


  // --- Shortcodes ---
  eleventyConfig.addShortcode("currentYear", () => {
    return DateTime.now().setZone(TimeZone).toFormat("yyyy");
  });


  // --- Collections ---
  eleventyConfig.addCollection("projects", function(collectionApi) {
    const projects = collectionApi.getFilteredByGlob("./src/projects/*.md");
    const order = require("./src/_data/projectOrder");
    return order.map(id => projects.find(project => project.fileSlug === id)).filter(Boolean);
  });

  eleventyConfig.addCollection("posts", function(collectionApi) {
    const items = collectionApi.getFilteredByGlob("./src/posts/**/*.md");
    // Ensure date from filename (YYYY-MM-DD-*) when front matter date is absent
    items.forEach(item => {
      if (!item.data.date) {
        const m = item.inputPath.match(/(\d{4}-\d{2}-\d{2})-/);
        if (m) item.data.date = m[1];
      }
    });
    return items.sort((a, b) => {
      const ad = a.data.date || a.date;
      const bd = b.data.date || b.date;
      return new Date(bd) - new Date(ad);
    });
  });

  eleventyConfig.addCollection("notes", function(collectionApi) {
    const items = collectionApi.getFilteredByGlob("./src/notes/**/*.md");
    // Ensure date from filename (YYYY-MM-DD-*) when front matter date is absent
    items.forEach(item => {
      if (!item.data.date) {
        const m = item.inputPath.match(/(\d{4}-\d{2}-\d{2})-/);
        if (m) item.data.date = m[1];
      }
    });
    return items.sort((a, b) => {
      const ad = a.data.date || a.date;
      const bd = b.data.date || b.date;
      return new Date(bd) - new Date(ad);
    });
  });


  // --- Base config ---
  return {
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};