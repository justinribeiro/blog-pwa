---
tags:
- mqtt
- Makerbot
date: 2012-09-05T00:00:00Z
description: "I wanted a web status panel for our Makerbot. I decided to build one."
title: "Getting Makerbot status on the web with MQTT, pywebsocket, Eclipse Paho and HTML 5 web sockets"
url: /chronicle/2012/09/05/getting-makerbot-status-on-the-web-with-mqtt-pywebsocket-eclipse-paho-and-html-5-web-sockets/
---

_If you're just looking for a live demo, check <a href="http://sv.3dprinting.status.s3-website-us-west-1.amazonaws.com/">Stickman's Makerbot Status</a> every so often; that printer is always printing something. Otherwise, read on._

A couple of weeks ago at the office, we picked up a Makerbot Replicator Dual for product prototyping. I'd seen them in action, but had never gotten a chance to put it through the paces. I decided it was time to dive in and bought one. We have an ongoing need to be able to test designs quickly so it seemed like a good fit. I was wrong; it was a great fit. It's been running non-stop for two straight weeks with no signs of stopping. Everyone loves it. I love it. The cool factor wears off, then all of the sudden the raw creativity hits overdrive and it's just seat-of-your-pants engineering.

The one thing I really wanted however, didn't seem to exist. I wanted the current build stats on the web. If I headed out and had an long print running on a Saturday, I wanted to be able to see how far long it was at the touch of my phone. I also wanted to be able to beat people to it, so I could run the next design. :-)

Since I'm not a fan of complaining and am a huge fan of open source, I decided to take on the challenge.

## Step 1: Getting intimate with ReplicatorG
<a href="https://github.com/makerbot/ReplicatorG">ReplicatorG</a> is available on GitHub, so I cloned the repo and started digging through. It's written in Java, uses some available drivers for your various 3D printers, and has a number of Gcode generating engines in it. If you're new to Java, ReplicatorG's source might seem hard but I didn't find it not too bad. It's actually quite an old code base, and you can see a lot of todo notes and "do this better" sort of comments, but it works well.

My original whiteboard concept was that I'd try to stay out of core code and write a plugin. This turned out to be less than ideal given the existing code base. The three main status indicators I wanted had callbacks (build status, progress, tooling temps), but a lot of the logging was setup to use java.util.logging.Logger, which would require me to write a more code than I wanted initially.

Start simple, go from there.

I decided in the end to add an "extras" menu along with a new MQTT preferences screen for setting your broker connection, a couple new classes to handle MQTT communications, and then place my hooks into the existing status update callbacks carefully.

<img src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2012/09/screenshot-20120905-mqtt-prefs.jpg" alt="My ReplicatorG build, with MQTT broker preference screen" title="My ReplicatorG build, with MQTT broker preference screen" width="755" height="761" class="alignnone size-full wp-image-1141" />

## Step 2: Getting familiar with Eclipse Paho
The <a href="http://www.eclipse.org/paho/">Eclipse Paho Project</a> has a fairly new Java client in their <a href="http://git.eclipse.org/c/paho/org.eclipse.paho.mqtt.java.git/">git repo</a> which I had never used. There are other Java libraries that can help you with MQTT communication, but I decided to jump into Paho in this case. I figured if I found some bugs, I can tack them to the tracker to help out.

Implementing the library is pretty simple. Clone the repo, edit the Ant task file as needed and issue your ant build command. Honestly, first build worked without fail and I had a working jar to use with my ReplicatorG project. I then implemented a MQTT communication class as per the documentation. If the documentation isn't enough and you're looking for a wiz-bang example of it's usage to learn from look no further than the <a href="http://mobilave.info/blog/2012/Quick_start_guide_for_the_Eclipse_Paho_Plug-in.html">Eclipse Paho Plugin source</a>.

## Step 3: ReplicatorG + Eclipse Paho, with a dash of GSON = talking bot
Once I had the form implemented, the prefs panels saving, and the bots status strings formatted into some slimline JSON via the ever awesome GSON library, we were good to go.

Except we weren't.

So, building ReplicatorG is not exactly the easiest of things. They make note of <a href="http://replicat.org/building-from-source">how to build the source</a>, including from Eclipse. I did get it working but it was a classpath nightmare on Windows. These are my straight notes to myself on how to make the build work on Windows such that any additional jar files added (which get picked up in the ant build) also get found by Windows.


* go into your source tree, head to build/windows/launcher
* install launch4j-3.0.0-win32.exe
* open build/windows/launcher/ReplicatorG.xml with Launch4j and add any additional jars to the classpath
* build the new ReplicatorG.exe, and then move it into build/windows/dist, replacing the old one
* build ReplicatorG from with ant dist-windows
* your golden


