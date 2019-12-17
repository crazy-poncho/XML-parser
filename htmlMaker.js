const makeHtml = parsedData => {
    const headerSeries = parsedData.header.headerSeries;
    const headerLevel = parsedData.header.headerLevel;
    const content = parsedData.content;

    console.log(content)
    
    const html = `
    <html>
        <head>
            <meta charset="UTF-8"></meta>
        </head>
        <body>
            <div>
                <span style="font-size: 20px">Series in the word document is:</span>
                <span style="font-weight: bold; font-size: 20px">${headerSeries}</span>
            </div>
            <div>
                <span style="font-size: 20px">Level in the word document is: </span>
                <span style="font-weight: bold; font-size: 20px">${headerLevel}</span>
            </div>
            <hr />
            ${
                content.storyTitle.map((storyTitle, storyTitleIndex) => {
                    const keyWords = retrieveKeyWords(storyTitleIndex, content)
                    const storyTextParagraphs = retrieveStoryTextParagraphs(storyTitleIndex, content);
                    const keyWordsNumber = retrieveKeyWordsNumber(storyTitleIndex, content);

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
                                    ${keyWords.map((keyWord, keyWordIndex) => ` ${keyWordIndex + 1}: ${keyWord};`)}
                                </span>
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
                                                    <span style="font-size: 16px">Sentence ${sentenceIndex + 1}: </span>
                                                    <span style="font-weight: bold; font-size: 16px">${sentence}.</span>
                                                </div>
                                            `;
                                        })}
                                    </div>
                                `;
                            })}
                            <hr />
                        </div>
                    `;
                })
            }
        </body>
    </html>`;

    return html;
};

const retrieveKeyWordsNumber = (storyTitleIndex, content) => {
    return content.keyWords[storyTitleIndex].split(', ').length;
};

const retrieveStoryTextParagraphs = (storyTitleIndex, content) => content.storyText[storyTitleIndex];

const retrieveKeyWords = (storyTitleIndex, content) => content.keyWords[storyTitleIndex].split(', ');

const retrieveParagraphSentences = paragraph => {
    const result = [];
    let temp = '';

    for (let i = 0; i < paragraph.length; i++) {
        if (isTheEndOfSentencesSymbol(paragraph[i]) && paragraph[i + 1] === ' ' && isUpperLetter(paragraph[i + 2])) {
            result.push(temp);
            temp = '';
            i += 1;
            continue;
        } else if (i === paragraph.length - 1) {
            result.push(temp);
            temp = '';
            continue;
        }

        temp += paragraph[i];
    }

    return result;
}

const isUpperLetter = letter => letter === letter.toUpperCase();

const isTheEndOfSentencesSymbol = symbol => ['?', '!', '.'].includes(symbol);

module.exports = { makeHtml };
