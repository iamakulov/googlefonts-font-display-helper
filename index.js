(function() {
  var fontStylesheet =
    'https://fonts.googleapis.com/css?family=Fira+Mono|Merriweather:700';
  var fontDisplayValue = 'swap';
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

  var isFontDisplaySupported =
    window.FontFace && window.FontFace.prototype.hasOwnProperty('display');
  if (!isFontDisplaySupported) {
    insertFallback();
    return;
  }

  if (localStorage.getItem(cssLocalStorageKey)) {
    var stylesheet = localStorage.getItem(cssLocalStorageKey);
    patchAndInsertStylesheet(stylesheet);
    // Still initiate fetch() to avoid “Unused <link rel="preload">” warnings
    fetch(fontStylesheet).then(() => {});
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
