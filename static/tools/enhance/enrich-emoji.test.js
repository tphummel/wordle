const assert = require('assert')
const lib = require('./enrich-emoji')

const tests = [
  () => {
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
    assert.equal(output.puzzleScore, 27)
    assert.equal(output.puzzleDate, '2022-02-08')
    assert.equal(output.isHardMode, true)
    assert.equal(output.guessCount, 5)
  },
  () => {
    const wordle = `
Wordle 466 4/6*

⬛️⬛️⬛️⬛️⬛️
🟨⬛️⬛️⬛️🟩
⬛️🟨⬛️🟨🟩
🟩🟩🟩🟩🟩
`
    const output = lib(wordle)
    console.log(output)

    assert.equal(output.puzzleNum, 466)
    assert.equal(output.isHardMode, true)
    assert.equal(output.puzzleScore, 23)
    assert.equal(output.puzzleDate, '2022-09-28')
    assert.equal(output.guessCount, 4)
  },
  () => {
    const output = lib(`
Wordle 1,941 3/6

⬛🟨⬛⬛⬛
🟨🟩⬛⬛⬛
🟩🟩🟩🟩🟩
`)
    assert.equal(output.puzzleNum, 1941)
    assert.equal(output.puzzleDate, '2026-10-12')
    assert.equal(output.guessCount, 3)
  },
  () => {
    // high contrast: orange = correct, blue = present
    const output = lib(`
Wordle 1,941 2/6

🟦⬛⬛⬛⬛
🟧🟧🟧🟧🟧
`)
    assert.deepEqual(output.results[0][0], 'present')
    assert.equal(output.results[1].every(s => s === 'correct'), true)
  },
  () => {
    assert.throws(() => lib('hello'), /title line/)
  }
]

tests.forEach((t) => t())