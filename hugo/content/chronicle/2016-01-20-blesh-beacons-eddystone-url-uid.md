---
date: 2016-01-20T00:00:00Z
description: In my ongoing saga of getting beacons in a solid working state, I find a solution in Accent Systems.
title: Getting Blesh beacons to advertise Eddystone URL and UID
tags:
- Web
- IoT
---

In my ongoing saga of sorting out Blesh beacons, let's talk about advertising. Advertising in the beacon game says that over some given interval, I am a particular frame type. I might be Eddystone-UID, I might be Eddystone-URL, I might be an iBeacon.

How does one configure that with Blesh beacons? Blesh doesn't have much in terms of documentation and having dug through the characteristics, we stumble upon the very last characteristic I checked which says that its value is "Adv Mode". This looks promising.

Now, what the proper value I'm supposed to drop in I didn't know. So I looked up the actual chip manufacturer, Accent Systems. Turns out, Accent Systems has their own app in the [Play Store](https://play.google.com/store/apps/details?id=com.accent_systems.ibks_config_tool) and as you can see in screenshot number two, their app will tell you the relevant value (in my case, I want UID+URL, ala 06). Note this also gives you TLM for use with the Proximity Beacon API, so we're golden in all the worlds we want to be in (at least for the digital city demo I'm working on).

<img src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2016/01/ss-2016-01-20-1185x1958-bleshbeacon.png" alt="Adv Mode">

<img src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2016/01/Screenshot_20160120-171723.png" alt="Accent Systems set adv mode">

In the end, this immediately resolves the problem and now I have Physical Web covered as well as UID (though you'll have to do the battery pop + 15 seconds trick to put the beacon in configuration mode).

