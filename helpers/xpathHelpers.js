const lodash = require('lodash');
const { ELLIPSIS, DASH } = require('../constants/replacedSpecSymbols');
const { ORIGIN_ELLIPSIS, ORIGIN_DASH} = require('../constants/originSymbols');

const retrieveKeyWordsNumber = storyTitleIndex => {
    return storyTitleIndex.split(', ').length;
};

const retrieveParagraphSentences = paragraph => {
    const result = [];
    let temp = '';
    const text = paragraph;

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

    return filterMultipleSentencesSymbols(replaceSpecialSymbols(result));
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

const replaceSpecialSymbols = sentences => {
    const allowedSybmols = [
        { orignSymbol: ORIGIN_ELLIPSIS, replcaedSymbol: ELLIPSIS },
        { orignSymbol: ORIGIN_DASH, replcaedSymbol: DASH },
    ];

    const result = sentences.map(sentence => {
        let resSentence = sentence;

        allowedSybmols.forEach(item => {
            resSentence = resSentence.replace(item.orignSymbol, item.replcaedSymbol);
        });
    
        return resSentence;
    });

    return result;
};

module.exports = {
    retrieveKeyWordsNumber,
    retrieveParagraphSentences
};
