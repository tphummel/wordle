const wardleWords = require('./words.json')
const nytWords = require('./nyt-words.json')

console.log(`
wardle words: ${wardleWords.length}
nyt words: ${nytWords.length}
`)

for (let i=0; i< 220; i++) {
  console.log(`${i} ${wardleWords[i]===nytWords[i]} orig: ${wardleWords[i]} nyt: ${nytWords[i]}`)
}
