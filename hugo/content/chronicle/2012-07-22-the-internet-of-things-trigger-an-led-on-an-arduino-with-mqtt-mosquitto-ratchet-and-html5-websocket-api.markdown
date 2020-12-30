---
tags:
- iot
- arduino
- mqtt
- maker
date: 2012-07-22T00:00:00Z
description: "The Internet of things is here and now. Let's create a system to trigger an LED on an Arduino with MQTT, Mosquitto, Ratchet, and HTML5 WebSocket API."
title: "The internet of things: trigger an LED on an Arduino with MQTT, Mosquitto, Ratchet, and HTML5 WebSocket API"
url: /chronicle/2012/07/22/the-internet-of-things-trigger-an-led-on-an-arduino-with-mqtt-mosquitto-ratchet-and-html5-websocket-api/
---

If the title didn't scare you off, congratulations! You too may want to automate something. What I'm doing is garden and home automation; you could reasonably do pretty much anything you wanted with this (and it's probably a bit overkill, but it really is an elegant system). Where to start? Let's trigger an LED to blink based on a broadcast message. Anything with flashing lights right?

## The parts
We're going to need a few things to make all this work, so let's have a look at the parts we're going to use:

1. A MQTT broker server to handle publish and subscription.
2. An Ardiuno with an ethernet shield and a basic three LED setup.
3. A websocket service to handle requests and publish them to the broker
4. A little JavaScript to talk to the web socket service.
5. Glue to make it all work together.

All the code I use I've made available on <a href="https://github.com/justinribeiro/justinribeiro.com-examples/tree/master/IOT-trigger-led-MQTT-WebSocket">github</a>.

## Why MQTT and not XYZ protocol?
<a href="http://mqtt.org/">MQ Telemetry Transport</a> is a lovely little protocol, very lightweight, ready for the internet of things. IBM and Eurotech came up with it, it's public domain, royalty free, and it's part of the <a href="http://eclipse.org/paho/">Eclipse Paho M2M messaging project</a>. You've probably indirectly used MQTT and never realized it (example: <a href="http://www.facebook.com/notes/facebook-engineering/building-facebook-messenger/10150259350998920" title="Building Facebook Messenger">Facebook Messenger</a>).

## Step 1: setup our broker / web socket server
For the sake of simplicity, I'm going to use a t1.micro instance on Amazon Web Services with the stock Amazon AMI to start. That instance is going to play two roles; one, it'll host our broker, and two, it'll host our web socket server. You could very well do this locally as well.

Let's start by setting up the broker server, <a href="http://mosquitto.org/">mosquitto</a>. Mosquitto is an open source MQTT broker and for my use case here works perfectly well. To install on our AMI, we'll need to add the repo first:

{{< codeblock lang="bash" >}}
sudo wget http://download.opensuse.org/repositories/home:/oojah:/mqtt/CentOS_CentOS-6/home:oojah:mqtt.repo -O /etc/yum.repos.d/home:oojah:mqtt.repo
{{< /codeblock >}}

Now, install mosquitto (and a few helpers) via yum:

{{< codeblock lang="bash" >}}
sudo yum install mosquitto mosquitto-pub mosquitto-sub
{{< /codeblock >}}

Now we're going to install PHP, which is required for Ratchet which is going to drive our web socket server.

{{< codeblock lang="bash" >}}
sudo yum install php
{{< /codeblock >}}

If you're doing this on AWS we're going to have to make sure that the security group we assigned the instance to has the proper ports open. For Mosquitto (or any MQTT broker) port 1883, for our web socket server we're going to go with 8899 (you could make that anything you wanted really).

## Step 2: Testing the broker server

Head over to the <a href="http://mosquitto.org/download/">downloads</a> for Mosquitto and find the proper version for you system. Having mosquitto-pub and mosquitto-sub will allow us to test the broker end of our server now without the web socket service.  Once you have it installed, let's fire up some tools!

In the SSH window for the AWS instance, let's start mosquitto with the default configuration:

{{< codeblock lang="bash" >}}
[ec2-user@ip-10-XXX-XXX-XXX ~]$ mosquitto
1343013211: mosquitto version 0.15 (build date 2012-06-07 07:29:57+0000) starting
1343013211: Opening ipv4 listen socket on port 1883.
1343013211: Opening ipv6 listen socket on port 1883.
{{< /codeblock >}}

At this point, you'll notice it just sitting there. This is fine for testing; we'll be able to see connect/disconnect messages as clients connect.

Now, on your desktop, open up a command line (in my case cygwin bash), and let's subscribe to the action on that server using the public DNS name of our AWS instance:

{{< codeblock lang="bash" >}}
mosquitto_sub.exe -h ec2-XXX-XXX-XXX-XXX.us-west-1.compute.amazonaws.com -t \\# -v
{{< /codeblock >}}

After running that command, you won't see anything yet (we haven't published anything!), but if you look at back at your SSH session you should see your connection:

