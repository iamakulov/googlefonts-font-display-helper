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

  function patchStylesheet(stylesheet) {
    return stylesheet.replace(
      /@font-face {/g,
      '@font-face{font-display:' + fontDisplayValue + ';'
    );
  }
  
  function insertStylesheet(stylesheet) {
    var style = document.createElement('style');
    style.innerHTML = stylesheet;
    append(style);
  }

  var isFontDisplaySupported =
    window.FontFace && window.FontFace.prototype.hasOwnProperty('display');
  if (!isFontDisplaySupported) {
    insertFallback();
    return;
  }

  if (localStorage[cssLocalStorageKey]) {
    insertStylesheet(localStorage[cssLocalStorageKey]);
    // Still initiate fetch() to avoid “Unused <link rel="preload">” warnings
    fetch(fontStylesheet).then(function() {});
    return;
  }

  fetch(fontStylesheet)
    .then(function(response) {
      return response.text();
    })
    .then(patchStylesheet)
    .then(function(stylesheet) {
      localStorage[cssLocalStorageKey] = stylesheet;
      return stylesheet;
    })
    .then(insertStylesheet)
    .catch(insertFallback);
})();
