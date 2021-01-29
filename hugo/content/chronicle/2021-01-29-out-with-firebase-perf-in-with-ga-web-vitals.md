---
title: "Replacing Firebase Web Performance Monitoring with Core Web Vitals and Google Analytics"
description: "What's old is new again: pushing my web performance data into Google Analytics and reporting those numbers just got a lot more accessible with updated tools from the Google Chrome team."
date: 2021-01-29T6:51:29-08:00
tags:
  - Web
  - web-perf
---

I've not been happy with web performance in general lately, if the [post earlier this week](/chronicle/2021/01/27/the-pains-of-surfing-the-web-on-a-four-year-old-google-pixel/) was any indicator. I've also not been terribly happy with the offerings available in the past in terms of tracking said performance, particularly [Firebase's Performance Monitoring](/chronicle/2019/10/28/six-months-using-firebase-web-performance-monitoring/) (which has not improved at all since I wrote about it).

As opposed to turning my grumpiness into a bitterness that would only further consume my soul, I instead turned to a common web performance meditation I use: I need to tune something.

As such I sat down to pick a performance related thing off my [blog-pwa](https://github.com/justinribeiro/blog-pwa) list, which in my case was to replace my use of Firebase's Performance Monitoring with the new-ish [Web Vitals](https://github.com/GoogleChrome/web-vitals) module that the Google Chrome team came up with. On the surface, it checks a lot of my happy-place boxes:

1. It's tiny (advertised at 1K on the wire, builds at 1.58K in my current pack).
2. It's fast (my traces show it's miniscule on the main thread if at all)
3. It's an ES module (I like my bare metal) and I can lazy load it (since I don't consider it important enough to block things up)

All of this combines with a approach I used pre-Firebase: you pump it to Google Analytics. The hurdle with Google Analytics at the time was that you had to use the API to write the reports and I definitely didn't feel like doing that again.

Low and behold, the excellent Mr. [Philip Walton](https://philipwalton.com/) wrote that beacon sample as part of of the [documentation](https://github.com/GoogleChrome/web-vitals#using-analyticsjs) and if you can report those findings from Google Analytics via the open source [Web Vitals Report](https://web-vitals-report.web.app/).

With said revision and performance reporting, blog-pwa actually gains some additional benefits:

1. I don't have to preconnect to the firebase domains
2. I don't have to make exceptions to the CSP for those domains
3. I shave 10K off my wire for the firebase lib and some thread time

All if took was a quick swap out in my analytics,js lazy load module:

{{< codeblock lang="javascript" >}}
function __trackCwpMetric({ name, delta, id }) {
  ga('send', 'event', {
    eventCategory: 'Web Vitals',
    eventAction: name,
    eventLabel: id,
    eventValue: Math.round(name === 'CLS' ? delta * 1000 : delta),
    nonInteraction: true,
    transport: 'beacon',
  });
}

async function initCwp() {
  const module = await import('web-vitals');
  module.getCLS(__trackCwpMetric);
  module.getFID(__trackCwpMetric);
  module.getLCP(__trackCwpMetric);
  module.getTTFB(__trackCwpMetric);
  module.getFCP(__trackCwpMetric);
}
{{< /codeblock >}}

This makes web performance me much happier than when I started the week to say the least.