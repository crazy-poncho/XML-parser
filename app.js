const express = require('express');
const app = express();
const { startParsing } = require('./parseAsXMLs');
const { startXPathParsing } = require('./xpath');
const { makeHtml } = require('./htmlMaker');
const { makeXPathHtml } = require('./xpathHtmlMaker');
const fs = require('fs');

const PORT = 3000;

app.get('/', async (req, res) => {
    const parsedData = await startParsing('myDoc/ReadLiveStudent1.xml');
    fs.createWriteStream('response.html').write(makeHtml(parsedData).replace(/[,]/g, ''));
    
    return fs.createReadStream('response.html').pipe(res);
});

app.get('/xpath', async (req, res) => {
    const parsedData = await startXPathParsing();
    fs.createWriteStream('responseXPaths.html').write(makeXPathHtml(parsedData));
    
    return fs.createReadStream('responseXPaths.html').pipe(res);
});

app.listen(PORT, () => {
    console.log('Parsing server is started...');
});
