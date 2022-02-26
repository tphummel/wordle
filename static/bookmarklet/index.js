const stats = JSON.parse(window.localStorage.getItem("nyt-wordle-statistics"));
const state = JSON.parse(window.localStorage.getItem("nyt-wordle-state"));

const completedAt = new Date(state.lastCompletedTs);

const epoch = new Date("2021-06-19T00:00:00");
const solutionCount = 2309;

function getDaysBetween(start, end) {
  let startDate = new Date(start);
  let daysBetween = new Date(end).setHours(0, 0, 0, 0) - startDate.setHours(0, 0, 0, 0);
  return Math.floor(daysBetween / 864e5)
}

function getPuzzleNumber(today) {
  let puzzleNumber = getDaysBetween(epoch, today) % solutionCount
  return puzzleNumber
}

let puzzleNumber = getPuzzleNumber(new Date)

const fileText = `---
title: ${puzzleNumber}
date: ${completedAt.toISOString()}
tags: []
words: ${JSON.stringify(state.boardState.filter(w => w !== ''))}
puzzle: ${puzzleNumber}
state: ${JSON.stringify(state, null, 2)}
stats: ${JSON.stringify(stats, null, 2)}
---

<!-- more -->
`;

const encodedFileText = encodeURIComponent(fileText);
const filename = `${puzzleNumber}.md`;
const githubQueryLink = "https://github.com/tphummel/wordle-static/new/main/content/w/new?quick_pull=1&labels=puzzle&value=" + encodedFileText +"&filename=" + filename;

window.open(githubQueryLink);
