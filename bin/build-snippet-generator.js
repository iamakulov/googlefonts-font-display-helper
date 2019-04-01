const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const jsStringEscape = require('js-string-escape');

const [, , snippetPath, snippetGeneratorPath, outputPath] = process.argv;

// Compile the handlebars template
const snippetGeneratorSource = fs.readFileSync(
  path.resolve(process.cwd(), snippetGeneratorPath),
  'utf-8'
);
const buildSnippetGenerator = Handlebars.compile(snippetGeneratorSource);

// Read and prepare the snippet source
const snippetSource = fs.readFileSync(snippetPath, 'utf-8');
const escapedSnippetSource = jsStringEscape(snippetSource)
  .replace(/<\/script>/g, '<\\/script>')
  .replace(/\r\n/g, '\\n');

// Prepare a snippet with specific values for dogfooding
const compiledSnippet = snippetSource
  .replace(
    /%FONT_STYLESHEET%/g,
    'https://fonts.googleapis.com/css?family=Fira+Mono:400,700|Montserrat:900'
  )
  .replace(/%FONT_DISPLAY%/g, 'swap')
  .replace(/%UNIQUE_ID%/g, Math.floor(Math.random() * 1e6).toString(16));

// Build and write the snippet generator page
const builtSnippetGenerator = buildSnippetGenerator({
  snippetSource: escapedSnippetSource,
  compiledSnippet: compiledSnippet,
});

fs.writeFileSync(
  path.resolve(process.cwd(), outputPath),
  builtSnippetGenerator
);
