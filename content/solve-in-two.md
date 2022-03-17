---
title: Puzzles Solved in Two Guesses
---

{{< solve.inline >}}
  {{ $guesses := 2 }}

  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $wins := where $wordles "Params.state.gameStatus" "WIN" }}

  {{ $found := where $wins "Params.state.rowIndex" $guesses }}
  <p>Count of puzzles solved in two guesses: <strong>{{ len $found }}</strong></p>

  {{ with (index $found 0) }}
  <p>Example: <a href="{{ .RelPermalink }}">Wordle {{ .Params.puzzle }} / {{ dateFormat "Jan 2, 2006" .Date }}</a></p>

  <p>{{ partial "emoji-grid" . }}</p>
  {{ end }}

  <table>
    <tr>
      <th>Date</th>
      <th>Puzzle</th>
      <th>Turns</th>
      <th>Score</th>
    </tr>

    {{ range sort $found "Date" "desc" }}
      <tr>
        <td><a href="{{ .RelPermalink }}">{{ dateFormat "Jan 2, 2006" .Date }}</a></td>
        <td><a href="{{ .RelPermalink }}">{{ .Name }}</td>
        <td><a href="{{ .RelPermalink }}">{{ partial "guess-count.html" . }}{{- cond (eq .Params.state.hardMode true) "*" "" -}}</a></td>
        <td><a href="{{ .RelPermalink }}">{{ partial "puzzle-score.html" . }}</a></td>
      </tr>

    {{ end }}
  </table>
{{< /solve.inline >}}
