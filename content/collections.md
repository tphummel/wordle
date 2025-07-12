---
title: Collections
---

{{< solve.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $found := slice }}
  {{ range $wordles }}
    {{ $wordleDate := .Date }}
    {{ $wordle := . }}
    {{ $evaluations := .Params.state.evaluations }}

    {{ if eq "WIN" $wordle.Params.state.gameStatus }}
      {{ $turns := partialCached "guess-count" $wordle $wordle.File.Path }}
      {{ $score := partialCached "puzzle-score" $wordle $wordle.File.Path }}

      {{ $puzzleData := dict "date" $wordleDate "puzzle" $wordle "turns" $turns "score" $score }}

      {{ $found = $found | append (slice $puzzleData) }}
    {{ end }}
  {{ end }}

  <p>Puzzles Won: {{ len $found }}</p>

  <h1>Wins By Score / Turn - Counts</h1>
  {{ $byScoreTurn := dict }}
  {{ range $found }}
    {{ $scoreKey := printf "%d" .score }}
    {{ $turnKey := printf "%d" .turns }}

    {{ $prevScore := (index $byScoreTurn $scoreKey ) | default dict }}
    {{ $prevCount := ((index $prevScore $turnKey) | default 0) }}

    {{ $newCount := add 1 $prevCount }}

    {{ $newByScoreTurn := dict $scoreKey (dict $turnKey $newCount) }}
    {{ $byScoreTurn = merge $byScoreTurn $newByScoreTurn }}
  {{ end }}

  {{ $scores := seq 2 40 }}
  {{ $turns := seq 1 6 }}

  <table>
    <tr>
      <th>Scores/Turns</th>
      {{ range $turns }}
        <th>{{ printf "%d" . }}</th>
      {{ end }}
    </tr>
    {{ range $i, $score := $scores }}
      <tr>
        <th>{{ printf "%d" $score }}</th>
        {{ range $turn := $turns }}
          {{ $count := index ((index $byScoreTurn (printf "%d" $score)) | default dict) (printf "%d" $turn) | default 0 }}
          <td style="color:{{ cond (eq $count 0) "grey" (cond (eq $count 1) "blueviolet" "green") }}">{{ $count }}</td>
        {{ end }}
      </tr>
    {{ end }}
  </table>
{{< /solve.inline >}}
