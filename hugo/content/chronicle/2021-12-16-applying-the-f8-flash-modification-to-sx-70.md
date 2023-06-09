---
title: "Applying the f/8 Flash Modification to a Polaroid SX-70 and Building a Flash Table for the Godox TT600"
description: "With a distance coupled aperture suited for old flashbars, we remove the SX-70 cam follower to allow more control with an external electronic flash."
date: 2021-12-16T09:35:52-08:00
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-assembly-pivot-800.jpg"
tags:
  - maker
  - photography
---

> Disclaimer: as with any hack/maker approach if you do attempt this modification you're doing so at your own risk to camera destruction or malfunction. Also don't stare at flashbars or any flash for that matter. You know the drill.

The internals of the Polaroid SX-70 are both incredibly fascinating and mildly frustrating. The fascination stems from novel approaches that lead to an amazingly useable camera by masses of people. The mildly frustrating part is trying to control the camera to make exposures in 2021, particularly when it comes to electronic flash usage.

It's not a secret that SX-70 film needs a lot of light to make viable exposures. With a today's SX-70 film rated at ISO 160 and no manual controls other than the beguiling light/dark wheel, we don't have a lot to work with when it comes to low light. This is further problematic when using flash because electronic flash wasn't yet a thing and instead we had flashbulbs and in the case of the SX-70, flashbars. Flashbars are _ridiculous_ in terms of brightness and have zero output control. You fire it and people see spots for a day. If you run across one, try it. It's like you've brought the sun indoors and people will curse you as they stumble around.

Which leads to the problem and the novel solution that the SX-70 used to deal with that brightness: if a flash is attached, it'll stop down via a cam follower based on the focus distance. Not just stop down, but _stop down_: in the [original patent](https://patents.google.com/patent/US3832722) it notes f/107 and in chatter in SX-70 circles somewhere around f/256. Sounds crazy, but again, try a flashbar and you'll see why.

The above explanation is at best a vast simplification of just how novel and clever the whole SX-70 shutter/aperture are and frankly I'm selling it short. Joaquín de Prada of the OpenSX70 Project wrote a great article on the [SX70 shutter](https://opensx70.com/posts/2018/11/sx70-shutter). If you're interested in the science and engineering, I highly recommend it.

