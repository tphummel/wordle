var epoch = new Date("2021-06-19T00:00:00");
var solutionCount = 2309;

function getPuzzleDate (num) {
  var startDate = new Date(epoch);
  var puzzleDate = startDate.setHours(0, 0, 0, 0) + (num * 864e5);
  return (new Date(puzzleDate)).toISOString().substr(0,10);
}

function analyzeEmoji (input) {
  var title = input.match(/Wordle [0-9]* [1-6]{1}\/6\*?/)
  var titlePieces = title[0].split(' ')
  var puzzleNum = parseInt(titlePieces[1],10)
  var puzzleDate = getPuzzleDate(puzzleNum)
  var guessPieces = titlePieces[2].split("")
  var [guessCount, slash, allowed, modeStr] = guessPieces

  var results = input.match(/[🟩🟨⬛️]*/g).filter(l => l !== '').map((l) => {
    return [...l].map((c) => {
      if (c === '🟩') {
        return 'correct'
      } else if (c === '🟨') {
        return 'present'
      } else {
        return 'absent'
      }
    })
  })

  var puzzleScore = results.reduce((memo, line) => {
    line.forEach((status) => {
      if (status === 'absent') memo += 2
      if (status === 'present') memo += 1
    })
    return memo
  }, 0)

  return {
    results,
    puzzleScore,
    puzzleNum,
    puzzleDate,
    guessCount: parseInt(guessCount, 10),
    isHardMode: modeStr === '*'
  }
}

module.exports = analyzeEmoji
