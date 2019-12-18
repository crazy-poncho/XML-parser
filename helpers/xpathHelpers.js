const lodash = require('lodash');
const { ELLIPSIS, DASH } = require('../constants/replacedSpecSymbols');
const { ORIGIN_ELLIPSIS, ORIGIN_DASH} = require('../constants/originSymbols');

const retrieveParagraphText = paragraphs => {
    const result = [];
    
    paragraphs.forEach(paragraph => {
        let text = '';
        
        paragraph.forEach(detail => {
            if (detail.isBold && detail.isItalic && detail.isUnderlined) {
                text += `<span><i><b><u>${detail.text}</u></b></i><span>`;
                return;
            }
            if (detail.isBold && detail.isItalic) {
                text += `<span><b><i>${detail.text}</i></b><span>`;
                return;
            }
            if (detail.isBold && detail.isUnderlined) {
                text += `<span><u><b>${detail.text}</b></u><span>`;
                return;
            }
            if (detail.isItalic && detail.isUnderlined) {
                text += `<span><u><i>${detail.text}</i></u><span>`;
                return;
            }
            if (detail.isBold) {
                text += `<span><b>${detail.text}</b></span>`;
                return;
            }
            if (detail.isItalic) {
                text += `<span><i>${detail.text}</i></span>`;
                return;
            }
            if (detail.isUnderlined) {
                text += `<span><u>${detail.text}</u></span>`;
                return;
            }
    
            text += `${detail.text}`;
        });

        result.push(text);
    });

    return result;
};

const retrieveKeyWordsNumber = storyTitleIndex => {
    return storyTitleIndex.split(', ').length;
};

const retrieveParagraphSentences = paragraph => {
    const result = [];
    let temp = '';
    const text = replaceSpecialSymbols(paragraph);

    for (let i = 0; i < text.length; i++) {
        if (isTheEndOfSentencesSymbol(text[i]) && text[i + 1] === ' ' && isUpperLetter(text[i + 2])) {
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

    return filterMultipleSentencesSymbols(result);
};

const isUpperLetter = letter => letter === letter.toUpperCase();

const isTheEndOfSentencesSymbol = symbol => ['?', '!', '.'].includes(symbol);

const filterMultipleSentencesSymbols = sentences => {
    const result = [];

    sentences.forEach(sentence => {
        result.push(splitSentence(sentence));
    });

    return lodash.flattenDeep(result);
};

const splitSentence = sentence => {
    if (sentence.indexOf(ELLIPSIS) !== -1) {
        const splitted = sentence.split(ELLIPSIS);
        splitted[0] = splitted[0].concat(ELLIPSIS);

        return [splitted[0], splitted[1]];
    }

    return sentence;
};

const replaceSpecialSymbols = paragraph => {
    const allowedSybmols = [
        { orignSymbol: ORIGIN_ELLIPSIS, replcaedSymbol: ELLIPSIS },
        { orignSymbol: ORIGIN_DASH, replcaedSymbol: DASH },
    ];

    allowedSybmols.forEach(item => {
        paragraph = paragraph.replace(item.orignSymbol, item.replcaedSymbol);
    });

    return paragraph;
};

module.exports = {
    retrieveKeyWordsNumber,
    retrieveParagraphSentences,
    retrieveParagraphText
};
