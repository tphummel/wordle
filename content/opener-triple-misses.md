---
title: Opener Triple Misses
---

Definition: Puzzles where all letters in my first three guesses were absent.

{{< om.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $found := partial "opener-triple-misses" $wordles }}

  <p>Pct of Total: <strong>{{ (mul (div (float (len $found)) (len $wordles)) 100)  | lang.FormatNumber 2 }}% ({{ len $found }} / {{ len $wordles }})</strong></p>

  {{ $example := (index (last 1 $found) 0).puzzle }}
  <p>Example: <a href="{{ $example.RelPermalink }}">Wordle {{ index $example.Params.puzzles 0 }} / {{ dateFormat "Jan 2, 2006" $example.Date }}</a></p>

  <p>{{ partialCached "emoji-grid" $example $example.File.Path }}</p>

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

  <p>Count of puzzles with three consecutive missed opening guesses: <strong>{{ len $found }}</strong></p>
{{< /om.inline >}}
