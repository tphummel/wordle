# Puzzle SQLite artifact

This repository stores puzzle data as markdown files with YAML front matter under `content/w`, and Hugo emits structured exports
into the `public/` directory during a build. The `scripts/build_puzzle_db.py` helper uses the [sqlite-utils](https://github.com/simonw/sqlite-utils)
tooling from Simon Willison's SQLite suite to read the already-rendered artifacts and write them into a SQLite database that can
be attached to CI artifacts.

## What Hugo already outputs

Hugo produces machine-readable files that the loader ingests directly:

- Per-guest JSON results at `public/w/<puzzle-date>/<guest>.json` that include the `results` matrix and `enrichedResults` payloads.
- Raw TSV copies of submitted share text at `public/w/<puzzle-date>/guest-entries.tsv`.

## Schema

The generated database contains two tables derived from those exports:

| Column | Type | Purpose |
| --- | --- | --- |
| `guest_results.puzzle_date` | `TEXT` | Puzzle date derived from the `public/w/<date>` folder name. |
| `guest_results.guest` | `TEXT` | Guest name taken from the JSON filename. |
| `guest_results.results` | `JSON` | `results` array from the per-guest JSON export. |
| `guest_results.enriched_results` | `JSON` | `enrichedResults` array from the per-guest JSON export. |
| `guest_results.source_path` | `TEXT` | Relative path to the originating JSON file for traceability. |
| `guest_entries_raw.puzzle_date` | `TEXT PRIMARY KEY` | Puzzle date matching the TSV source folder. |
| `guest_entries_raw.guest_entries_tsv` | `TEXT` | Raw TSV content from `guest-entries.tsv`. |
| `guest_entries_raw.source_path` | `TEXT` | Relative path to the TSV file that was imported. |

## Artifact packaging

The workflow uploads the SQLite file with the `actions/upload-artifact` step. That action already compresses artifacts before storing them, so an additional tarball (e.g., `tar.gz`) is unnecessary. Keeping the raw `.db` file simplifies local use while still benefiting from GitHub's built-in compression during transfer and storage.

## Implementation language considerations

When building the database locally or in CI, the simplest approach is to pick a single runtime that can parse YAML and talk to SQLite without shelling out to other languages. The main trade-offs are:

- **Python** — Ships with `sqlite3` in the standard library, so only `pyyaml` is required for YAML parsing. The code stays readable, and dependency weight stays low (one third-party package).
- **Ruby** — Bundles YAML parsing via the standard library (`Psych`), so there are no extra packages for that, but it does require the `sqlite3` gem. This is still a concise single-language solution if Ruby is already available in the workflow.
- **Node.js** — Requires installing both a YAML parser (e.g., `yaml`/`js-yaml`) and either a SQLite client library or the `sqlite3` CLI. While perfectly viable, it usually introduces more moving parts than Python or Ruby for this specific task.

If minimizing dependencies is the top priority, **Python** tends to be the lightest option because it pairs a built-in SQLite client with a single YAML dependency. A pure Ruby script is a close alternative when Ruby is first-class in the environment. Favor a single-language script over a mixed pipeline to keep the build logic easy to read and maintain.
