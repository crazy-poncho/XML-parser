const fs = require('fs');
const path = require('path');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const xpathNamespaces = require('./xpathNamespaces');

const select = xpath.useNamespaces(xpathNamespaces());

const filePath = 'myDoc/ReadLiveStudent.xml';

const retrieveReadLiveStudent = () => {
    const xmlReadLiveStudentFile = fs.readFileSync(path.join(__dirname, filePath));
    const doc = new dom().parseFromString(xmlReadLiveStudentFile.toString());
    
    const headerTr = select('//w:hdr/w:tbl/w:tr', doc);
    const headerResult = [];
    headerTr.forEach(item => {
        const doc = new dom().parseFromString(item.toString());
        const result = select('//w:tc/w:p', doc);

        headerResult.push(retrieveParagraphsContent(result, 'header'));
    });

    const documentSdt = select('//w:document/w:body/w:sdt', doc);
    const bodyResult = [];

    documentSdt.forEach(item => {
        const doc = new dom().parseFromString(item.toString());
        const result = select('//w:sdtContent/w:sdt/w:sdtContent/w:sdt/w:sdtContent/w:p', doc);

        bodyResult.push(retrieveParagraphsContent(result, 'body'));
    });

    return { headerResult, bodyResult };
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
    const xmlDocumentFile = fs.readFileSync(path.join(__dirname, filePath));
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
    const body = retrieveReadLiveStudent().bodyResult;
    const descriptionInfo = retrieveDescriptionInfo();

    return { header, body, descriptionInfo }
}

module.exports = { startXPathParsing };
