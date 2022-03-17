---
title: Guesses
---

{{< solve.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $found := slice }}
  {{ range $wordles }}
    {{ $wordleDate := .Date }}
    {{ $wordle := . }}
    {{ $evaluations := .Params.state.evaluations }}

    {{ range $g, $guess := .Params.state.boardState }}
      {{ if not (eq $guess "") }}
        {{ $before := "" }}
        {{ $beforeScore := 0 }}
        {{ $after := "" }}
        {{ $afterScore := 0 }}
        {{ $diff := "" }}

        {{ if eq $g 0 }}
          {{ $before = "⬛️⬛️⬛️⬛️⬛️" }}
          {{ $beforeScore = 10 }}
        {{ else }}
          {{ $beforeEval := index $evaluations (sub $g 1) }}
          {{ range $b := $beforeEval }}
            {{- if eq $b "correct" -}}
              {{ $before = printf "%s%s" $before "🟩" }}
              {{ $beforeScore = add 0 $beforeScore }}
            {{- else if eq $b "present" -}}
              {{ $before = printf "%s%s" $before "🟨" }}
              {{ $beforeScore = add 1 $beforeScore }}
            {{- else -}}
              {{ $before = printf "%s%s" $before "⬛️" }}
              {{ $beforeScore = add 2 $beforeScore }}
            {{- end -}}
          {{ end }}
        {{ end }}

        {{ $afterEval := index $evaluations $g }}
        {{ range $a := $afterEval }}
          {{ if eq $a "correct" }}
            {{ $after = printf "%s%s" $after "🟩" }}
            {{ $afterScore = add 0 $afterScore }}
          {{ else if eq $a "present" }}
            {{ $after = printf "%s%s" $after "🟨" }}
            {{ $afterScore = add 1 $afterScore }}
          {{ else }}
            {{ $after = printf "%s%s" $after "⬛️" }}
            {{ $afterScore = add 2 $afterScore }}
          {{ end }}
        {{ end }}

        {{ $guessData := dict "date" $wordleDate "puzzle" $wordle "guessNum" (add $g 1) "word" $guess "beforeEmoji" $before "beforeScore" $beforeScore "afterEmoji" $after "afterScore" $afterScore "scoreDiff" (sub $afterScore $beforeScore) }}

        {{ $found = $found | append (slice $guessData) }}
      {{ end }} <!-- close if for empty guesses -->
    {{ end }} <!-- close range over board state -->
  {{ end }} <!-- close range over puzzles -->

  <p>Guess Count: {{ len $found }}</p>
  <h1>Guesses By Score Diff</h1>
  {{ $byDiff := dict }}
  {{ range $found }}
    {{ $diffKey := printf "%d" .scoreDiff }}
    {{ $newByDiff := dict $diffKey (add 1 ((index $byDiff $diffKey) | default 0)) }}
    {{ $byDiff = merge $byDiff $newByDiff }}
  {{ end }}

  {{ $byDiffSortable := slice }}
  {{ range $diff, $guesses := $byDiff }}
    {{ $byDiffSortable = $byDiffSortable | append (dict "diff" (int $diff) "count" $guesses) }}
  {{ end }}

  <table>
    <tr>
      <th>Score Diff</th>
      <th>Count</th>
    </tr>
  {{ range sort $byDiffSortable "diff" "desc" }}
    <tr>
      <td>{{ printf "%d" .diff }}</td>
      <td>{{ .count }}</td>
    </tr>
  {{ end }}
  </table>

  <h1>Guesses By Score Diff / Turn</h1>
  {{ $byDiffTurn := dict }}
  {{ range $found }}
    {{ $diffKey := printf "%d" .scoreDiff }}
    {{ $turnKey := printf "%d" .guessNum }}

    {{ $prevDiff := (index $byDiffTurn $diffKey ) | default dict }}
    {{ $prevCount := ((index $prevDiff $turnKey) | default 0) }}

    {{ $newCount := add 1 $prevCount }}

    {{ $newByDiffTurn := dict $diffKey (dict $turnKey $newCount) }}
    {{ $byDiffTurn = merge $byDiffTurn $newByDiffTurn }}
  {{ end }}

  {{ $diffs := seq -10 0 }}
  {{ $turns := seq 1 6 }}

  <table>
    <tr>
      <th>Diffs/Turns</th>
      {{ range $turns }}
        <th>{{ printf "%d" . }}</th>
      {{ end }}
    </tr>
    {{ range $i, $diff := $diffs }}
      <tr>
        <th>{{ printf "%d" $diff }}</th>
        {{ range $turn := $turns }}
          <td>{{ index ((index $byDiffTurn (printf "%d" $diff)) | default dict) (printf "%d" $turn) | default 0 }}</td>
        {{ end }}
      </tr>
    {{ end }}
  </table>


  <h1>All Guesses</h1>
  <table>
    <tr>
      <th>Date</th>
      <th>Puzzle</th>
      <th>Turn #</th>
      <th>Word</th>
      <th>Before</th>
      <th>After</th>
      <th>Diff</th>
    </tr>

    {{ range sort $found "date" "desc" }}
      <tr>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ dateFormat "Jan 2, 2006" .date }}</a></td>
        <td><a href="{{ .puzzle.RelPermalink }}">{{ .puzzle.Name }}</td>
        <td>{{ .guessNum }}</td>
        <td>{{ .word }}</td>
        <td>{{ .beforeEmoji }} {{ .beforeScore }}</td>
        <td>{{ .afterEmoji }} {{ .afterScore }}</td>
        <td>{{ printf "%d" .scoreDiff }}</td>
      </tr>

    {{ end }}
  </table>
{{< /solve.inline >}}
