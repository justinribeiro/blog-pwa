---
title: "blog-pwa gets a speed bump"
description: "Unhappy with some of the numbers I've been seeing, I set forth to update blog-pwa to bring down the wire weight and increase the web performance."
date: 2020-01-31T12:00:28-08:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-800.png" alt="WebPageTest, running on 3G Fast on a Moto G4, shows solid rendering performance.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">WebPageTest, running on 3G Fast on a Moto G4, shows solid rendering performance.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-800.png"
tags:
- Web
---

A number of changes I made late last year in my [blog-pwa project](https://github.com/justinribeiro/blog-pwa) were meant to sort of smooth the rough edges. Better fonts. Cleaner and better labeled photography. While those updates look slick, as with pretty things, they come at a web performance cost when you're not exactly paying attention.

It's not like it was terrible; the timings were still well under the two second marks on most devices, but I started to see an uptick of beyond two seconds for rendering that just should not have been. Digging deeper, I found I had inadvertently introduced a number of small but annoying roadblocks:

1. Google Fonts were loading at an inopportune time on some devices, resulting in a pause of the main content body painting.
2. The base bundle size was just too heavy for my liking, exceeding 20K in practice to spin up.
3. My service workers had gone MIA on CDN images caching

Again, to the average user, this probably wasn't a problem. As a matter of fact, I guarantee it wasn't a problem (have you _seen_ the weighted down web sites people make lately?).

But it was my problem.

## Step one, cut the weight

I like vaadin-router, I use it in a number of corporate projects. It is a reliable choice and I don't have any problem with it.

Except I don't need it for blog-pwa. It's too much weight for the simple routing that the little PWA shell does, and with the refactor from last year that removed a number of edge case views, it was my choice to slice and dice.

Total savings: 11KB. That's what I like to see.

## Step two, push Google Fonts until later

With `font-display`, I don't worry too much about fonts these days. I don't really have a problem with Google Fonts...but the font sizes are just so large. Looking at a trace, I could see that it blocked up my render regardless, so I push them into the head later after the more important work has been done (and I don't really care if they don't load on slow devices).

## Step three, upgrade and fix workbox's service worker

[Workbox 5.0](https://github.com/GoogleChrome/workbox/releases/tag/v5.0.0) landed a couple of days ago, so I took the time to upgrade. Upgrading is fairly straight forward, but the big shift to local bundling as opposed to CDN might shock some folks, so be aware (see the [changelog](https://github.com/GoogleChrome/workbox/releases/tag/v5.0.0)). I found it pretty quick to update, at which point I quickly patched my CDN cache which was missing the proper opaque responses required.

## The result equals speed

While the changes seem small, they equal a solid second in practice. Running a 9 test look on WebPageTest, we can see really quick rendering performance on 3G on a constrained device:

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20200131-webpagetest-800.png" alt="WebPageTest, running on 3G Fast on a Moto G4, shows solid rendering performance.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">WebPageTest, running on 3G Fast on a Moto G4, shows solid rendering performance.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

If we take a look at lighthouse, we can see the basic numbers also shave about a second off the previous timings:

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200131-lighthouse-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-lighthouse-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-lighthouse-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-lighthouse-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-lighthouse-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200131-lighthouse-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-lighthouse-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-lighthouse-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-lighthouse-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200131-lighthouse-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20200131-lighthouse-800.png" alt="">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">Testing the performance of the changes in Lighthouse.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

## The moral

Just because you're fast, don't mean you can't be faster. Keep an eye on the numbers, work towards more web performance. Your users will thank you.
