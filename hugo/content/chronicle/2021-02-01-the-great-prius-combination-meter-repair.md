---
title: "The Great Prius Combination Meter Repair Or Lets Rip The Dashboard Apart"
description: "I decided to finally take the time, break some plastic tabs, curse to the heavens, and fix the combination meter in my 2005 Toyota Prius."
date: 2021-02-01T06:58:43-08:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url(''data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\''http%3A//www.w3.org/2000/svg\'' xmlns%3Axlink=\''http%3A//www.w3.org/1999/xlink\'' viewBox=\''0 0 1280 853\''%3E%3Cfilter id=\''b\'' color-interpolation-filters=\''sRGB\''%3E%3CfeGaussianBlur stdDeviation=\''.5\''%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\''discrete\'' tableValues=\''1 1\''%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\''url(%23b)\'' x=\''0\'' y=\''0\'' height=\''100%25\'' width=\''100%25\'' xlink%3Ahref=\''data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\''%3E%3C/image%3E%3C/svg%3E'');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-800.jpg" alt="The new 220uf 16V capacitor soldered into place on the Prius combination meter cluster board.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The new 220uf 16V capacitor soldered into place on the Prius combination meter cluster board.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-800.jpg"
tags:
  - maker
  - repair
---

A couple of years ago, I created my [Speedometer progressive web app](/chronicle/2019/01/31/tiny-pwas-and-why-i-keep-building-them/) to address the fact that my 2005 Toyota Prius had developed a touchy case of dashboard-no-work. Said progressive web app has worked a treat for a good year as the dashboard on said Prius would travel in and out of function. Then this pandemic hit and the Prius has not moved for the better part of the last year.

If there was any time to rip the dashboard apart to fix this combination meter, now seemed like the time.

Well, not now. I though I did this repair last month, but it turns out that was actually October. Because of course it was. Damn you pandemic time hole.

Regardless, the whole reason I didn't do this before was because you have to get the combination meter out of the car to replace a 100uf 16v capacitor that is known to fail on Generation 2 clusters (see original [technical bulletin from 2009](https://static.nhtsa.gov/odi/tsbs/2012/MC-10133976-9999.pdf)). Getting the dashboard out isn't generally hard to accomplish. A few metric sockets, a screw driver or two, and the ability to curse as you fail to gingerly pull apart plastic parts made in 2005 that have been attacked by the evils of UV radiation.

With those tools and the cursing to the heavens, you end with a dashboard that looks like this.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-800.jpg" alt="The naked dashboard reminding me that it's what is on the inside that counts.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The naked dashboard reminding me that it's what is on the inside that counts.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

Looks so _simple_. I'm sure it was just a pop out of one piece and one wire harness. The backseat says otherwise.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-backseat-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-backseat-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-backseat-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-backseat-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-backseat-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-backseat-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-backseat-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-backseat-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-backseat-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-backseat-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-backseat-800.jpg" alt="The backseat with the various remains of the dashboard in perfectly chaotic order.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The backseat with the various remains of the dashboard in perfectly chaotic order.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

All of that just to get to one tiny yet very important circuit board which sits in a little housing with terribly placed screws. If you're starting to wonder why this gets estimated as a $1200 USD job at the dealership, I'm convinced it's because of this tiny screws. Devil screws I tell you.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-the-combo-meter-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-the-combo-meter-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-the-combo-meter-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-the-combo-meter-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-the-combo-meter-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-the-combo-meter-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-the-combo-meter-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-the-combo-meter-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-the-combo-meter-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-the-combo-meter-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-the-combo-meter-800.jpg" alt="The combination meter cluster sits apart from its housing.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The combination meter cluster sits apart from its housing.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

After some quick prodding with probes to test various capacitors on the board, the very capacitor as noted in various PriusChat forum posts and YouTube videos is indeed the culprit. I was not time stripping that cap off with my soldering iron and extractor.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-no-cap-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-no-cap-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-no-cap-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-no-cap-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-no-cap-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-no-cap-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-no-cap-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-no-cap-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-no-cap-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-no-cap-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-no-cap-800.jpg" alt="The faulty capacitor location ready for new capacitor after removing our misbehaving part.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The faulty capacitor location ready for new capacitor after removing our misbehaving part.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

The above photograph, shot with the Fujifilm 60mm macro lens I borrowed from my wife, doesn't quite do justice to how small this thing is and how much of a pain it was to get in there. As reference, note the tiny offending cap between my thumb and finger.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-bad-cap-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-bad-cap-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-bad-cap-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-bad-cap-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-bad-cap-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-bad-cap-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-bad-cap-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-bad-cap-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-bad-cap-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-bad-cap-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-bad-cap-800.jpg" alt="The bad capacitor, the bane of my driving existence the last couple of years.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The bad capacitor, the bane of my driving existence the last couple of years.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

The bad capacitor in question as at best five cent piece of hardware. I had a stack of similar 220uf 16V capacitors of the same form factor from some other project (which also happens to be the recommended fix). A quick tap tap of the iron and we're back in business.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20210201-prius-dashboard-teardown-naked-board-new-cap-in-place-800.jpg" alt="The new 220uf 16V capacitor soldered into place on the Prius combination meter cluster board.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The new 220uf 16V capacitor soldered into place on the Prius combination meter cluster board.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

That was it. No, there was no other solder work to do. No, no other units to replace. A single, five cent cap. You may be aghast to know the dealership quoted $1200 USD a couple years ago to fix said cluster. Hey, maybe the price of that cap was through the roof and maybe no one wanted to deal with the plastic wonder of a dashboard, I'm not one to judge (everyone's gotta make a living). The repair in question took me one hours, forty-seven minutes from start to finish so it's not exactly quick but I wouldn't say it took me a great deal effort. Sure, I snapped a good number of plastic in the process (two vents, lots of tabs) but that why we have cursing. The creative expression of repair.

Since I've made said fix, said car dashboard has not failed once. Which means I can now iterate on my speedometer progressive web app again, since it is no less than mission critical. That, and I think legally the car can be driven again. I maintain my application was well within the legal standard, but was lucky to never test that theory. 🤣
