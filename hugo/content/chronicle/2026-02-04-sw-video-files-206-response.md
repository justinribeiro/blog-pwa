---
title: "Service Worker, Video Files, and the 206 Partial Response"
description: "I made a mistake, but workbox and it's range request plugin to the rescue."
date: 2026-02-04T15:00:00-07:00
tags:
 - oss
 - serverworker
 - web
---

In my [last post](/chronicle/2026/02/03/how-i-insert-my-em-dash-and-other-special-characters-with-rofi-and-i3-hotkey/) I used an autostart silent looping video file to simulate a GIF—the file size saving and the overall processing power are diminished on the viewers device. I've used this effect in previous posts over the years and it's a nice replacement, though not very meme-ready in the classic GIF sense.

However, in my recent quest to clean out cruft of code that have piled up on me, I made a silly mistake in the service worker that prevented re-viewing that loop. You see my service worker cache's things off my tiny CDN and had been doing so in a blanket sort of way; if it came from that domain, I knew it was my stuff so go ahead and dump into my generic cache. This included images and a couple fonts, and the random file type that I link to from time to time.

What I had forgotten was that video or audio files have `range` headers. These are generally good; they tell the server, hey, return only a portion of the whole request so I can get started. If the user changes the spot in the media file, the server than can react without burning the bytes. In practice this results in a `206 Partial Content`, and that's where I broke things.

My CDN rule would catch it but not handle the 206, so it would never return from the service worker and you'd end up in this broken, not-loaded state. The fix is relatively simple in so much that after all these years I continue to use [Workbox](https://developer.chrome.com/docs/workbox) to generate my service worker. Therefore, using the [workbox-range-requests](https://developer.chrome.com/docs/workbox/modules/workbox-range-requests)—or in my case, the generateSW equivalent [rangeRequests](https://developer.chrome.com/docs/workbox/modules/workbox-build#type-RuntimeCaching)—resolves the problem.

Of course, this results in an odd case where I couldn't quite make one urlPattern rule work; things choke in different spots. So instead of fighting it, I wrote [split regex cases](https://github.com/justinribeiro/blog-pwa/blob/5d262238570d68e371fb6553664fddb0839f2c9f/app/workbox-config.cjs#L66-L97) to handle this.

Problem solved. My faded memory around the 206 code slightly improved. Back to regularly scheduled programming.





