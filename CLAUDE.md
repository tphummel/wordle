# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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