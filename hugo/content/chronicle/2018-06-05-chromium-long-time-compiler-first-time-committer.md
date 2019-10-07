---
date: 2018-06-05T08:00:00-08:00
title: "Chromium: long time compiler, first time committer"
description: "All those years building Chrome and WebKit and putting it places, and yet this is my first commit."
imagetwitter: "https://storage.googleapis.com/jdr-public-imgs/blog/20180605-chromium-first-commit-twitter-1024x535.jpg"
imagefb: "https://storage.googleapis.com/jdr-public-imgs/blog/20180605-chromium-first-commit-fb-1200x630.jpg"
imagegplus: "https://storage.googleapis.com/jdr-public-imgs/blog/20180605-chromium-first-commit-gplus-800x360.jpg"
tags:
- Web
---

It's not really a secret that I've put web engines in some not-so-usual places. I've embedded it on devices in the manufacturing world, I've used it in place of terrible frameworks on consumer devices, I've put it into containers of various shapes and sizes to do all kinds of things that don't fit the standard I-want-to-look-at-cat-photos use case.

Yet, I've never pushed anything upwards. Sure, I've reported bugs and I have had not lack of conversation and input on other sorts of things, but when it's come to the coding portion I've not found the time.

Knowing this, it's odd that my first commit is a four line beast to [fix a custom element issue](https://bugs.chromium.org/p/chromium/issues/detail?id=841725) I ran into that had already been reported.

<img src="https://storage.googleapis.com/jdr-public-imgs/blog/20180605-chromium-first-commit-twitter-1024x535.jpg" alt="First commit for Chromium merged.">

To boot, in the process of fixing said bug, I also got to add a Web Platform Test (which is automatic when pushing with the CL).

<img src="https://storage.googleapis.com/jdr-public-imgs/blog/20180605-wpt-test-twitter-1024x535.jpg" alt="Web Platform Test merged FTW">

## Resources

Getting started is a snap. The documentation is amazing and will help guide you through. Three particular pages you'll probably want out of the gate include:

- [Get the Code](https://www.chromium.org/developers/how-tos/get-the-code)
- [depot_tools tutorial](https://commondatastorage.googleapis.com/chrome-infra-docs/flat/depot_tools/docs/html/depot_tools_tutorial.html)
- [Chromium Coding Style](https://chromium.googlesource.com/chromium/src/+/master/styleguide/styleguide.md)

If you're looking for a play by play, do read Monica Dinculescu's [Contributing to Chromium: an illustrated guide](https://meowni.ca/posts/chromium-101/). Monica (who is amazing) wrote the guide a few years ago, but the content is still very relevent and on point.
