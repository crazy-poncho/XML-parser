const fs = require('fs');
const path = require('path');
const xmlParser = require('xml2js');

const ReadLiveStudentParser = new xmlParser.Parser({
    normalize: true,
    normalizeTags: true,
    mergeAttrs: true,
});

const processReadLive = ReadLiveStudentData => {
    const parts = ReadLiveStudentData['pkg:package']['pkg:part'];

    return { 
        header: extractReadLiveHeader(parts.filter(package => package['pkg:name'].includes('/word/header1.xml'))),
        content: extractReadLiveContent(parts.filter(package => package['pkg:name'].includes('/word/document.xml')))
    };
};

const extractReadLiveHeader = headerKeywordWrapper => {
    const tr = headerKeywordWrapper[0]['pkg:xmldata'][0]['w:hdr'][0]['w:tbl'][0]['w:tr'];

    const tc = tr.map(item => item['w:tc']);

    const headerSeries = retrieveHeaderInfo(tc[0]);
    const headerLevel = retrieveHeaderInfo(tc[1]);

    return { headerSeries, headerLevel };
}

const retrieveHeaderInfo = headerDataWrapper => {
    const p = headerDataWrapper[0]['w:p'];
    const r = p[0]['w:r'];
    const t = r.reduce((acc, item) => acc + retreiveAppropriateDataByType(item['w:t'][0]), '');

    return t.split(':')[1];
};

const extractReadLiveContent = documentKeywordWrapper => {
    const body = documentKeywordWrapper[0]['pkg:xmldata'][0]['w:document'][0]['w:body'];
    const p = removeUnparsedRows(body[0]['w:p']);
    const sdt = body[0]['w:sdt'];
    const storyTitle = retrieveDescriptionStoryInfo(p, 'RLStoryTitleChar');
    const keyWords = retrieveDescriptionStoryInfo(p, 'RLKeyWordsChar');
    const storyText = retrieveStoryText(sdt);

    return { storyTitle, keyWords, storyText };
}

const retrieveDescriptionStoryInfo = (contentWrapper, descriptionInfoStyle) => {
    const result = [];

    for (let i = 0; i < contentWrapper.length; i++) {
        const item = contentWrapper[i];
        const r = item['w:r'];
        const rpr = r[0]['w:rpr'];
        const rstyle = rpr[0]['w:rstyle'][0]['w:val'][0];

        if (rstyle === descriptionInfoStyle) {
            const t = r.reduce((acc, item) => acc + item['w:t'][0], '');
            result.push(t);
        }
    }

    return result;
};

const retrieveStoryText = contentWrapeer => {
    const result = [];

    contentWrapeer.forEach(item => {
        const stdText = [];
        const sdt = item['w:sdtcontent'][0]['w:sdt'];
        
        sdt.forEach(item => {
            const p = extractSdtParagraph(item['w:sdtcontent']);
            p.forEach(pItem => {
                if (pItem['w:r'] || pItem['w:sdt']) {
                    if (pItem['w:sdt']) {
                        const  storyText = pItem['w:sdt'].reduce((acc, pSdtItem) => {
                            const r = pSdtItem['w:sdtcontent'][0]['w:r'];

                            return acc + ' ' + extractParagraphContent(filterParagraphContent(r));
                        }, '');

                        stdText.push(storyText);
                    } else {
                        const storyText = extractParagraphContent(filterParagraphContent(pItem['w:r']));
                        stdText.push(storyText);
                    }
                }
            });
        });

        result.push(stdText);
    });

    return result;
};

const extractSdtParagraph = sdtcontent => {
    if (sdtcontent[0]['w:p']) {
        return sdtcontent[0]['w:p'];
    }

    return extractSdtParagraph(sdtcontent[0]['w:sdt'][0]['w:sdtcontent']);
};

const filterParagraphContent = contentArray => contentArray.map(item => {
    return { t: retreiveAppropriateDataByType(item['w:t'] ? item['w:t'][0] : {}) };
});

const extractParagraphContent = contentArray => {
    return contentArray.reduce((accumulator, item) => accumulator + item.t, '');
};

const removeUnparsedRows = data => data.filter(item => {
    return (!!item['w:r'] && !!item['w:r'][0]['w:rpr']);
});

const isOnlySpace = data => Object.keys(data).length === 1 && data.hasOwnProperty('xml:space');
const isSpace = data => data.hasOwnProperty('xml:space');

const retreiveAppropriateDataByType = data => {
    if (typeof data === 'string') {
        return ' ' + data;
    }
    if (typeof data === 'object' && isOnlySpace(data)) {
        return ' ';
    }
    if (typeof data === 'object' && isSpace(data)) {
        return ' ' + data._;
    }
    
    return '';
}

const startParsing = (fileReadLiveStudentPath) => {
    try {
        const xmlReadLiveStudentFile = fs.readFileSync(path.join(__dirname, `/${fileReadLiveStudentPath}`));
        const ReadLiveStudentXML = ReadLiveStudentParser.parseStringPromise(xmlReadLiveStudentFile);
        
        return Promise.all([ReadLiveStudentXML]).then(data => {
            const [ReadLiveStudentData] = data;
            const ReadLiveStudent = processReadLive(ReadLiveStudentData);

            return ReadLiveStudent;
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { startParsing };
