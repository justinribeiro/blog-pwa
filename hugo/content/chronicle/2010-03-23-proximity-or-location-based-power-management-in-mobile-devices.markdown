---
tags:
- context
date: 2010-03-23T00:00:00Z
description: Why does my device know where I'm at, but not power down when needed?
title: Proximity or location based power management in mobile devices
url: /chronicle/2010/03/23/proximity-or-location-based-power-management-in-mobile-devices/
---

One of the great things about most modern mobile devices is that there is a tenancy for everything to come stock with GPS, wifi, and bluetooth.  The one thing that annoys me is that these things generally run all the time by default, which drains battery life and usable time.  My iPhone 3G for example won't last a day in use without a mix matched turning off of these components and dimming of the screen, et cetera.  iPhone aside, most other mobile platforms, from Android devices to netbooks, suffer these same ills.

What I would like to see built stock in the power management interface of the mobile device realm is a location based or proximity based power management features.  Let me explain.

When I arrive home, the first thing I generally do is turn off my bluetooth, GPS and 3G and turn on the wifi.  I'd love to automate this based on where the my device is.  Maybe the GPS kicks grabs a signal and checks it location, running scripted actions for the desired location.  My house isn't moving, nor is the office, so within a the general area it would know what device services to enable and disable.

This isn't a new idea; Muhammad Abdullah Adnan at UC San Diego wrote a project paper titled (warning, PDF) <a href="http://mesl.ucsd.edu/gupta/cse237b-f09/ProjectReports/ProximityPowerAdnan.pdf">Proximity Based Power Management in PC using Bluetooth Mobile</a>) that talks about using a mobile phone to signal to a PC when to go into power saving (and wake up).  I can think of a fair number of ways to carry out the same end game, from GPS locations, to bluetooth pairing, to wifi connected network, to tower triangulation, all of which could tell where you're located.

How could you do this today?  Having been reading and playing with Android recently, most of the API's that are offered would make such an application easy to write (you can pretty much disable/enable anything you like, and the addition of background applications makes it an exercise more than a project). <a href="http://www.latedroid.com/2010/01/juicedefender.html">JuiceDefender</a> with the UltimateJuice add on offers some location based battery saving tips, and is currently the closest thing I've seen to the type of control I'm looking for.

The iPhone stock just won't fly, but on my jailbroke 3G, you can almost get there with SBsettings and <a href="http://www.iclarified.com/entry/index.php?enid=7672">SBschedule</a>.  Note, SBsettings aren't proximity or location based, but it's not much of a jump to add feature to the scripting of toggles into those profiles. I have no doubt such an app could be written for the iPhone, but I have no want or need to play in their walled garden these days.

In the time of let's be more nature friendly and when even the average consumer begins to do more with their mobile devices, the question I suppose is not a question of why, but rather a waiting game of when such functionality will become the norm in our everyday mobile lifestyles.  Would a power scheme setup such as this be too confusing, or could it help the power hunger devices of the day last a little longer?
