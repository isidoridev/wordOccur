const fs = require('fs')
const readline = require('readline');
import { pdfToText } from "./pdftotext";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Parsing and Output

let word_set: [{},] = [{
  word: "",
  lines: [],
  count: 0,
}]

let sentence_list: string[] = []

let total_data: {} = {
  sentence_list: [], 
  word_set: [
    {
      word: "",
      lines: [],
      count: 0
    },
  ]
}

function createTotalData(): any {
  return {word_set, sentence_list}
}

function processWord (word: string, line_count: number): void {
  word = word.toLowerCase()
  if (word in word_set) {
    word_set.word.push(line_count)
  } else {
    word_set [word] = [line_count]
    
  }
}

function parseInputToFiles (input: string): void {
  let prev_sentence: string = ''
  let prev_word: string = ''
  let sentence_count: number = 0
  

  for (let i = 0; i < input.length; i++) {
    const c = input.charAt(i)

    if (/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑçÇ¿¡\-0-9]+$/.test(c)) {
      prev_word += c
    }
    else if (c === ' ') { // End of word - collect last word and add to line.
      if (prev_word === '') continue
      processWord(prev_word, sentence_count)
      prev_sentence += `${prev_word} `
      prev_word = ''
    }
    else if (c === '.' || c === '?' || c === '!') { // End of sentence - collect last word and sentence.
      processWord(prev_word, sentence_count)
      sentence_list[sentence_count] = `${prev_sentence}${prev_word}${c}`
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
  } else {
    // Convert the array of objects to JSON string
    const jsonString = JSON.stringify(total_data, null, 2)
    fs.writeFileSync('./results/word_set.json', jsonString)
  }
}// writeBlobToFile()

function restoreany (): void {
  // Read the JSON file
  const jsonString = fs.readFileSync('./results/word_set.json', 'utf-8')
  total_data = JSON.parse(jsonString)
}

/// Given a full total_data, let's try select a word.
function lineSelector(user_input: string): void {
    if(!total_data.word_set[user_input]) {
      console.log("Could Not find word...");
  }
  else {
      total_data.word_set[user_input]
	  .forEach((line_n: number) => 
	      console.log(total_data[sentence_list[line_n]]))
  }
}

async function questionCLI() {
  return new Promise<void>((res) => {
    rl.question('What word shall we search? ', (input: string) => {
    lineSelector(input);
    res()
  });
})}

async function run() {
  while(true) {
    await questionCLI()
    console.log()
  }
}

run()