{{< codeblock lang="bash" >}}
1343013777: New connection from 173.XXX.XXX.XX.
1343013777: New client connected from 173.XXX.XXX.XX as mosq_sub_6620_.
{{< /codeblock >}}

Now, let's publish something. Open another command line, and send along something to the broker, which will show another connection, which will publish to your subscription window:

{{< codeblock lang="bash" >}}
[justin@home ~]$ /path/to/mosquitto_pub.exe -h ec2-XXX-XXX-XXX-XXX.us-west-1.compute.amazonaws.com -t "something/something" -m "Hi let us send chars"
{{< /codeblock >}}

That command will return pretty quick like, you sub command line should now show that message:

{{< codeblock lang="bash" >}}
[justin@home ~]$ /path/to/mosquitto_sub.exe -h ec2-XXX-XXX-XXX-XXX.us-west-1.compute.amazonaws.com -t \\# -v
something/something Hi let us send chars
{{< /codeblock >}}

Your SSH broker command line will now show a pub connection:

{{< codeblock lang="bash" >}}
1343013934: New connection from 173.XXX.XXX.XXX.
1343013934: New client connected from 173.XXX.XXX.XXX as mosq_pub_6720_.
{{< /codeblock >}}

If you've got all that running, congrats, your broker is working smoothly.

## Step 3: Setting up a web socket server with an MQTT hook

