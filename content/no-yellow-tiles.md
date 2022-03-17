---
title: No Yellow Tiles
---

Definition: Puzzles where all letters in all guesses are either absent or correct.

{{< om.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}

  {{ $found := partial "no-yellow-tiles.html" $wordles }}

  <p>Count of puzzles with no yellow tiles: <strong>{{ len $found }}</strong></p>

  {{ $example := (index $found 0).puzzle }}
  <p>Example: <a href="{{ $example.RelPermalink }}">Wordle {{ $example.Params.puzzle }} / {{ dateFormat "Jan 2, 2006" $example.Date }}</a></p>

  <p>{{ partial "emoji-grid" $example }}</p>

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
        <td><a href="{{ .puzzle.RelPermalink }}">{{ .puzzle.Name }}</td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partial "guess-count.html" .puzzle }}{{- cond (eq .puzzle.Params.state.hardMode true) "*" "" -}}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partial "puzzle-score.html" .puzzle }}</a></td>
        <td>{{ partial "emoji-grid" .puzzle }}</td>
      </tr>

    {{ end }}
  </table>
{{< /om.inline >}}
