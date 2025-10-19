---
title: Dive and Saves
---

Definition: Puzzles solved on the sixth (and final) guess that required at least four progress points (out of ten) on the deciding turn.

{{< om.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $found := partialCached "dive-and-saves.html" $wordles }}

  <p>Puzzle Count: <strong>{{ len $found }}</strong></p>
  <p>Pct of Total: <strong>{{ (mul (div (float (len $found)) (len $wordles)) 100)  | lang.FormatNumber 2 }}% ({{ len $found }} / {{ len $wordles }})</strong></p>

  {{ if gt (len $found) 0 }}

    {{ $example := (index (sort $found "date" "desc") 0).puzzle }}
    <p>Recent Example: <a href="{{ $example.RelPermalink }}">Wordle {{ index $example.Params.puzzles 0 }} / {{ dateFormat "Jan 2, 2006" $example.Date }}</a></p>

    <p>{{ partialCached "emoji-grid" $example $example.File.Path }}</p>
  {{ else }}
    <p>No qualifying puzzles yet.</p>
  {{ end }}

  {{ if gt (len $found) 0 }}
    <table>
      <tr>
        <th>Date</th>
        <th>Puzzle</th>
        <th>Score</th>
        <th>Progress Points</th>
        <th>Grid</th>
      </tr>

      {{ range sort $found "date" "desc" }}
        <tr>
          <td><a href="{{ .puzzle.RelPermalink }}">{{ dateFormat "Jan 2, 2006" .date }}</a></td>
          <td><a href="{{ .puzzle.RelPermalink }}">{{ index .puzzle.Params.puzzles 0 }}</td>
          <td><a href="{{ .puzzle.RelPermalink }}">{{ partialCached "puzzle-score.html" .puzzle .puzzle.File.Path }}</a></td>
          <td>{{ .progressPoints }}</td>
          <td>{{ partialCached "emoji-grid" .puzzle .puzzle.File.Path }}</td>
        </tr>
      {{ end }}
    </table>
  {{ end }}
{{< /om.inline >}}
