---
title: Outcome is Consistent
date: 2022-02-26T10:30:00.000-08:00
toc: false
---

# Intro

For every puzzle, the outcome is defined in the `gameStatus` field, which is either:

- `WIN`
- `FAIL`

For `WIN` outcomes, the final guess in `state.boardState` should match the `solution` field. For `FAIL` outcomes, the final guess in `state.boardState` should not match the `solution` field.

# Usage

This page is also an executable zx script for testing a puzzle against this rule. Pipe a single puzzle md file into this test on stdin.

```
# test a single file
cat content/w/198.md | zx content/r/outcome.md

# test a single file
find content/w -name "*.md" | grep -v "_index" | head -n1 | xargs -I {} sh -c "cat {} | zx content/r/outcome.md"

# test all files
find content/w -name "*.md" | grep -v "_index" | xargs -I {} sh -c "cat {} | zx content/r/outcome.md"
```

The process will exit 0 on success and exit 1 on failure with info written to stdout

# Code

```js
const assert = require('assert')

process.stdin.setEncoding("ascii");

let _input = ""

process.stdin.on("data", function (input) {
  _input += input
});

process.stdin.on("end", function () {
   runTests(_input)
});

function runTests (yaml) {
  const firstDoc = YAML.parseAllDocuments(yaml)[0]
  const title = firstDoc.contents.items.find(item => item.key.value === 'title').value

  const state = firstDoc.contents.items.find(item => item.key.value === 'state')
  const boardState = state.value.items.find(item => item.key.value === 'boardState')

  const solution = state.value.items.find(item => item.key.value === 'solution').value.value
  const gameStatus = state.value.items.find(item => item.key.value === 'gameStatus').value.value

  const guesses = boardState.value.items.filter(i => i.value.length === 5)
  const finalGuess = guesses[guesses.length - 1].value

  debug({
    solution,
    gameStatus,
    finalGuess
  })

  const testFile = __filename.split("/")[__filename.split("/").length-1]

  console.log(`[Test: ${testFile}] Title: ${title}`)

  const validGameStatuses = ['WIN', 'FAIL']

  assert.ok(
    validGameStatuses.includes(gameStatus),
    "gameStatus value must be in allowed values"
  )

  if (gameStatus === 'WIN') {
    assert.equal(
      finalGuess,
      solution,
      "in a WIN, the final guess must match the solution"
    )
  } else if (gameStatus === 'FAIL') {
    assert.notEqual(
      finalGuess,
      solution,
      "in a FAIL, the final guess must NOT match the solution"
    )
  } else {
    assert.fail('there is a puzzle with a gameStatus not in WIN or FAIL')
  }
}

process.stdin.resume();

function debug (msg) {
  if (process.env.DEBUG) console.log(msg)  
}
```