I'm sure someone will say "well of course you have to do that" but that wasn't exactly clear to me at first glance. Once the build is sorted with have a ReplicatorG talking with MQTT (in this case, our beloved <a href="http://mosquitto.org/">Mosquitto</a> broker).

## Step 4: A two way conversation with pywebsocket
Our ReplicatorG implementation isn't just a publisher, but actually subscribes to a specific topic so that it can send needed information back (especially when a new user connects to the web status page). To do this, I need the web socket to not only listen for MQTT messages to pass on, but also listen to for the web page status call so it can send a publish a message.

What to do? Bring in <a href="http://code.google.com/p/pywebsocket/">pywebsocket</a>, a Python implementation WebSocket server and extension for Apache. It's labeled for testing and experimentation which sounds good to me.  Combined with a the recent overhaul of the python MQTT client library from Mosquitto, and you've got a very easy to implement two way conversation.

## Step 5: Show me the money, er, Makerbot status
Just to recap, we now have ReplicatorG sending and listening for messages from our Mosquitto broker, which our websocket server is also connected to, listening and sending messages to it. Now all we have to do is build a web frontend. Piece of cake.

First, we get the great HTML5 Boilerplate project. Since I wanted something responsive and ready for mobile out of the gate, I used href="http://www.initializr.com/">initializr</a> to create a specific package saving me a bit of time. I then went ahead and wrote a small broker web socket class in JavaScript, created a small Ui class to handle DOM updates, init'ed the whole thing, and viola, we have data being pumped to the web!

<img src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2012/09/screenshot-20120905-matching.jpg" alt="Remote web frontend matching to the ReplicatorG build" title="Remote web frontend matching to the ReplicatorG build" width="897" height="873" class="alignnone size-full wp-image-1142" />

If you're running Firefox, Chrome, or Safari (either desktop or mobile versions) you'll get a pretty decent experience.

## Step 6: Screenshots are so 1997, show me a live demo!
You've seen the screenshots, maybe you jumped to the repo's, but it's always nice to see the it actually running.  So here you go:

<a href="http://sv.3dprinting.status.s3-website-us-west-1.amazonaws.com/">Stickman's Makerbot Status</a>

If the bot is running (solid chance it is), you'll get some status updates.

## Dealing with issues
The thing to keep in mind, is that I haven't ironed out all the kinks yet. Sometimes the web socket server dies, sometimes ReplicatorG loses the TCP socket, sometimes you have to restart ReplicatorG after a build (even if says it's sending messages), et cetera, et cetera.

Let's just call it an alpha. Or a pre-release. Something something. :-)

## The roadmap
This is an early release, something I've only been working on for maybe a week. It's useable, but I have some much grander plans:

* Model upload to S3, WebGL rendering of current print status (it makes the office giddy with joy on that one, we heart the WebGL)
* Multiple 3D printer display (some of the code is implemented, but not in use yet)
* Better console logging support from ReplicatorG to the web
* 3DprintersUnite.com, a sort of live map of 3D printers printing (I'm excited to see such a visualization...if people will at least use my build or I get my patches upstream)

## Set it up yourself

* Clone my ReplicatorG repo and build it
* Setup a Mosquitto server or use an existing MQTT broker
* Clone my ReplicatorG websocket server, change the server vars at the top of the file, run it
* Clone my ReplicatorG web status page, change the server vars in main.js, add Google Analytics code if you so please, build it, change the index.html js references at the bottom (I didn't have time to change the build script, sorry)
* Run your fresh ReplicatorG build, go to Extras menu, add MQTT settings, test, and save. Close ReplicatorG, re-open it, verify everything is sticking.
* Open the web status panel, see some data.
* Start a build in ReplicatorG, check the web status panel to see updates

## Questions, questions

### Why not the Mosquitto JavaScript library and skip the bridge?
It is true Mosquitto has a QoS 0 implementation of MQTT written in JavaScript and I initially looked into using it directly, but I found it faster (and a little more fun) to just write the bridge. It gives me a little more flexibility for the grandiose plans I have for even cooler ReplicatorG status page.

### Why not Rachet and PHP SAM?
Bad fit. The implementation requires two running loops on separate threads, and doing that in PHP is a nightmare. Secondly, I simply haven't had to time to bring PHP SAM up to date, and it's lacking proper observers, so it really was a no go situation.

### Why not just MQTT from the Makerbot directly?
I'd like to add an ethernet shield onto that bad boy, but I suspect the office isn't going to let me do that for a while. But it's on my list.
