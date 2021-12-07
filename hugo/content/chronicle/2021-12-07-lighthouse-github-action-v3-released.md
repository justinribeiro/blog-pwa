---
title: "Lighthouse Github Action Version 3 Released"
description: "Now adds support for lighthouse v9 for all your web performance testing goodness."
date: 2021-12-07T11:05:01-08:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211207-lha-v3-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211207-lha-v3-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211207-lha-v3-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211207-lha-v3-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211207-lha-v3-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211207-lha-v3-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211207-lha-v3-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211207-lha-v3-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211207-lha-v3-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211207-lha-v3-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url(''data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\''http%3A//www.w3.org/2000/svg\'' xmlns%3Axlink=\''http%3A//www.w3.org/1999/xlink\'' viewBox=\''0 0 1280 853\''%3E%3Cfilter id=\''b\'' color-interpolation-filters=\''sRGB\''%3E%3CfeGaussianBlur stdDeviation=\''.5\''%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\''discrete\'' tableValues=\''1 1\''%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\''url(%23b)\'' x=\''0\'' y=\''0\'' height=\''100%25\'' width=\''100%25\'' xlink%3Ahref=\''data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\''%3E%3C/image%3E%3C/svg%3E'');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20211207-lha-v3-800.png" alt="Version 3 of lighthouse-action ready in the Github Actions Marketplace.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">Version 3 of lighthouse-action ready in the Github Actions Marketplace.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20211207-lha-v3-800.png"

tags:
 - web
 - perfmatters
 - web-performance
 - web-tools
---

With the release of [lighthouse v9](https://github.com/GoogleChrome/lighthouse/releases/tag/v9.0.0) comes with a pretty wide array of changes to the reporting end as well as the addition of [user flows](https://web.dev/lighthouse-user-flows/) which I think everyone has been doing in some shape or form—I know I have. This makes life easier for more developers to get actionable information which is a nice touch.

While I have not yet added some form of user flow support to [lighthouse-action](https://github.com/justinribeiro/lighthouse-action), I have released version 3 which bump the lighthouse dependency to version 9 and adds a few reporting fixes (since some of the imports have been changed). This also bumps the github action node version to 16, since lighthouse now requires at least v14 of node.

With the holidays approaching, this is high on my list to start sorting our the details on user flow testing support during some downtime. In the meantime, if you want the latest numbers in you pull request comments, grab the latest version from the [Github Actions Marketplace](https://github.com/marketplace/actions/web-performance-audits-with-lighthouse) or update your yamls.

Happy Holidays!