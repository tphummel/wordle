# wordle results static site

extract game state

```
const stats = JSON.parse(window.localStorage.getItem("nyt-wordle-statistics"))
const state = JSON.parse(window.localStorage.getItem("nyt-wordle-state"))
```
