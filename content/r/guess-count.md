---
title: Guess Count is Consistent
date: 2022-02-24T12:40:00.000-08:00
toc: false
---

# Intro

For every puzzle, the number of guesses is encoded in three places:

- `state.boardState`. A valid guess is a five character string.
- `state.rowIndex`
- `state.evaluations`

These three numbers should all match.

# Usage

This page is also an executable zx script for testing a puzzle against this rule. Pipe a single puzzle md file into this test on stdin.

```
# test a single file
cat content/w/198.md | zx content/r/guess-count.md

# test a single file
find content/w -name "*.md" | grep -v "_index" | head -n1 | xargs -I {} sh -c "cat {} | zx content/r/guess-count.md"

# test all files
find content/w -name "*.md" | grep -v "_index" | xargs -I {} sh -c "cat {} | zx content/r/guess-count.md"
```

- The process will exit 0 on success with info written to stdout
- The process will exit 1 on failure with info written to stdout

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

function runTests (input) {
  const frontMatter = input.match(/^---\n([\s\S]*?)\n---/)
  const data = frontMatter ? YAML.parse(frontMatter[1]) : {}
  const { title, state = {} } = data
  const { boardState = [], evaluations = [], rowIndex } = state

  const guessesFromBoardState = boardState.filter(g => g && g.length === 5).length
  const guessesFromEvaluations = evaluations.filter(e => Array.isArray(e)).length

  debug({
    guessesFromBoardState,
    guessesFromEvaluations,
    rowIndex,
    test: guessesFromBoardState === rowIndex
  })

  const testFile = __filename.split("/")[__filename.split("/").length-1]

  console.log(`[Test: ${testFile}] Title: ${title}`)

  assert.equal(
    guessesFromBoardState,
    guessesFromEvaluations,
    "guess count from board state should match guess count from evaluations",
  )

  assert.equal(
    guessesFromBoardState,
    rowIndex,
    "guess count from board state should match the ending rowIndex",
  )

  assert.equal(
    guessesFromEvaluations,
    rowIndex,
    "guess count from evaluations should match the ending rowIndex",
  )
}

process.stdin.resume();

function debug (msg) {
  if (process.env.DEBUG) console.log(msg)
}
```
