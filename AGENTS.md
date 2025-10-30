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

## Adding Rarities

Rarities are special pattern achievements that appear on individual puzzle pages as trophies and are tracked in aggregate on the homepage. Examples include "No Yellow Tiles", "Symmetrical", "Stairstep", etc.

### Rarity Architecture

The rarity system consists of three components:

1. **Detection partial** (`layouts/partials/{rarity-name}.html`) - Tests if a single puzzle matches the rarity criteria
2. **List page** (`content/{rarity-name}.md`) - Displays all matching puzzles with statistics
3. **Integration** - Adds the rarity to homepage table and single puzzle trophy display

### Adding a New Rarity: Step-by-Step

**1. Create the detection partial** (`layouts/partials/{rarity-name}.html`)

The partial must:
- Accept a single page (not a collection)
- Return a dict or value on match, `false` on no match
- Use `partialCached` for the guess-count helper if needed

**Preferred approach: Hash-based detection** (fastest, simplest):

```go
{{ $result := false }}

{{ if isset .Params "hashes" }}
  {{ $hash := index .Params.hashes 0 }}

  {{ if eq $hash "PATTERN1" }}
    {{ $result = dict "key" "value" }}
  {{ else if eq $hash "PATTERN2" }}
    {{ $result = dict "key" "value" }}
  {{ end }}
{{ end }}

{{ return $result }}
```

**Alternative: Evaluation-based detection** (for complex patterns):

```go
{{ $result := false }}
{{ $guessCount := partialCached "guess-count" . .File.Path }}

{{ range $guess := .Params.state.evaluations }}
  {{/* Logic to check evaluations */}}
{{ end }}

{{ return $result }}
```

**Hash format:** Each puzzle has a 30-character hash in `.Params.hashes[0]`:
- `C` = correct (green)
- `P` = present (yellow)
- `A` = absent (gray)
- `X` = unused row

6 guesses × 5 letters = 30 characters. Example: `AAAAACAAAACCAAACCCAACCCCCXXXXX`

**2. Create the list page** (`content/{rarity-name}.md`)

```markdown
---
title: Rarity Name
---

Definition: Brief description of the pattern criteria.

{{< om.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}

  {{ $found := slice }}
  {{ range $wordles }}
    {{ $result := partialCached "{rarity-name}.html" . .File.Path }}
    {{ if $result }}
      {{ $found = $found | append (slice (dict "date" .Date "puzzle" .)) }}
    {{ end }}
  {{ end }}

  <p>Puzzle Count: <strong>{{ len $found }}</strong></p>
  <p>Pct of Total: <strong>{{ (mul (div (float (len $found)) (len $wordles)) 100) | lang.FormatNumber 2 }}% ({{ len $found }} / {{ len $wordles }})</strong></p>

  <table>
    <tr>
      <th>Date</th>
      <th>Puzzle</th>
      <th>Score</th>
      <th>Grid</th>
    </tr>

    {{ range sort $found "date" "desc" }}
      <tr>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ dateFormat "Jan 2, 2006" .date }}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ index .puzzle.Params.puzzles 0 }}</td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partialCached "puzzle-score.html" .puzzle .puzzle.File.Path }}</a></td>
        <td>{{ partialCached "emoji-grid" .puzzle .puzzle.File.Path }}</td>
      </tr>
    {{ end }}
  </table>
{{< /om.inline >}}
```

**3. Add to homepage rarities table** (`layouts/index.html`)

Find the `🦄 Rarities` section and add before the closing `</table>`:

```go
{{ with .Site.GetPage "{rarity-name}.md" }}
  {{ $rarityName := slice }}
  {{ range $wordles }}
    {{ if partialCached "{rarity-name}.html" . .File.Path }}
      {{ $rarityName = $rarityName | append . }}
    {{ end }}
  {{ end }}
  <tr>
    <td><a href="{{ .RelPermalink }}">Display Name</a></td>
    <td>
      {{ (mul (div (float (len $rarityName)) (len $wordles)) 100) | lang.FormatNumber 2 }}% (<a href="{{ .RelPermalink }}">{{ len $rarityName }}</a> / {{ len $wordles }})
    </td>
  </tr>
{{ end }}
```

**4. Add trophy to single puzzle page** (`layouts/w/single.html`)

Find the `$achievements` section and add before the `{{ with $achievements }}` block:

```go
{{ with (partialCached "{rarity-name}" . .File.Path) }}
  {{ $achievement := dict "badge" "🏆" "report" "{rarity-name}.md" "title" "Display Name" }}
  {{ $achievements = $achievements | append (slice $achievement) }}
{{ end }}
```

Choose an appropriate emoji badge from existing rarities or select a new one.

### Testing

After implementation:
1. Run `hugo` to build and check for template errors
2. Visit a matching puzzle page to verify the trophy appears
3. Check the homepage to see the rarity count
4. Visit the list page to see all matching puzzles

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
