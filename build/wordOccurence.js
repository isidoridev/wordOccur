"use strict";
/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/naming-convention */
const fs = require('fs');
let word_set = {};
let sentence_list = [];
let total_data = { sentence_list: [], word_set: {} };
function createTotalData() {
    return { word_set, sentence_list };
}
/// if(c == ' ') processWord(c,line);
function processWord(word, line_count) {
    if (!(word in word_set)) {
        word_set[word] = [line_count];
    }
    else {
        word_set[word].push(line_count);
    }
}
function parseInputToFiles(input) {
    let prev_sentence = '';
    let prev_word = '';
    let sentence_count = 0;
    for (let i = 0; i < input.length; i++) {
        const c = input.charAt(i);
        if (/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ¿¡\-0-9]+$/.test(c)) {
            // console.log(1, c)
            prev_word += c;
        }
        else if (c === ' ') { // End of word - collect last word and add to line.
            // console.log(2, prev_word)
            if (prev_word === '')
                continue;
            processWord(prev_word, sentence_count);
            prev_sentence += `${prev_word} `;
            prev_word = '';
        }
        else if (c === '.' || c === '?' || c === '!') { // End of sentence - collect last word and sentence.
            // console.log(3, c)
            processWord(prev_word, sentence_count);
            sentence_list[sentence_count] = `${prev_sentence} ${prev_word}${c}`;
            console.log(sentence_list);
            prev_sentence = '';
            prev_word = '';
            sentence_count += 1;
        }
    }
    // console.log(sentence_list, sentence_count)
}
parseInputToFiles('This is a test piece. I wonder what is the output? Who knows.');
total_data = createTotalData();
// convert word_set into file
function writeBlobToFile(path) {
    if (path) {
        //
    }
    else {
        // Generic Path ~/Writing/12WordsInContext/.json
        // console.log('Executing writeBlobToFile')
        // Convert the array of objects to JSON string
        const jsonString = JSON.stringify(total_data, null, 2);
        fs.writeFileSync('./results/word_set.json', jsonString);
        console.log('JSON file created successfully.');
    }
}
writeBlobToFile();
function restoreWordSet() {
    // Read the JSON file
    const jsonString = fs.readFileSync('./results/word_set.json', 'utf-8');
    // Parse the JSON string into an array of MyObject
    total_data = JSON.parse(jsonString);
}
console.log(total_data.sentence_list);
//restoreWordSet()
//console.log(word_set);
