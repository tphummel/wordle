---
title: "How Does This Work?"
date: 2022-09-10T08:00:00-08:00
toc: true
---

# Problem Statement

Wordle data at high fidelity isn't stored beyond the current day. Once the calendar turns over to tomorrow, only an aggregated summary is available in the game itself. 

The current day's data has a wealth of detail:

```json
{
  "boardState": [
    "track",
    "spice",
    "<the actual solution - redacted>",
    "",
    "",
    ""
  ],
  "evaluations": [
    [
      "absent",
      "absent",
      "absent",
      "correct",
      "absent"
    ],
    [
      "absent",
      "absent",
      "correct",
      "correct",
      "correct"
    ],
    [
      "correct",
      "correct",
      "correct",
      "correct",
      "correct"
    ],
    null,
    null,
    null
  ],
  "rowIndex": 3,
  "solution": "<the actual solution - redacted>",
  "gameStatus": "WIN",
  "lastPlayedTs": 1657288128419,
  "lastCompletedTs": 1657288128419,
  "restoringFromLocalStorage": null,
  "hardMode": true
}
```

The historical data gives you a basic overview of your play results but no granularity whatsoever:
```json
{
  "currentStreak": 61,
  "maxStreak": 61,
  "guesses": {
    "1": 0,
    "2": 7,
    "3": 22,
    "4": 38,
    "5": 23,
    "6": 6,
    "fail": 0
  },
  "winPercentage": 100,
  "gamesPlayed": 96,
  "gamesWon": 96,
  "averageGuesses": 4
}
```

As you can see, the historical gives you a nice overview of your career totals but not much more than that. With the level of detail in the current day numbers, if preserved, you can do more advanced analysis than what is in the app itself.

# Solution

I originally started with a desktop browser bookmarklet but was inspired by [Katy DeCorah][8]'s [iOS shortcut][9].

1. Complete the puzzle on iOS mobile safari
1. Click share sheet, run Shortcut automation script (shared below)
1. Create new Pull Request on Github after the redirect
1. Select create a new git branch when prompted
1. Label the pull request 'puzzle'
1. Submit Pull Request
1. GitHub Actions runs data integrity checks
1. Mergify evaluates the PR. If all conditions pass, the PR is merged to `main`
1. Upon `main` merge, GitHub auto-triggers a [Hugo][5] build and deploy on [Cloudflare Workers Sites][0]

{{< youtube id="72By-G7AUlI" title="Daily Wordle Data Capture Demo" >}}

## iOS shortcut

```javascript
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
```

# Analysis

It may not be an obvious choice, but the Go/[Hugo][5] templating system and other capabilities make it a place you can do data analysis. 

## Puzzles With No Yellow Tiles
[Report][7] ([Source][3])

```go
{{ $found := slice }}
{{ range . }}
  {{ $wordleDate := .Date }}
  {{ $wordle := . }}

  {{ $presentLetters := 0}}
  {{ range $guess := .Params.state.evaluations }}
    {{ range $e := $guess }}
      {{ if eq "present" $e }}
        {{ $presentLetters = add $presentLetters 1 }}
      {{ end }}
    {{ end }}
  {{ end }}

  {{ if (eq $presentLetters 0) }}
    {{ $found = $found | append (slice (dict "date" $wordleDate "puzzle" $wordle)) }}
  {{ end }}

{{ end }}
{{ return $found }}
```

## Puzzles with an Absent First Guess
[Report][6] ([Source][2])

```go
{{ $missedFirstGuesses := 0 }}
{{ $found := slice }}

{{ range . }}
  {{ $wordleDate := .Date }}
  {{ $wordle := . }}
  {{ $firstGuess := index .Params.state.evaluations 0 }}

  {{ $absentLetters := 0}}
  {{ range $char := (seq 0 4) }}
    {{ if (eq "absent" (index $firstGuess $char)) }}
      {{ $absentLetters = add $absentLetters 1 }}
    {{ end }}
  {{ end }}

  {{ if (eq $absentLetters 5) }}
    {{ $missedFirstGuesses = add 1 $missedFirstGuesses }}
    {{ $found = $found | append (slice (dict "date" $wordleDate "puzzle" $wordle)) }}
  {{ end }}

{{ end }}
{{ return $found }}

```

## Consecutive Puzzles Played
Streak ends if you miss a calendar day. [Source][1]

```go

{{ $wordles := . }}

{{ $thisW := dict }}
{{ $lastW := dict }}
{{ $active := slice }}
{{ $streaks := slice }}

{{ range $i, $wordle := $wordles.ByDate }}
  {{ $thisW = $wordle }}

  {{ if (and $thisW.Date $lastW.Date) }}
    {{ $thisDay := time ($thisW.Date.Format "2006-01-02") }}
    {{ $lastDay := time ($lastW.Date.Format "2006-01-02") }}

    {{ $isConsecDays := eq $thisDay ($lastDay.AddDate 0 0 1) }}
    {{ $isSameDay := eq $thisDay $lastDay }}

    {{ if $isConsecDays }}
      {{ $active = $active | append (slice $thisW) }}
    {{ else if $isSameDay }}
    {{ else }}
      {{ $start := (index (first 1 $active) 0) }}
      {{ $end := (index (last 1 $active) 0) }}
      {{ $streak := dict "length" (len $active) "start" $start "end" $end }}
      {{ $streaks = $streaks | append (slice $streak) }}
      {{ $active = slice }}

      {{ $active = $active | append (slice $thisW )}}
    {{ end }}
  {{ else }}
    {{ $active = $active | append (slice $thisW )}}
  {{ end }}

  {{ $lastW = $thisW }}
{{ end }}

{{ if gt (len $active) 0 }}
  {{ $streak := dict "length" (len $active) "start" (index (first 1 $active) 0) "end" (index (last 1 $active) 0) "note" "Active 🚧" }}
  {{ $streaks = $streaks | append (slice $streak) }}
{{ end }}

{{ return $streaks }}

```

# Conclusion

Get your [Wordle][4] data out today before it is lost. You can get [Hugo][5] to do interesting analysis and it is optimized for publishing and the operational simplicity of a static website. You might quit wordle, but your data website won't quit on you. 

  [0]: https://developers.cloudflare.com/workers/platform/sites
  [1]: https://github.com/tphummel/wordle/blob/d13310bf7fa623912bdc57ff6801e622c09a9527/layouts/partials/streak-days-played.html
  [2]: https://github.com/tphummel/wordle/blob/d0edf380e44c94cbff7e47c970f389f4b4f3ce0b/content/opener-misses.md
  [3]: https://github.com/tphummel/wordle/blob/505e9ee4fdc53ab99fb3ca33e8be133be64c90f4/layouts/partials/no-yellow-tiles.html
  [4]: https://www.nytimes.com/games/wordle/index.html
  [5]: https://gohugo.io/
  [6]: {{< relref "opener-misses" >}}
  [7]: {{< relref "no-yellow-tiles" >}}
  [8]: https://katydecorah.com/
  [9]: https://github.com/katydecorah/wordle-action/tree/main/shortcut