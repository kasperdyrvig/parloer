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
  eleventyConfig.addShortcode("exerciseMultiInput", function (labelArray, validationArray) {
    let output = `<fieldset class="multiinput">`;
    const labels = labelArray.split(",");
    labels.forEach(element => {
      const id = uuidv4();
      output += `<div class="form-group textinput">
        <label for="${id}">${element}</label>
        <input type="text" id="${id}" class="form-input" autocomplete="off" spellcheck="off">
      </div>`;
    });
    output += `</fieldset>`;
    return output;
  });
  
  eleventyConfig.addShortcode("exerciseInput", function (label, validation) {
    const id = uuidv4();
    return `<div class="form-group textinput">
        <label for="${id}">${label}</label>
        <input type="text" id="${id}" autocomplete="off" spellcheck="off">
      </div>`;
  });

  eleventyConfig.addShortcode("uniqueId", function () {
    return uuidv4();
  });

  eleventyConfig.addShortcode("backButton", function () {
    return `<p><a href="../" class="btn btn-small btn-white btn-inline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg> Tilbage</a></p>`;
  });

  eleventyConfig.addShortcode("searchFab", function () {
    return `<a href="/soeg" title="Søg" class="btn btn-gray fab-search">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
      </svg>
    </a>`;
  });

  eleventyConfig.addShortcode("videoPlayer", function (videoUrl) {
    return `<div class="video-wrapper"><video controls><source src="/assets/video/${videoUrl}" type="video/mp4"></video></div>`;
  });

  eleventyConfig.addPairedShortcode("exerciseItem", function (exerciseContent) {
    const id = uuidv4();
    return `<div class="exercise-item" id="${id}"><form id="${id}f" action="#" onsubmit="startCheck(event)" class="exercise-inputs" autocomplete="off" spellcheck="off">${exerciseContent}</form></div>`;
  });

  eleventyConfig.addPairedShortcode("helpContent", function (content, label) {
    const id = uuidv4();
    return `<details class="details-help"><summary>${label}</summary><div class="details-help-content">${content}</div></details>`;
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