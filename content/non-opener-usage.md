---
title: Non-Opener Word Usage
---

Words that have been used outside the opener, sorted by non-opener usage.

{{< om.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $data := partial "non-openers.html" $wordles }}
  {{ $words := sort $data.wordCounts "count" "desc" }}

  <p>Distinct Opening Words Used: <strong>{{ $data.counts.openers }}</strong></p>
  <p>Distinct Non-Opener Words Used: <strong>{{ $data.counts.nonOpeners }}</strong></p>
  <p>Total Distinct Words Used: <strong>{{ $data.counts.total }}</strong></p>

  <table>
    <tr>
      <th>Word</th>
      <th>Non-Opener Uses</th>
      <th>1</th>
      <th>2</th>
      <th>3</th>
      <th>4</th>
      <th>5</th>
      <th>6</th>
    </tr>
    {{ range $words }}
      {{ $w := . }}
      <tr>
        <td>{{ $w.word }}</td>
        <td>{{ $w.count }}</td>
        {{ range $slot := seq 1 6 }}
          <td>{{ if index $w.slots (string $slot) }}✅{{ else }}❌{{ end }}</td>
        {{ end }}
      </tr>
    {{ end }}
  </table>
{{< /om.inline >}}
