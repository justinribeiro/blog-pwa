---
title: "The Internet Connection Puzzle in the California Rural Central Valley"
description: "I am not jealous of your internet speed, I am frustrated by the endless poor performance of the websites and tools we use that think high bandwidth is an inherent right (tip: it is not)."
date: 2025-05-09T13:45:55-07:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-new-waveform-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-new-waveform-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-new-waveform-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-new-waveform-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-new-waveform-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-new-waveform-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-new-waveform-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-new-waveform-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-new-waveform-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-new-waveform-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-new-waveform-800.jpg" alt="I did not pick this seemingly unconventional spot on this shed pointed at a hole in the trees for this antenna: the waves did.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">I did not pick this seemingly unconventional spot on this shed pointed at a hole in the trees for this antenna: the waves did.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-new-waveform-800.jpg"
tags:
 - web
 - internet
 - maker
 - personal
---

Rural internet here in the Central Valley in California has improved over the years. The advent of fixed wireless and now 5G in its various technological forms has in part replaced many of the older, high latency satellite connections and where DSL from AT&T even would not reach.

Over the last three years since moving away from previous hardwired gigabit internet life to the rural farmland and native habitat we now care-take, I’ve come to admire my internet connection more. My 30/30 symmetric fixed wireless connection (from local vendor [Ayera Technologies](https://www.ayera.com/), with whom I highly recommend) has latency in the 8-10ms range, a static IP, and an uptime that has survived the many atmospheric rivers of the past couple of years; I cannot say the same for our electricity, which can be a roller coaster of availability even on sunny days.

But even on the good days, I still despise your bloated website. Or your streaming service. Or your terrible dependency management. The inefficiencies and poor choices of software development that make network calls are around every corner, and increasingly hard to dodge. Look, I’ve spied the calls and packets on a lot of sites and services: we should be ashamed in our business of the waste we perpetrate over the wire.

I eventually ran out of avenues on my abandon-and-self-host approach. I am of course only one person in this house; there are three other normal people internet using people. From a purely data perspective, recent research says that the average usage per person is around 15Mbps ([Dine and Kane, 2023](https://itif.org/publications/2023/01/11/broadband-myths-is-us-broadband-service-slow/)), through they've never met my twins generation which is streaming four devices at once while holding two video call conversations on another device. It should come as no surprise that they just want their stuff to work. It was decided then: time to see about upgrading the connection.

My rough plan was simple: keep the 30/30 fixed wireless and find another connection to combine with it. I had nothing if not the network gear to handle such a setup (both Ubiquity equipment and my custom FreeBSD network hardware), big spools of shielded direct-burial/UV rated CAT6, and some very tall ladders to use with my increasingly tall redwoods (my fear of heights be damned). I could figure this out.

I would be remiss to not point out that I had tried this when we first bought the property three years earlier only to come up empty. Most towers were too far out of range or cut off due to the rolling terrain and tree line, limiting my ability to tower bounce. DSL wasn’t even an option; too far to run copper, too expensive to hang fiber (I ran that math). No 5G coverage and the LTE wasn’t enough to hold a phone call let alone an internet connection. The fixed wireless that Ayera provided was the only game in town.

Surely the passing of time will have improved my internet speed hopes.

Turns out, this was partially true. Ayera had started to rollout [UltraSpeed mmWave fixed wireless](https://www.ayera.com/ultraspeed/), but alas, wasn’t yet on the tower nearest to us, and their engineers were convinced even if it were we are too far away to make it work (the working range is under two miles; we’re two and half with blockage, but I’m convinced I could swing it with the right setup and bounce). Starlink was now available, but between the tree canopy and my fuck-you-Elon-you-Nazi-fuck stance, that was never an option. Still no hardwire options on the poles either.

There was however 5G. Sorta.

## Rolling the dice with 5G when the numbers are bad

A couple of months prior, I had noticed that our cell phones had all started catching 5G bands. The catch was, locking onto a 5G band wasn’t stable; the front of the property, which has less canopy, fared better while the the house set back an acre was at best a game of rolling dice. The only cell tower near us was nearly three miles away, so this was unsurprising. But if they had hung 5G gear on that tower, I might be in business. A quick scan of TMobile 5G service map reveled that they would now offered consumer and business 5G internet to us, though our spot on the map was riddled with coverage holes. The terrain and trees had conspired against me again, but I was determined. I just needed to make a whole bunch of measurements on the property and then thread a needle of connectivity with the right piece of hardware.

I placed an order with T-Mobile Business for their 5G kit, grabbed my ladder and a notebook, and did what any sane person would do: ran band lock, latency, and speed tests by sticking my phone up in the air. Sounds easy, but the terrain isn’t exactly ladder-friendly and the out buildings are of various peek heights (and I’m still terrified of heights). Tooling wise, I don’t keep a lot of cell tools these days (no need), but I found that [Network Cell Info Lite & Wifi on Android](https://play.google.com/store/apps/details?id=com.wilysis.cellinfolite) was more than adequate for the task.

Having spent a day waving my phone around-wasn’t that a Verizon commercial at one point?- I found that threading the needle to landing this connectivity was an understatement. Staying connected to a 5G band (N41 or N66) was at best a terrible; RSSI above -110 and RSRP bouncing above the disconnect line of -100 doesn’t make for a happy connection. There were signs of life though; the stars would align and RSRQ would hit -10 (usually is a good indicator overall connection quality). However, these readings were also in what I would consider non-intuitive locations; seemingly pointed slightly away from the tower, through some trees, slightly blocked by one of outbuildings, while standing at the top of 8 foot ladder. The connection in those instances was stable, with speeds of 450/15. I just needed to hold that line.

## Threading the needle with a Waveform Antenna

To do this would require a few things. For one, I needed an external antenna. As planned, T-Mobile sent their G4SE gateway which has external antenna connections, no soldering required. [Waveform](https://www.waveform.com) sells a directional and omnidirectional antenna that work with this gateway out of the box. Add a mounting pole and a run of 150 feet of CAT6 and this just might work.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-waveform-in-action-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-waveform-in-action-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-waveform-in-action-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-waveform-in-action-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-waveform-in-action-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-waveform-in-action-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-waveform-in-action-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-waveform-in-action-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-waveform-in-action-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-waveform-in-action-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-waveform-in-action-800.jpg" alt="The Waveform omnidirectional QuadMini antenna was easy to setup and is an amazing performer.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The Waveform omnidirectional QuadMini antenna was easy to setup and is an amazing performer.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

I hedged my bets with the [omnidirectional QuadMini antenna](https://www.waveform.com/products/quadmini). Given the lack of a good line of sight at the building roof level, I wasn’t going to be able to make the directional work. That and I didn’t want to rent a bucket truck until I sorted at least some initial testing; the fixed wireless directional antennae is on a utility pole on the highest point on the south property line, but how they got the okay for that originally, no idea.

So, in the most odd place ever, the out building shed gets itself an antenna. This has at least some benefits, in particular that I can run the least amount of antenna cable (e.g., less loss on the wire) while also powering and shielding the G4SE gateway (e.g., very much not an outdoor device). Running a 150 feet drop of CAT6 I could do in my sleep and in this case, did it in the dark.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-cable-run-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-cable-run-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-cable-run-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-cable-run-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-cable-run-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-cable-run-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-cable-run-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-cable-run-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-cable-run-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-cable-run-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-cable-run-800.jpg" alt="The first 30 feet of the CAT6 run with a service loop; give me a break, I did this in the dark.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The first 30 feet of the CAT6 run with a service loop before the building hop; give me a break, I did this in the dark.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

Of course, issues being to creep in. The G4SE gateway won’t start the external antenna until it has picked up a 5G band (thank you Waveform for the [excellent documentation](https://www.waveform.com/a/b/guides/hotspots/t-mobile-5g-gateway-g4#connecting-mimo-antennas-to-the-t-mobile-5g-g4ar-and-g4se-gateways) on all the nuances), which I found to be extremely frustrating. The G4SE gateway takes a long time to do this, but on the plus side once it does lock in and doesn’t bounce and the external antenna works without issue. After further resolving with T-Mobile weird auto-blocking issues (a “feature” of business accounts that is frankly not a feature, and requires a call to support to disable), things just sort of worked.

The Waveform external antenna is a champ in this regard. Looking at the data on the G4SE gateway via the [open source HINT Control](https://github.com/zacharee/HINTControl) shows solid improvements to RSSI (down to -87 from -110) and RSRP (down to -90 from -100), all locked to N41 band. A series of speed tests showed good numbers across the board.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-wireup-device-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-wireup-device-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-wireup-device-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-wireup-device-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-wireup-device-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-wireup-device-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-wireup-device-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-wireup-device-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-wireup-device-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-wireup-device-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-the-wireup-device-800.jpg" alt="The G4SE gateway attached to the wall with a hook, wired to external antenna using Waveform's amazing cables (white) and the downline CAT6 (black).">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The G4SE gateway attached to the wall with a hook, wired to external antenna using Waveform's amazing cables (white) and the downline CAT6 (black).</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

## A Month Later

After a month of running the dual-WAN setup I've found that overall the experience surprisingly good. I route specific traffic to each WAN via VLANs, which has prevented the significant lag resulting from the-twins-logging-on after school (which if you've ever been on a call with me in the afternoon, you will have experienced the skippy-Justin-effect from this). This affect is less kid specific and just more network load specific, be it streaming or game updates, which now operate with buttery smoothness. The overall speed has also largely held in the ~400/10 range with some drops into the 150/6 range during peek usuage (I presume tower congestion), but the overall stability has exceeded my expectations.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-speed-test-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-speed-test-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-speed-test-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-speed-test-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-speed-test-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-speed-test-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-speed-test-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-speed-test-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-speed-test-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250509-speed-test-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20250509-speed-test-800.jpg" alt="A recent synthetic internet speed test from Ookla's speedtest.net.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">A recent synthetic internet speed test from Ookla's speedtest.net.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

 The latency and upload are is still much better on the fixed wireless connection, but the 5G has been a better performer than I expected. Overall, in the last the 30 days, the dual WAN setup has moved a lot more data much more easily making my backups a lot more happy (~3TB, roughly 2TB down, 1TB up at about 50/50 across connections).

Will I stay with this setup? Time will tell. For now, things run slightly smoother.