---
tags:
- IoT
date: 2012-11-08T00:00:00Z
description: Securing communications between my Arduinos and the outside world using MQTT and Mosquitto. Stop trying to open my garage door people.
title: Securing MQTT communication between Ardruino and Mosquitto
url: /chronicle/2012/11/08/securing-mqtt-communication-between-ardruino-and-mosquitto/
---

_I tried a lot of solutions, experimented heavily, but this was the most consistent way for my monitoring and remote command design. Your mileage may vary (greatly) based on your use case._

As I posted late in the summer, connecting and interacting with an Arduino remotely with MQTT and web sockets is fairly straight forward. Dealing with the security however is not so trivial.

## Captain, we need more power (for the SSL)
While we can make the ATmega328 do many things, doing secure socket layer (SSL) isn't an option. Which leaves us with a bit of a dilemma before we even get started: how do we secure communications?  If we just use the username and password authentication available within both the MQTT libs for Arduino and Mosquitto, we're passing them in the wide open. Anyone with Wireshark and a couple minutes will start opening your garage door.

## Sometimes you need a middle man
In a perfect world, Arduino does SSL (or maybe we're using Rasberry Pi's or Netdruino's) and we don't have any need for a middle man. However, it's not a perfect world, and we have lots of Arduino's we want to securely control from the outside world.  We need a middle man.

In our case, our middle man is a local instance of Mosquitto that we'll run bridged to our outside instance. We're making a few presumptions (in particular that your home network isn't wide open and is secured), but let's for a second pretend you have some device that's always running. In my case, that happens to be a netbook that has been re-purposed as a print server, so it's not seeing constant action.

## Building bridges
Okay, so now our Audrinos are talking and listening the the local instance of Mosquitto. The local network is locked down, so we're not worried about line snooping. Let's start simple, and bridge our local Mosquitto instance with our remote Mosquitto instance.

Bridging Mosquitto instances is fairly well documented (see <a href="http://mosquitto.org/man/mosquitto-conf-5.html">mosquitto.conf documentation</a>). Sticking with the sane defaults, creating the bridge is like so:

{{< codeblock lang="bash" >}}
#... previous things

address ec2-somethingsomething.us-west-1.compute.amazonaws.com:8883
connection BridgeIt

topic devices/# out "" home
topic cmds/# in remote ""

username SomeUser
password SomePassword

bridge_cafile /etc/keys/myCA.crt
bridge_certfile /etc/keys/myServer.crt
bridge_keyfile /etc/keys/myServer.key

#... other things
{{< /codeblock >}}

Breaking down the config, we're securing the bridge connection for using SSL (to see how to generate the certs and keys, have a look at the <a href="http://mosquitto.org/man/mosquitto-tls-7.html">mosquitto-tls</a> documentation), we're using a username/password, and we're defining which topics we're sending out and listening for.

## A note on topic mapping: don't loop me
Topic mapping is important, but slightly out of the scope of the security conversation...but I'm going to talk about it anyway. Topic mapping defines which messages will flow across the bridge. It can be very easy to create a loop, where both brokers continuously send the same message back and forth. This is beyond problematic; you will anger the CPU gods and make your broker machines unhappy.

What to do? It really depends on how your overall information design. For me, I remap from the local devices tree into the remote home/devices/+ and to be super paranoid, I add an access control list rule that only allows the bridge user to write to that tree.

## Locking up the remote side
So you've created this bridge, but your remote server needs some options set as well in it's own config to make all this work. For the sake of not being open at all on the remote end, let's not allow anonymous access, require password, and set the defaults to use SSL.

{{< codeblock lang="bash" >}}
#... previous things

acl_file /etc/mosquitto/accesscontrols
allow_anonymous false
password_file /etc/mosquitto/users

bind_address 127.0.0.1
port 8883

cafile /etc/keys/ca.crt
certfile /etc/keys/server.crt
keyfile /etc/keys/server.key

#... other things
{{< /codeblock >}}

To create the password file, you can use <a href="http://mosquitto.org/man/mosquitto_passwd-1.html">mosquitto_passwd</a>.  The access control file will differ based on your information design, but I basically set up some limits on the users that I've defined for my over all system. You could very well not use acl's and the SSL and password file will suffice.

_I'm not going to go indepth on pre-shared keys, but if you're interested in knowing, you could very well use PSK and not use the password\_file at all._

## So where does this leave us?
In the end we end up with two Mosquitto brokers; one in the outside world that only speaks to the web socket server, and one on our inside private network, which only talks to the Arduinos. Together, the two brokers talk over SSL through the bridge.

Since the python Mosquitto library has SSL support, it talks to the outside instance securely. We then run our dashboard and interface panel over HTTPS, which further secures information exchange. And because we're running HTTPS, the web socket service will use WSS (WS over TLS), also secure.

It's a rather long path to secure everything, but in the end, as long as we make sure we don't have any gaps in our local network, we can still talk securely and control those Arduinos remotely.
