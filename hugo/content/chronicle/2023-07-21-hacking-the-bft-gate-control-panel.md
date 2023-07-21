---
title: "Hacking the BFT Gate Control Panel with a Nest Doorbell and a Progressive Web App"
description: "Between the endless bugs and terrible native app, it was only a matter of time before I cracked this open."
date: 2023-07-21T14:08:59-07:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-800.jpg" alt="The BFT gate controller hacked with a Google Nest Doorbell and some black gaffer tape.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The BFT gate controller hacked with a Google Nest Doorbell and some black gaffer tape.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-800.jpg"
tags:
 - web
 - maker
 - iot
---

I sometimes stare at the gate, the metal monstrosity that blocks our entrance driveway. My wife will inevitably bump me if my gaze is simply too long, knocking me out of my trance.

“What’s wrong with the gate now?” she will ask, a flippant tone of a spouse who for too long has put up with the her finder-of-imperfections.

Nothing was wrong with the gate per se. It served a purpose, which primarily seemed to be keeping the dogs from running wild through the surrounding orchards. Otherwise it mostly prevented people from driving in, which very well could have been the point of said gate but there wasn't exactly a horde of people driving through the countryside looking for houses to ransack—consider that this piece’s _The Last of Us_ reference. It mostly annoyed people we wanted to let in.

The reason for this annoyance was two fold. Controlling the gate seemed simple—push button, gate opens—but alas in practice it was push button, nothing happens, push again, start to open and then stop in a half open/closed state. This was more aggravating than anything else, and the dance was only more complicated by multiple people trying to open the gate at the same time. Don’t even get me started if someone was entering a code on the keypad; you could be trapped in gate purgatory for the better part of 15 minutes.

The other annoyance was actually figuring out who was at the gate. The doorbell on the keypad required the use of a custom mobile application which in practice simply did not work. When said doorbell button was pressed at the gate we would have no idea other than the blaring siren that the gate keypad would emit which mostly annoyed local coyotes who would howl with said tone. Sometimes the keypad rang itself causing an endless humm on the internal speaker. Stopping the tone required flipping the breaker in the electrical panel.

None of this was ideal and while I didn’t have the proper amount of time to give to coming up with something better, I decided to use what I had in the parts box and reverse engineer this thing.

<h2>Tapping the keypad controller for power</h2>

The keypad controller was made by BFT and had scant documentation. The keypad itself worked rather flawlessly and had programmable sequences not unlike more control keypads I've dealt with in the past, so I found that easy enough to setup and use.

Opening the panel revealed enough to at least stop the annoying features: disconnecting circuit modules for the mic, speaker, and camera. Reading the circuit board and verifying with a multimeter showed that it had terminal that offered steady 12 volt and 24 volt power.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-internals-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-internals-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-internals-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-internals-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-internals-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-internals-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-internals-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-internals-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-internals-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-internals-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-internals-800.jpg" alt="The BFT gate controller panel opened showing it's internals.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The BFT gate controller panel opened showing it's internals.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

This was a positive development, as 12 volts is what I need to power the original Nest Doorbell camera. It just so happens I had one we used at the previous house and given the long range outdoor wifi points I had installed around the property, WiFi wasn’t an issue. A few drill and taps and some leach wiring, and the Nest doorbell was up and running.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-power-tap-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-power-tap-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-power-tap-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-power-tap-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-power-tap-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-power-tap-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-power-tap-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-power-tap-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-power-tap-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-power-tap-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20230721-bft-nest-power-tap-800.jpg" alt="The addition of green and white wires as a power tap to start up up the Google Nest Doorbell.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The addition of green and white wires as a power tap to start up up the Google Nest Doorbell.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

Upon further inspection, I did find the WiFi in the keypad itself. This was expected given it was controllable (supposedly) via app (which never worked). Based on the slim markings on the circuit board, surely it had an API somewhere in it. Sure enough, a very limited web UI and some endpoints where hiding, saving some time from having to sniff the Android application for chatter.

This allowed me to whip up a quick like progressive web app and facade API to talk to the controller and within an hour I had a remote controllable gate that would now actually alert you. Add a couple old Amazon Dash buttons with the same API trigger, and you’ve got yourself a reasonable set of controls outside just the Liftmaster remotes.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20230721-pwa-gate-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-pwa-gate-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-pwa-gate-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-pwa-gate-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-pwa-gate-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20230721-pwa-gate-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-pwa-gate-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-pwa-gate-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-pwa-gate-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20230721-pwa-gate-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20230721-pwa-gate-800.jpg" alt="The progressive web app to control the gate along side the a Liftmaster control button.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The progressive web app to control the gate along side the a Liftmaster control button.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

Is it perfect? Not even in the slightest. It doesn’t understand state, so you can’t tell if the gate is opened or closed. That’ll require a reed switch or some such. This also doesn’t account for the controller itself, which is finicky as all get out (I force reboot it every 2 hours otherwise the controller deadlocks). It has telnet that I have not yet broken (same admin credentials don’t work sadly). Then again, the Liftmaster doesn’t understand state either, so it’s not exactly worse.

It’s a work in progress to say the least. But at least we can let people into the driveway now more reliably.

> Note: someone is going to ask "why didn't you hook it up to Home Assistant, I thought you liked open source". It's not personal, I think HA is cool. Buttttt, I like building tiny, useful, scoped, and <a href="/chronicle/2019/01/31/tiny-pwas-and-why-i-keep-building-them/">private PWAs</a> just as much.
