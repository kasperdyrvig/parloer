module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  
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
    const id = uuidv4();
    return `<div class="exercise-item" id="`+ id +`"><form id="`+ id +`f" action="#" onsubmit="startCheck(event)" class="exercise-inputs" autocomplete="off" spellcheck="off">${exerciseContent}</form></div>`;
  });

  // Return your Object options (must be last in file)
  return {
    dir: {
      input: "src",
      output: "public"
    }
  }
};