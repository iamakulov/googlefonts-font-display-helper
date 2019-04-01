(function(window, document, localStorage) {
  'use strict';

  // %FONT_STYLESHEET%, %FONT_DISPLAY% and %UNIQUE_ID% values are replaced by the snippet generator
  // when the snippet is generated
  var fontStylesheet = '%FONT_STYLESHEET%';
  var fontDisplayValue = '%FONT_DISPLAY%';
  // We need a unique ID for a localStorage key and a style tag attribute (see #18 for reasoning).
  // In this script, we reuse the same variable for both meanings
  // to reduce the script size after minification and gzip
  var uniqueStorageId = '__3perf_googleFonts_%UNIQUE_ID%';

  function append(el) {
    (document.head || document.body).appendChild(el);
  }

  function insertFallback() {
    var link = document.createElement('link');
    link.href = fontStylesheet;
    link.rel = 'stylesheet';
    append(link);
  }

  function patchStylesheet(stylesheet) {
    return stylesheet.replace(
      /@font-face {/g,
      '@font-face{font-display:' + fontDisplayValue + ';'
    );
  }

  function insertStylesheet(stylesheet) {
    if (!document.getElementById(uniqueStorageId)) {
      var style = document.createElement('style');
      style.id = uniqueStorageId;
      append(style);
    }

    document.getElementById(uniqueStorageId).innerHTML = stylesheet;
  }

  var isFontDisplaySupported =
    window.FontFace && window.FontFace.prototype.hasOwnProperty('display');
  if (!isFontDisplaySupported) {
    insertFallback();
    return;
  }

  if (localStorage[uniqueStorageId]) {
    // We insert a cached stylesheet syncronously to avoid a FOUT if fonts are cached.
    // This matches the behavior of the original render-blocking `<link rel="stylesheet">` tag.
    // There’s a small chance that the cached stylesheet is outdated – to handle this,
    // we still perform a `fetch` and update the stylesheet asynchronously
    insertStylesheet(localStorage[uniqueStorageId]);
  }

  // Still initiate fetch() to avoid “Unused <link rel="preload">” warnings
  fetch(fontStylesheet)
    .then(function(response) {
      return response.text();
    })
    .then(patchStylesheet)
    .then(function(stylesheet) {
      localStorage[uniqueStorageId] = stylesheet;
      return stylesheet;
    })
    .then(insertStylesheet)
    .catch(insertFallback);
})(window, document, localStorage);
