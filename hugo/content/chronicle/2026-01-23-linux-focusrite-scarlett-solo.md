---
title: "My Shocking Amazement at the Delightful Linux Support for the Focusrite Scarlett Solo 4th Gen"
description: "Many years have passed since I last tempted the Linux audio gods, but I am very glad I did."
date: 2026-01-23T08:00:00-07:00
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-on-desk-800.jpg"
tags:
 - linux
 - audio
 - hearts
---

I do not swap out audio configurations lightly. This is in part because I do not feel the need to chase trends or fancy hardware; I enjoy my boring stability, my dull toolset, my dated equipment. There is a warm contentment that washes over me when I lay down just the right track, my baritone voice tapping the -12 dB line light as a feather on hardware that you wouldn't pull out of trash bin.

That is until my dated hardware fails. In this case it was my 14 year old mixer, which based on the kurt buzz and smell of crisped capacitors was making clearly having a very bad day. Was it a good mixer? Not really, it was a terribly finicky thing that only I seemed to understand. Did I throw it into the nearest trash bin? Of course not, I'll fix it on a rainy day.

I did however need a working setup to continue using for not just recording but the endless stream of meetings-that-could-be-emails that my life entails. Oddly—and to some surprise given my failsafe mentality—I found that my caldron of spare components and parts lacked anything resembling coherent mixing equipment. Which means I would have to buy something. Which means I would have to buy something specific.

Enter Linux audio.

I do not make it a secret that I run and have run Linux on my desktop for decades, not that any one should care or that it matters. I do not care nor interest myself in the debates of the "year of Linux on the desktop". But for the smoothness I experience with most of my Linux use these days, the one outlier&ast; has always been Linux audio. This comes to no surprise to anyone—it was a seeming unending pain in Linux—but unconsciously it likely drove my reasoning for not swapping my audio setups. If I made it work on Linux, I didn't breathe on it and let it be.

Having not looked into the state of the Linux audio world for the better part of a decade, it came as no surprise that I found a lot of things that simply did not work or had support paths that would require me to fork a lot of code. Yet, to my shocked amazement, a [couple](https://interfacinglinux.com/2024/04/30/focusrite-scarlett-solo-gen-4/) [articles](https://prestburyweb.oliver-wood.co.uk/focusrite-scarlett-usb-audio-on-linux/) noted the stellar support for the [Focusrite Scarlett](https://us.focusrite.com/scarlett) to the extent that it was reasonably plug-and-play via USB no less. Peeking at [Geoffrey D. Bennett's](https://github.com/geoffreybennett) excellent code for firmware updates and and an actual UI for the device and I was feeling optimistic.

With the decision seemingly made, I pulled out my wallet and splurged on something new for once, a [Scarlett 4th Gen Solo](https://us.focusrite.com/products/scarlett-solo). From the moment it came out of the box I knew I was in love with it; small, compact, simple. With great hope, some dreams, and the cautious optimism that I had grown for this endeavor, I plugged the USB-C into my workstation.

Elation—it worked without so much as a shell command.

Never in all my years have I had a audio device with such an easy install in Linux. I plugged in a XLR microphone and a set of headphones, and I was recording. No lag, no fuss.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-on-desk-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-on-desk-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-on-desk-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-on-desk-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-on-desk-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-on-desk-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-on-desk-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-on-desk-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-on-desk-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-on-desk-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-on-desk-800.jpg" alt="The Scarlett 4th Gen Solo sitting on my desk, while Tina thinks 'Do you think horses get songs stuck in their heads?'">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The Scarlett 4th Gen Solo sitting on my desk, while Tina thinks "Do you think horses get songs stuck in their heads?"</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

Really going for broke in this newfound audio landscape, I decided to attempt to run the [GUI](https://github.com/geoffreybennett/alsa-scarlett-gui) and was told that the firmware needed to be updated. Pulled the repo, loaded up the [firmware tool](https://github.com/geoffreybennett/scarlett2) and again, to my amazement, it just worked. I was now off and running changing the routing on the device without issue.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-linux-gui-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-linux-gui-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-linux-gui-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-linux-gui-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-linux-gui-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-linux-gui-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-linux-gui-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-linux-gui-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-linux-gui-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-linux-gui-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20260123-scarlett-solo-linux-gui-800.png" alt="The Scarlett GUI interface running on Linux, I never dreamed I could have such nice things.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The Scarlett GUI interface running on Linux, I never dreamed I could have such nice things.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

While you're probably expecting a kicker, something that I find wrong or a pain about the device, I can report I have no complaint. Not a one. It is a lovely device to use on Linux, even on my hacked up build of a Linux machine. The articles and videos foretold a prophecy of a plug-and-play device, and the prophecy was true.

I just wished I done this sooner.

&ast; Inevitably someone is going to say "what about video drivers". I did what I always did: bought supported hardware even in the old days. As such I never had issues with drivers because I ran Matrox cards—yes, for real they were cool—for years while people fought with other video cards. I still have at least two in my backup parts bin.