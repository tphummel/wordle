#!/usr/bin/env zx

const epoch = new Date("2021-06-19T00:00:00")
function getDateTime (dateStr) {
  let dt = new Date(dateStr),
    current_date = dt.getDate(),
    current_month = dt.getMonth() + 1,
    current_year = dt.getFullYear(),
    current_hrs = dt.getHours(),
    current_mins = dt.getMinutes(),
    current_secs = dt.getSeconds(),
    current_datetime

  current_date = current_date < 10 ? '0' + current_date : current_date
  current_month = current_month < 10 ? '0' + current_month : current_month
  current_hrs = current_hrs < 10 ? '0' + current_hrs : current_hrs
  current_mins = current_mins < 10 ? '0' + current_mins : current_mins
  current_secs = current_secs < 10 ? '0' + current_secs : current_secs
  current_datetime = current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs
  return current_datetime
}

function getDaysBetween(start, end) {
  const startDate = new Date(start)
  const secondsBetween = new Date(end).setHours(0, 0, 0, 0) - startDate.setHours(0, 0, 0, 0)
  return Math.floor(secondsBetween / 864e5)
}


const defaultDate = getDateTime(new Date()).substring(0,10);
let puzzleDate = await question(`what is today's date? hit enter for ${defaultDate}`)
if (puzzleDate === '') puzzleDate = defaultDate

const defaultPuzzleNo = getDaysBetween(epoch, puzzleDate) + 1
let puzzleNo = await question(`what is today's puzzle number? Hit enter for ${defaultPuzzleNo}`)
if (puzzleNo === '') puzzleNo = defaultPuzzleNo
await question('Open the wordle project directory: cd ~/Code/personal/wordle')
await question("fetch all branches: gfa")
await question(`check out today's branch: gco ${puzzleDate}_${puzzleNo}`)
await question(`move into the puzzle directory: cd content/w/${puzzleDate}/`)
await question(`create empty guest-entries file: touch ./guest-entries.tsv`)
await question("copy today's rows from the google sheet into guest-entries.tsv and save")
await question("run the node script: node ../../../static/tools/score-guests/index.js ./guest-entries.tsv")
await question("git add *.tsv *.json")
await question(`git commit -m "add guest entries for ${puzzleDate}"`)
await question(`ggp`)
await question(`open the pr on website: https://github.com/tphummel/wordle/pulls/`)
await question(`add the 'puzzle' label to the PR`)
await question(`open preview website and note tom's puzzle score: https://${puzzleDate}-${puzzleNo}.wordle-static.pages.dev/`)
await question(`create the leaderboard output from the node script and add tom's score manually. paste in whatsapp`)
await question(`copy the emoji list from the node script output. paste in whatsapp.`)
await question(`from the preview website. paste tom's emoji share with spoilers into whatsapp with name noted`)
await question(`wait for auto merge and publish`)
await question(`say "leaderboard updated" in whatsapp`)



