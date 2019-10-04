---
title: "stl-part-viewer web component updated to v1.0"
date: 2019-04-17T21:47:30-07:00
description: "stl-part-viewer moves to version 1.0 with an update to three.js and LitElement."
tags:
- IoT
- Web
---

Ever since [lit-html](https://lit-html.polymer-project.org/) hit 1.0, I've been meaning to get around to updating `<stl-part-viewer>`. Well, that day finally came after I needed to use it for a couple of projects this week.

With version 1.0 ([available on npm](https://www.npmjs.com/package/@justinribeiro/stl-part-viewer)), only a few changes:

1. LitElement base class updated to 2.1.0
2. Three.js updated to r103

To use, grab with npm or yarn.

{{< codeblock lang="bash" >}}
npm i @justinribeiro/stl-part-viewer
# or
yarn add @justinribeiro/stl-part-viewer
{{< /codeblock >}}

Now start displaying those parts!