In my case, I really wanted to do away with the restriction of the cam when using either [my custom rig](/chronicle/2021/02/23/building-a-custom-polaroid-sx-70-camera-rig/) or my studio lights. I turn to the old and I would contend fairly well known modification, the [constant f/8 flash mod](http://www.sx2pc.com/SX_f8conv.html). In the old guide, it gives a couple of smallish photographs and don't go into the notion of calculating the flash output you might use with this mod. So let's do some hacking.

## The Tear Down

> Note: you will not be able to use flashbars with this modification applied. Be advised.

First, let's take a look at the exploded parts from the SX-70 repair manual to get an idea of what we're going to do.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-exploded-parts-view-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-exploded-parts-view-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-exploded-parts-view-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-exploded-parts-view-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-exploded-parts-view-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-exploded-parts-view-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-exploded-parts-view-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-exploded-parts-view-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-exploded-parts-view-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-exploded-parts-view-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-exploded-parts-view-800.png" alt="A screenshot section of Figure 2-9, Shutter, Exploded View from the SX-70 repair manual. The parts we'll be dealing with are highlighted in pink.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">A screenshot section of Figure 2-9, Shutter, Exploded View from the SX-70 repair manual. The parts we'll be dealing with are highlighted in pink.</span>
    <span class="author" itemprop="copyrightHolder">Polaroid Company</span>
  </figcaption>
</figure>

Just three parts separate us from the cam follower assembly that we want to remove to give us a more workable aperture for our flash photography. The biggest issue with getting to those parts is what SX-70 version you have. If you have an Alpha this mod is quick to perform given the shutter housing cover can be removed with little more then pulling the outside tabs out, no tools required. If you do not, things get very complicated because it requires a 1mmx1mm square bit (which you'll likely have to make yourself, it's not an off the shelf tool).

Once you get the cover off, you're greeted to the terrifying notion that you may screw this up. Welcome new maker/modder, relish in this feeling.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-housing-off-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-housing-off-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-housing-off-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-housing-off-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-housing-off-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-housing-off-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-housing-off-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-housing-off-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-housing-off-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-housing-off-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-housing-off-800.jpg" alt="The shutter front housing removed reveals the SX-70 shutter assembly.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The shutter front housing removed reveals the SX-70 shutter assembly.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

First things first, rack your lens out to infinity and mark the focus dial and the idler gear. I did this with masking tape and razor cut to make alignment easier, but you can draw a pen or pencil mark as needed. Just don't lose the spot otherwise things won't turn out quite right—you'd have to deal with lens collimation and frankly that's outside the scope of this mod.

Now we have to remove the focus wheel retaining screw. If you read the repair guide, you'd think there was no way to get that screw out without a special tool, but in reality this screw is usually easy to remove with nothing more than fine set of needle nose pliers. I've never run into one that is tight, it just requires a fine touch.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-off-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-off-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-off-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-off-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-off-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-off-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-off-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-off-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-off-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-off-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-off-800.jpg" alt="Removing the focus wheel retaining screw will not remove the wheel, so check that focus mark with the idler gear before you pull it off.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">Removing the focus wheel retaining screw will not remove the wheel, so check that focus mark with the idler gear before you pull it off.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-calipers-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-calipers-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-calipers-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-calipers-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-calipers-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-calipers-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-calipers-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-calipers-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-calipers-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-calipers-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-wheel-retaining-screw-calipers-800.jpg" alt="The small and fine focus wheel retaining screw sits on my caliper jaws.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The small and fine focus wheel retaining screw sits on my caliper jaws.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

Once removed, the focus wheel will come off and you're left with a view of the cam follower assembly being held in place by the focus wheel pivot retaining ring.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-assembly-pivot-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-assembly-pivot-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-assembly-pivot-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-assembly-pivot-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-assembly-pivot-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-assembly-pivot-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-assembly-pivot-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-assembly-pivot-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-assembly-pivot-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-assembly-pivot-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-focus-assembly-pivot-800.jpg" alt="A view of the cam follower assembly with the attached focus wheel pivot retaining ring in place.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">A view of the cam follower assembly with the attached focus wheel pivot retaining ring in place.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

You'll want to grab a pair of tweezers and carefully unhook the cam follower spring. If you're heavy handed, you will break it and then there is no return if you want to put the cam back in later. Once unhooked, you have to remove the focus wheel pivot, which on most of the Alpha's is a plastic retainer ring. This part is a little tricky as it is push fit tight and if you apply uneven pull pressure when attempting to pull off you will break it.

Once you have the focus wheel pivot retainer off, you now unhook the trim link and the solenoid #2 pulldown bar assembly. This requires no tools and simply slips away with little friction or effort.

At this point, the cam follower should be able to removed and you're left with all four highlighted parts from the previous exploded view on your workbench.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-parts-on-bench-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-parts-on-bench-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-parts-on-bench-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-parts-on-bench-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-parts-on-bench-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-parts-on-bench-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-parts-on-bench-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-parts-on-bench-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-parts-on-bench-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-parts-on-bench-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-parts-on-bench-800.jpg" alt="From left: the focus wheel (reversed), the focus wheel pivot, the focus wheel retaining screw, cam follower assembly with spring.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">From left: the focus wheel (reversed), the focus wheel pivot, the focus wheel retaining screw, cam follower assembly with spring.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

We now work backwards. Push the focus wheel pivot retainer ring back into place and then place the focus wheel into place, noting your alignment tape/line from the beginning is aligned. Finally, add the focus wheel retaining screw. This can be hard to start given the 0-80 fine thread, but go slow and do not over tighten.

Finally, check that the focus wheel and idler gear are properly moving the lens assembly. If that looks good, click back into place the shutter front housing and your mod is complete.

## Using the Mod with a Flash

Once back together, it's time to coble together some flash tables. I'm going to do so with my Godox TT600 Thinklite Flash, since it's what I use on the handheld rig and it's readily available. You could do the following for any flash you have, including the MiNT Flashbar—which I still use from time to time and like very much, but I always found under powered for close focus shots for an unmodded SX-70.

I am not an expert on flash lighting. I use it rarely and while I understand the concepts and the math—the inverse square law is pretty cool—I prefer material tests whenever possible. That said I needed a place to start the testing. The Godox TT600 Thinklite Flash has a guide number of 60/197 (m/ft), but the devil is in the details with guide numbers. In this case, that's 1/1 power, ISO 100 @ 200mm zoom, and for the SX-70 I would expect to run the unit at 50mm given the field of view for the lens. Simple you say, look at the guide number table in the manual to find the relative guide number for 50mm. Unlike Canon or Nikon flash units, this table is missing in the Godox documentation.

Breaking out the flash meter, I calculate the TT600 50mm guide number at 24/80, e.g., f/8 at 10 feet. Given that at beyond 6.5 feet the SX-70 is f/8, I can work the math backwards and come to the same guide number—e.g., guide number = distance × f/stop, 10ft × f/8 = 80. A quick test shot with the flash at 1/1 power and camera at that 10ft, I end up with an optimal exposure.

I then used the aperture and coupled distance reference from the [SX-70 Exposure Control FAQ](http://www.sx2pc.com/sxfaq.html#link06) in combination with some back-of-napkin math—the [guide number calculator](https://www.scantips.com/lights/flashbasics1c.html) is a better start point—I put together some very rough numbers on paper to test further with my Sekonic meter and film.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-test-sheet-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-test-sheet-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-test-sheet-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-test-sheet-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-test-sheet-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-test-sheet-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-test-sheet-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-test-sheet-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-test-sheet-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-test-sheet-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-mod-test-sheet-800.jpg" alt="Scribbled notes, test shots, and my Sekonic meter sit next to my SX-70 on my kitchen counter as I sort out a working set of flash settings.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">Scribbled notes, test shots, and my Sekonic meter sit next to my SX-70 on my kitchen counter as I sort out a working set of flash settings.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

While my math was okay—my terrible handwriting notwithstanding—the nuances of the film and camera combine to give some variability in use. In the below image test you can see a silly copy-to-legal-pad mistake led to an unideal exposure but an interesting data point.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-sample-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-sample-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-sample-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-sample-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-sample-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-sample-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-sample-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-sample-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-sample-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-sample-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20211216-sx-70-f8-sample-800.jpg" alt="From left: a 1.5 foot distance shot at with the flash at -1.3 EV is overexposed, while -2.67 EV gives a more even exposure.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">From left: a 1.5 foot distance shot at with the flash at -1.3 EV is overexposed, while -2.67 EV gives a more even exposure.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

The above exposure to the left is blown out and lacks detail at 1.5 feet, which I consider successful as a data point given that was near impossible before the modification. The adjustment to the right shows significantly more detail and really highlights why I undertook the f/8 modification, showcasing smooth bokeh that was unachievable before the modification at that distance.

From a does-the-test-match-the-calculations, for the most part this is true, but you have to cook to taste your exposures to be what you want them to be. Having metered, shot, compared, re-compared, I have come up with the following Polaroid SX-70 f/8 Modified Flash Guide for the Godox TT600 Thinklite Flash that fits my tastes.

<table title="Polaroid SX-70 f/8 Modified, Flash Guide for Godox TT600 Thinklite Flash">
  <thead>
    <tr>
      <th>Distance</th>
      <th>Aperture</th>
      <th>EV Offset @ GN 24/80</th>
      <th>Godox TT600 Setting</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1.0ft / 0.3m</td>
      <td>f/32</td>
      <td>-3.667 EV</td>
      <td>1/8 -0.7</td>
    </tr>
    <tr>
      <td>1.5ft / 0.4m</td>
      <td>f/22</td>
      <td>-2.667 EV</td>
      <td>1/4 -0.7</td>
    </tr>
    <tr>
      <td>2.0ft / 0.6m</td>
      <td>f/22</td>
      <td>-1.667 EV</td>
      <td>1/2 -0.7</td>
    </tr>
    <tr>
      <td>3.2ft / 1.0m</td>
      <td>f/16</td>
      <td>-1.333 EV</td>
      <td>1/2 -0.3</td>
    </tr>
    <tr>
      <td>6.5ft / 2.0m</td>
      <td>f/11</td>
      <td>-1.000 EV</td>
      <td>1/2</td>
    </tr>
    <tr>
      <td>10ft / 3.0m - ∞</td>
      <td>f/8</td>
      <td>0.000 EV</td>
      <td>1/1</td>
    </tr>
  </tbody>
</table>

As the table shows, the f/8 modification to the SX-70 makes the Godox more than usable for our purposes. The nuance is subtle where we deviate from the math and focus more on the test results. For instance, at 6.5 feet / 2 meters @ f/11, the math tells us that should be a -0.3 EV, not -1.00 EV, but in testing I found the -1.00 EV exposure held more detail. Your mileage will indeed vary based on your own look and feel you're trying to achieve, but the table works for my use and may be a good start point for you on your SX-70 f/8 modification adventure.

## Concluding Thoughts

The f/8 modification for the SX-70 has been around for as long as I can recall. I quite like the look in comparison to the incredibly sharp photographs produced by the higher geared apertures with flash pre-modification—when they came out no less, which was usually highly under exposed. The increased predictability when using the flash at closer distance to subjects is an added bonus in this regard.

Now to go do some photographing. Happy instant photographing!📸

## Further Reading Links

* [Polaroid SX-70 Camera Repair Book](https://instantphotography.files.wordpress.com/2010/12/polaroid-sx-70-camera-repair-book.pdf)
* [Godox TT600 Manual](http://www.godox.com/EN/InstructionManual/Godox_TT600_20170915.pdf)
* [Flash with the openSX70](https://opensx70.com/posts/2019/11/practical-flash)