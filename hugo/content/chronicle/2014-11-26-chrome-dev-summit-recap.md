---
categories:
- chrome
- summit
date: 2014-11-26T00:00:00Z
description: Google may not own the web, but they sure are trying to make it better
title: 'Chrome Dev Summit recap: ServiceWorker, Polymer, and TLS'
url: /chronicle/2014/11/26/chrome-dev-summit-recap/
---

This was the second year for Chrome Dev Summit. Last year there was a lot of talk about things that were in the pipe. This year, a lot of those very technologies came to the forefront in a very real way. A few of my favorites:

1. ServiceWorker. I've been cheerleading for ServiceWorker for some time (I probably sound like a broken record). As someone who has built a lot of offline-first corporate web applications that rely on some sly tricks to make work (File and FileSystem API, what would I do without you), ServiceWorker is looking fantastic. With it landing in M40 and Mozilla on track to implement, and IE considering it, things are looking rather bright. There is some way to go on the spec, but things are moving as swiftly as one could hope.

2. Web Components. The topic draws raised eyebrows for a lot of developers about the possible weight characteristics, but I'm not going to lie: I like the concept. The benefits as the APIs land across browsers will greatly reduce the performance overhead of the polyfill, and the improvements across the board in the preview for Polymer 0.8 looks great. Speaking of Polymer, I'm convinced people don't know what it is. Polymer is Google's viewpoint on web components; you don't have to use it if you don't want to. You can still use the power of web components without it.

3. SSL / TLS. Ahhh, the secure web. Hard to do, lots of benefits. I was particularly pleased to see this talk come after ServiceWorker (which requires TLS and drew some groans from people sitting around me when this was mentioned). Your performance excuses are weak general Internet mobs: start securing your sites!

All and all it was another well polished event with a long list of solid speakers. Paul Lewis' talk on eeking out every last bit of performance on the Summit's site was fascinating and Adrienne Porter Felt's talk on the permission model was constructive (the web model is a work in progress, though at-time-of-use asking seems more well conceived than Android or iOS's all-or-nothing upfront).

Going to events where you can sit down and have direct conversations about implementations and approaches with the engineers is always a winner for me. The [https://developer.chrome.com/devsummit/](Chrome Dev Summit) website has all the talk videos online if you're looking to catch up on all the action.

<img src="/images/blog/2014/11/IMG_20141121_100252.jpg" alt="Badged for Chrome Dev Summit.">