const pdfTextExtract = require('pdf-text-extract')

function pdfToText(path: string) {
    pdfTextExtract(path, function(err: any,pages: any) {
    if (err) {
      console.error('Error:',err);
      return;
    }
    const text = pages.join('\n');
    return text;
  })
};

export { pdfToText }
