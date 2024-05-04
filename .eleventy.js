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
  eleventyConfig.addShortcode("searchFab", function () {
    return `<a href="/soeg" title="Søg" class="btn btn-gray fab-search">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
      </svg>
    </a>`;
  });

  eleventyConfig.addShortcode("videoPlayer", function (videoUrl) {
    return `<div class="video-wrapper"><video controls><source src="/assets/video/` + videoUrl + `" type="video/mp4"></video></div>`;
  });

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