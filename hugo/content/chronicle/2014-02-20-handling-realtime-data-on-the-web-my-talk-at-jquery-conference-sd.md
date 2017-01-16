---
categories:
- real-time
- Glass
- jQuery
- talk
date: 2014-02-20T00:00:00Z
tags: []
title: 'Handling real-time data on the web: my talk at jQuery Conference'
url: /chronicle/2014/02/20/handling-realtime-data-on-the-web-my-talk-at-jquery-conference-sd/
---

Back in December, I submitted a talk to the folks over at the jQuery Foundation on handling real-time data on the web. You might be quick to say that you don't need jQuery for that and I would agree. However jQuery offers a lot more than just pushing around data, and I wanted to touch on that. Luckily my talk was accepted, and Ihad the oppurtunity to speak at [jQuery's Conference in San Diego](http://events.jquery.org/2014/san-diego/). The conference was great, with a great line-up of talks and an engaging audience.

Handling real time data on the web can be particually challenging these days. The merging of both understanding the backend performance and how design decisions affect how we implement the frontend is difficult to fit into 30 minutes, but I felt the talk went well. The video of the talk should be online shortly.

As always, I included a host of real time demos. One included an intergration with Google Glass, which myself and the lads have been developing software for since last June. The app sent real time data from Glass through a broker that ran back into presentation slides through a web socket. It worked rather well; real time demo's can always be tricky.

Along with the Glass demo, there was also a host of examples, such as sensor data from everything from Raspberry Pi's and Ardunios to 3D printers.

I also released a couple new open source projects, [jquery-websocket-callback](https://github.com/justinribeiro/jquery-websocket-callback) and [jquery-eventsource-callback](https://github.com/justinribeiro/jquery-eventsource-callback) which use the $.callback() features in jQuery to my great delight. $.Deferred() support is awesome when combined with real time data.

The [slides are available](http://cdn.cache.stickmanventures.com/presentations/jqueryconsd2014/index.html) as well.

I have a much more indepth post on why $.callback, in particular for websockets, can be quite awesome when dealing with pub/sub style topic lists from say an MQTT broker.
