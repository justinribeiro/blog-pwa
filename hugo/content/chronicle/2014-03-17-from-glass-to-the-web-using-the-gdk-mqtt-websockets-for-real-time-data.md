---
tags:
- gdk
- javascript
- mqtt
- google-glass
date: 2014-03-17T00:00:00Z
title: "From Glass to the web: using the GDK, MQTT, and websockets for real time data"
url: /chronicle/2014/03/17/from-glass-to-the-web-using-the-gdk-mqtt-websockets-for-real-time-data/
---

During my talk at jQuery Conference in San Diego, my slides had a real time countdown timer that was being fed from Google Glass through a websocket. Overall it worked pretty well (the conference wifi was very well done which helped the entire process go without a hitch). Let's walk through to accomplish this.

## Expanding the Timer GDK example with MQTT + Eclipse Paho
Building Glass applications with the GDK is a lot like writing applications for Android, except for a very different UI and UX use case. Since we're working Java we can integrate [Eclipse Paho](http://www.eclipse.org/paho/) to give our application MQTT support and use that to send messages to our broker.

I considered writing the timer purely from scratch, but I was a little short on time. Instead I forked the existing Timer GDK example and added a very simple hook to a broker: [glass-gdk-timer-mqtt](https://github.com/justinribeiro/glass-gdk-timer-mqtt). While retaining all the features of the existing example, it adds the simple sending of the remaining time from Glass to the broker from the getRemainingTimeMillis method. You can look at the project, but the basic barebones MQTT connect and send is as follows:

{{< codeblock lang="java" >}}
if ((client != null) && client.isConnected()) {
  // no need to fire up our client, we're good
} else {
  try {

    // File persist not working on Glass
    MemoryPersistence persistence = new MemoryPersistence();
    client = new MqttClient("tcp://mybroker:1883", "Justin-Glass" persistence);

  } catch (MqttException e1) {
    Log.e("JDR_GLASS_TIMER", "Client error", e1);
  }

  try {

    // Connect to the broker
    client.connect();

  } catch (MqttSecurityException e) {

    Log.e("JDR_GLASS_TIMER", "Client connect security error", e1);

  } catch (MqttException e) {

    Log.e("JDR_GLASS_TIMER", "Client connect general", e);

  }
}

// Safety first Shaun
if ((client != null) && client.isConnected()) {
  MqttTopic topic         = client.getTopic("/justin/glass");
  String    sendtobroker  = String.valueOf(remainingTime);

  MqttMessage message = new MqttMessage(sendtobroker.getBytes());

  // F%^&* it, if it doesn't get there, we're cool with it
  message.setQos(0);

  try {

    // send the message to the broker
    topic.publish(message);

  } catch (MqttException ex) {

    Log.e("JDR_GLASS_TIMER", "That message did not send!", ex);

  }
}
{{< /codeblock >}}

As you can see, this does only one thing in addition to all the reset that the timer does on Glass: it takes the remaining milliseconds and sends it to our broker on the topic /justin/glass.

The one gotcha in this setup is the MemoryPersistence for Paho. By default, Paho will use FilePersistence and if you've used Paho on Android before you know that this works fine. However, even with the proper set of manifest permissions FilePersistence would not work and I had to switch over to using MemoryPersistence. This doesn't take a huge toll in this case (for that matter, sending MQTT messages didn't greatly impact the performance of Glass at all), but it's something to keep in mind.

## Building the websocket with pywebsocket
The days, you've got a lot of options on the MQTT to WebSocket front. IBM and HiveMQ's commercial brokers support it out of the box and on the open source front you can hook Mosquitto throught mod_websocket or WSS. For me, the easiest and fastest way is to simply use the Mosquitto python libs (which are now part of Paho) and use pywebsocket. The reason I like pywebsocket is that it's usually on the edge in terms of websocket implementation which makes it a great reference when testing new features.

Setting up the websocket is pretty straight forward; the entire script is located in [my glass_wsh.py gist](https://gist.github.com/justinribeiro/9669113), but the barebones send is located as such:

{{< codeblock lang="python" >}}
def onMessage(self, mosq, obj, msg):
  if _status_ == _OPEN_:
    try:
      string = json.dumps({"topic": msg.topic, "message": msg.payload})
      self.socket.ws_stream.send_message(string)
    except Exception:
      # catch me
      return
{{< /codeblock >}}

Basically our onMessage callback is listening for messages from the broker and then sends them through to the websocket for action.

## Connecting it to the slides with jquery.websocket.callback
As part of my presentation, I released [jquery.websocket.callback](https://github.com/justinribeiro/jquery-websocket-callback) as a easier way to handle websockets via jQuery's $.callback() api. Having talked to some of the jQuery folks apparently I'm one of the few people to actually use $.callback() outside of jQuery (internally it's used for $.ajax() and $.Deferred() components) and that to me is unfortunate because it's pretty flippin' awesome. This works nicely with a pubsub / observer pattern topic system, as we can use the topic list to hook to various topics from the broker (on the assumption that we're returning the messages' associated topic from the broker in our frame).

In the case of hooking to our Glass topic, we're not doing anything special (though a binary frame given the data type would make sense for a more long term production use...but I don't think we're streaming Glass countdown timer data 24-7 :-). We simply connect to our broker, set some default topics we want to subscribe to, and define the methods to handle those callbacks:

{{< codeblock lang="javascript" >}}
JDR.glass.ws = $.websocket({
    url: "ws://socketserver:8899/glass"
});

JDR.glass.ws.topic( "websocket.onOpen" ).subscribe( JDR.glass.onOpen );
JDR.glass.ws.topic( "websocket.onMessage" ).subscribe( JDR.glass.onMessage );
{{< /codeblock >}}

Our Glass methods in the subscribe callback are straightforward:

{{< codeblock lang="javascript" >}}
JDR = {
  utils: {
    // Let's just keep this simple, no fancy
    msToPretty: function( rawMs ) {

      var ms = rawMs % 1000;
      rawMs = (rawMs - ms) / 1000;

      var secs = rawMs % 60;
      rawMs = (rawMs - secs) / 60;

      var mins = rawMs % 60;

      return mins + 'm ' + secs + 's ' + ms + 'ms ';
    }
  },
  glass: {
    ws: null,
    glassUpdateDomElement: null,
    onOpen: function ( value ) {
      console.log("we're open for business");
    },
    onMessage: function ( value ) {

      var obj = jQuery.parseJSON(value);

      if (typeof Number(obj.message) === 'number'){
        var prettyTime = JDR.utils.msToPretty(obj.message);
        JDR.glass.glassUpdateDomElement[0].textContent = prettyTime;
      }

    }
  }
};
{{< /codeblock >}}

Nothing super hard going on here, we're just updating our target DOM object with some data. You can further make this more performant by using a layout boundry to make sure that you're not janking the heck out of your slides by updating every 500ms - 1s:

{{< codeblock lang="css" >}}
/* Layout Boundary for updating Glass stat pack */
#statpack {
  left: 10px;
  bottom: 10px;
  width: 250px;
  height: 100px;
  overflow: hidden;
  position: absolute;
}
{{< /codeblock >}}

While a single ticker may not be the most impactful thing to your rendering performance (and it wasn't on my Pixel when I gave my talk), that simple bit of code drops the recalc and paint from from 2.1ms to 0.5ms. Performance matters people.

## Powers unite!

With all the moving pieces, we now should have time being updated on our slides from Glass through this magical loop. Real-time data for the win.

My talk video isn't out yet from jQueryCon, but when it does I'll add the link to this post and you can see said demo in action. In the mean time, here's a quick #throughglass snap of me testing the slides just before I did my talk.

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2014/03/20140213_130207_496_x.jpg" alt="Glass to Slides for the win" />