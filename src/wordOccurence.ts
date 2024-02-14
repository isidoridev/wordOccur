/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/naming-convention */
const fs = require('fs')

//  Words In Context
//  Parsing Input To Blob

// *Important word_set
type WordSet = Record<string, number[]>
let word_set: WordSet = {}

// *Important sentence_list
let sentence_list: string[] = []

// Sorta Important
interface TotalData {
  sentence_list: string[],
  word_set: WordSet, 
}

let total_data: TotalData = {sentence_list: [], word_set: {}}
function createTotalData(): TotalData {
  return {word_set, sentence_list}
}


// if(c == ' ') processWord(c,line);
function processWord (word: string, line_count: number): void {
  word = word.toLowerCase()
  if (!(word in word_set)) {
    word_set[word] = [line_count]
  } else {
    word_set[word].push(line_count)
  }
}

function parseInputToFiles (input: string): void {
  let prev_sentence: string = ''
  let prev_word: string = ''
  let sentence_count: number = 0
  

  for (let i = 0; i < input.length; i++) {
    const c = input.charAt(i)

    if (/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ¿¡\-0-9]+$/.test(c)) {
      // console.log(1, c)
      prev_word += c
    }
    else if (c === ' ') { // End of word - collect last word and add to line.
      // console.log(2, prev_word)
      if (prev_word === '') continue
      processWord(prev_word, sentence_count)
      prev_sentence += `${prev_word} `
      prev_word = ''
    }
    else if (c === '.' || c === '?' || c === '!') { // End of sentence - collect last word and sentence.
      // console.log(3, c)
      processWord(prev_word, sentence_count)
      sentence_list[sentence_count] = `${prev_sentence}${prev_word}${c}`
      //console.log(sentence_list)
      prev_sentence = ''
      prev_word = ''
      sentence_count += 1
    }
  }
  // console.log(sentence_list, sentence_count)
}

parseInputToFiles('This is a test piece. I wonder what is the output? Who knows.')
total_data = createTotalData()

// convert word_set into file
function writeBlobToFile (path?: string) {
  if (path) {
    //
  } else {
    // Convert the array of objects to JSON string
    const jsonString = JSON.stringify(total_data, null, 2)
    fs.writeFileSync('./results/word_set.json', jsonString)
    //console.log('JSON file created successfully.')
  }
}

writeBlobToFile()

function restoreWordSet (): void {
  // Read the JSON file
  const jsonString = fs.readFileSync('./results/word_set.json', 'utf-8')
  // Parse the JSON string into an array of MyObject
  total_data = JSON.parse(jsonString)
}

//console.log(total_data.sentence_list)

/// Given a full total_data, let's try select a word.

const test_input: string = "this" // substitute this

function lineSelector(inp: string): void {
  if(total_data.word_set[inp]) {
    total_data.word_set[inp].forEach((line_n) => 
    console.log(total_data.sentence_list[line_n]))
  }
}
//console.log(total_data)
lineSelector(test_input)