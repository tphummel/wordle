# Agent Handbook

This repository powers a Hugo site that documents Wordle puzzles. The notes below collect the bits of institutional knowledge future agents usually end up hunting for.

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
