var epoch = new Date("2021-06-19T00:00:00")
var solutionCount = 2309

function getPuzzleDate(num) {
  var startDate = new Date(epoch)
  var puzzleDate = startDate.setHours(0, 0, 0, 0) + (num * 864e5)
  return (new Date(puzzleDate)).toISOString().substr(0, 10)
}

function analyzeEmoji(input) {
  var title = input.match(/Wordle [0-9]* [1-6]{1}\/6\*?/)
  var titlePieces = title[0].split(' ')
  var puzzleNum = parseInt(titlePieces[1], 10)
  var puzzleDate = getPuzzleDate(puzzleNum)
  var guessPieces = titlePieces[2].split("")
  var [guessCount, slash, allowed, modeStr] = guessPieces

  var nytSharePattern = /[🟩🟨⬛️]*/g
  var slackSharePattern = /(\:(large_green_square|black_large_square|large_yellow_square)\:){5}/g
  var results = []

  if (input.match(nytSharePattern)) {
    results = input.match(nytSharePattern)
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
  }

  if (input.match(slackSharePattern)) {
    var slackTilePattern = /\:(large_green_square|black_large_square|large_yellow_square)\:/g
    results = input.match(slackSharePattern)
      .filter(r => r !== '')
      .map((line) => {
        return line.match(slackTilePattern)
          .map((char) => {
            if (char === ':large_green_square:') {
              return 'correct'
            } else if (char === ':large_yellow_square:') {
              return 'present'
            } else if (char === ':black_large_square:') {
              return 'absent'
            }
          })
      })
  }

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