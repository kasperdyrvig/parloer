module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/assets");
  
  // Functions
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  // Shortcodes
  eleventyConfig.addPairedShortcode("exerciseItem", function (exerciseContent) {
    return `<div class="exercise-item">${exerciseContent}</div>`;
  });

  // Return your Object options (must be last in file)
  return {
    dir: {
      input: "src",
      output: "public"
    }
  }
};