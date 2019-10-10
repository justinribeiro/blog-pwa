---
tags:
- Google Glass
date: 2013-05-10T12:27:25Z
description: "It's hard to contain my excitement about Glass. Not wasting time, I started working on apps before I even have my pair."
title: "Ongoing work on Google Glass apps for M2M / Internet of Things connectivity"
url: /chronicle/2013/05/10/ongoing-work-on-google-glass-apps-for-m2m-internet-of-things-connectivity/
---

By some great stroke of luck, I was picked in the #ifihadglass round for Glass Explorers. I was in the middle of a EclipseCon and it was all too hard to hold in the sheer excitement. Bleeding edge probably is an understatement.

When the Mirror API docs were released, I started chipping away. Could I make it do real time patient stats? Kinda. Could I rework my concept to make it a little more in tune with what the Mirror API offered? Sure. But all great ideas start with smaller steps, and since I already had a body of M2M devices connected all over the place, it seemed to make more sense to start there. They had existing code bases, existing alert systems (I heart MQTT), and these all seemed like a solid fit for Glass.

## Piecing it together
So here lies the problem. I don't have my pair of Glass yet. But not having a device has never stopped me from developing software. What I need was an emulator that acted like the API (since you only get access to the API after you pick up your pair). Just so happens the very awesome <a href="https://plus.google.com/112336147904981294875/posts">Gerwin Sturm</a> developed an App Engine clone that acts like the API (<a href="https://github.com/Scarygami/mirror-api">https://github.com/Scarygami/mirror-api</a>).

From there, deploy the app to App Engine it's only a matter of setting up in the application to use the emulator end points. Fantastic!

## So...what am I working on
Couple of things (well, lots of things). Primarily on the Mirror API side, I'm working on an MQTT bridge that pushes data down to the device in as real time as I can get. The basic implementation looks like this (one of my older Arduino MQTT thermostat builds showing a temperature alert).

<img src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2013/05/screenshot-20130502-mirror-to-home-auto-bridge.png" alt="MQTT to Mirror API bridge test" />

On the hackable side (ala, native Glass apps) I'm working through my real time patient stats idea. The Mirror API could work for this, but it's not ideal. If you're looking for code on the native side right away, look no further than <a href="https://plus.google.com/116031914637788986927/posts">Mike DiGiovanni's</a> <a href="https://github.com/kaze0">Github projects</a>.

There are four other apps in the works, but they're all over the place (one of which is the photographic spotmeter, but I'll talk about that another time).
