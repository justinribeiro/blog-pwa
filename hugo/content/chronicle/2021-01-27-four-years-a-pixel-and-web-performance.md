---
title: "The Pains of Surfing the Web on a Four Year Old Google Pixel"
description: "As I enter the fifth year of using the Google's original flagship Pixel, I have deep concerns about whether anyone really cares about web performance."
date: 2021-01-27T16:25:24-08:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200715-desk-phone-printed-finished-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200715-desk-phone-printed-finished-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200715-desk-phone-printed-finished-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200715-desk-phone-printed-finished-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200715-desk-phone-printed-finished-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200715-desk-phone-printed-finished-640.jpg 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200715-desk-phone-printed-finished-800.jpg 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200715-desk-phone-printed-finished-1024.jpg 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200715-desk-phone-printed-finished-1280.jpg 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200715-desk-phone-printed-finished-1600.jpg 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20200715-desk-phone-printed-finished-800.jpg" alt="My Pixel sits in the Model 500 phone holder I designed, which seems fitting given its age.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">My Pixel sits in the Model 500 phone holder I designed, which seems fitting given its age.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>
'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20200715-desk-phone-printed-finished-800.jpg"
tags:
  - Web
  - web-perf
---

1560 days. That’s how long I’ve been using the original Google Pixel. Four years, three months, 8 days. Not as a sometimes test device, not as a joke to tell at parties. No, this phone is my everyday carry. And yes, I really did [make that phone stand](/chronicle/2020/07/15/designing-and-3d-printing-a-classic-we-model-500-inspired-phone-stand/).

The battery life at this point is a gamble depending on whether it’s a full moon or not. The fingerprint reader is at best an artifact to remind that was a feature that used to work. I can sometimes warm my hands with the Qualcomm Snapdragon 821 SOC when it decides it wants to rage against the one tab I have open in Chrome. I am hard pressed to recall if this was a premium device offering. That’s where we’re at.

While my continued use of said device may be considered quirky or thrifty or abusive to my personal sanity, I persist in its use nonetheless. Which reminds me: for all the lip service folks pay on web performance, the reality is y’all are doing a down right atrocious job.

Before you go into the “Justin your device is old” response, let me remind you that there are plenty of devices more recent with lesser hardware, let alone that LG produced Android One devices and a tablet in late 2019 with the very same 821 SOC as my faithful workhorse of a phone I have now. Spare me the hand wringing.

Before you go into the “Justin everything in my market is fast”, why don’t you just say it works on your device, call yourself the elitist you are, and try to blame poor people for your troubles when your organization doesn’t hit their revenue targets in new markets. If my anger seems oddly specific in that sentence, let’s just leave it as I’m legally not able to throw you or your manager to the wolves, but I remember where the bodies are buried.

Alas, I digress. My takeaway is that for all the data, all the tools, all the talks, all the articles that are written, developers and management still don’t understand web performance because frankly they don’t feel the pain of their web performance on a daily use basis. New hardware and fast networks are a sauve to ease the concern, masking the looming or ongoing revenue loss for their bad performance in a world that doesn’t have $1200 to spend.

You can of course disagree with my assessment. But when was the last time you used a phone that was old or off the cutting edge? Not to test on, but actually carry and use for any extended period of time? I’ve wandered through enough offices and know enough folks to know there aren’t many of us.

When was the last time you modeled your market only to realize that you only have iPhone users because that’s the only thing your web app will run on? The grand joke of “that’s what my analytics says” while not realizing that the instrumentation never starts on devices that can’t handle the site has been a priceless find of mine time and again at orgs. You think it was hard winning customers to start? Let me tell you the effort to regain lost users and improve the revenue is a steep climb you may not have the tools or resources in your organization to make.

Should people on mass be using a four year old Pixel? Of course not; I don’t even recall the last security patch this thing received. The phone however is a constant reminder to me that too many of the people talk about web performance and not enough people are actually working to make web performance and the life of their users better.

When I see a site that runs slow on my phone, I think to myself “I can’t fix that site, but I can try to make the products and experiences I control better for my users.” Take a dose of empathy for your users, feel their pain in the wide open web, and chip away as best you can.
