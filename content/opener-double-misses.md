---
title: Opener Double Misses
---

Definition: Puzzles where all letters in my first two guesses were absent.

{{< om.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $found := partial "opener-double-misses" $wordles }}

  <p>Pct of Total: <strong>{{ lang.NumFmt 2 (mul (div (float (len $found)) (len $wordles)) 100) }}% ({{ len $found }} / {{ len $wordles }})</strong></p>

  {{ $example := (index (last 1 $found) 0).puzzle }}
  <p>Example: <a href="{{ $example.RelPermalink }}">Wordle {{ index $example.Params.puzzles 0 }} / {{ dateFormat "Jan 2, 2006" $example.Date }}</a></p>

  <p>{{ partial "emoji-grid" $example }}</p>

  <table>
    <tr>
      <th>Date</th>
      <th>Puzzle</th>
      <th>Turns</th>
      <th>Score</th>
    </tr>

    {{ range sort $found "date" "desc" }}
      <tr>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ dateFormat "Jan 2, 2006" .date }}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ index .puzzle.Params.puzzles 0 }}</td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partial "guess-count.html" .puzzle }}{{- cond (eq .puzzle.Params.state.hardMode true) "*" "" -}}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partial "puzzle-score.html" .puzzle }}</a></td>
      </tr>

    {{ end }}
  </table>

  <p>Count of puzzles with two consecutive missed opening guesses: <strong>{{ len $found }}</strong></p>
{{< /om.inline >}}
