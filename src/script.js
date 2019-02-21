(function() {
  'use strict';

  // $FONT_STYLESHEET$ and $FONT_DISPLAY$ values are replaced by the snippet generator
  // when the snippet is generated
  var fontStylesheet = '%FONT_STYLESHEET%';
  var fontDisplayValue = '%FONT_DISPLAY%';
  // We use the same ID as both a localStorage key and a style tag attribute.
  // In this script, we reuse the same variable for both meanings
  // to reduce the script size after minification and gzip
  var uniqueStorageId = '__3perf_googleFontsStylesheet';

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
})();
