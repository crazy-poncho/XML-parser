const fs = require('fs');
const path = require('path');
const dom = require('xmldom').DOMParser;
const select = require('./xpathNamespaces');

const retrieveReadLiveStudent = () => {
    const xmlReadLiveStudentFile = fs.readFileSync(path.join(__dirname, 'myDoc/ReadLiveStudent1.xml'));
    const doc = new dom().parseFromString(xmlReadLiveStudentFile.toString());
    
    const headerTr = select('//w:hdr/w:tbl/w:tr', doc);
    const headerResult = [];
    headerTr.forEach(item => {
        const doc = new dom().parseFromString(item.toString());
        const result = select('//w:tc/w:p', doc);

        headerResult.push(retrieveParagraphsContent(result, 'header'));
    });

    const documentSdt = select('//w:document/w:body/w:sdt', doc);
    const documentResult = [];

    documentSdt.forEach(item => {
        const doc = new dom().parseFromString(item.toString());
        const result = select('//w:sdtContent/w:sdt/w:sdtContent/w:sdt/w:sdtContent/w:p', doc);

        documentResult.push(retrieveParagraphsContent(result, 'body'));
    });

    return { headerResult, documentResult };
}

const retrieveParagraphsContent = (paragraphs, paragraphsType) => {
    const paragrapthsResult = [];

    paragraphs.forEach(paragrapth => {
        const doc = new dom().parseFromString(paragrapth.toString());
        const textResult = select('//w:r/w:t/text()', doc);
        let paragrapthText = '';

        textResult.forEach(text => {
            paragrapthText += text.nodeValue;
        });

        paragrapthsResult.push(paragrapthText);
    });

    return paragrapthsResult.filter(item => !!item[0]);
};

const retrieveDescriptionInfo = () => {
    const xmlDocumentFile = fs.readFileSync(path.join(__dirname, `myDoc/ReadLiveStudent1.xml`));
    const doc = new dom().parseFromString(xmlDocumentFile.toString());
    const result = select('//w:document/w:body/w:p', doc);

    const descriptionInfoContent = retrieveParagraphsContent(result, 'descriptionInfo');

    return groupDecriptionInfo(descriptionInfoContent);
};

const groupDecriptionInfo = descriptionInfoContent => {
    const descriptionInfoResult = [];

    for (let i = 0; i < descriptionInfoContent.length; i += 2) {
        const storyTitle = descriptionInfoContent[i];
        const keyWords = descriptionInfoContent[i + 1];

        descriptionInfoResult.push({ storyTitle, keyWords  });
    }

    return descriptionInfoResult;
}

const startXPathParsing = async () => {
    const header = retrieveReadLiveStudent().headerResult;
    const body = retrieveReadLiveStudent().documentResult;
    const descriptionInfo = retrieveDescriptionInfo();

    return { header, body, descriptionInfo }
}

module.exports = { startXPathParsing };
