---
title: Stairstep
---

Definition: Puzzles where each guess adds exactly one contiguous green tile, forming a visual stairstep pattern from left to right or right to left. The puzzle must be solved in either 5 or 6 guesses, with no yellow tiles (only correct or absent evaluations). The first guess is either all absent (AAAAA), one correct on the left (CAAAA), or one correct on the right (AAAAC).

{{< om.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}

  {{ $found := partial "stairstep.html" $wordles }}

  <p>Puzzle Count: <strong>{{ len $found }}</strong></p>
  <p>Pct of Total: <strong>{{ (mul (div (float (len $found)) (len $wordles)) 100)  | lang.FormatNumber 2 }}% ({{ len $found }} / {{ len $wordles }})</strong></p>

  <table>
    <tr>
      <th>Date</th>
      <th>Puzzle</th>
      <th>Score</th>
      <th>Direction</th>
      <th>Grid</th>
    </tr>

    {{ range sort $found "date" "desc" }}
      <tr>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ dateFormat "Jan 2, 2006" .date }}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ index .puzzle.Params.puzzles 0 }}</td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partialCached "puzzle-score.html" .puzzle .puzzle.File.Path }}</a></td>
        <td>{{ .direction }}</td>
        <td>{{ partialCached "emoji-grid" .puzzle .puzzle.File.Path }}</td>
      </tr>

    {{ end }}
  </table>
{{< /om.inline >}}
