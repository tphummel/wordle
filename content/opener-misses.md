---
title: Opener Misses
---

Definition: Puzzles where all letters in my opening guess were absent, excluding puzzles where this happened on the first two guesses (see [opener double misses]({{< ref "opener-double-misses" >}})).

{{< om.inline >}}

  {{ $wordles := where .Site.RegularPages "Section" "w" }}

  {{ $found := partial "opener-misses" $wordles }}

  <p>Pct of Total: <strong>{{ (mul (div (float (len $found)) (len $wordles)) 100)  | lang.FormatNumber 2 }}% ({{ len $found }} / {{ len $wordles }})</strong></p>

  {{ $example := (index $found 0).puzzle }}
  <p>Example: <a href="{{ $example.RelPermalink }}">Wordle {{ index $example.Params.puzzles 0 }} / {{ dateFormat "Jan 2, 2006" $example.Date }}</a></p>

  <p>{{ partialCached "emoji-grid" $example $example.File.Path }}</p>

  <table>
    <tr>
      <th>Date</th>
      <th>Puzzle</th>
      <th>Turns</th>
      <th>Score</th>
      <th>Puzzle</th>
    </tr>

    {{ range sort $found "date" "desc" }}
      <tr>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ dateFormat "Jan 2, 2006" .date }}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ index .puzzle.Params.puzzles 0 }}</td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partialCached "guess-count.html" .puzzle .puzzle.File.Path }}{{- cond (eq .puzzle.Params.state.hardMode true) "*" "" -}}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partialCached "puzzle-score.html" .puzzle .puzzle.File.Path }}</a></td>
        <td>{{ partialCached "emoji-grid" .puzzle .puzzle.File.Path }}</td>
      </tr>

    {{ end }}
  </table>

  <p>Count of puzzles with a missed opening guess: <strong>{{ len $found }}</strong></p>
{{< /om.inline >}}
