const epoch = new Date('2021-06-19T00:00:00')

function getPuzzleDate (num) {
  const startDate = new Date(epoch)
  const puzzleDate = startDate.setHours(0, 0, 0, 0) + (num * 864e5)
  return (new Date(puzzleDate)).toISOString().substr(0, 10)
}

function decodeEmoji (input) {
  const title = input.match(/Wordle [0-9]* [1-6]{1}\/6\*?/)
  const titlePieces = title[0].split(' ')
  const puzzleNum = parseInt(titlePieces[1], 10)
  const puzzleDate = getPuzzleDate(puzzleNum)
  const guessPieces = titlePieces[2].split('')
  const [guessCount, slash, allowed, modeStr] = guessPieces // eslint-disable-line no-unused-vars

  const results = input.match(/[🟩🟨⬛️]*/g) // eslint-disable-line no-misleading-character-class
    .filter(r => r !== '')
    .map((line) => {
      return [...line]
        .filter(a => /[^\ufe0f]/.test(a))
        .map((char) => {
          if (char === '🟩') {
            return 'correct'
          } else if (char === '🟨') {
            return 'present'
          } else {
            return 'absent'
          }
        })
    })

  const enrichedResults = results.map((lineStatuses) => {
    const lineEmoji = lineStatuses.map((status) => {
      if (status === 'correct') return '🟩'
      if (status === 'present') return '🟨'
      return '⬛️' // absent
    })

    const lineProgress = lineStatuses.reduce((memo, status) => {
      if (status === 'correct') return memo + 2
      if (status === 'present') return memo + 1
      return memo + 0 // absent
    }, 0)

    const lineScore = lineStatuses.reduce((memo, status) => {
      if (status === 'correct') return memo + 0
      if (status === 'present') return memo + 1
      return memo + 2 // absent
    }, 0)

    return {
      lineStatuses,
      lineEmoji,
      lineProgress,
      lineScore
    }
  })

  const puzzleScore = enrichedResults.reduce((memo, result) => {
    return memo + result.lineScore
  }, 0)

  return {
    results,
    enrichedResults,
    puzzleScore,
    puzzleNum,
    puzzleDate,
    guessCount: parseInt(guessCount, 10),
    isHardMode: modeStr === '*'
  }
}

module.exports = { decodeEmoji }
