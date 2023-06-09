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

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2014/06/screenshot-20140609-obs-throughglass.jpg" alt="throughtglass - testing the app">

For all the code, visit the sample on Github: [justinribeiro/glass-gdk-lowfreq-mqtt-live-card](https://github.com/justinribeiro/glass-gdk-lowfreq-mqtt-live-card)
