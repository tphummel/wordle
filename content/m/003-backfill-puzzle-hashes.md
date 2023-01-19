---
title: Backfill Puzzle Hashes
date: 2022-11-27T14:09:00.000-08:00
toc: false
---

# Intro

This is a one time migration of my puzzle files to add puzzle hash taxonomies prior to 2022-11-25

## Goals:

- compute the puzzle hash and insert it into the puzzle yaml

## Pseudocode:

- start
  - glob all puzzle files
  - for each file
    - read file contents
    - parse yaml
    - check for presence of hashes taxo
    - if absent
      - evaluate evaluations
      - build puzzle hash from evaluations
      - insert line `hashes: ["AACACA..."]` above end of doc `---`
- end 

# Usage

```
# dry run
zx content/m/002-move-puzzles-to-leaf-bundles.md --dry

# wet run
zx content/m/002-move-puzzles-to-leaf-bundles.md
```

- The process will exit 0 on success
- The process will exit 1 on failure with failure info written to stdout

# Code

```js
debug(`argv: ${JSON.stringify(argv, null, 2)}`)
const { dry } = argv
debug(`dry: ${dry}`)

const paths = await globby(['content/w/**/index.md'])
debug(`paths: ${paths.length}`)

paths.forEach(async function addHash (pathName) {
  const puzzle = await fs.readFile(pathName, 'utf8')
  // debug(puzzle)
  const hasHashesTaxo = puzzle.match(/hashes\:\s{1}\[\"[APCX]{30}\"\]/)
  debug(`${JSON.stringify(hasHashesTaxo)}`)
  if (hasHashesTaxo) {
    debug(`${pathName} ${hasHashesTaxo} no action`)
  } else {
    debug(`${pathName} ${hasHashesTaxo} generate hash and insert into file`)
    const docs = YAML.parseAllDocuments(puzzle)
    const frontMatter = docs[0]
    debug(JSON.stringify(frontMatter, null, 2))
    // parse evaluations
    // generate puzzle hash from evaluations
    // awk the new line into the file. https://stackoverflow.com/questions/18272379/bash-inserting-a-line-in-a-file-at-a-specific-location
    // write back the file content
  }
})

function debug (msg) {
  if (process.env.DEBUG) console.log(msg)  
}
```
