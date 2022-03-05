---
title: Guess Word Lists are Consistent
date: 2022-03-05T09:40:00.000-08:00
toc: false
---

# Intro

For every puzzle, the ordered list of guessed words should match in two places:

- `state.boardState`
- `words`

`words` is a duplicate list created by me to enable the [words taxonomy]({{< relref "/words">}}).

# Usage

This page is also an executable zx script for testing a puzzle against this rule. Pipe a single puzzle md file into this test on stdin.

```
# test a single file
cat content/w/198.md | zx content/r/guess-words.md

# test a single file
find content/w -name "*.md" | grep -v "_index" | head -n1 | xargs -I {} sh -c "cat {} | zx content/r/guess-words.md"

# test all files
find content/w -name "*.md" | grep -v "_index" | xargs -I {} sh -c "cat {} | zx content/r/guess-words.md"
```

- The process will exit 0 on success
- The process will exit 1 on failure with failure info written to stdout

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
  const title = firstDoc.contents.items.find(item => item.key.value === 'title')
  const testFile = __filename.split("/")[__filename.split("/").length-1]
  console.log(`[Test: ${testFile}] Title: ${title.value}`)

  // extract fields to be tested
  const state = firstDoc.contents.items.find(item => item.key.value === 'state')

  const boardState = state.value.items.find(item => item.key.value === 'boardState')

  const guessesFromBoardState = boardState.value.items
    .filter(i => i.value.length === 5)
    .map(i => i.value)

  const guessesFromWords = firstDoc.contents.items
    .find(item => item.key.value === 'words')
    .value.items.map(i => i.value)

  debug({
    guessesFromBoardState,
    guessesFromWords
  })

  assert.equal(
    guessesFromBoardState.length,
    guessesFromWords.length,
    "guess array lengths should match"
  )

  for (let i=0; i < guessesFromBoardState.length; i++) {
    assert.equal(
      guessesFromBoardState[i],
      guessesFromWords[i]
    )
  }

  for (let i=0; i < guessesFromWords.length; i++) {
    assert.equal(
      guessesFromBoardState[i],
      guessesFromWords[i]
    )
  }
}

process.stdin.resume();

function debug (msg) {
  if (process.env.DEBUG) console.log(msg)  
}
```
