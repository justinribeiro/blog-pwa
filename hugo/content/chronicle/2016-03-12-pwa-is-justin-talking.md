---
date: 2016-03-12T00:00:00Z
description: Because you know you just want to know when I am talking all the time.
title: "New Progressive Web App: Is Justin Talking?"
tags:
- Web
---
I've been really bad lately about updating my talk list. It's one of thise things that boils down to a matter of time; I spend most of it actually coming up with the talks and less so advertising after the fact.

To remedy this problem I decided it was time to build a progressive web application to not only get myself back into the habit of adding my slidedecks to the proper locations, but also to actually give just play more with progressive web apps (hashtag #pwa2016).

The result: [Is Justin Talking?](https://is-justin-talking.appspot.com/), a progressive web application that I tie to a Physical Web beacon that I carry with me to not only help advertise my talk, but also distrbute slides.

As you can see, it's pretty minimal but gets the job done:

<img src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2016/03/pwa-isjsutintalking.jpg" alt="Justin is talking, the PWA version">

The building blocks are straight forward:

* Uses HTTP/2 Push for Google App Engine based on [Chrome http2push-gae](https://github.com/GoogleChrome/http2push-gae)
* Uses Service Worker and Push API via [Polymer Platinum Elements](https://elements.polymer-project.org/browse?package=platinum-elements) `platinum-sw` and `platinum-push-messaging`
* Uses Firebase to store subscriberIds so that you can push messages.
* Deploy to Google App Engine and then assign url to a [Physical Web beacon](https://google.github.io/physical-web/).

All the code is [available on Github](https://github.com/justinribeiro/is-justin-talking) if you'd like to run your own version of it.