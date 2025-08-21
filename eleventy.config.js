module.exports = function(eleventyConfig) {
  // _projects
  eleventyConfig.addCollection("projects", function(collectionApi) {
    const projects = collectionApi.getFilteredByGlob("./src/_projects/*.md");
    const order = require("./src/_data/projectOrder");
    return order.map(id => projects.find(project => project.fileSlug === id)).filter(Boolean);
  });

  // _posts
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./src/_posts/*.md").sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  });

  // _notes
  eleventyConfig.addCollection("notes", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./src/_notes/*.md").sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  });
};