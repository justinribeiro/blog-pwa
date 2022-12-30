---
title: "Share to Mastodon Web Component v2.0 Released"
description: "The growing popularity of Mastodon and the rising amount of questions I get about Mastodon-related things means, huzzah, it's time for a web component update."
date: 2022-12-30T12:11:48-08:00
tags:
 - web
 - web-component
---

If you would have told me that Mastodon would become popular, or at least more used, I would have probably shrugged. As a matter of fact I did shrug, many times over the years, and I just went about my business.

Then some stuff happened at the bird site, and I got a lot of questions (and kindness) from folks about [setting up Mastodon](/chronicle/2019/09/27/setting-up-mastodon-on-google-cloud-platform/), and subsequently people started asking about sharing to mastodon from web sites. This is the long winded way of saying, I got you.

With that, I've released version 2 of my [share-to-mastodon web component](https://github.com/justinribeiro/share-to-mastodon). I've used version 1 of said component for a number of years on this very site, but I'm the first to say, it wasn't exactly the most robust setup. Version 2 however takes the sharp edges off and offers some nice things:

1. Now uses `dialog` to reduce the weight and offer better accessibility.
2. Now has 100% test coverage so that it doesn't break in weird cases.
3. You can now load it via CDN's like JS Deliver ESM.Run, so it's more drop-in ready like [my other components](https://github.com/justinribeiro/lite-youtube).
4. Still ultra-customizable for your particular localization and/or color related needs.
5. No tracking, all local. It's not one of those janky privacy-hazard share buttons.

To explain the in-and-outs, see the [related video](https://www.youtube.com/watch?v=NMVbawJP0gA) below or the [documentation](https://www.npmjs.com/package/@justinribeiro/share-to-mastodon). Hopefully, this will be of use or inspire you to start adding sharing options for Mastodon users in your own way. As always, happy coding and I'll see you out there on the webs.

{{< liteyoutube videoid="NMVbawJP0gA" >}}