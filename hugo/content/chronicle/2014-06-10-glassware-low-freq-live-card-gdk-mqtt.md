---
date: 2014-06-10T00:00:00Z
description: A new Google Glass code sample I wrote to display real time data in a low frequency card.
title: "New Glassware GDK sample: low frequency mqtt live card"
url: /chronicle/2014/06/10/glassware-low-freq-live-card-gdk-mqtt/
tags:
- IoT
---

You know I heart the MQTT. A lot of my sensor stacks are built with MQTT and I've been known to use the protocal in some pretty harsh conditions.

Given it's footprint and overall performance it seemed like a natural fit to use on Glass. I'd already created Mirror API bridges to MQTT and that fits most of my non-realtime use cases. However, sometime you just want something a little more frequent. So, I coded up the smallest example I could think of using the low frequency live card pattern for Glass using the Glass Developement Kit (GDK). Here's a shot from Glass of the action (and yes, it was a 104.5 outside...it's a little toasty :-)

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2014/06/screenshot-20140609-obs-throughglass.jpg" alt="throughtglass - testing the app">

For all the code, visit the sample on Github: [justinribeiro/glass-gdk-lowfreq-mqtt-live-card](https://github.com/justinribeiro/glass-gdk-lowfreq-mqtt-live-card)
