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

```
# run a single file
zx content/m/001-move-puzzle-to-date.md $(pwd)/content/w/251.md

# test a single file
find content/w -name "*.md" | grep -v "_index" | head -n1 | xargs -I {} sh -c "zx content/m/001-move-puzzle-to-date.md {}"

# test all files
find content/w -name "*.md" | grep -v "_index" | xargs -I {} sh -c "zx content/m/001-move-puzzle-to-date.md {}"
```

- The process will exit 0 on success
- The process will exit 1 on failure with failure info written to stdout

# Code

```js
process.env.DEBUG = true

const [migrationFile, inputFile] = argv._

debug(`processing: ${inputFile}`)
const inputContent = await fs.readFile(inputFile, 'utf-8')
const yamlOptions = {
  version: '1.2'
}
const inputYaml = YAML.parseAllDocuments(inputContent, yamlOptions)
const puzzle = inputYaml[0].toJSON()

// debug(`before: ${JSON.stringify(puzzle, null, 2)}`)
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
const outputPuzzle = new YAML.Document({
  directivesEndMarker: true
})
outputPuzzle.contents = puzzle

inputYaml[0] = outputPuzzle
const outputYaml = inputYaml
const delim = '---\n'
let out = outputYaml.map(doc => {
  doc.directivesEndMarker = true
  return YAML.stringify(doc)
})
out.unshift('')

const outputFile = `content/w/${puzzleDate}.md`

await fs.writeFile(outputFile, out.join(delim))
await $`rm ${inputFile}`

function debug (msg) {
  if (process.env.DEBUG) console.log(msg)  
}
```
