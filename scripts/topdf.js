var markdownpdf = require('markdown-pdf');
var fs = require('fs');

var mdEdgeDocs = [];
var EDGE_BOOK = 'thingspro-edge-developer-docs.pdf';
var EDGE_PATH = 'docs/edge';
fs.readdirSync(EDGE_PATH).forEach(file => {
  mdEdgeDocs.push(`${EDGE_PATH}/${file}`);
});

markdownpdf()
  .concat.from(mdEdgeDocs)
  .to(EDGE_BOOK, function() {
    console.log('Created', EDGE_BOOK);
  });
