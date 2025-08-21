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
    return collectionApi.getFilteredByGlob("./src/posts/*.md").sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  });

  eleventyConfig.addCollection("notes", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./src/notes/*.md").sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
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