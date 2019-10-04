---
date: 2016-09-19T00:00:00Z
description: Imagine a world where I can plug things in, have them alert me they are nearby and let me interact with their locally served progressive web app. It could happen
title: Controlling home devices with the Physical Web and Progressive Web Apps
url: /chronicle/2016/09/19/pwa-physical-web-and-your-home/
tags:
- Web
---

The Internet of Things is a mess. Yep, I said it. I know you've thought it but maybe not said it. Devices for all their usefulness can be utterly frustating when you have to go through the find-me-use-me dance:

1. I need this app from this store. Downloading....
2. Wow, that looks like something from 2012. Why is the text so small?
3. Humm, can't find the device.
4. Where is my router login?
5. Yep, I see you in the DHCP logs.
6. Direct input of IP into app.
7. Spinner....spinner.....spinner frozen
8. Hey I can control the device (maybe)

That above isn't even a hypothetical: it's the pain stacking series of events I recently went though with a Blu-Ray player. Yeah, a Blu-Ray player.

I know what you're going to say: put disc in, play movie. But that's not the point. I hate remotes. The device hates remotes (which is why the manufactor is saying plastered on the box "Look at our cool control app!").

User experiences for devices with API and embedded web servers could be a amazing. Flow me on a magical journey where we talk about the future.

## What if devices just told us via the Physical Web?

In a perfect world devices just tell me they exist near me. I don't need your native app, I don't need to find an IP address: things just work.

Luckily we have the up-and-coming wonderfulness that is the [Physical Web](https://google.github.io/physical-web/). I heart the Physical Web and when I'm not handing out beacons, I'm using them myself. The case I propose isn't far outside of many of the examples you'll see on the page.

You see, in a perfect world of increasingly cheap and updatable hardware would it not be lovely if the audio visual receiver that powers your TV just told you it existed? No app to download, just the local IP of that device that serves it's own little progressive web app for you to use.

The funny thing is, how close are we really to that idea? Not to far: even my old Yamaha A/V receiver serves it's own web control app (outdated and not updated, but that could be overcome).

That's the world I want to live in. Because it requires less to do. But it has to work better and seamless and the Physical Web can jump that divide.

## It's easy to download a native app Justin

No it's not. Not for the babysitter who comes over to watch my kids and wants to control the TV (or frankly anything in my house they may want to use).

The temporary user doesn't care about the native app; they just want something nearby to work and if they're on my local network (which if you're in my house, the creds are an NFC tap away at the door), then chances are you can control things without the native app for 20 devices that exist.

## Sample case: the great A/V receiver PWA

I've chosen an A/V receiver primarily because that's what I've been working on lately. It's not an unknown to me; I had reversed the POST commands from Yamaha's web panel a while back (DevTools is your friend), so I knew I could make the receiver respond to commands.

The kicker is the case above is legitally the one I wanted to overcome, albeit I didn't necessarily want to swap the firmware off the device, add Eddystone or a better web server (I suppose that's for another day).

The basic approach I started with was to simply:

1. Add Physical Web beacon to receiver pointed to locally served PWA.
2. Run PWA on small web server in house.
3. People visit house and use device.
3. Profit.

From a technology standpoint, this is not rocket science. I'm just bolting on existing and new things to some devices I already have in the house. Again, in my perfect world, devices do this themselves.

As such I generated this setup (seen here testing the night before locally just to get the juices flowing):

<iframe width="560" height="315" src="https://www.youtube.com/embed/PjnPgfUGlgI" frameborder="0" allowfullscreen></iframe>

One polymer init, a couple imports, and a quick api wire up as a web componenet later and I'm rocking. It's amazing what you can do at 1am.

## You can do this manufacturers
Why show the simple sample above? Because it was rudimentary to implement the required functionality. If I can swing it in an hour, surely you can o-magical device manufacturer?

From a device manufacturer standpoint, given the increasingly awesome IoT base platforms to build products on, you can indeed pull this off. I know you can. You have many of the subsystems needed to not only serve your PWA or broadcast an Eddystone-URL, but to update that app as well.

You've got the API, you've got the hardware, now let's bring a better user experience to so many users out there.

I believe in you.

## Random Notes and Thoughts

1. Remote controls are easier, but damn if I can sort the 27 of them we have floating in the house at this point. I'm positive I have one from a TV I used to own in college. Why, beats me.

2. "Remotes are for old people." I love young people and their notions that at 36 I'm old.

3. Damn it, I'm 36. Totally forgot that until just now.

4. Yeah, security. I know. We'd have to talk about it (but we can sort that out).

5. For something like an A/V receiver, there are a lot of moving parts. Most of the apps I've tried don't hold the state of those configurations. My labels are not my wife's labels are not my guests labels for inputs for instance. Data lives in it's little silos and it's a horrible experience. What was lost was understanding what the user would actually want to accomplish and even when apps exist they fall short because data and the sharing of the data or even state is still important (and can't be ignored).

6. Lost track of how many times I've re-labeled the inputs in the Yamaha app. Ugh.

7. Did not push repo this morning. Will push Yamaha sample this week.