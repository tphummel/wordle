---
title: Losses
---

{{< solve.inline >}}

  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $found := where $wordles "Params.state.gameStatus" "FAIL" }}
  <p>Count of Losses: <strong>{{ len $found }}</strong></p>
  <p>Pct of Total: <strong>{{ (mul (div (float (len $found)) (len $wordles)) 100)  | lang.FormatNumber 2 }}% ({{ len $found }} / {{ len $wordles }})</strong></p>
  {{ with (index $found 0) }}
  <p>Example: <a href="{{ .RelPermalink }}">Wordle {{ index .Params.puzzles 0 }} / {{ dateFormat "Jan 2, 2006" .Date }}</a></p>

  <p>{{ partialCached "emoji-grid" . .File.Path }}</p>
  {{ end }}

  <table>
    <tr>
      <th>Date</th>
      <th>Puzzle</th>
      <th>Turns</th>
      <th>Score</th>
      <th>Grid</th>
    </tr>

    {{ range sort $found "Date" "desc" }}
      <tr>
        <td><a href="{{ .RelPermalink }}">{{ dateFormat "Jan 2, 2006" .Date }}</a></td>
        <td><a href="{{ .RelPermalink }}">{{ index .Params.puzzles 0 }}</td>
        <td><a href="{{ .RelPermalink }}">{{ partialCached "guess-count.html" . .File.Path }}{{- cond (eq .Params.state.hardMode true) "*" "" -}}</a></td>
        <td><a href="{{ .RelPermalink }}">{{ partialCached "puzzle-score.html" . .File.Path }}</a></td>
        <td>{{ partialCached "emoji-grid" . .File.Path }}</td>
      </tr>

    {{ end }}
  </table>
{{< /solve.inline >}}
