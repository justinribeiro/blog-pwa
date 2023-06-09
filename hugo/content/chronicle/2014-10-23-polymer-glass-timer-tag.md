---
date: 2014-10-23T00:00:00Z
description: "Developing a connected Google Glass web tag has never been easier with Polymer."
title: glass-timer implementation in polymer
url: /chronicle/2014/10/23/polymer-glass-timer-tag/
tags:
- Web
- IoT
---

In preperation for my talks at DevFest, I decided to change my implementation of my onscreen timer. Originally, I had it built directly into the slides and I had a fairly pieced together solution. I wanted to simplify it as much as I could and re-use as needed.

Enter Polymer and a special build of mosquitto.

## Fast porting into Polymer

I'm not going to go over how I got Mosquitto broker to talk over websockets. If you really want to know, see my last blog post on the nitty gritty build details. Let's instead talk about Polymer.

I was up against the clock. I had two presentations to give and three hours of Polymer codelabs. I couldn't spend a great deal of time on building a fresh tag. Knowing I already had the basic building block of the timer done, I focused on porting what I had along with the Paho's JavaScript implementation.

## Setting the attributes

I knew that the tag needed to handle certain attributes:

1. Title in the template
2. Host information (hostname, port)
3. The broker topic to listen for
4. Debug flag (because I wanted to cut down on console chatter)

Doing this in Polymer is pretty simple:

{{< codeblock lang="markup" >}}
&lt;!-- Import Polymer --&gt;
&lt;link rel=&quot;import&quot; href=&quot;../bower_components/polymer/polymer.html&quot;&gt;
&lt;script src=&quot;mqttws31.js&quot;&gt;&lt;/script&gt;

&lt;!-- Define your custom element --&gt;
&lt;polymer-element name=&quot;glass-timer&quot; attributes=&quot;title host port topic debug&quot;&gt;
{{< /codeblock >}}

From there, we can set defaults:

{{< codeblock lang="javascript" >}}
Polymer('glass-timer', {
  title: 'Glass Timer',
  host: '',
  port: '',
  topic: '#',
  client: null,
  timeout: 3000,
  debug: false,
  // more things...
});
{{< /codeblock >}}

And I was off for with flying start. Now there are a lot more attributes that I could be handling (*cough* useSSL, cleanSession, timeout *cough*) but I figured I could always circle back later.

## Build a quick template

Templates are nice. It's even nicer when I don't have to wire them with 27 libraries. I stuck to the basic format I had previsouly which was designed with a layout boundry and was supposed to live in a reveal.js presentation:

{{< codeblock lang="markup" >}}
&lt;template&gt;
  &lt;style&gt;
    /* Create a Layout Boundary */
    #statpack {
      left: 10px;
      bottom: 10px;
      width: 250px;
      height: 100px;
      overflow: hidden;
      position: absolute;
    }

    #glass-status {
      position: relative;
      vertical-align: top;
      z-index: 30;
      bottom: 0;
      padding: 0.5em;
    }

    #glass-status h1, h2 {
      margin: 0.6em 0;
    }
  &lt;/style&gt;

  &lt;div id=&quot;statpack&quot;&gt;
    &lt;aside id=&quot;glass-status&quot;&gt;
      &lt;h1&gt;{{title}}&lt;/h1&gt;
      &lt;h2&gt;{{timer}}&lt;/h2&gt;
    &lt;/aside&gt;
  &lt;/div&gt;
&lt;/template&gt;
{{< /codeblock >}}

## Breath life into it with Paho JS

The primarly lib that makes this all come together is Eclipse Paho's JavaScript implementation: [Paho JavaScript Client](http://www.eclipse.org/paho/clients/js/). It handles all the heavy lifting, but we still need to wire it up.

