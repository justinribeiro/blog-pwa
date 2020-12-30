---
date: 2015-04-28T00:00:00Z
description: Everyone needs realtime uplink traffic stats right?
title: Tracking uplink network throughput with SNMP to Firebase to Polymer
url: /chronicle/2015/04/28/snmp-firebase-polymer-wan-traffic-demo/
tags:
- Web
- IoT
---

With all the Firebase action this month, I couldn't just sit on the sidelines and write codelabs. I needed to write a little something something, something realtime. Why not network throughput from an uplink? Sure, I could swing that.

Working with SNMP data can be a bit burdensome. I decided to write the SNMP-to-Firebase bridge in Python, primarily because the very awesome [snimpy](https://snimpy.readthedocs.org/en/latest/) exists, which I've used in the past to pull SNMP data. The code for this is now available on Github:

* [justinribeiro/wan-snmp-to-firebase-bridge](https://github.com/justinribeiro/wan-snmp-to-firebase-bridge)

The setup instructions are in the README (I tested on Ubuntu LTS) and I've made a few basic assumptions to slim down the profile of the script (including not parsing ifDescr to determine other adapters). You could pull all kinds of data if you like.

Once we have our data flowing, we want to display it. I decided I'd write a little Polymer 0.8 since it's friggin' awesome. If you wrote Polymer elements on 0.5.x, 0.8 can be a bit of a departure (and higher suggest [reading the 0.8 documentation](https://www.polymer-project.org/0.8/) on the changes in 0.8). So I designed a basic Polymer element I call `bandwidth-gauge` that uses a little CSS3 half circle rotate trick to do our visuals. The code for this is available on Github:

* [justinribeiro/bandwidth-gauge](https://github.com/justinribeiro/bandwidth-gauge)

Finally, a lot of code means there must be a demo somewhere. Look no further:

* [https://wan-traffic-logger.firebaseapp.com/](https://wan-traffic-logger.firebaseapp.com/)

If the office uplink is pushing a lot of data during the day, it'll peak out just under 20MB/s. If it's not moving we're not moving much traffic on that line. :-)

And just because I have it lying around, the obligatory screenshot:

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2015/04/snmp-to-firebase-to-polymer.jpeg" alt="SNMP to Firebase to Polymer ... smooth as silk.">


