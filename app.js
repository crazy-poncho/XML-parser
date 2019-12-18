const express = require('express');
const app = express();
const { startXPathParsing } = require('./xpath');
const { makeXPathHtml } = require('./xpathHtmlMaker');
const fs = require('fs');

const PORT = 3000;

app.get('/xpath', async (req, res) => {
    const parsedData = await startXPathParsing();
    fs.createWriteStream('responseXPaths.html').write(makeXPathHtml(parsedData));
    
    return fs.createReadStream('responseXPaths.html').pipe(res);
});

app.listen(PORT, () => {
    console.log('Parsing server is started...');
});
