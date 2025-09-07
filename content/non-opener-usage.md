---
title: Non-Opener Word Usage
---

Words that have been used outside the opener, sorted by non-opener usage.

{{< om.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $openers := partial "openers.html" $wordles }}
  {{ $nonOpeners := partial "non-openers.html" $wordles }}
  {{ $words := sort $nonOpeners "count" "desc" }}

  <p>Distinct Non-Opener Words Used: <strong>{{ len $nonOpeners }}</strong></p>
  <p>Total Distinct Words Used: <strong>{{ add (len $openers.wordCounts) (len $nonOpeners) }}</strong></p>

  <table>
    <tr>
      <th>Word</th>
      <th>Non-Opener Uses</th>
      <th>Guesses</th>
    </tr>
    {{ range $words }}
      {{ $w := . }}
      <tr>
        <td>{{ with $.Site.GetPage (printf "/words/%s" $w.word) }}<a href="{{ .RelPermalink }}">{{ $w.word }}</a>{{ else }}{{ $w.word }}{{ end }}</td>
        <td>{{ $w.count }}</td>
        <td>{{ range $slot := seq 1 6 }}{{ if index $w.slots (string $slot) }}✅{{ else }}❌{{ end }}{{ end }}</td>
      </tr>
    {{ end }}
  </table>
{{< /om.inline >}}