Web Socket implementations are aplenty at this point. Pick a language, someone has an implementation. In my case, I wanted to play with <a href="http://socketo.me/">Ratchet</a>, a PSR-0 compliant PHP websocket implementation I'd never used. This would also give me a chance to play with <a href="http://getcomposer.org/">Composer</a>, a PHP dependency manager, which I haven't used very extensively (one line review based on this experience: it's very nice).

The nice thing about Rachet, is that for this small test, their chat example is just about all we need. However, we need an MQTT hook. Like a good protocol should, there are library's aplenty available that allow you to send and receive MQTT messages. In PHP's case, we have <a href="http://project-sam.awardspace.com/">SAM, Simple Asynchronous Messaging for PHP</a>.

You can install SAM from PECL, but that would require a compiler and the truth is we don't need those other parts of SAM. We also need to patch SAM to make it work with better with Mosquitto.  The talk about this, as well as the patch, is on the <a href="http://mqtt.org/wiki/doku.php/php_sam">MQTT wiki page for SAM</a>. Or you can just pull it from my example source on Github.

I'm not going to go into the finer points of initializing Ratchet or installing Composer (they both have documentation on that, and it's a very simple two step and you're running procedure). So instead let's take a quick walk through our control.php websocket service:

{{< codeblock lang="c" >}}
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
require __DIR__ . '/vendor/autoload.php';

// TODO Justin: rewrite SAM to be PSR-0 compatible
require __DIR__ . ('/vendor/SAM/php_sam.php');

/**
 * control.php
 *
 * Send any incoming messages to all connected clients and broker.
 * Based on the sample chat application that comes with Rachet
 *
 */
class Control implements MessageComponentInterface {
  protected $clients;
  protected $broker;

    public function __construct() {
      $this->clients = new \SplObjectStorage;
      $this->broker = new SAMConnection();
    }

    public function onOpen(ConnectionInterface $conn) {
      $this->clients->attach($conn);

      $this->broker->connect(SAM_MQTT, array(
          SAM_HOST => "ec2-XXX-XXX-XXX-XXX.us-west-1.compute.amazonaws.com",
          SAM_PORT => 1883
        )
      );
    }

    public function onMessage(ConnectionInterface $from, $msg) {
      foreach ($this->clients as $client) {
        if ($from != $client) {
            $client->send($msg);
        }
        $msgSAM = new SAMMessage($msg);
        $this->broker->send('topic://control', $msgSAM);
      }
    }

    public function onClose(ConnectionInterface $conn) {
      $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
      $conn->close();
    }
}

// Run the server application through the WebSocket protocol on port 8899
$server = IoServer::factory(new WsServer(new Control), 8899);
$server->run();
{{< /codeblock >}}

Immediately, you'll probably notice two things:

1. SAM isn't PSR-0 compliant, which means we have to include it outside the autoloader
2. That's pretty easy, right?

There really isn't much too this. The onMessage function simply waits for messages through the WebSocket protocol and when it gets one, sends it along to the broker under the topic control. How do you run this? Right on the command line:

{{< codeblock lang="bash" >}}
[ec2-user@ip-10-XXX-XXX-XXX ~]$ php ./websocketservice/control.php

-->SAMConnection()
<--SAMConnection()
{{< /codeblock >}}

With debugging turned on in the SAM lib, you'll see the connections and callouts the library makes as control.php tells it what to do.  When a client connects to the websocket and sends a message, you'll see something like this:

{{< codeblock lang="bash" >}}
-->SAMConnection.Connect()
-->SAMConnection.Create(proto=mqtt)
   SAMConnection.Create() get_cfg_var() ""
   SAMConnection.Create() calling factory - sam_factory_mqtt.php

   SAMConnection.Create() rc = SAMConnection_MQTT
<--SAMConnection.Create()
   SAMConnection.Connect() connection created for protocol mqtt
-->SAMConnection_MQTT.Connect()
   SAMConnection_MQTT.Connect() host=ec2-XXX-XXX-XXX-XXX.us-west-1.compute.amazonaws.com, port=1883, cleanstart=
-->SAMConnection_MQTT.checkHost(ec2-XXX-XXX-XXX-XXX.us-west-1.compute.amazonaws.com)
<--SAMConnection_MQTT.checkHost(rc=1)
<--SAMConnection_MQTT.Connect() rc=1
<--SAMConnection.Connect() rc=1
-->SAMConnection.Send()
-->SAMConnection_MQTT.Send()
   SAMConnection_MQTT.do_connect_now() sub_id=500cd79640ce37.11335627
   SAMConnection_MQTT.remaining_length() l=37
   SAMConnection_MQTT.remaining_length() digit=37 l=0
   SAMConnection_MQTT.remaining_length() rlf=%
   SAMConnection_MQTT.read_fixed_header() mtype=2, dup=0, qos=0, retain=0
   SAMConnection_MQTT.read_remaining_length() byte (1) = 2
   SAMConnection_MQTT.read_remaining_length() remaining length = 2
   SAMConnection_MQTT.do_connect_now() connected OK
   SAMConnection_MQTT.remaining_length() l=14
   SAMConnection_MQTT.remaining_length() digit=14 l=0
   SAMConnection_MQTT.remaining_length() rlf=
<--SAMConnection_MQTT.Send() rc=1
<--SAMConnection.Send() rc=1
{{< /codeblock >}}

## Step 4: Connect to the WebSocket service throught your web page

Connecting to a websocket through a webpage is pretty straightforward from a JavaScript perspective. The <a href="http://dev.w3.org/html5/websockets/">API</a> is available, <a href="https://developer.mozilla.org/en-US/demostag/tech:websockets">Mozilla's May derby was all about the WebSocket API</a>, HTML5 Rocks has a <a href="http://www.html5rocks.com/en/features/connectivity">connectivity section</a> with websocket info.

Since we have all this info and the only thing I needed as a send, I didn't take the time to write a specific send/recieve web page for this example. Instead I used the <a href="http://www.websocket.org/echo.html">WebSocket.org echo demo</a>, and simply pointed it to my websocket service url (which would be ws://ec2-XXX-XXX-XXX-XXX.us-west-1.compute.amazonaws.com/control in this case).

## Step 5: Make that Arduino blink!

First thing: lets wire up that Arduino. Slap on your ethernet shield, and wire up three leds (in my case, red, green, blue) to pins 5, 6, 7. The overall basic design of this is from the wonderful tutorial series at Adafruit (<a href="http://www.ladyada.net/learn/arduino/lesson3.html">lesson 3</a> as a matter of fact; the ciruit layout below is modified from that tutorial).

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2012/07/basic-three-led-setup.jpg" alt="Modified from Adafruit Lesson 3" />

Once you have that wired up, you're going to need to add Nicholas O'Leary's excellent <a href="http://knolleary.net/arduino-client-for-mqtt/">pubsubclient</a> (which implements support for MQTT) to your Arduino environment.  Once you have that installed, let's have a look at the sketch:

{{< codeblock lang="c" >}}
#include &lt;SPI.h&gt;
#include &lt;Ethernet.h&gt;
#include &lt;PubSubClient.h&gt;

// Set the MAC address
byte mac[] = { 0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x01 };

// Set fallback IP address if DHCP fails
IPAddress ip(192,168,0,201);

// Set the broker server IP
byte server[] = { XXX, XXX, XXX, XXX };

// Set what PINs our Led's are connected to
int redPin = 5;
int greenPin = 6;
int bluePin = 7;

// Set a generic code that will trigger our Blue Led
// think of this as a set of codes for automation you might write
byte triggerBlue[6] = "12345";

// handles messages that are returned from the broker on our subscribed channel
void callback(char* topic, byte* payload, unsigned int length) {

  Serial.print("New message from broker on topic:");
  Serial.println(topic);

  Serial.print("Payload:");
  Serial.write(payload, length);

  // This will blink our green LED
  blink(greenPin);

  // Check and see if our payload matches our simple trigger test
  if ((length == 5) & (memcmp(payload, triggerBlue, 5) == 0) )
  {
    blink(bluePin);
  }

}

// Fire up our PubSub client
PubSubClient client(server, 1883, callback);

void setup()
{

  // Open serial communications
  Serial.begin(9600);

  // Setup our Leds
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  // attempt a DHCP connection
  Serial.println("Attempting to get an IP address using DHCP:");
  if (!Ethernet.begin(mac))
  {
    // if DHCP fails, start with a hard-coded address:
    Serial.println("failed to get an IP address using DHCP, trying manually");
    Ethernet.begin(mac, ip);
  }

  Serial.print("My address:");
  Serial.println(Ethernet.localIP());

  // Connect to Broker, give it arduino as the name
  if (client.connect("arduino")) {

    // Good, we connected turn on the red led
    digitalWrite(redPin, HIGH);

    // Publish a message to the status topic
    client.publish("status","Arduino is now online");

    // Listen for messages on the control topic
    client.subscribe("control");
  }

}

void loop()
{
  client.loop();
}

// Anything with flashing lights.
void blink(int targetLed)
{
 static boolean led = HIGH;
 static int count = 0;

 Serial.print("Starting to blink...");

 while (count < 10)
 {
   digitalWrite(targetLed, led);

   count++;

   if (led == HIGH)
   {
     led = LOW;
   }
   else
   {
     led = HIGH;
   }

   delay(200);
 }

 count = 0;

 Serial.print("done.");
}
{{< /codeblock >}}

The code above is pretty well commented, so I won't touch on it all. The key thing is that you must set the server var to you ip address, as well as make sure your ethernet gets it's own local address. Almost all of the ethernet wire up code is stuff you've probably seen from the ethernet examples; there isn't anything new there. Once we get all that wired up in the setup, we connect our pubsub client to the broker and then do three things:

1. Turn on the red led to show we're connected
2. We send publish a message to the status topic saying we've connected
3. We subscribe to the control channel.

Once we start subscribing to the control topic, anything the broker broadcasts to that channel will get read in the callback function. The callback function will blink our green led when a message on the control topic is received, and if the payload of the message equals 12345, then our blue led will blink as well.

So if we have our broker and websocket service running, and we open up the echo test page and connect to the websocket and send a message of 12345, our green led will blink first, than the blue led will blink second. If we send 32424324, the green led will blink but the blue led will not.

## Step 6: Amaze your friends, automate or report something

Presuming all went well, you've just flashed a led by using all kinds of cool and interesting technology. It's a long setup for such a simple example, but once you have the server services setup, you can begin to see that you can automate anything (close the garage door), or report back information anywhere (how hot is the chicken coop). No firewalls to deal with. No port forwarding. The code doesn't require deep knowledge. It just works.

## Next time

Since you probably don't want someone randomly opening your garage door, next time we'll have a look at some security, and maybe we'll build a dashboard. Everyone loves a good dashboard.

## Get the code

All the code used here is available on my <a href="https://github.com/justinribeiro/justinribeiro.com-examples/tree/master/IOT-trigger-led-MQTT-WebSocket">github</a> account. Take it, fork it, do as you please. Remember, knowledge is as much about giving back as it taking.
