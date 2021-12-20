---
title: "Beware the Search Results Phishing for your Holiday Gift Cards"
description: "Break out the egg nog and check those search results twice before trying to validate that gift card balance."
date: 2021-12-20T09:56:57-08:00
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-phishing-800.png"
tags:
 - web
 - business
 - scams
 - phishing
---

I am not a fan of gift cards. On the one hand if you know what the getter wants gift cards offer more value, though the strengths fade in utilitarian economics beyond that case, where cash offers greater value due to less risk {{< citation string="(Waldfogel, 1993)" >}}Waldfogel, J. 1993. The Deadweight Loss of Christmas. <b><i>The American Economic Review</i></b>, 83(5): 1328–1336.{{< /citation >}}. This of course discounts other factors—Waldfogel notes social stigma's related to cash as a gift—but let's talk about risk in an online world with gift card balances and phishing.

While the FTC has a whole section on [what gift card scams look like](https://www.consumer.ftc.gov/articles/gift-card-scams#what%20the%20scam%20looks%20like), the screenshot comparison below showcases one not not listed. What you see is in the first search result is an AdSense campaign result at the top of the page on my actual mobile device. That results looks legit at first glance; it has all the bells and whistles and one might assume that a first-slot search result—a paid advertisement no less—would be vetted for fraud by Google. Alas, this is not the case.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-phishing-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-phishing-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-phishing-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-phishing-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-phishing-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-phishing-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-phishing-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-phishing-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-phishing-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-phishing-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-phishing-800.png" alt="A Target gift card search on mobile returning a phishing result as the first ad result, which has an identical looking site to the actual Target check gift card site. The ad result has since been flagged and removed.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">A Target gift card search on mobile returning a phishing result as the first ad result, which has an identical looking site to the actual Target check gift card site. The ad result has since been flagged and removed.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

The aforementioned phishing site is sneaky. If I was betting man one likely AdSense check fail is on the ad title itself. I didn't debug this—I wasn't expecting to run into this on a Sunday—the "T" character in the word "Target" in that ad looks like a Tau to my eye (U+03A4). In the moment I didn't register the difference. Landing on the phishing site, it's nearly a one-to-one mirror of Target's actual gift card balance site. The site domain, which is clearly not Target.com throws no safe browsing error screen likely because the domain churns quickly to evade detection.

Situations like this can easily and effectively lead to being phished if you're in a rush. I know from experience: I was in a rush and I only noticed this when Monica asked me to check the card because she couldn't remember her Target.com login. Turns out Target.com makes you login to check a gift card balance; the phishing site does not. I got lucky and dodged it, but I suspect that in any other moment of a chaotic Sunday I may not have otherwise.

Target has often been a target of gift card balance phishing; they have a whole [own gift card scam support site](https://security.target.com/fraud ) and the FTC notes [$35 million lost to scams for Target gift cards](https://www.ftc.gov/news-events/press-releases/2021/12/ftc-data-show-major-increase-gift-cards-scam-payment-method) in the first nine months this of 2021. Target gift cards are socially considered one of the more appropriate gifts over other gift cards {{< citation string="(Valentin & Allred, 2012)" >}}Valentin, E. K., &amp; Allred, A. T. 2012. Giving and getting gift cards. <b><i>Journal of Consumer Marketing</i></b>, 29(4): 271–279. {{< /citation >}}, and Target issues a lot of gift cards. Target's net estimated breakage rate—a term used in the industry to denote the percentage of gift cards will never be redeemed—accounts for $739 million USD in 2020 {{< citation string="(Annual Report Target Corporation, 2020: 42)" >}}<b><i>2020 Annual Report Target Corporation</i></b>. 2020. 78.{{< /citation >}}, which gives us some idea of just how large their gift card issuance is.

After reporting the advertisement—I presume others did as well, I have no idea if my report ever made it to the right people—AdSense has since removed the result. That said, don't think scammers aren't organically slipping into the search results. The second organic search result is indeed another less refined phishing site that does not trigger any warning at all.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-come-on-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-come-on-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-come-on-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-come-on-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-come-on-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-come-on-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-come-on-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-come-on-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-come-on-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-come-on-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20211220-fa-la-la-come-on-800.png" alt="A phishing site holds the second organic search result beneath the indented second order links in the Target.com first result.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">A phishing site holds the second organic search result beneath the indented second order links in the Target.com first result.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

Which is to say, be diligent. Check those URLs and make sure you really are where you need to be before inputting sensitive information into a web site or app. And for that niece or nephew, they'll happily take cash. 😉 Happy Safe Holidays!
