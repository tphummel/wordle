---
title: Opener Hash Checklist
aliases:
  - /openerhashes/checklist/
---

{{< openerhashes.inline >}}
  {{ $letters := slice "A" "P" "C" }}
  {{ $emojiMap := dict "A" "⬛️" "P" "🟨" "C" "🟩" }}
  {{ $scratch := newScratch }}
  {{ $scratch.Set "total" 0 }}
  {{ $scratch.Set "completed" 0 }}
  {{ $scratch.Set "percent" 0 }}

  {{ range $c5 := $letters }}
    {{ range $c4 := $letters }}
      {{ range $c3 := $letters }}
        {{ range $c2 := $letters }}
          {{ range $c1 := $letters }}
            {{ $hash := printf "%s%s%s%s%s" $c1 $c2 $c3 $c4 $c5 }}
            {{ $term := $.Site.GetPage (printf "/openerhashes/%s" (lower $hash)) }}
            {{ $scratch.Set "total" (add ($scratch.Get "total") 1) }}
            {{ if $term }}
              {{ $scratch.Set "completed" (add ($scratch.Get "completed") 1) }}
            {{ end }}
          {{ end }}
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}

  {{ $total := $scratch.Get "total" }}
  {{ $completed := $scratch.Get "completed" }}
  {{ if gt $total 0 }}
    {{ $scratch.Set "percent" (mul (div (float $completed) (float $total)) 100) }}
  {{ end }}
  {{ $percent := $scratch.Get "percent" }}

  <p><strong>Checklist progress:</strong> {{ $completed }} / {{ $total }} ({{ printf "%.1f" $percent }}%)</p>

  <table>
    <tr>
      <th>Emoji</th>
      <th>Hash</th>
      <th>Count</th>
      <th>First Played</th>
    </tr>
    {{ range $c5 := $letters }}
      {{ range $c4 := $letters }}
        {{ range $c3 := $letters }}
          {{ range $c2 := $letters }}
            {{ range $c1 := $letters }}
              {{ $hash := printf "%s%s%s%s%s" $c1 $c2 $c3 $c4 $c5 }}
              {{ $emoji := printf "%s%s%s%s%s" (index $emojiMap $c1) (index $emojiMap $c2) (index $emojiMap $c3) (index $emojiMap $c4) (index $emojiMap $c5) }}
              {{ $term := $.Site.GetPage (printf "/openerhashes/%s" (lower $hash)) }}
              <tr>
                <td>{{ $emoji }}</td>
                <td>
                  {{ with $term }}
                    <a href="{{ .RelPermalink }}"><code>{{ $hash }}</code></a>
                  {{ else }}
                    <code>{{ $hash }}</code>
                  {{ end }}
                </td>
                <td>
                  {{ with $term }}
                    {{ len .Pages }}
                  {{ else }}
                    --
                  {{ end }}
                </td>
                <td>
                  {{ with $term }}
                    {{ with first 1 (.Pages.ByDate) }}
                      {{ $first := index . 0 }}
                      <a href="{{ $first.RelPermalink }}">{{ $first.Date.Format "Jan 2, 2006" }}</a>
                    {{ else }}
                      --
                    {{ end }}
                  {{ else }}
                    --
                  {{ end }}
                </td>
              </tr>
            {{ end }}
          {{ end }}
        {{ end }}
      {{ end }}
    {{ end }}
  </table>
{{< /openerhashes.inline >}}
