---
title: "Terrible Tiktok Embed Web Performance and my Imperfect Web Component Solution"
description: "I had not set out to make a lite-tiktok web component, but I had a spare hour. It only got worse from there."
date: 2022-07-15T09:18:58-07:00
featureimage: ''
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-img-devtools-1600.png"
tags:
 - web
 - web-performance
 - web-component
 - tiktok
---

I recently released version 1.4 of [lite-youtube](https://github.com/justinribeiro/lite-youtube), the little performant web component that just keeps on going. The reason for the version bump was that I added some [experimental interaction support for YouTube Shorts](https://www.youtube.com/watch?v=aw7CRQTuRfo), which I think is kinda of nifty and that quite a few people seemed interested in.

This however inevitably lead to yet more questions from people. "Justin, why not a lite-tiktok web component?" Fair question and I had a spare hour the other day so I set out to build a one. The end result was version 0.1.0 of [lite-tiktok](https://github.com/justinribeiro/lite-tiktok) which produces a more web performance friendly version.

Well, sort of.

You see it turns out the Tiktok embed is _terrible_ on so many levels that my web component is little more than a "stop and hope for the best". How terrible is the Tiktok embed for your web performance? Let me recount the ways:

1. The embed loads around 500kB of JavaScript, which jostles around the embed and causes a couple layout shifts.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-js-devtools-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-js-devtools-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-js-devtools-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-js-devtools-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-js-devtools-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-js-devtools-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-js-devtools-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-js-devtools-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-js-devtools-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-js-devtools-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-js-devtools-800.png" alt="500kB of JavaScript, I'm sure that's all needed immediately said no one.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">500kB of JavaScript, I'm sure that's all needed immediately said no one.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

2. Once that JavaScript is parsed and fires up, it's going to load at least a dozen placeholder images totaling around 4MB. Why so many? They're basically thumbnails for other videos that you might see post play of the video in question. Yeah, you may never even see them.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-img-devtools-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-img-devtools-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-img-devtools-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-img-devtools-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-img-devtools-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-img-devtools-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-img-devtools-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-img-devtools-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-img-devtools-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-img-devtools-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-img-devtools-800.png" alt="Sure, I'm sure we need all these images before we've done literally anything.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">Sure, I'm sure we need all these images before we've done literally anything.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

3. Then it loads the video. No, not a stream, it downloads the video before interaction or clicking play.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-video-devtools-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-video-devtools-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-video-devtools-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-video-devtools-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-video-devtools-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-video-devtools-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-video-devtools-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-video-devtools-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-video-devtools-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-video-devtools-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-video-devtools-800.png" alt="Why they do this is beyond me: the video downloaded, not streamed on interaction.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">Why they do this is beyond me: the video downloaded, not streamed on interaction.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

For my little 13 second duck video which I used to grab those numbers, that accounts for nearly 10MB _for a control I have not interacted with_. That's right, that's just the embed tossed into a page. No user click, no user hover, nothing. 10MB burned on your wire on top of the parse time and all the usual jank that comes along with such behavior.

On top of this terrible performance is the sad fact that unlike YouTube, Tiktok has no API for their embed. There is no means to control the player through a postMessage or other means, which means for the regular old placeholder-interaction-and-play trick I use for lite-youtube, you simply cannot do this. This means you end up with a double-tap to play for the default web component or you have to rely on the Intersection Observer autoload behavior to smooth out the experience.

What about thumbnail for the video? The placeholder image has to be fetched via their oembed endpoint and cannot be determined by the video's id much like YouTube. This results in a fetch call to their oembed endpoint to grab the proper link to the image for placeholder use. Note however that fetch is still a factor of 100 (not a typo) faster than waiting for their terrible JavaScript to load fill in the same placeholder on mobile devices.

Which is to say, my lite-tiktok web component is at best a slight improvement but cannot do much to deal with all that cruft.

"Justin, I bet YouTube's embed loads all kinds of weight too". On first load, you bet; YouTube's embed over 700kB of JavaScript, but ditches most of the image and initial video weight (because the video streams). YouTube however has a secret power when it comes to its embed which is the main site service worker; if you've visited Youtube or second load the embed, the service worker limits YouTube's load to just 32kB of JavaScript.

Oddly enough, TikTok uses a service worker as well on their main site but the embed doesn't utilize it in my testing. While the embed does use disk cache with somewhat reasonable headers, the problem ultimately becomes one of the weight of the media sources that it crushes the wire. Even the same video embedded twice won't hit the disk cache for all media assets, resulting in quite the wire hit: my 13 second duck video, loaded twice on the same page via intersection observer at different times pulls 16MB on the wire.

Frankly, I'm just not a fan of the Tiktok's embed even with my intersection web component. The media weight is simply too high given what may not be a user interaction. If they had any resemblance of an API to control playback, this could easily be worked around. In the mean time [lite-tiktok](https://github.com/justinribeiro/lite-tiktok) is around albeit not ideal by any means. If you want, I talk about it more in this [video](https://www.youtube.com/watch?v=K4MHNR_BIHQ);

And hey, TikTok's source code says is hiring, so maybe they'll get some web performance expertise and make the web a little nicer for their embeds.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-hire-web-perf-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-hire-web-perf-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-hire-web-perf-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-hire-web-perf-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-hire-web-perf-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-hire-web-perf-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-hire-web-perf-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-hire-web-perf-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-hire-web-perf-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-hire-web-perf-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20220715-tiktok-embed-hire-web-perf-800.png" alt="Scouring their embed source code, I ran into this line. Hire some web perf people, please.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">Scouring their embed source code, I ran into this line. Hire some web perf people, please.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>