{{< codeblock lang="javascript" >}}
Polymer('glass-timer', {
  title: 'Glass Timer',
  host: '',
  port: '',
  topic: '#',
  client: null,
  timeout: 3000,
  debug: false,
  created: function() {
    this.clientid = "glasstimer_" + parseInt(Math.random() * 1000, 10);
  },
  ready: function() {
    this.client = new Messaging.Client(
                    this.host,
                    parseInt(this.port),
                    this.clientid
                  );

    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.onMessageArrived = this.onMessageArrived.bind(this);

    //
    // For the sake of this example, we'll just define this here.
    // Ideally, this would be passed in as an attribute
    //
    this.options = {
        timeout: 3,
        useSSL: false,
        cleanSession: true,
        onSuccess: this.onConnect.bind(this),
        onFailure: this.onFailure.bind(this)
    };

    this.connect();
  },
  connect: function(){
    this.client.connect(this.options);
  },
  onConnect: function() {
    if (this.debug) {
      console.log("glass-timer: Connection Establisted to " + this.host + ":" + this.port);
      console.log("glass-timer: Subscribed to topic: " + this.topic);
    }
    this.client.subscribe(this.topic, {qos: 0});
  },
  onFailure: function(response) {
    if (this.debug) {
      console.log("glass-timer: Connection Failed, " + response.errorMessage);
      console.log("glass-timer: Attempting reconnection in" + this.timeout + "ms");
    }
    setTimeout(this.connect, this.timeout);
  },
  onConnectionLost: function(response) {
    if (this.debug) {
      console.log("glass-timer: Connection Lost, " + response.errorMessage);
      console.log("glass-timer: Attempting reconnection in " + this.timeout + "ms");
    }
    setTimeout(this.connect.bind(this), this.timeout);
  },
  onMessageArrived: function(response) {
    var ret_topic = response.destinationName;
    var ret_payload = response.payloadString;

    if (this.debug) {
      console.log("glass-timer: Message Arrived, topic:" + ret_topic + " payload:" + ret_payload);
    }

    // We're expecting a number from Glass
    if (typeof Number(ret_payload) === 'number'){
      var prettyTime = this.msToPretty(ret_payload);
      this.timer = prettyTime;
    }

  },
  // Let's just keep this simple, no fancy
  msToPretty: function(rawMs) {
    var ms = rawMs % 1000;
    rawMs = (rawMs - ms) / 1000;

    var secs = rawMs % 60;
    rawMs = (rawMs - secs) / 60;

    var mins = rawMs % 60;

    return mins + 'm ' + secs + 's ' + ms + 'ms ';
  }
});
{{< /codeblock >}}

Looks complicated? Nah, it's pretty straight forward. Let's break it down.

When our tag is created we generate a clientid on the fly:

{{< codeblock lang="javascript" >}}
created: function() {
  this.clientid = "glasstimer_" + parseInt(Math.random() * 1000, 10);
}
{{< /codeblock >}}

Then when things are ready, we connect:

{{< codeblock lang="javascript" >}}
ready: function() {
  this.client = new Messaging.Client(
                  this.host,
                  parseInt(this.port),
                  this.clientid
                );

  this.client.onConnectionLost = this.onConnectionLost.bind(this);
  this.client.onMessageArrived = this.onMessageArrived.bind(this);

  //
  // For the sake of this example, we'll just define this here.
  // Ideally, this would be passed in as an attribute
  //
  this.options = {
      timeout: 3,
      useSSL: false,
      cleanSession: true,
      onSuccess: this.onConnect.bind(this),
      onFailure: this.onFailure.bind(this)
  };

  this.connect();
}
{{< /codeblock >}}

The key takeaway here is that we use .bind(this) to make sure things remain bound and we don't lose this.

Everything else is simply the callbacks we need to listen for to handle the connections to the broker. onMessageArrived listens for messages from the broker. onConnectionLost tries to reconnect if things go south. And so on.

## Put it together and what have you got?

Once the tag is up and running, it's only a matter of importing and using it as needed:

{{< codeblock lang="markup" >}}
&lt;glass-timer title=&quot;Justin&#039;s Glass Timer&quot; host=&quot;MY_HOST&quot; port=&quot;9001&quot;
  topic=&quot;justin/device/glass&quot; debug=&quot;true&quot;&gt;&lt;/glass-timer&gt;
{{< /codeblock >}}

And then the magic happens as seen in the screenshot below.

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2014/10/screenshot-20141020-glass-action.jpg" alt="it's the final countdown" />

## All the code for your use

There are lot of things to fix and make better, but it took me less than an hour to port this into Polymer for the win. Honestly, it took me longer find my previous implementation notes. :-)

All the code is on github: Polymer [polymer-glass-timer-mqtt](https://github.com/justinribeiro/polymer-glass-timer-mqtt) tag and my [GDK MQTT Glass Timer](https://github.com/justinribeiro/glass-gdk-timer-mqtt) application. Powers combined, it makes for some nifty cool slides.