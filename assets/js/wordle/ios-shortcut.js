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

// from: https://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes
function getLocalTimeZone () {
  const timezoneOffsetMin = new Date().getTimezoneOffset()
  let offsetHours = parseInt(Math.abs(timezoneOffsetMin / 60), 10)
  let offsetMin = Math.abs(timezoneOffsetMin % 60)
  let timezoneStandard
  if (offsetHours < 10) { offsetHours = '0' + offsetHours }
  if (offsetMin < 10) { offsetMin = '0' + offsetMin }
  if (timezoneOffsetMin < 0) {
    timezoneStandard = '+' + offsetHours + ':' + offsetMin
  } else if (timezoneOffsetMin > 0) {
    timezoneStandard = '-' + offsetHours + ':' + offsetMin
  } else if (timezoneOffsetMin === 0) {
    timezoneStandard = 'Z'
  }
  return timezoneStandard
}

function getDateTime (dateStr) {
  const dt = new Date(dateStr)
  let currentDate = dt.getDate()
  let currentMonth = dt.getMonth() + 1
  const currentYear = dt.getFullYear()
  let currentHrs = dt.getHours()
  let currentMins = dt.getMinutes()
  let currentSecs = dt.getSeconds()

  currentDate = currentDate < 10 ? '0' + currentDate : currentDate
  currentMonth = currentMonth < 10 ? '0' + currentMonth : currentMonth
  currentHrs = currentHrs < 10 ? '0' + currentHrs : currentHrs
  currentMins = currentMins < 10 ? '0' + currentMins : currentMins
  currentSecs = currentSecs < 10 ? '0' + currentSecs : currentSecs

  const currentDatetime = currentYear + '-' + currentMonth + '-' + currentDate + 'T' + currentHrs + ':' + currentMins + ':' + currentSecs
  return currentDatetime
}

const puzzleNumber = getPuzzleNumber(new Date())
const puzzleDate = getDateTime(state.lastCompletedTs).substring(0, 10)
const fileText = `---
title: "${puzzleNumber}: ${puzzleDate}"
date: ${getDateTime(state.lastCompletedTs) + getLocalTimeZone()}
tags: []
words: ${JSON.stringify(state.boardState.filter(w => w !== ''))}
puzzles: [${puzzleNumber}]
state: ${JSON.stringify(state, null, 2)}
stats: ${JSON.stringify(stats, null, 2)}
---
<!-- more -->
`

const encodedFileText = encodeURIComponent(fileText)
const filename = `${puzzleDate}.md`
const githubQueryLink = 'https://github.com/tphummel/wordle/new/main/content/w/new?quick_pull=1&labels=puzzle&value=' + encodedFileText + '&filename=' + filename
// Call completion to finish - iOS shortcuts specific function
completion(githubQueryLink) // eslint-disable-line no-undef
