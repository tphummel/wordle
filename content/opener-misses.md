---
title: Opener Misses
---

Definition: Puzzles where all letters in my opening guess were absent.

{{< om.inline >}}
  {{ $found := slice }}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $missedFirstGuesses := 0 }}

  {{ range $wordles }}
    {{ $wordleDate := .Date }}
    {{ $wordle := . }}
    {{ $firstGuess := index .Params.state.evaluations 0 }}

    {{ $absentLetters := 0}}
    {{ range $char := (seq 0 4) }}
      {{ if (eq "absent" (index $firstGuess $char)) }}
        {{ $absentLetters = add $absentLetters 1 }}
      {{ end }}
    {{ end }}

    {{ if (eq $absentLetters 5) }}
      {{ $missedFirstGuesses = add 1 $missedFirstGuesses }}
      {{ $found = $found | append (slice (dict "date" $wordleDate "puzzle" $wordle)) }}
    {{ end }}

  {{ end }}

  {{ $example := (index $found 0).puzzle }}
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

  <p>Count of puzzles with a missed opening guess: <strong>{{ len $found }}</strong></p>
{{< /om.inline >}}
