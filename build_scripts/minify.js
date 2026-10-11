import htmlMinifier from "html-minifier-terser";
import { minify as minifyWithTerser } from "terser";

export const minifyHtml = (content) => htmlMinifier.minify(content, {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeTagWhitespace: true,
  sortAttributes: true,
  sortClassName: true,
  useShortDoctype: true,
});

export const minifyJs = async (content) => {
  const result = await minifyWithTerser(content, {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ["console.log", "console.info"],
    },
    mangle: true,
    format: { comments: false },
  });
  return result.code || content;
};

export const minifyXml = (content) => content
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/>\s+</g, "><")
  .trim();
