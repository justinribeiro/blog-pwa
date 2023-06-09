---
title: "ARM64 M1 Silicon Chromium Build Added to Chrome-Headless Docker Container"
description: "You kids and your fancy Apple silicon and the need to run chrome-headless things on it, rejoice, support!"
date: 2021-12-21T10:47:09-08:00
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20211221-chromium-tag-800.png"
tags:
 - web
 - docker
 - chrome
 - chromium
---

With the helpful—artful one might say—contribution of [Randy Fay](https://twitter.com/randyfay), the ongoing staying power of my chrome-headless docker containers live into the linux/arm64 architecture age with the release of the [chromium](https://hub.docker.com/r/justinribeiro/chrome-headless/tags) tag. This tag lives it's own branch in the [dockerfiles repo](https://github.com/justinribeiro/dockerfiles) very similar to the Chrome release branches tracking that I use in the repo and Docker hub.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211221-chromium-tag-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211221-chromium-tag-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211221-chromium-tag-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211221-chromium-tag-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211221-chromium-tag-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211221-chromium-tag-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211221-chromium-tag-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211221-chromium-tag-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211221-chromium-tag-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211221-chromium-tag-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20211221-chromium-tag-800.png" alt="What is sorta old becomes sorta new again in the M1 age: arm/64 support.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">What is sorta old becomes sorta new again in the M1 age: arm/64 support.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

This isn't without issues. For starters, Debian is all kinds of behind with Chromium in terms of the mainline. This isn't exactly new—Chromium on Debian has always somewhat been a gamble, but the move to six week release cycles and deps problems really put the nail in that coffin—but it seems to have reared it's ugly head more in the last few weeks, culminating in a post of Phoronix about the [overall sad state of browser support on Debian](https://www.phoronix.com/scan.php?page=news_item&px=Web-Browser-Packages-Debian) no less. Yikes.

Even in the build that's pushed to Docker Hub, I had to move from bullseye to buster-slim because of [problems with qemu and libc](https://github.com/moby/qemu/issues/19) which surfaces in [buildx](https://github.com/docker/buildx/issues/314).

So, while this build will work with your fancy M1 Apple silicon, buyer beware: you're way behind on the Chrome features and more importantly security side of things. Use caution and if you run into problems, file bugs on the [repo](https://github.com/justinribeiro/dockerfiles).