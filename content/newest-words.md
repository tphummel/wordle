---
title: Newest Words
---

Words sorted by when they were first used, newest additions first.

{{< nw.inline >}}
  {{ $newestWords := partialCached "newest-words.html" .Site "newest-words" }}

  <p>Total Distinct Words: <strong>{{ len $newestWords }}</strong></p>

  <table>
    <tr>
      <th>Word</th>
      <th>First Used</th>
      <th>Last Used</th>
      <th>Uses</th>
    </tr>
    {{ range $newestWords }}
      {{ $nw := . }}
      <tr>
        <td>{{ with $.Site.GetPage (printf "/words/%s" $nw.word) }}<a href="{{ .RelPermalink }}">{{ $nw.word }}</a>{{ else }}{{ $nw.word }}{{ end }}</td>
        <td><a href="{{ $nw.firstPage.RelPermalink }}">{{ $nw.firstDate.Format "Jan 2, 2006" }}</a></td>
        <td><a href="{{ $nw.lastPage.RelPermalink }}">{{ $nw.lastDate.Format "Jan 2, 2006" }}</a></td>
        <td>{{ $nw.count }}</td>
      </tr>
    {{ end }}
  </table>
{{< /nw.inline >}}
