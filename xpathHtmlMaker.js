const makeXPathHtml = data => {
    const { header, body, descriptionInfo } = data;

    const html = `
    <html>
        <head>
            <meta charset="UTF-8"></meta>
        </head>
        <body>
            <div>
                <span style="font-size: 20px">Series in the word document is:</span>
                <span style="font-weight: bold; font-size: 20px">${header[0][0].split(':')[1]}</span>
            </div>
            <div>
                <span style="font-size: 20px">Level in the word document is: </span>
                <span style="font-weight: bold; font-size: 20px">${header[1][0].split(':')[1]}</span>
            </div>
            <hr />
            ${descriptionInfo.map((infoItem, infoItemIndex) => {
                const storyTitle = infoItem.storyTitle;
                const keyWordsNumber = retrieveKeyWordsNumber(infoItem.keyWords);
                const keyWords = infoItem.keyWords.split(', ');
                const storyTextParagraphs = body[infoItemIndex];
                
                return `
                    <div>
                        <div>
                            <span style="font-size: 20px">The title of the story in the word document is:</span>
                            <span style="font-weight: bold; font-size: 20px">${storyTitle}</span>
                        </div>
                        <div>
                            <span style="font-size: 20px">Number of Keywords entered in the word document:</span>
                            <span style="font-weight: bold; font-size: 20px">${keyWordsNumber}</span>
                        </div>
                        <div>
                            <span style="font-size: 20px">The keywords entered in the word document are:</span>
                            <span style="font-weight: bold; font-size: 20px">
                                ${keyWords.map((keyWord, keyWordIndex) => ` ${keyWordIndex + 1}: ${keyWord}`)}
                            </span>
                        </div>
                    </div>
                    <h2>Story Text:</h2>
                    <div>   
                        <span style="font-size: 20px">Number of paragraphs in the word document is:</span>
                        <span style="font-weight: bold; font-size: 20px">${storyTextParagraphs.length}</span>
                    </div>
                    ${storyTextParagraphs.map((storyTextParagraph, storyTextParagraphIndex) => {
                        const paragraphSentences = retrieveParagraphSentences(storyTextParagraph);

                        return `
                            <div>   
                                <h4 style="font-size: 18px">Paragraph: ${storyTextParagraphIndex + 1}</h4>
                                ${paragraphSentences.map((sentence, sentenceIndex) => {
                                    return `
                                        <div>
                                            <span style="font-size: 16px">
                                                Sentence ${sentenceIndex + 1}:
                                            </span>
                                            <span style="font-size: 16px">${sentence}.</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        `;
                    }).join('')}
                    <hr />
                `;
            }).join('')}
        </body>
    </html>`;

    return html;
};

const retrieveKeyWordsNumber = storyTitleIndex => {
    return storyTitleIndex.split(', ').length;
};

const retrieveParagraphSentences = paragraph => {
    const result = [];
    let temp = '';
    const text = paragraph;

    for (let i = 0; i < text.length; i++) {
        if (isTheEndOfSentencesSymbol(text[i]) && text[i + 1] === ' ') {
            result.push(temp);
            temp = '';
            i += 1;
            continue;
        } else if (i === text.length - 1) {
            result.push(temp);
            temp = '';
            continue;
        }

        temp += text[i];
    }

    return result;
}

const isTheEndOfSentencesSymbol = symbol => ['?', '!', '.'].includes(symbol);

const replaceSpecialSymbols = sentences => {
    const allowedSybmols = [
        { orignSymbol: '…', replcaedSymbol: '&#8230;' },
        { orignSymbol: '–', replcaedSymbol: '&mdash;' },
    ];

    const result = sentences.map(sentence => {
        let resSentence = sentence;

        allowedSybmols.forEach(item => {
            resSentence = resSentence.replace(item.orignSymbol, item.replcaedSymbol);
        });
    
        return resSentence;
    });

    return result;
}

module.exports = { makeXPathHtml };
