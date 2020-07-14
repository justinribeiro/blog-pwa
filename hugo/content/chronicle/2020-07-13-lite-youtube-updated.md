---
title: "lite-youtube v0.9 released"
description: "A new feature, a bug fix, and many thanks to all the contributors!"
date: 2020-07-13T12:41:12-08:00
tags:
  - Web
---

My encapsulated and responsive [@justinribeiro/lite-youtube](https://www.npmjs.com/package/@justinribeiro/lite-youtube) web component has been recently updated to version 0.9.0. New Things:

- `params` allows you to use any [YouTube Embedded Players and Player Parameters](https://developers.google.com/youtube/player_parameters) you like
- `videoStartAt` param has been fixed (cheers [@abdonrd](https://twitter.com/abdonrd)!)
- stop the subbuild on install (cheers [@abraham](https://twitter.com/abraham)!)

A big shout to [@abdonrd](https://twitter.com/abdonrd) and [@abraham](https://twitter.com/abraham) for their contributions, and to everyone for their ongoing use and comments. Keep'em coming!

To use, you can install it via npm or yarn:

{{< codeblock lang="bash" >}}
npm i @justinribeiro/lite-youtube

# or

yarn add @justinribeiro/lite-youtube
{{< /codeblock >}}

Or you can just include is directly with JSDelivr:

{{< codeblock lang="markup" >}}
&lt;script type=&quot;module&quot; src=&quot;https://cdn.jsdelivr.net/npm/@justinribeiro/lite-youtube@0.9.0/lite-youtube.js&quot;&gt;
{{< /codeblock >}}

From there, just include it your page with the `videoid` and `videotitle`

{{< codeblock lang="markup" >}}
&lt;lite-youtube&#10; videoid=&quot;guJLfqTFfIw&quot;&#10; videotitle=&quot;Sample output of devtools-to-video cli tool&quot;&gt;&#10;&lt;/lite-youtube&gt;
{{< /codeblock >}}

{{< liteyoutube videoid="MUF6R-tk_vY" videotitle="Web Components, HTML5 Drag and Drop API, and You" >}}

If you'd like to contribute or find an issue, the [project is available on Github](https://github.com/justinribeiro/lite-youtube) or if you're looking for the non-ShadowDOM version, do check out Paul's [repo](https://github.com/paulirish/lite-youtube-embed) and pending NPM package as well.
