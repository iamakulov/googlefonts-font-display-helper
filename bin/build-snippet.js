const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const [
  ,
  ,
  minifiedScriptPath,
  snippetTemplatePath,
  targetSnippetPath,
] = process.argv;

const snippetSource = fs.readFileSync(
  path.resolve(process.cwd(), snippetTemplatePath),
  'utf-8'
);
const snippetTemplate = Handlebars.compile(snippetSource);

const minifiedScriptSource = fs.readFileSync(minifiedScriptPath, 'utf-8');
const snippet = snippetTemplate({
  scriptSource: minifiedScriptSource,
});

fs.writeFileSync(path.resolve(process.cwd(), targetSnippetPath), snippet);
