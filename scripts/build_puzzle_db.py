#!/usr/bin/env python3
"""
Build a SQLite database from the static site outputs using the sqlite-utils
library from Simon Willison's SQLite tools collection.

This loader avoids parsing Hugo front matter directly; instead it consumes the
structured JSON and TSV artifacts that Hugo already writes under `public/w`. The
resulting database is convenient for downstream analysis while staying aligned
with the generated site content.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable, Mapping

import sqlite_utils


def iter_guest_json(public_root: Path) -> Iterable[Mapping[str, object]]:
    """Yield guest result JSON objects from `public/w/<date>/<guest>.json` files."""

    if not public_root.exists():
        return []

    for date_dir in sorted(public_root.iterdir()):
        if not date_dir.is_dir():
            continue

        puzzle_date = date_dir.name
        for json_path in sorted(date_dir.glob("*.json")):
            if json_path.name == "index.json":
                continue

            payload = json.loads(json_path.read_text(encoding="utf-8"))
            guest = json_path.stem
            yield {
                "puzzle_date": puzzle_date,
                "guest": guest,
                "results": payload.get("results"),
                "enriched_results": payload.get("enrichedResults"),
                "source_path": str(json_path),
            }


def iter_guest_tsv(public_root: Path) -> Iterable[Mapping[str, object]]:
    """Yield raw TSV content from `public/w/<date>/guest-entries.tsv` files."""

    if not public_root.exists():
        return []

    for date_dir in sorted(public_root.iterdir()):
        if not date_dir.is_dir():
            continue

        tsv_path = date_dir / "guest-entries.tsv"
        if tsv_path.exists():
            yield {
                "puzzle_date": date_dir.name,
                "guest_entries_tsv": tsv_path.read_text(encoding="utf-8"),
                "source_path": str(tsv_path),
            }


def build_database(public_root: Path, db_path: Path) -> None:
    db = sqlite_utils.Database(db_path)

    guest_json_rows = list(iter_guest_json(public_root))
    if guest_json_rows:
        table = db["guest_results"]
        table.upsert_all(
            guest_json_rows,
            pk=("puzzle_date", "guest"),
            alter=True,
        )
        table.transform(types={"results": "JSON", "enriched_results": "JSON"})

    tsv_rows = list(iter_guest_tsv(public_root))
    if tsv_rows:
        db["guest_entries_raw"].upsert_all(
            tsv_rows,
            pk="puzzle_date",
            alter=True,
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build puzzle SQLite from static outputs.")
    parser.add_argument(
        "--public-root",
        default=Path("public") / "w",
        type=Path,
        help="Root directory containing Hugo-generated per-day folders (default: public/w)",
    )
    parser.add_argument(
        "--db-path",
        default=Path("puzzle-data.db"),
        type=Path,
        help="Path to the SQLite database to write (default: puzzle-data.db)",
    )

    args = parser.parse_args()
    build_database(args.public_root, args.db_path)
