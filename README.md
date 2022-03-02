# Tom's Wordle Results Website

# What? Why?

- [Wordle](https://www.nytimes.com/games/wordle/index.html) is a very fun and popular game.
- Wordle doesn't currently (as of 2022-02-26) store high fidelity data historically. The share via emoji feature, while very cool, intentionally doesn't capture the actual guesses you made - so as not to spoil today's puzzle for others.
- I want to learn about myself and my play style.
- I am not trying solve or break Wordle. I want to savor the ritual and joy in playing daily.

🚀 https://wordle.tomhummel.com 🛠

# Notable Features

- A bookmarklet that extracts high fidelity game state from Wordle and opens a Pull Request to this repo.
- Automatic deployment to [Cloudflare Pages](https://pages.cloudflare.com/). Preview deployments for branches.
- Data tests to validate puzzle files. A single markdown test file that are both:
  1. published as web page
  1. executable with [google/zx](https://github.com/google/zx)
- Wordle analysis and reporting with [Hugo](https://gohugo.com).
- A "vendored" version of wordle with an integrated Save button - for playing on mobile (where bookmarklets don't work very well)

# Preview

![Static Site](/wordle.tomhummel.com_.png)
