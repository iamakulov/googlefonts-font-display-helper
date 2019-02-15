(function() {
  'use strict';
  
  // $FONT_STYLESHEET$ and $FONT_DISPLAY$ values are replaced by the snippet generator
  // when the snippet is generated
  var fontStylesheet = '%FONT_STYLESHEET%';
  var fontDisplayValue = '%FONT_DISPLAY%';
  var cssLocalStorageKey = '__3perf_googleFontsStylesheet';
  
  function append(el) {
    (document.head || document.body).appendChild(el);
  }
  
  function insertFallback() {
    var link = document.createElement('link');
    link.href = fontStylesheet;
    link.rel = 'stylesheet';
    append(link);
  }

  function patchAndInsertStylesheet(stylesheet) {
    var stylesheetWithFontDisplay = stylesheet.replace(
      /@font-face {/g,
      '@font-face{font-display:' + fontDisplayValue + ';'
    );

    var style = document.createElement('style');
    style.innerHTML = stylesheetWithFontDisplay;
    append(style);
  }

  var isFontDisplaySupported =
    window.FontFace && window.FontFace.prototype.hasOwnProperty('display');
  if (!isFontDisplaySupported) {
    insertFallback();
    return;
  }

  if (localStorage[cssLocalStorageKey]) {
    var stylesheet = localStorage[cssLocalStorageKey];
    patchAndInsertStylesheet(stylesheet);
    // Still initiate fetch() to avoid “Unused <link rel="preload">” warnings
    fetch(fontStylesheet).then(function() {});
    return;
  }

  fetch(fontStylesheet)
    .then(function(response) {
      return response.text();
    })
    .then(function(stylesheet) {
      localStorage[cssLocalStorageKey] = stylesheet;
      return stylesheet;
    })
    .then(patchAndInsertStylesheet)
    .catch(insertFallback);
})();
