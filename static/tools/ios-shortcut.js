const data = JSON.parse(window.localStorage.getItem('nyt-wordle-moogle/ANON'));
const epoch = new Date("2021-06-19T00:00:00");
const solutionCount = 2309;

function getDaysBetween(start, end) {
    let startDate = new Date(start);
    let daysBetween = new Date(end).setHours(0, 0, 0, 0) - startDate.setHours(0, 0, 0, 0);
    return Math.floor(daysBetween / 864e5);
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
return timezone_standard;
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
    return current_datetime;
}

let puzzleDate = getDateTime(data.game.timestamps.lastCompleted).substring(0,10);
let words = data.game.boardState.filter(w => w !== '');
let opener = words[0]
let middlers = []
if (words.length >= 3) {
    const secondWordIndex = 1
    const lastWordIndex = words.length - 1
    middlers = words.slice(secondWordIndex, lastWordIndex)
}

const gameRows = Array.from(document.querySelector("#wordle-app-game > div").firstChild.children)

const evaluations = gameRows.map((row) => {
    const letters = Array.from(row.children).map((letterDiv) => {
        const letter = letterDiv.firstChild;
        return letter.dataset.state;
    } );

    // historically we've treated unused guesses as null instead of ['empty', 'empty', ...]
    // keeping it here for consistency
    if (letters[0] !== 'empty') return letters;
    return null;
} );

let state = {
    boardState: data.game.boardState,
    evaluations,
    rowIndex: data.game.currentRowIndex,
    solution: words[words.length - 1],
    gameStatus: data.game.status,
    lastPlayedTs: data.game.timestamps.lastPlayed, 
    lastCompletedTs: data.game.timestamps.lastCompleted, 
    hardMode: data.settings.hardMode,
    settings: data.settings,
    gameId: data.game.id,
    dayOffset: data.game.dayOffset,
    timestamp: data.timestamp
};

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const extraPositions = 6;
function encodeCaesarCipher(word) {
    return word.split('').map((c, i) => {
        const shiftedIndex = (alphabet.indexOf(c) + (i + extraPositions)) % alphabet.length;
        console.log(c, i, shiftedIndex);
        return alphabet[shiftedIndex];
    }).join('');
}
function decodeCaesarCipher(word) {
    return word.split('').map((c, i) => {
        const unshiftedIndex = (alphabet.length + (alphabet.indexOf(c) - (i + extraPositions))) % alphabet.length;
        console.log(c, i, unshiftedIndex);
        return alphabet[unshiftedIndex];
    }).join('');
}

const puzzleHash = state.evaluations.map((row) => {
    if (row === null) return 'XXXXX';
    return row.map(c => c.substring(0, 1).toUpperCase()).join('');
}).join('');

const activeContests = [
    // `${puzzleDate.slice(0,7)}-relay-mode`
    // `${puzzleDate.slice(0,7)}-ffa`
    // `${puzzleDate.slice(0,7)}-${state.boardState[0]}`
]

const fileText = `---
title: "${data.game.dayOffset}: ${puzzleDate}"
date: ${getDateTime(data.game.timestamps.lastCompleted)+getLocalTimeZone()}
tags: []
git_branch: ${puzzleDate}_${data.game.dayOffset}
contests: ${JSON.stringify(activeContests)}
words: ${JSON.stringify(words)}
openers: ${JSON.stringify([opener])}
middlers: ${JSON.stringify(middlers)}
puzzles: [${data.game.dayOffset}]
hashes: ["${puzzleHash}"]
shifts: ["${encodeCaesarCipher(state.solution)}"]
state: ${JSON.stringify(state, null, 2)}
stats: ${JSON.stringify(data.stats, null, 2)}
---
<!-- more -->
`;

const encodedFileText = encodeURIComponent(fileText);
const filename = `${puzzleDate}/index.md`;
const githubQueryLink = `https://github.com/tphummel/wordle/new/main/content/w?quick_pull=1&commit-choice=quick-pull&message=add+puzzle+${puzzleDate}+${data.game.dayOffset}&target_branch=${puzzleDate}_${data.game.dayOffset}&same_repo=1&guidance_task=&labels=puzzle&value=${encodedFileText}&filename=${filename}`;
// Call completion to finish
completion(githubQueryLink);
