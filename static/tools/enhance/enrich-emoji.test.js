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
    // console.log(output)

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
    // console.log(output)

    assert.equal(output.puzzleNum, 466)
    assert.equal(output.isHardMode, true)
    assert.equal(output.puzzleScore, 23)
    assert.equal(output.puzzleDate, '2022-09-28')
    assert.equal(output.guessCount, 4)
  },
  function copyFromWhatsApp () {
    const wordle = `
Wordle 449 4/6*

⬛️⬛️⬛️⬛️⬛️
🟩⬛️🟨🟩⬛️
🟩🟨⬛️🟩⬛️
🟩🟩🟩🟩🟩
`
    const output = lib(wordle)
    // console.log(output)

    assert.equal(output.puzzleNum, 449)
    assert.equal(output.isHardMode, true)
    assert.equal(output.puzzleScore, 20)
    assert.equal(output.puzzleDate, '2022-09-11')
    assert.equal(output.guessCount, 4)
  },
  function copyFromSlack () {
    const wordle = `
Wordle 467 4/6*
:black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:
:black_large_square::black_large_square::large_green_square::black_large_square::large_yellow_square:
:large_yellow_square::large_yellow_square::large_green_square::large_yellow_square::black_large_square:
:large_green_square::large_green_square::large_green_square::large_green_square::large_green_square:
`
    const output = lib(wordle)
    console.log(output)

    assert.equal(output.puzzleNum, 467)
    assert.equal(output.isHardMode, true)
    assert.equal(output.puzzleScore, 22)
    assert.equal(output.puzzleDate, '2022-09-29')
    assert.equal(output.guessCount, 4)
  },
]

tests.forEach((t) => t())