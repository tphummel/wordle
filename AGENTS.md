# Agent Handbook

This repository powers a Hugo site that documents Wordle puzzles. The notes below collect the bits of institutional knowledge future agents usually end up hunting for.

## Project Overview

This is Tom's personal Wordle results tracking website built with Hugo. It processes and analyzes daily Wordle game data, storing results as structured markdown files and generating a static site with analytics and reporting.

## Development Commands

### Hugo Site Management

- `hugo` - Build the static site
- `hugo server` - Start local development server with live reload
- `hugo --templateMetrics` - Build with template performance metrics (used in CI)

### Hugo Version Management

The project uses asdf for tool version management:

- Hugo version is pinned to `0.148.1` in `.tool-versions`
- Run `./.tool-versions-setup.sh` to install the required Hugo version with asdf

### Testing

- `node static/tools/enhance/enrich-emoji.test.js` - Run JavaScript tests for emoji enrichment functionality

## Architecture

### Content Structure

- **`content/w/YYYY-MM-DD/index.md`** - Individual puzzle entries with comprehensive game state, statistics, and metadata
- **`content/*.md`** - Collection pages for different analysis views (openers, anagrams, contests, etc.)
- **`content/a/`** - Article pages explaining site functionality

### Key Directories

- **`layouts/`** - Hugo templates for rendering content
- **`static/tools/`** - Client-side JavaScript tools for data processing
- **`functions/`** - Cloudflare Pages Functions for serverless functionality
- **`public/`** - Generated static site output (not committed)

### Data Model

Each puzzle entry contains:

- **Frontmatter** - Structured YAML with puzzle metadata, tags, taxonomies
- **`state` object** - Complete Wordle game state (board, evaluations, solution, settings)
- **`stats` object** - Player statistics at time of puzzle completion

### Hugo Configuration

- **Taxonomies** - Multiple custom taxonomies for content organization (words, puzzles, openers, contests, etc.)
- **Custom output format** - `p8s` format generates plain text metrics file
- **Git integration** - `enableGitInfo = true` for commit-based metadata

## Deployment & CI

### Cloudflare Pages

- Automatic deployment from `main` branch
- Preview deployments for feature branches
- Mergify auto-merges puzzle PRs when labeled with `puzzle` and CI passes

### GitHub Actions

- **`hugo-build-profile.yml`** - Captures Hugo build metrics on PRs
- **`contest-label.yml`** - Adds helper links when PRs are labeled with `contest`

## Puzzle Data Workflow

### Manual Entry

Puzzle data is manually created as markdown files with structured frontmatter containing the complete game state from Wordle.

### Adding Historical Puzzles

Common workflow for adding old puzzles that haven't been entered yet:

**Input formats accepted:**

- Image of completed Wordle puzzle
- Puzzle date (YYYY-MM-DD format)
- Wordle emoji share text

**Automated workflow:**

1. Parse input to extract puzzle number, date, and game data
2. Create new markdown file at `content/w/YYYY-MM-DD/index.md`
3. Generate structured frontmatter with all required fields
4. Create git branch using naming convention: `add-puzzle/<date>/<number>`
5. Commit the new puzzle file with descriptive message
6. Push branch to remote (user will create PR manually)

**Required frontmatter structure:**

- `title`, `date`, `puzzles`, `words`, `openers`, `middlers`
- `state` object with board state, evaluations, solution, game status
- `stats` object with current player statistics
- Taxonomies: `tags`, `contests`, `hashes`, `openerHashes`, `shifts`

### Validation

Tests validate puzzle data integrity using both web publishing and executable testing with google/zx.

### Contest System

Special workflow for contest puzzles where multiple players submit data for the same puzzle date.

## ZX rule scripts (`content/r/`)

The files in `content/r/` double as Markdown documentation and executable [ZX](https://github.com/google/zx) scripts. They are designed to be **ad-hoc validation checks** that run outside of the standard Hugo build; nothing in the `hugo` pipeline consumes their exit status. When you add new puzzle analytics, prefer putting the heavy logic inside one of these rules so it can be executed on demand without slowing down site generation.

### How execution works

- Each rule file keeps normal Hugo front matter at the top so it can render as a documentation page.
- The bottom of the file contains a JavaScript code block (` ```js ... ``` `). When ZX executes a Markdown file it automatically extracts the fenced JavaScript, so you can write plain Node.js inside that block (see `guess-count.md` for an example) and read the incoming puzzle data from `process.stdin`.
- Rules are intentionally stateless. They should read all input from STDIN and print all findings to STDOUT/STDERR.
- Exit with code `0` for success and `1` (or throw) for failures so callers can gate pipelines on the result.

### Running rules locally

From the project root you can execute any rule by piping puzzle content into `zx`:

```bash
# Test one puzzle file against the "guess-count" rule
cat content/w/198.md | zx content/r/guess-count.md

# Run the rule across the whole archive
find content/w -name "*.md" ! -name "_index.md" -print0 | \
  xargs -0 -I {} sh -c 'cat "{}" | zx content/r/guess-count.md'
```

If you do not have a global `zx` binary, substitute `npx zx` (or use another package runner) after installing the tool. Because these checks are separate from the Hugo build, it is safe to run them piecemeal while iterating on new logic.

### Authoring new rules

- Copy an existing rule as a template to inherit the front matter, usage documentation, and `runTests` harness pattern.
- Keep usage instructions accurate so other contributors know how to invoke the rule.
- Avoid importing large dependencies; ZX scripts run under Node.js, so stick to the standard library or tiny helpers.
- When adding new rules, update any relevant documentation pages if you want them linked from the site’s navigation.
