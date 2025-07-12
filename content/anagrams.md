---
title: Anagrams
---

Definition: Puzzles which contain a non-solving guess with all letters correct or present - they just need to be rearranged.

{{< om.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $found := partial "anagrams.html" $wordles }}
  <p>Pct of Total: <strong>{{ (mul (div (float (len $found)) (len $wordles)) 100)  | lang.FormatNumber 2 }}% ({{ len $found }} / {{ len $wordles }})</strong></p>
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
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partial "guess-count.html" .puzzle }}{{- cond (eq .puzzle.Params.state.hardMode true) "*" "" -}}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ partial "puzzle-score.html" .puzzle }}</a></td>
        <td>{{ partial "emoji-grid" .puzzle }}</td>
      </tr>

    {{ end }}
  </table>
{{< /om.inline >}}
