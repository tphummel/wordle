---
title: Single Letter Guesses
---

Definition: Puzzles containing a guess made up of the same letter in all five positions.

{{< om.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $found := partial "single-letter-guesses.html" $wordles }}
  <p>Pct of Total: <strong>{{ (mul (div (float (len $found)) (len $wordles)) 100)  | lang.FormatNumber 2 }}% ({{ len $found }} / {{ len $wordles }})</strong></p>
  <table>
    <tr>
      <th>Date</th>
      <th>Puzzle</th>
      <th>Turns</th>
      <th>Score</th>
      <th>Guess</th>
      <th>Puzzle</th>
    </tr>

    {{ range sort $found "date" "desc" }}
      {{ $guesses := slice }}
      {{ range .letters }}
        {{ $guesses = $guesses | append (strings.Repeat . 5) }}
      {{ end }}
      <tr>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ dateFormat "Jan 2, 2006" .date }}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ index .puzzle.Params.puzzles 0 }}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partialCached "guess-count.html" .puzzle .puzzle.File.Path }}{{- cond (eq .puzzle.Params.state.hardMode true) "*" "" -}}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partialCached "puzzle-score.html" .puzzle .puzzle.File.Path }}</a></td>
        <td>{{ delimit $guesses ", " }}</td>
        <td>{{ partialCached "emoji-grid" .puzzle .puzzle.File.Path }}</td>
      </tr>
    {{ end }}
  </table>
{{< /om.inline >}}
