---
title: Numeric Words
words: 
  - acres
  - eight
  - forty
  - least
  - quart
  - stone
  - third
  - triad
---

{{< om.inline >}}
  <ul>
  {{ range $word := .Page.Params.words }}
    {{ $taxo := "words" }}
    {{ with $.Site.GetPage (printf "%s/%s" $taxo $word) }}
      <li><a href="{{ .Permalink }}">{{ .LinkTitle }}</a></li>
    {{ else }}
      <li>{{ $word | title}}</li>
    {{ end }}
  {{ end }}
  </ul>
{{< /om.inline >}}
