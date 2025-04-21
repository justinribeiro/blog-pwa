---
title: "Supporting Self Hosted Bookmarking with Linkhut with my New Chrome Extension"
description: "I love browsing the web and a love a good self hosted bookmarking service; I just needed a browser extension to close the loop."
date: 2025-04-21T12:22:48-07:00
tags:
 - web
 - oss
 - browser-extension
---

I still browse the web. I readily admit that such a statement will seem foreign to many; social media offers a draconian set of walls that few venture out from. Yet, I cannot help but wander down the lanes and alleyways that lead to discoveries of creativity that I would other miss. Friends send links in Signal or email; blogs posts and RSS feeds offer new rabbit holes to follow; the subcultures and communities I inhabit post links on Mastodon and on old-school forums.

Links are still out there, waiting to be read, heard, seen.

Alas, having such a wide caldron of links leads to it's own issues in sharing and management. In the past, [Delicious](https://en.wikipedia.org/wiki/Delicious_(website)) was the social bookmarking site of record and frankly I miss that site some days. I was a paying subscriber to [Pinboard](https://pinboard.in) for some time, but drifted away after issues arose back in 2023. This left a gap in my general browsing-the-web-and-bookmarking-things workflow that I patched together with random text files and browser bookmarks, which never really did what I wanted.

In my quest to self-host as much as I can while creating external mirrors where appropriate via RSS, I needed a social bookmarking application. I toyed with writing one (but I haven't exactly been showered with free time of late), and then I looked at the open-source landscape and was generally disappointed (e.g., I don't want your AI or external dependencies). It was at this point I found [Linkhut](https://linkhut.org) and was instantly intrigued. Off the beaten path ([self-hosted git you say](https://sr.ht/~mlb/linkhut/)), written in a language I am both familiar with but do not write in (cool learning opportunity), and allows me to self-host, Linkhut appeared to be just the fix I was looking for.

However, it didn't have a Chromium browser extension for all my browser needs. Sure, I could use the bookmarklet, but where's the fun in that? So I whipped up a [Linkhut Chrome Extension](https://chromewebstore.google.com/detail/linkhut-add-to-bookmarks/ohbeihamagmbdfjflnmagijmbhnhkope) for your Chrome-based browsers of the world (I've been using [Vivaldi](https://vivaldi.com/) of late for what it's worth). The [source code](https://codeberg.org/justinribeiro/linkhut-chrome-extension) is hosted on my new Codeberg account should you want to make changes or off pull requests (I am diversifying of late from my GitHub hosted open source projects).

> Side Note: if you haven't worked with v3 Manifest when it comes to browser extensions, have to say, not a huge fan.

The extension is a bit of a trick; it's a hands-off tab similar to the bookmarklet so requires no API key management, but does have an option to set your self-hosted target if you're not using the official hosted version at [https://ln.ht](https://ln.ht). I run my self-hosted version as accessible only to my internal network and works a treat.

Will it solve all of my browsing-the-web needs? Right now, yes. I imported all my various old bookmarks (Linkhut supports the old Netscape format, which pretty much every bookmarking system supports) and all my tags and everything just worked.

So now, off to browse the web and have some non-walled in fun.