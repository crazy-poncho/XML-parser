const express = require('express');
const app = express();
const { startXPathParsing } = require('./xpath');
const { makeXPathHtml } = require('./xpathHtmlMaker');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const PORT = 3000;

app.get('/xpath', async (req, res) => {
    const { file } = req.query;
    const zip = new AdmZip(path.join(__dirname, `/myDoc/${file}.docx`));
    const documentXml = zip.getEntry('word/document.xml').getData();
    const headerXml = zip.getEntry('word/header1.xml').getData();

    const parsedData = await startXPathParsing(documentXml, headerXml);

    fs.createWriteStream('responseXPaths.html').write(makeXPathHtml(parsedData));
    
    return fs.createReadStream('responseXPaths.html').pipe(res);
});

app.listen(PORT, () => {
    console.log('Parsing server is started...');
});
