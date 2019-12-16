const express = require('express');
const app = express();
const { startParsing } = require('./parseAsXMLs');
const { makeHtml } = require('./htmlMaker');
const fs = require('fs');

app.get('/', async (req, res) => {
    const parsedData = await startParsing('myDoc/ReadLiveStudent1.xml');
    fs.createWriteStream('response.html').write(makeHtml(parsedData).replace(/[,]/g, ''));
    
    return fs.createReadStream('response.html').pipe(res);
});

app.listen(9999, () => {
    console.log('Parsing server is started...');
});
