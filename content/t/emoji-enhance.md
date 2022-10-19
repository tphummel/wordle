---
title: Emoji Enhance
date: 2022-10-03T09:59:00.000-08:00
toc: false
aliases:
- /tools/enhance
---

    <script type="text/javascript">
      var epoch = new Date("2021-06-19T00:00:00")
      var solutionCount = 2309
      var report

      function getPuzzleDate (num) {
        var startDate = new Date(epoch)
        var puzzleDate = startDate.setHours(0, 0, 0, 0) + (num * 864e5)
        return (new Date(puzzleDate)).toISOString().substr(0,10)
      }

      function analyzeEmoji (input) {
        var title = input.match(/Wordle [0-9]* [1-6]{1}\/6\*?/)
        var titlePieces = title[0].split(' ')
        var puzzleNum = parseInt(titlePieces[1], 10)
        var puzzleDate = getPuzzleDate(puzzleNum)
        var guessPieces = titlePieces[2].split("")
        var [guessCount, slash, allowed, modeStr] = guessPieces

        var results = input.match(/[🟩🟨⬛️]*/g)
          .filter(r => r !== '')
          .map((line) => {
            return [...line]
              .filter(a => /[^\ufe0f]/.test(a))
              .map((char) => {
                if (char === '🟩') {
                  return 'correct'
                } else if (char === '🟨') {
                  return 'present'
                } else {
                  return 'absent'
                }
              })
        })

        var enrichedResults = results.map((lineStatuses) => {
          var lineEmoji = lineStatuses.map((status) => {
            if (status === 'correct') return '🟩'
            if (status === 'present') return '🟨'
            if (status === 'absent') return '⬛️'
          })

          var lineProgress = lineStatuses.reduce((memo, status) => {
            if (status === 'correct') return memo + 2
            if (status === 'present') return memo + 1
            if (status === 'absent') return memo + 0
          }, 0)

          var lineScore = lineStatuses.reduce((memo, status) => {
            if (status === 'correct') return memo + 0
            if (status === 'present') return memo + 1
            if (status === 'absent') return memo + 2
          }, 0)

          return {
            lineStatuses,
            lineEmoji,
            lineProgress,
            lineScore
          }
        })

        var puzzleScore = enrichedResults.reduce((memo, result) => { 
          return memo + result.lineScore 
        }, 0)

        return {
          results,
          enrichedResults,
          puzzleScore,
          puzzleNum,
          puzzleDate,
          guessCount: parseInt(guessCount, 10),
          isHardMode: modeStr === '*'
        }
      }

      function enhanceEmojiFormInput() {
        var inputText = document.querySelector('form#enhance textarea#emoji-input').value
        report = analyzeEmoji(inputText)
        var cleanEmoji = report.enrichedResults
          .map((line, i, arr) => {
            var netProgress = i === 0 ? line.lineProgress : line.lineProgress - arr[i-1].lineProgress
            return `${line.lineEmoji.join('')}  ${netProgress === 0 ? '-' : '+' + netProgress * 10 + '%' }`
        }).join('\n')
        var output = `Wordle ${report.puzzleNum} ${report.guessCount}/6${report.isHardMode ? '*' : ''}
Day ${report.puzzleDate}
${cleanEmoji}
Puzzle Score ${report.puzzleScore}
`

        document.querySelector('form#enhance textarea#output').value = output
      }

      function shareClick() {
        navigator.clipboard.writeText(document.querySelector('form#enhance textarea#output').value)
        return false
      }

      function shareJSONClick() {
        navigator.clipboard.writeText(JSON.stringify(report, false, 2))
        return false
      }

      function demoClick() {
        document.querySelector('form#enhance textarea#emoji-input').value = `Wordle 465 5/6*

⬛️🟩⬛️⬛️🟩
⬛️🟩⬛️⬛️🟩
⬛️🟩⬛️⬛️🟩
⬛️🟩🟨⬛️🟩
🟩🟩🟩🟩🟩`
        return false
      }
    </script>
  
    <h1>Wordle Emoji Share Enhancer</h1>
    <p>Paste your emoji share and click Enhance. <a id="demo-link" href="">Demo</a> </p>
    <script>
      document.getElementById("demo-link").onclick = demoClick
    </script>
    <form id="enhance">
      <textarea id="emoji-input" rows="8"></textarea>
      <input type="button" id="enhance" value="Enhance" onclick="enhanceEmojiFormInput();" />
      <textarea id="output" rows="10"></textarea>
      <input type="button" id="copy-link" value="Copy to Clipboard" />
    
      <script>
        document.getElementById("copy-link").onclick = shareClick
      </script>
      <p>Legend</p>
      <p>
        <ul>
          <li>The percentages to the right of each row show progress achieved by that guess toward completion of the puzzle.</li>
          <li>Puzzle Score: a total score for how well you performed on this puzzle. Like golf, lower scores are better. black: 2 pts, yellow: 1 pt, green: 0 pts. The goal is to give you a little more nuance in comparing your results with friends.</li>
        </ul>
      </p>
      <p>Extras</p>
      <p>Most people won't care about this, but once you enhance an emoji you can copy all of the JSON data from the analysis by clicking the button below.</p>
      <p>
        <input type="button" id="copy-json" value="Copy JSON to Clipboard" />
      </p>
      <script>
        document.getElementById("copy-json").onclick = shareJSONClick
      </script>
    </form>
    <div style="opacity:0.5; text-align:center">
      <a href="https://wordle.tomhummel.com">Back to Wordle Site</a>
    </div>
    <div style="opacity:0.5; text-align:center">
      🛠 by <a href="https://tomhummel.com">Tom Hummel</a>
    </div>
    <div style="opacity:0.5; text-align:center">
      💛 No cookies. No third-party javascript. 💚
    </div>
