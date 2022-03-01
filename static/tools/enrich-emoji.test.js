const assert = require('assert')
const lib = require('./enrich-emoji')

const wordle = `
Wordle 234 5/6*

🟨⬛⬛⬛⬛
🟨⬛⬛🟨⬛
⬛🟩🟨🟨⬛
⬛🟩🟩⬛🟩
🟩🟩🟩🟩🟩
`

const output = lib(wordle)
console.log(output)

assert.equal(output.puzzleNum, 234)
assert.equal(output.isHardMode, true)
assert.equal(output.guessCount, 5)
