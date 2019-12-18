const fs = require('fs');
const path = require('path');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const xpathNamespaces = require('./xpathNamespaces');

const select = xpath.useNamespaces(xpathNamespaces());

const { FILE_PATH } = require('./constants/common');

const retrieveReadLiveStudent = () => {
    const xmlReadLiveStudentFile = fs.readFileSync(path.join(__dirname, FILE_PATH));
    const doc = new dom().parseFromString(xmlReadLiveStudentFile.toString());
    
    const headerTr = select('//w:hdr/w:tbl/w:tr', doc);
    const headerResult = [];
    headerTr.forEach(item => {
        const doc = new dom().parseFromString(item.toString());
        const result = select('//w:tc/w:p', doc);

        headerResult.push(retrieveParagraphsContent(result, 'header'));
    });

    const bodySdt = select('//w:document/w:body/w:sdt', doc);
    const bodyResult = [];

    bodySdt.forEach(item => {
        const doc = new dom().parseFromString(item.toString());
        const result = select('//w:sdtContent/w:p', doc);

        bodyResult.push(retrieveParagraphsContent(result, 'body'));
    });

    return { headerResult, bodyResult };
}

const retrieveParagraphsContent = (paragraphs, paragraphsType) => {
    const paragrapthsResult = [];

    paragraphs.forEach(paragrapth => {
        const doc = new dom().parseFromString(paragrapth.toString());
        const textResult = select('//w:r/w:t/text()', doc);
        const bodyText = [];
        let paragrapthText = '';

        textResult.forEach(text => {
            if (paragraphsType === 'body') {
                const r = select(`//w:r[w:t[text()='${text.nodeValue}']]`, doc);
                const isBold = retrieveWordStyles(r, 'b');
                const isItalic = retrieveWordStyles(r, 'i');
                const isUnderlined = retrieveWordStyles(r, 'u');

                bodyText.push({ text: text.nodeValue, isBold, isItalic, isUnderlined });
            } else {
                paragrapthText += text.nodeValue;
            }
        });

        paragrapthsResult.push(paragraphsType === 'body' ? bodyText : paragrapthText);
    });

    return paragrapthsResult.filter(item => !!item[0]);
};

const retrieveDescriptionInfo = () => {
    const xmlDocumentFile = fs.readFileSync(path.join(__dirname, FILE_PATH));
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

const retrieveWordStyles = (r, style) => {
    const doc = new dom().parseFromString(r.toString());
    const result = select(`//w:${style}`, doc);

    return !!result.length;
};

const startXPathParsing = async () => {
    const header = retrieveReadLiveStudent().headerResult;
    const body = retrieveReadLiveStudent().bodyResult;
    const descriptionInfo = retrieveDescriptionInfo();

    return { header, body, descriptionInfo }
}

module.exports = { startXPathParsing };
