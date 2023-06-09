---
tags:
- arduino
- mqtt
- mosquitto
- Google Glass
date: 2013-07-07T00:00:00Z
description: "I had a spare hour, so why not get Google Glass controlling my network connected Arduino? Let's do it!"
title: "Weekend fun: Google Glass controlling a network connected Arduino"
url: /chronicle/2013/07/07/weekend-fun-google-glass-controlling-a-network-connected-arduino/
---

With the kids asleep, I decided it was time to start writing some Glassware that would hook to M2M and Internet of Things related devices. The Mirror API works rather well for this senario, so I knew this wouldn't be very difficult and would be a bit of fun.

## Use what you got: my development thermostat

Since I always have my development thermostat on my desk (which is a clone of what runs my first and second floor in my house), I already had a working hardware setup. The hardware is nothing exotic; an Arduino Uno, an ethernet shield, some LEDs to show the state, a TMP36 sensor (which is what I use in the zone device in the rooms around the house), and some relays (which in prod, control the HVAC).

The software that runs on the Arduino is rather simple; using MQTT subscriptions from the local broker, it listens for commands and responds accordingly. The local server contains the rulesets that control temperature in the house, using the zone sensors in various rooms. If you're in the house, you can control the HVAC from any smartphone, tablet, TV or computer using the responsive web interface (though you shouldn't need to).

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2013/07/screenshot-20130603-thermocontrol-internal-aurora.jpg" alt="Development panel of Home Zone system" />

For those interested, the web interface is powered by web sockets allowing you to see the current status of things quickly (in the snap above the panel running in devel mode; sensors in prod only update every 30 seconds).

## The outlier case: the house is melting
Why allow Glass to control the thermostat? The better question, why not? :-) Let's pretend that something has gone horribly wrong and my home automation has failed. I've missed a case, and the system has sent an SOS and requires action.

Using the Mirror API makes life easy for this case, but we have to listen for our response from Glass. This requires a subscription, which in turn requires an SSL secured callback URL. Since I was doing this at midnight on a Saturday night, I didn't feel life setting that up. For development purposes, you can use the subscription proxy that Google provides (see: <a href="https://developers.google.com/glass/subscription-proxy">https://developers.google.com/glass/subscription-proxy</a>).

Our callback url will basically send the proper message to our MQTTd broker based on the payload from Glass, at which point, if it matches on the subscribed topic on the Arduino, the Ardunio will trigger the proper relay.

In the video below, I create an error condition, forcing the Arduino to trigger an alert. Since I had already authenticated to my Glassware and have an existing subscription, I can now simply use my existing credentials and create a timeline card with the alert data and add a custom menu option with something to do. In this case, the server determines that I probably want to set the AC on, and offers me the suggestion. I select on Glass, it triggers the callback url, and then sha-bam, AC relay on Arduino triggered!

## Enough talk, show me the video!
_Can't see the embed? <a href="http://www.youtube.com/watch?v=RzESklDsjMg">Watch on YouTube</a>_

<iframe width="640" height="360" src="//www.youtube.com/embed/RzESklDsjMg?rel=0" frameborder="0" allowfullscreen></iframe>

## Why not speak the temperature?
You could use the REPLY menu option, which would take voice which you could then parse from the payload sent to the contact, but that's not really how my thermostat and zone systems work (nor is REPLY supposed to be used for specific keywords according to the Mirror API documentation). You could of course make it work.

## Scratching the surface
This is both a brief and simple example; you could spin this a number of ways. That's the beauty of the Mirror API; it's really really quick to implement and get it talking. Onward!
