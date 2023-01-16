var epoch = new Date("2021-06-19T00:00:00")
var solutionCount = 2309

function getPuzzleDate (num) {
  var startDate = new Date(epoch)
  var puzzleDate = startDate.setHours(0, 0, 0, 0) + (num * 864e5)
  return (new Date(puzzleDate)).toISOString().substr(0,10)
}

function analyzeEmoji (input) {
  var title = input.match(/Wordle [0-9]* [X1-6]{1}\/6\*?/)
  var titlePieces = title[0].split(' ')
  var puzzleNum = parseInt(titlePieces[1], 10)
  var puzzleDate = getPuzzleDate(puzzleNum)
  var guessPieces = titlePieces[2].split("")
  var [guessCount, slash, allowed, modeStr] = guessPieces

  var results = input
    .replace(/⬜/g, '⬛️')
    .match(/[🟩🟨⬛️]*/g)
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

  var enrichedResults = results.map((lineStatuses) => {
    var lineEmoji = lineStatuses.map((status) => {
      if (status === 'correct') return '🟩'
      if (status === 'present') return '🟨'
      if (status === 'absent') return '⬛️'
    })

    var lineProgress = lineStatuses.reduce((memo, status) => {
      if (status === 'correct') return memo + 2
      if (status === 'present') return memo + 1
      if (status === 'absent') return memo + 0
    }, 0)

    var lineScore = lineStatuses.reduce((memo, status) => {
      if (status === 'correct') return memo + 0
      if (status === 'present') return memo + 1
      if (status === 'absent') return memo + 2
    }, 0)

    return {
      lineStatuses,
      lineEmoji,
      lineProgress,
      lineScore
    }
  })

  var puzzleScore = enrichedResults.reduce((memo, result) => { 
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

module.exports = analyzeEmoji