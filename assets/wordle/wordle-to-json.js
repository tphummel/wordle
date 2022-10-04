const stats = JSON.parse(window.localStorage.getItem('nyt-wordle-statistics'))
const state = JSON.parse(window.localStorage.getItem('nyt-wordle-state'))

const epoch = new Date('2021-06-19T00:00:00')
const solutionCount = 2309

function getDaysBetween (start, end) {
  const startDate = new Date(start)
  const daysBetween = new Date(end).setHours(0, 0, 0, 0) - startDate.setHours(0, 0, 0, 0)
  return Math.floor(daysBetween / 864e5)
}

function getPuzzleNumber (today) {
  const puzzleNumber = getDaysBetween(epoch, today) % solutionCount
  return puzzleNumber
}
const now = new Date()
const puzzleNumber = getPuzzleNumber(now)

window.alert(JSON.stringify({
  puzzle: puzzleNumber,
  now,
  state,
  stats
}, null, 2))
