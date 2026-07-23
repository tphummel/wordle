---
title: Double Letter Slot Tour
---

Definition: Puzzles where two letters each appear in all five positions/slots 1-5 across all guesses.

{{< om.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $found := partial "double-letter-guesses.html" $wordles }}
  <p>Pct of Total: <strong>{{ (mul (div (float (len $found)) (len $wordles)) 100)  | lang.FormatNumber 2 }}% ({{ len $found }} / {{ len $wordles }})</strong></p>
  <table>
    <tr>
      <th>Date</th>
      <th>Puzzle</th>
      <th>Score</th>
      <th>Letters</th>
      <th>Grid</th>
    </tr>

    {{ range sort $found "date" "desc" }}
      <tr>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ dateFormat "Jan 2, 2006" .date }}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ index .puzzle.Params.puzzles 0 }}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partialCached "puzzle-score.html" .puzzle .puzzle.File.Path }}</a></td>
        <td>{{ delimit .letters ", " | upper }}</td>
        <td>{{ partialCached "emoji-grid" .puzzle .puzzle.File.Path }}</td>
      </tr>
    {{ end }}
  </table>
{{< /om.inline >}}
