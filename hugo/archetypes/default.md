---
title: "{{ .Name | title | replaceRE "([0-9]*-[0-9]*-[0-9]*|-)" " " | strings.TrimLeft " " }}"
description: ""
date: {{ now.UTC.Format $.Site.Params.ISO8601 }}
featureimage: ''
socialimage: "{{ $.Site.Params.imageCDN }}"
tags:
 -
---