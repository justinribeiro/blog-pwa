---
title: "Faster YouTube embeds with lite-youtube web component"
description: "Riffing off of Paul's original concept that built on AMP's concept, I've released vanilla shadow dom web component version of lite-youtube to npm for easy use."
date: 2019-11-18T14:47:41-08:00
tags:
- Web
---

I was puttering around Github at the end of last week and I stumbled upon Paul Irish's [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed). I heart the things that Paul comes up with and in the run around with Chrome Dev Summit and what not last week, I had likely missed it (and as of this writing, it's come a long way since I saw it on Friday in a single html file).

What I really was intrigued about was the numbers: it was fast. Having been embedding YouTube videos in some of my posts recently, I wanted more speed as the YouTube embeds weren't exactly blazing fast in my traces. So I decided I'd go a bit of a different direction than Paul and build a ShadowDOM version of the component (since Paul was going to only build the custom element version, I didn't want to pester him with a shadowDOM argument in his issue tracker).

My encapsulated and responsive version is now available on NPM at [@justinribeiro/lite-youtube](https://www.npmjs.com/package/@justinribeiro/lite-youtube), recently updated to version 0.3.1. Primary features include:

* No dependencies; it's just a vanilla web component.
* It's fast yo.
* It's Shadow Dom encapsulated!
* It's responsive 16:9
* It's accessible via keyboard and will set ARIA via the `videotitle` attribute
* It's locale ready; you can set the `videoplay` to have a properly locale based label

To use, you can install it via npm or yarn:

{{< codeblock lang="bash" >}}
npm i @justinribeiro/lite-youtube
# or
yarn add @justinribeiro/lite-youtube
{{< /codeblock >}}

Or you can just include is directly with JSDelivr:

{{< codeblock lang="markup" >}}
&lt;script type=&quot;module&quot; src=&quot;https://cdn.jsdelivr.net/npm/@justinribeiro/lite-youtube@0.3.1/lite-youtube.js&quot;&gt;
{{< /codeblock >}}

From there, just include it your page with the `videoid` and `videotitle`

{{< codeblock lang="markup" >}}
&lt;lite-youtube&#10;  videoid=&quot;guJLfqTFfIw&quot;&#10;  videotitle=&quot;Sample output of devtools-to-video cli tool&quot;&gt;&#10;&lt;/lite-youtube&gt;
{{< /codeblock >}}

{{< liteyoutube videoid="hvitpOwoETU" videotitle="1930s Grunow radio to Google Assistant" >}}

If you'd like to contribute or find an issue, the [project is available on Github](https://github.com/justinribeiro/lite-youtube) or if you're looking for the non-ShadowDOM version, do check out Paul's [repo](https://github.com/paulirish/lite-youtube-embed) and pending NPM package as well.
