const stats = JSON.parse(window.localStorage.getItem("nyt-wordle-statistics"));
const state = JSON.parse(window.localStorage.getItem("nyt-wordle-state"));
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

// from: https://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes
function getLocalTimeZone () {
var timezone_offset_min = new Date().getTimezoneOffset(),
    offset_hrs = parseInt(Math.abs(timezone_offset_min/60), 10),
    offset_min = Math.abs(timezone_offset_min%60),
    timezone_standard;
if(offset_hrs < 10)
    offset_hrs = '0' + offset_hrs;
if(offset_min < 10)
    offset_min = '0' + offset_min;
if(timezone_offset_min < 0)
    timezone_standard = '+' + offset_hrs + ':' + offset_min;
else if(timezone_offset_min > 0)
    timezone_standard = '-' + offset_hrs + ':' + offset_min;
else if(timezone_offset_min == 0)
    timezone_standard = 'Z';
return timezone_standard
}

function getDateTime (dateStr) {
var dt = new Date(dateStr),
    current_date = dt.getDate(),
    current_month = dt.getMonth() + 1,
    current_year = dt.getFullYear(),
    current_hrs = dt.getHours(),
    current_mins = dt.getMinutes(),
    current_secs = dt.getSeconds(),
    current_datetime;

current_date = current_date < 10 ? '0' + current_date : current_date;
current_month = current_month < 10 ? '0' + current_month : current_month;
current_hrs = current_hrs < 10 ? '0' + current_hrs : current_hrs;
current_mins = current_mins < 10 ? '0' + current_mins : current_mins;
current_secs = current_secs < 10 ? '0' + current_secs : current_secs;
current_datetime = current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs;
return current_datetime
}

let puzzleNumber = getPuzzleNumber(new Date)
let puzzleDate = getDateTime(state.lastCompletedTs).substring(0,10)
const fileText = `---
title: "${puzzleNumber}: ${puzzleDate}"
date: ${getDateTime(state.lastCompletedTs)+getLocalTimeZone()}
tags: []
words: ${JSON.stringify(state.boardState.filter(w => w !== ''))}
puzzles: [${puzzleNumber}]
state: ${JSON.stringify(state, null, 2)}
stats: ${JSON.stringify(stats, null, 2)}
---
<!-- more -->
`;

const encodedFileText = encodeURIComponent(fileText);
const filename = `${puzzleDate}.md`;
const githubQueryLink = "https://github.com/tphummel/wordle/new/main/content/w/new?quick_pull=1&labels=puzzle&value=" + encodedFileText +"&filename=" + filename;
// Call completion to finish
completion(githubQueryLink);