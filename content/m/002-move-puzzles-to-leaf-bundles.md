---
title: Move Puzzles to leaf bundles
date: 2022-11-27T13:09:00.000-08:00
toc: false
---

# Intro

This is a one time migration of my puzzle files to use the new leaf bundle format, for uniformity. It will also help yet to be completed competitions in August and September. And it will help future migrations work from a single format going forward. 

## Goals:

- move eligible files from /content/w/2022-05-22.md to /content/w/2022-05-22/index.md.
- make this migration idempotent.

## Pseudocode:

- start
  - inputs: none
  - select files to be moved
  - for each file in list: 
    - move /content/w/2022-05-22.md -> /content/w/2022-05-22/index.md
- end 

One quirk of note is 2022-04-03a. I handled this manually outside the script. 

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

const paths = await globby(['content/w/*.md', '!content/w/_index.md'])
debug(`paths: ${paths.length}`)

paths.forEach(async function mvPath (pathName) {
  const puzzleDate = pathName.match(/\d{4}\-\d{2}\-\d{2}/)[0]
  const destDir = `content/w/${puzzleDate}`
  const mkdirpCmd = `mkdir -p ${destDir}`
  const mvCmd = `mv ${pathName} ${destDir}/index.md`
  if (dry) {
    console.log(`dry run, cmds: ${mkdirpCmd} ${mvCmd}`)
  } else {
    await $`mkdir -p ${destDir}`
    await $`mv ${pathName} ${destDir}/index.md`
  }
})

function debug (msg) {
  if (process.env.DEBUG) console.log(msg)  
}
```
