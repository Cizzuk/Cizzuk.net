module.exports = function(eleventyConfig) {
  // Filters
  const { DateTime } = require("luxon");
  eleventyConfig.addFilter("date", (dateString) => {
    return DateTime.fromISO(dateString).toFormat("MMMM dd, yyyy");
  });
  eleventyConfig.addFilter("dateISO", (dateString) => {
    return DateTime.fromISO(dateString).toFormat("yyyy-MM-dd");
  });

  // Collections
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

  // Base config
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