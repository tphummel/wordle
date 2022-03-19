---
title: Move Puzzle to Date as Main Identifier
date: 2022-03-17T09:40:00.000-08:00
toc: false
---

# Intro

This is a one time migration of my puzzle files.

## Goals:

- add the puzzle date in the title
- move `puzzle` param field to `puzzles` taxonomy
- move the file from `/content/w/168.md` to `/content/w/2021-12-04.md`
- add `aliases` param with the original path to redirect to the new one. `/w/168`

## Pseudocode:

- start
  - input: path to file
  - read file at path
  - parse yaml
      - get puzzle number
      - get puzzle date
  - update title
  - delete puzzle
  - write puzzles taxo
  - write aliases
  - write out new file
  - delete old file
- end

# Usage

- The process will exit 0 on success
- The process will exit 1 on failure with failure info written to stdout

# Code

```js
process.env.DEBUG = true

const [migrationFile, inputFile] = argv._

debug(`processing: ${inputFile}`)
const inputContent = await fs.readFile(inputFile, 'utf-8')
const inputYaml = YAML.parseAllDocuments(inputContent)
const puzzle = inputYaml[0].toJSON()

debug(`yaml: ${JSON.stringify(puzzle, null, 2)}`)

const puzzleNumber = puzzle.puzzle
const puzzleDateTime = puzzle.date
const puzzleDate = puzzleDateTime.substr(0,10)

console.log(puzzleNumber, puzzleDateTime, puzzleDate)

// - add the puzzle date in the title
puzzle.title = `${puzzleNumber}: ${puzzleDate}`

// - move `puzzle` param field to `puzzles` taxonomy
delete puzzle.puzzle
puzzle.puzzles = [puzzleNumber]

// - add `aliases` param with the original path to redirect to the new one. `/w/168`
puzzle.aliases = [`/w/${puzzleNumber}/`]

// - move the file from `/content/w/168.md` to `/content/w/2021-12-04.md`
// await $`rm ${inputFile}`

const outputPuzzle = YAML.stringify(puzzle)
inputYaml
const outputYaml =
const outputFile = `content/w/${puzzleDate}.md`
await fs.writeFile(outputFile, YAML.stringify)


function debug (msg) {
  if (process.env.DEBUG) console.log(msg)  
}
```
