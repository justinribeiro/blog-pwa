---
title: "Fork-to-Local: My Ongoing Quest Away from Cloud Services"
description: "Quietly over the last 18 months, I've forked and changed various projects to continue severing ties with online services."
date: 2026-02-12T09:00:00-07:00
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20260212-in-progress.jpg"
tags:
 - oss
 - fork
 - selfhost
 - permacompute
---

I love open source. I contribute to open source, I maintain open source, I speak at open source conferences, a lot of my research on creativity and innovation is focused on the wonders of open source contributors and maintainers, the list goes on. Which is to say I am not a stranger to the communities and norms and arguments and at times the vitriol that comes with those interactions in these communities. While I do not care for the darker side of the open source world, I find it pails in comparison to the ongoing challenges and ills as forced upon us by the larger, commercial providers of services.

What is old becomes new: self host your own services and tools. Such an approach is not novel; before the rise of software-as-a-service, we just wrote and ran our own things that filled needs like email or chat. Of course, such setups required skilled people to do so, so it wasn't for everyone. Products rose to fill those gaps—I recall the epiphany that was Flickr—and they were faster for people to setup and use. Friction reduced, people flocked to those services.

The resurgence of the self hosting conversation has resulted in a resurgent in-group around such indie efforts. This in-group frustrates me due to their general hostility, hypocrisy, and virtue signaling. Such behavior has been on strong display this week around the "how to move away from Discord" debate, and the superiority complex drives people away from the very self hosting that this in-group wants others embrace.

I do not engage—it is not worth my time.

Instead, I've taken a different approach for my immediate circle and the move away from commercial SaaS. Over the last 18 months I have quietly started forking and modifying large swaths of tools for personal use. A quick check of Github or other source control services and you'll note that there are no such forks there; I've started running an internal version of [Forgejo](https://forgejo.org/) where I maintain my forks. My forks are for me and contain my opinions as evidenced in code and features that are not-so-useful to the upstream project—I'm not looking to maintain them for others.

From a software perspective, some of my choices to fork and run are likely unsurprising:

1. [Pi-hole](https://pi-hole.net/) handles all my adblocking. No, I will not debate blocking traffic; my internet connection, my choice what runs and gets through.
2. [Forgejo](https://forgejo.org) handles all my source code; if you're seeing commits on Github from me, chances are they're being funneled from my internal instance at this point.
3. [Jellyfin](https://jellyfin.org/) for all our movies, TV, and music collection which we've spent countless years ripping off discs.
4. [immach](https://immich.app/) for all the photo managment that comes from various devices, which works quite nicely when with the likes of [darktable](https://www.darktable.org/) when you have the stores setup oh-so-nicely on your NAS.
5. [Mastodon](https://github.com/mastodon/mastodon) for all the Fediverse needs; I had written a [guide back in 2019](/chronicle/2019/09/27/setting-up-mastodon-on-google-cloud-platform/) and even a [web component for sharing](/chronicle/2022/12/30/share-to-mastodon-web-component-v2.0-released/) which I'm running on this very site.

However, I do run some services and tooling that probably fall into the less known side of the self hosted world:

1. [Miniflux](https://miniflux.app/) is an RSS feed reader and is pretty opinionated all itself and I love it.
2. [linkhut](https://linkhut.org/) is also highly opinionated bookmarking service that is tinyyyy, and I love it so much that I actually wrote a [plugin](/chronicle/2025/04/21/supporting-self-hosted-bookmarking-with-linkhut-with-my-new-chrome-extension/) for it for use in Chromium browsers like [Vivaldi](https://vivaldi.com/) or Chrome/Edge.
3. [Kiwix](https://kiwix.org/en/) so that I can mirror information from the likes of Wikipedia and other documentation.
4. Package mirrors and proxies; yeah, I'm forking and holding my own versions for some of the various supply chain items.

The supply chain is actually one reason I've been forking strongly: I've spent an not insignificant amount of time stripping these various services and tools down to the foundations I use and want to maintain in the long run. The fewer dependencies, the less I have to track and keep and eye on. This is not easy or for the faint of heart, nor do I even recommend it. That said, this is my attempt to think about and experiment with ideas in [permacomputing](https://permacomputing.net/). If I had to run the software I want on the old hardware available to me, what I could I run?

All of these services run on two ancient—but absolutely bullet proof—14 year old [Sandy Bridge](https://en.wikipedia.org/wiki/Sandy_Bridge) i5 machines. Why? Because I had collected stacks of them over the years and they just keep working. Nope, they are not the fastest. Nope, they will not last forever. Having an underlying understanding of the needs of the software however allows me to set my waypoint in what I can get my hands on—visit a recycler, stacks of usable parts tossed to the way side—and what I can get away with—how much horsepower do I need against my available power.

This may sound like less ditching corporate services and being terrified of the ongoing downfall of society prepper-style, but we tend to forget that access to information and the use of the internet is not equal for everyone. Maybe you once ran [squid](https://www.squid-cache.org/) to improve your browsing experience before the advent of broadband—I am probably dating myself with that reference. Regardless, the [digital divide](https://www.sciencedirect.com/science/article/abs/pii/S0040162521007903) continues to be something we research; we all experience to different degrees the facets of these divides. I live in a place where [internet is a challenge](/chronicle/2025/05/09/the-internet-connection-puzzle-in-the-california-rural-central-valley/) in California no less. No one is immune.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/VideoObject">
  <video autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/jdr-public-imgs/blog/20260212-grosse-point-blank-in-progress.mp4" type="video/mp4">
  </video>
  <figcaption itemprop="caption description">
    <span>John Cusack as Martin Blanke in the 1997 film Grosse Point Blank responds to the line "Hows your life": In progress.</span>
    <span class="author" itemprop="copyrightHolder">Random GIF Creator from Old Internet Cafe</span>
  </figcaption>
</figure>

Yet, even as I explore and experiment—having a lot of fun along the way—and move away from services, I am not perfect and likely won't ever be in my quest. I've made some mistakes, released buggy versions, had to close down gaps; failure and iteration rule the day and I find new creative means to fix those issues. I haven't been able to move away from all of Google's services, particularly, Workplace or whatever it's called these days. I had moved the family to those accounts long long ago—recall, it was a no-cost service at the start—moving from that setup is easier said then done. Though [recent developments](https://theintercept.com/2026/02/10/google-ice-subpoena-student-journalist/) have me ramping those efforts.

Is my plan perfect? No, it's in progress. I just want to interact and engage with some degree of control over the things I want to run, the things I want the computer to do.






