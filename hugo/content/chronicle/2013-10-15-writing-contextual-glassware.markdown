---
categories:
- Google Glass
- Glassware
date: 2013-10-15T00:00:00Z
title: Writing Contextual Glassware
description: "Information is only as good when useful for the user now."
url: /chronicle/2013/10/15/writing-contextual-glassware/
---

I've been writing lots of Glassware. Writing Glassware using the Mirror API is both addicting, powerful in context, and amazingly easy to integrate.

While I could sit here and reinvent the application wheel, I've started to look at Glassware and the things it sends to Glass as actionable in some state. A common example would be setting the temperature on my thermostat or being alerted that I should go down and switch the laundry. This is context that is important really only to me or the particular user targeted. That's a huge win in my opinion and one where Glass shines.

So what have I been building? Oh so many things. Since I've been posting a lot of these on Google+, let's hit the highlights.

## Farming, Irrigation and Glass
I haven't talked about it much, but pre-Glass I'd been working on a mesh sensor network designed for farming applications, primarily irrigation tracking. Seemed natural to hook up that data to Glass. The general idea is that Glass polls data from sensors that I've been working on, placed throughout the field that communicate via a mesh. Making a sensor of this type, something that penetrates deep enough into the soil based on root depth, is a fun challenge. My goal is something cheap and durable. That portion I'm still working on, but it's coming along.

<a href="https://plus.google.com/106603156529760508714/posts/1Q6pSWETnRp">Read the entire note on Google+.</a>

<img src="/images/blog/2013/10/20130909_181216_361_x.jpg" />

## Drive 2 Glass
The Drive API now has file watches and push notifications, so if I want to sync say images from a motion camera and have them pushed to Glass, I can do that using nothing but off the shelf scope and existing tooling.

<a href="https://plus.google.com/106603156529760508714/posts/3bDVKHi51uA">Read the entire note on Google+.</a>

<img src="/images/blog/2013/10/JustinRibeiro-MyGlass-screenshot_Drive2Glass_web_03.png" alt="JustinRibeiro-MyGlass-screenshot_Drive2Glass_web_03" />

## Yamaha A/V Receiver Control
I drove my wife crazy with this but I've written a piece of Glassware that switches the inputs on a recently purchased Yamaha A/V receiver.

Turns out the receiver has a web interface, which after some snooping around, is pretty wide open. Post the correct XML in the response body and you can make the receiver do pretty much anything you want.

I also used "post an update to" to be able to do this entirely with voice. Freakin' love it.

<a href="https://plus.google.com/106603156529760508714/posts/Vw4wsa82NLQ">Read the entire post on input control on Google+.</a>
<a href="https://plus.google.com/106603156529760508714/posts/axVAQeXQUHn">Read the entire post on voice control on Google+.</a>

<img src="/images/blog/2013/10/Screenshot_2013-08-19-08-22-36.png" alt="Screenshot_2013-08-19-08-22-36" />

## ReplicatorG and 3D printing alerts
I hack on ReplicatorG from time to time (I built a 3D printer web status panel implementation which I spoke about at Eclipsecon this year). I had code lying around, and this was low hanging fruit. :-)

<a href="https://plus.google.com/106603156529760508714/posts/1ZgQTNrTqt7">Read the entire note on Google+.</a>

<img src="/images/blog/2013/10/Screenshot_2013-07-08-15-46-40.png" alt="Screenshot_2013-07-08-15-46-40" />

## Contextual UPS notification
Below is a timeline card that gets generated when my computer at my home desk has the power plug pulled and falls back to the UPS battery. This is achieved using nothing more than a bash script that gets run when pwrstat determines bad things have happened (ala I pulled the power cable out) pinging a secure endpoint via cURL I've setup in my little Glass app that generates that timeline card.

<a href="https://plus.google.com/106603156529760508714/posts/4RywZsjZVU8">Read the entire note on Google+.</a>

<img src="/images/blog/2013/10/Screenshot_2013-07-12-14-00-39.png" alt="Screenshot_2013-07-12-14-00-39" />

## Contextual data based on router connection
This is based on an older DD-WRT startup script I had laying around, basically interval checks for a connected mac, and if seen, pings my local house api and sends assorted contextual data now that I'm home from other services (ala a wife submitted task: "please switch the laundry").

<a href="https://plus.google.com/106603156529760508714/posts/Z4WagMMMFBH">Read the entire note on Google+.</a> | <a href="https://gist.github.com/justinribeiro/6076466">Github Gist</a>
