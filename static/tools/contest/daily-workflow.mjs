#!/usr/bin/env zx

const date = await question("what is today's date?")
const puzzleNo = await question("what is today's puzzle number?")
await question('Open the wordle project directory: cd /Users/tom/Code/personal/wordle')
await question("fetch all branches: gfa")
await question(`check out today's branch: gco ${date}_${puzzleNo}`)
await question(`cd content/w/${date}/`)
await question(`create empty guest-entries file: touch ./guest-entries.tsv`)
await question("copy today's rows from the google sheet into guest-entries.tsv and save")
await question("run the node script: `node ../../../static/tools/score-guests/index.js ./guest-entries.tsv`")
await question("git add *.tsv *.json")
await question(`git commit "add guest entries for {date}"`)
await question(`ggp`)
await question(`open the pr on website and add the 'puzzle' label`)
await question(`wait for auto merge and publish`)
await question(`create the leaderboard output from the node script and add tom's score manually. paste in whatsapp`)
await question(`copy the emoji list from the node script output. paste in whatsapp.`)
await question(`paste tom's emoji share with spoilers into whatsapp`)
await question(`say "leaderboard updated" in whatsapp`)



