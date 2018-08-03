var markdownpdf = require('markdown-pdf');

var mdDocs = ['docs/ThingsProEdgeApp.md', 'docs/ThingsProEdgeIntro.md'],
  bookPath = './book.pdf';

markdownpdf()
  .concat.from(mdDocs)
  .to(bookPath, function() {
    console.log('Created', bookPath);
  });
