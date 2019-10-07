---
tags:
- m0n0wall
- Comcast
- SMC8014
- setup
date: 2009-10-15T00:00:00Z
description: The SMC8014 doesn't have a bridge mode and you want to use m0n0wall...this
  is how.
tags: []
title: Setting up a static IP with bridge mode for SMC 8014 and m0n0wall
url: /chronicle/2009/10/15/setting-up-a-static-ip-with-bridge-mode-for-smc-8014-and-m0n0wall/
---

Recently I made the switch from AT&T DSL to Comcast Business Class Internet. I had not been a fan of Comcast for some time, after very poor experiences with them in both Seattle and San Francisco.  But after repeated attempts to resolve serious line issues with AT&T engineers (they tried very hard, it was simply a matter of them not wanting to dig up half the neighborhood) I had no choice but to look for a more reliable connection.  Comcast Business was the only option at hand and to their credit I've had a much better experience initially.

The technicians braved the storm and setup the line, and I had a shiny new SMC 8014 modem with an assigned static IP running in no time flat.

The SMC 8014 has some features; it has a firewall, you can do port forwarding, static routing, some basics.  Given that I have a perfectly good setup of m0n0wall on a Soekris Net4521 I was going to pass it up and set the SMC up as a bridge.

First thing is first: lets log in.  The techs didn't give me the connection username/password combo for the SMC, so for those on Comcast in a similar situation:

IP: 10.1.10.1
Username: cusadmin
Password: highspeed

Once you log into the SMC, you will note that there appears to be no way to setup said device as a bridge.  You can route, but I don't want to route.  Apparently, said device does what some people refer to as a "smart bridge" where you simply setup the target firewall with the static IP details, and the SMC after a few minutes figures out that you don't want it to operate as a firewall/router and switches into said bridge mode.

So hop on over to your m0n0wall config.  Under Interfaces, select WAN.  Set the type to Static and enter in the IP address that Comcast gave you.  If they didn't give you the gateway, it's simply +1 to your IP  (example: static IP is 10.10.10.10, your gateway would be 10.10.10.11).  Some people question where to put in the subnet (example: 255.255.255.252); m0n0wall uses CIDR (Classless InterDomain Routing) notation (you can read about it in the <a href="http://doc.m0n0.ch/quickstartsoekris/#id11570301">manual</a>) which many people won't recognize.  If you have a look at the manual, you'll note that my example subnet of 255.255.255.252 equals /30, which you select next to the static IP address you put into place.  Click Save.

Now, you'll need to set some DNS servers under System > General setup in the section called DNS Servers.  I'm not using Comcast's DNS (<a href="http://www.opendns.com">OpenDNS </a>works well), but once you enter your DNS details here, click Save.

At this point you should be able to surf the web as normal, or after a few minutes once the SMC figures out you don't want it doing anything.  I also went about disabling as much of the firewall and related options as the SMC allows, so it won't conflict or get in the way of my traffic to the m0n0wall device.

Once this was setup and working, I was able to connect to my existing VPN on the new static IP without the SMC getting in the way.  While it's not what I would consider a true bridge, it seems to work fine in my initial testing.




