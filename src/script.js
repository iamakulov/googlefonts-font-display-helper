(function() {
  // $FONT_STYLESHEET$ and $FONT_DISPLAY$ values are replaced by the snippet generator
  // when the snippet is generated
  var fontStylesheet = '%FONT_STYLESHEET%';
  var fontDisplayValue = '%FONT_DISPLAY%';
  var cssLocalStorageKey = '__3perf_googleFontsStylesheet';

  function insertFallback() {
    var link = document.createElement('link');
    link.href = fontStylesheet;
    link.rel = 'stylesheet';
    (document.head || document.body).appendChild(link);
  }

  function patchAndInsertStylesheet(stylesheet) {
    var stylesheetWithFontDisplay = stylesheet.replace(
      /@font-face {/g,
      '@font-face {\n  font-display: ' + fontDisplayValue + ';'
    );

    var style = document.createElement('style');
    style.innerHTML = stylesheetWithFontDisplay;
    (document.head || document.body).appendChild(style);
  }

  var isFontDisplaySupported = document.fonts !== undefined;
  if (!isFontDisplaySupported) {
    insertFallback();
    return;
  }

  if (localStorage.getItem(cssLocalStorageKey)) {
    var stylesheet = localStorage.getItem(cssLocalStorageKey);
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
      localStorage.setItem(cssLocalStorageKey, stylesheet);
      return stylesheet;
    })
    .then(patchAndInsertStylesheet)
    .catch(insertFallback);
})();
