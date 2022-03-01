var stats = JSON.parse(window.localStorage.getItem("nyt-wordle-statistics"));
var state = JSON.parse(window.localStorage.getItem("nyt-wordle-state"));

var completedAt = new Date(state.lastCompletedTs);

var epoch = new Date("2021-06-19T00:00:00");
var solutionCount = 2309;

function getDaysBetween (start, end) {
  var startDate = new Date(start);
  var daysBetween = new Date(end).setHours(0, 0, 0, 0) - startDate.setHours(0, 0, 0, 0);
  return Math.floor(daysBetween / 864e5)
}

function getPuzzleNumber(today) {
  var puzzleNumber = getDaysBetween(epoch, today) % solutionCount
  return puzzleNumber
}
var now = new Date
var puzzleNumber = getPuzzleNumber(now)

var fileText = `---
title: ${puzzleNumber}
date: ${completedAt.toISOString()}
tags: []
words: ${JSON.stringify(state.boardState.filter(w => w !== ''))}
puzzle: ${puzzleNumber}
state: ${JSON.stringify(state, null, 2)}
stats: ${JSON.stringify(stats, null, 2)}
---
`

alert(fileText);
