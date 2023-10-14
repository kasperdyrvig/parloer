module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/assets");

  // Shortcodes
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }

  eleventyConfig.addShortcode("headers", function (title, subtitle) {
    const id = uuidv4();
    return `<h1 id="${id}">${title}</h1><p>${subtitle}</p>`;
  });

  // Return your Object options (must be last in file)
  return {
    dir: {
      input: "src",
      output: "public"
    }
  }
};