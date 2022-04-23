---
title: Openers
---

All opening words guessed.

{{< om.inline >}}
  {{ $wordles := where .Site.RegularPages "Section" "w" }}
  {{ $openerWords := partial "openers.html" $wordles }}

  <p>Distinct Opening Words Used: <strong>{{ len $openerWords }}</strong></p>

  <table>
    <tr>
      <th>Opening Guess</th>
      <th>Count</th>
    </tr>

    {{ range sort $openerWords "count" "desc" }}
      <tr>
        <td>{{ .word }}</td>
        <td>{{ .count }}</td>
      </tr>
    {{ end }}
  </table>
{{< /om.inline >}}
