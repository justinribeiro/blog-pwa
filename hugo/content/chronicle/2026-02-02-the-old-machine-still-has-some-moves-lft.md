---
title: "Upgrading a 10 Year Old Linux Workstation Against the Internets Advice"
description: "You are telling me I can grab a 12 core Xeon for $50? Sign me up."
date: 2026-02-02T15:00:00-07:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-i7-ready-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-i7-ready-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-i7-ready-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-i7-ready-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-i7-ready-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-i7-ready-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-i7-ready-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-i7-ready-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-i7-ready-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-i7-ready-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-i7-ready-800.jpg" alt="My $50 USD, 10 year old Xeon sits next to the 12 year old i7 it replaces.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">My $50 USD, 10 year old Xeon sits next to the 12 year old i7 it replaces.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-i7-ready-800.jpg"
tags:
 - hardware
 - upgrades
 - oldmanandthesea
---

It should come as no surprise that I am a person who will feverishly fix literally anything that is still useful. Old cameras? You bet. Various house related restoration? Hand me the hammer and nails. Do not ask me how many times I have repaired our [2005 Prius](/chronicle/2021/02/01/the-great-prius-combination-meter-repair-or-lets-rip-the-dashboard-apart/); it is a touchy subject in our household. I simply cannot replace good, workable items because society tells me I can purchase a cheap—I use this word with intended malice—replacement that will last longer in a landfill than in my service.

Which leads me to my very aged workstation by software developer terms. How old is this machine you say? I believe I built it 10 years ago; most of the parts manufactured have dates of in the 12-ish years range. Based on the Intel X99 chipset and the LGA 2011-v3 CPU socket, I originally built it less for the CPU and more because of my ever loving need for 128GB RAM, which given the current DRAM shortage*, would be an expensive pipe dream these days.

Which is to say, the calls of "there are better CPUs and GPUs that give better performance" I understand. I can read a benchmark and yes there is no denying that the newest hardware is rocket in flight. Speed however is not enough for me these days; can I keep something running longer, for less money, to do the thing I need it to do? I'm not out to win benchmarks or races, I'm here to do work, to enjoy what I have. Which leads me to, yes, I bought a used 12 core Xeon for $50 off of Ebay.

Do I buy parts off of Ebay? Yes, I do. Enlarger parts, camera parts, tool parts. Do I buy computer parts from Ebay. That would no, this is new territory.

Finding the right balance of risk with bang per buck was really the key. The old Extreme Edition i7's still go for over $200 USD in a lot places, and that was not a worthwhile investment in my opinion. Scanning benchmarks, I settled on the [Intel(R) Xeon(R) CPU E5-2687W v4 @ 3.00GHz](https://www.intel.com/content/www/us/en/products/sku/91750/intel-xeon-processor-e52687w-v4-30m-cache-3-00-ghz/specifications.html), which on paper appeared to be able to breathe a bit of life into my old 6-core machine. No BIOS update required as I had maxed that out way back in 2019 (the last release for this motherboard).

There is that underlying worry of course; I hadn't touched the CPU in 10 years and I also generally follow the if-it-ain't-broke rule I was really rolling the dice against my lived experience. Low and behold however, the CPU swap was uneventful to my great luck as the CPU swap was fast and simple.
<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20260202-x99-lga2011v3-socket-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-x99-lga2011v3-socket-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-x99-lga2011v3-socket-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-x99-lga2011v3-socket-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-x99-lga2011v3-socket-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20260202-x99-lga2011v3-socket-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-x99-lga2011v3-socket-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-x99-lga2011v3-socket-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-x99-lga2011v3-socket-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-x99-lga2011v3-socket-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20260202-x99-lga2011v3-socket-800.jpg" alt="The LGA 2011-v3 socket, free of dust and it's water cooler, awaits the Xeon.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The LGA 2011-v3 socket, free of dust and it's water cooler, awaits the Xeon.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

CPU installed, dust cleaned out, and Linux back up and running, to my amazement the paper speed up held up. Everything is a bit snappier, the load more balanced. My experience with Xeon's over the years is that they like to run hot but this Broadwell era Xeon runs in the mid 30s with the watering cooling in most of my processing tasks, very much on par with my old 6-core i7.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-workload-btop-sample-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-workload-btop-sample-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-workload-btop-sample-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-workload-btop-sample-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-workload-btop-sample-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-workload-btop-sample-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-workload-btop-sample-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-workload-btop-sample-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-workload-btop-sample-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-workload-btop-sample-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20260202-xeon-workload-btop-sample-800.png" alt="The Xeon running cool under my standard working load, as shown in btop.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The Xeon running cool under my standard working load, as shown in btop.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

While some people will say that I have wasted my money on a worthless upgrade, for $50 I've extended this machine for a little while longer. Buying time on the clock to spend effort or funds or resources on other more worthwhile causes—like my kids college education, or film, or other needs—outweighs the shadowy and often ill-conceived needs for the latest hardware.

Most of the finer pieces of software I've built has been on old hardware, for old hardware, powering though the decades in places far flung from the comforts of city lights or rural fireplaces. The tools don't make that person; the person makes the tools.

&ast; All that DRAM and you still can't get regex right.