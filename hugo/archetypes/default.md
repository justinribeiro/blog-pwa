---
title: "{{ .Name | title | replaceRE "([0-9]*-[0-9]*-[0-9]*|-)" " " | strings.TrimLeft " " }}"
description: ""
date: {{ .Date }}
featureimage: ''
socialimage: "{{ $.Site.Params.imageCDN }}"
tags:
 - web
 - business
 - maker
 - photography
 - iot
 - personal
---