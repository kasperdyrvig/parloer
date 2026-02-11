const path = require("path");

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
  eleventyConfig.addShortcode("uniqueId", function () {
    return uuidv4();
  });

  eleventyConfig.addShortcode("backButton", function () {
    return `<p><a href="../" class="btn btn-small btn-white btn-inline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg> Tilbage</a></p>`;
  });

  eleventyConfig.addShortcode("videoPlayer", function (videoUrl) {
    return `<div class="video-wrapper"><video controls><source src="/assets/video/${videoUrl}" type="video/mp4"></video></div>`;
  });

  eleventyConfig.addPairedShortcode("exerciseItem", function (exerciseContent) {
    const id = uuidv4();
    return `<div class="exercise-item" id="${id}"><form id="${id}f" action="#" onsubmit="startCheck(event)" class="exercise-inputs" autocomplete="off" spellcheck="off">${exerciseContent}</form></div>`;
  });

  eleventyConfig.addPairedShortcode("helpContent", function (content, label) {
    return `<details class="details-help"><summary>${label}</summary><div class="details-help-content">${content.trim().toString().replace(/\n/g, "<br>")}</div></details>`;
  });

  // Filters
  eleventyConfig.addFilter("relatedHomework", (collections, lessonNumber) => {
    return collections.filter(item => {
      return item.data.tags && item.data.tags.includes("homework") && item.data.partOfLesson === lessonNumber;
    })
    .sort((a, b) => (a.data.sortNumber > b.data.sortNumber ? 1 : -1));
  });

  eleventyConfig.addFilter("relatedOralHomework", (collections, lessonNumber) => {
    return collections.filter(item => {
      return item.data.tags && item.data.tags.includes("oral") && item.data.partOfLesson === lessonNumber;
    })
  });

  eleventyConfig.addFilter("relatedGem", (collections, lessonNumber) => {
    return collections.filter(item => {
      return item.data.tags && item.data.tags.includes("gems") && item.data.partOfLesson === lessonNumber;
    })
  });

  eleventyConfig.addFilter("relatedExtra", (collections, lessonNumber) => {
    return collections.filter(item => {
      return item.data.tags && item.data.tags.includes("extrapage") && item.data.partOfLesson === lessonNumber;
    })
  });

  eleventyConfig.addFilter("lessonStudyNote", (collections, lessonNumber) => {
    return collections.filter(item => {
      return item.data.tags && item.data.tags.includes("studynotes") && item.data.partOfLesson === lessonNumber;
    })
  });

  eleventyConfig.addFilter("lessonTeacherNote", (collections, lessonNumber) => {
    return collections.filter(item => {
      return item.data.tags && item.data.tags.includes("teachernotes") && item.data.partOfLesson === lessonNumber;
    })
  });

  eleventyConfig.addFilter("moduleTeacherNote", (collections, moduleNumber) => {
    return collections.filter(item => {
      return item.data.tags && item.data.tags.includes("teachernotes") && item.data.partOfModule === moduleNumber;
    })
  });

  // Return your Object options (must be last in file)
  return {
    dir: {
      input: "src",
      output: "public"
    }
  }
};