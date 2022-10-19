const tap = require('tap')
const { decodeEmoji } = require('./index')

tap.test('decodeEmoji() can parse a dark-theme official share from NYTimes', t => {
  const input = `
Wordle 234 5/6*

🟨⬛⬛⬛⬛
🟨⬛⬛🟨⬛
⬛🟩🟨🟨⬛
⬛🟩🟩⬛🟩
🟩🟩🟩🟩🟩
`
  const output = decodeEmoji(input)
  // console.log(output)

  t.equal(output.puzzleNum, 234)
  t.equal(output.puzzleScore, 27)
  t.equal(output.puzzleDate, '2022-02-08')
  t.equal(output.isHardMode, true)
  t.equal(output.guessCount, 5)
  t.end()
})

tap.test('decodeEmoji() can parse a standard share from wordle.tomhummel.com', t => {
  const input = `
Wordle 466 4/6*

⬛️⬛️⬛️⬛️⬛️
🟨⬛️⬛️⬛️🟩
⬛️🟨⬛️🟨🟩
🟩🟩🟩🟩🟩
`
  const output = decodeEmoji(input)
  // console.log(output)

  t.equal(output.puzzleNum, 466)
  t.equal(output.isHardMode, true)
  t.equal(output.puzzleScore, 23)
  t.equal(output.puzzleDate, '2022-09-28')
  t.equal(output.guessCount, 4)
  t.end()
})
