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

const crypto = require('crypto');

const defaultDate = getDateTime(new Date()).substring(0,10);
let puzzleDate = await question(`what is today's date? hit enter for ${defaultDate}`)
if (puzzleDate === '') puzzleDate = defaultDate

const defaultPuzzleNo = getDaysBetween(epoch, puzzleDate) + 1
let puzzleNo = await question(`what is today's puzzle number? Hit enter for ${defaultPuzzleNo}`)
if (puzzleNo === '') puzzleNo = defaultPuzzleNo
// await question('Open the wordle project directory: cd ~/Code/personal/wordle')
const tmpdir = `/tmp/${puzzleDate}-${puzzleNo}-${crypto.randomBytes(3).toString('hex')}/`
await $`mkdir -p ${tmpdir}`
cd(tmpdir)
// await question("fetch all branches: gfa")
await $`git clone git@github.com:tphummel/wordle.git`
cd('wordle')
// await question(`check out today's branch: gco ${puzzleDate}_${puzzleNo}`)
const branch = `${puzzleDate}_${puzzleNo}`
await $`git checkout ${branch}`
cd('static/tools/score-guests')
await $`npm ci`
cd('../../..')
// await question(`move into the puzzle directory: cd content/w/${puzzleDate}/`)
cd(`content/w/${puzzleDate}/`)
// await question(`create empty guest-entries file: touch ./guest-entries.tsv`)
await $`touch ./guest-entries.tsv`
// await question("copy today's rows from the google sheet into guest-entries.tsv and save: code ./guest-entries.tsv")
await $`code ./guest-entries.tsv`
await question("copy today's rows from the google sheet into guest-entries.tsv and save. then hit enter")
// await question("run the node script: node ../../../static/tools/score-guests/index.js ./guest-entries.tsv")
await $`node ../../../static/tools/score-guests/index.js ./guest-entries.tsv`
// await question("git add *.tsv *.json")
await $`git add *.tsv *.json`
await $`git config user.name "Tom Hummel"`
await $`git config user.email tohu@hey.com`
// await question(`git commit -m "add guest entries for ${puzzleDate}"`)
await $`git commit -m "add guest entries for ${puzzleDate}"`
// await question(`ggp`)
await $`git push origin ${branch}`
await $`open https://github.com/tphummel/wordle/pulls/`
// await question(`open the pr on website: https://github.com/tphummel/wordle/pulls/`)
await question(`add the 'puzzle' label to the PR`)
await question(`wait for auto merge and publish`)
await question(`say "leaderboard updated" in whatsapp`)



