---
date: 2014-10-22T00:00:00Z
description: Getting setup with Mosquitto on Google Compute Engine is suprising simple in this step-by-step setup.
title: Setting up Mosquitto 1.4 with libwebsockets on CentOS 7 on Google Compute Engine
url: /chronicle/2014/10/22/mosquitto-libwebsockets-google-compute-engine-setup/
tags:
- IoT
---

I use mosquitto for a lot of projects; it's a great MQTT broker. However, I've also always had to spin my own middleware to meld it into my websocket implementations. This isn't the worst thing, as the approach allows a custom layer that can do heavy processing before being sent to clients.

The issue being...sometimes I just want the straight stream without the middleware.

To accomplish this, we can build a custom version of the Mosquitto 1.4 branch with libwebsockets that will allow us to configure Mosquitto to output on a websocket.

## Fire up the VM on Google Compute Engine

There are two ways to start an instance on Compute Engine; the web panel or the command line. The command line is the easiest in my opinion. This assume you've already auth'ed (otherwise you may want to read up on the [managing authentication and credentials](https://cloud.google.com/sdk/gcloud/#gcloud.auth))

{{< codeblock lang="sh" >}}
➜  ~ gcloud compute instances create my-instance-name --image centos-7 --zone us-central1-a
{{< /codeblock >}}

Once we're up and running, we can go ahead an ssh into that instance:

{{< codeblock lang="sh" >}}
➜  ~ gcloud compute ssh my-instance-name --zone us-central1-a
{{< /codeblock >}}

## Grab some dependiences

First things first: grab your development tools:

{{< codeblock lang="sh" >}}
➜  ~ sudo yum groupinstall "Development Tools"
{{< /codeblock >}}

Now, let's grab other pieces we'll need to build libwebsockets and mosquitto:

{{< codeblock lang="sh" >}}
➜  ~ sudo yum install wget mercurial cmake openssl-devel c-ares-devel libuuid-devel
{{< /codeblock >}}

Fantastic! Now, let's go get libwebsockets:

{{< codeblock lang="sh" >}}
➜  ~ wget https://github.com/warmcat/libwebsockets/archive/v1.3-chrome37-firefox30.tar.gz
{{< /codeblock >}}

## Building libwebsockets

Presuming everything above went a-okay, we should have all we need to build.

_Note: I've shorted the zsh command prompts without the path name below; obvisouly we're changing into a directory and in oh-my-zsh that would put the folder in the path...it just gets a little long on the cut and paste._

{{< codeblock lang="sh" >}}
➜  ~ tar zxvf v1.3-chrome37-firefox30.tar.gz
➜  ~ cd libwebsockets-1.3-chrome37-firefox30
➜  ~ mkdir build; cd build;
➜  ~ cmake .. -DLIB_SUFFIX=64
➜  ~ sudo make install
{{< /codeblock >}}

The cmake command above is important on CentOS 7; if we don't give it the lib suffix, the build will fail.

## Building Mosquitto 1.4

First, let's pull the code from the repo using mecurial:

{{< codeblock lang="sh" >}}
➜  ~  hg clone https://bitbucket.org/oojah/mosquitto
➜  ~  cd mosquitto
➜  ~  hg pull && hg update 1.4
{{< /codeblock >}}

Okay, so you have some code. Now we need to tell Mosquitto to use libwebsockets by editing the config.mk file and enabling WITH_WEBSOCKETS:

{{< codeblock lang="sh" >}}
WITH_WEBSOCKETS:=yes
{{< /codeblock >}}

After we've done that, we can build mosquitto:

{{< codeblock lang="sh" >}}
➜  ~  make binary
➜  ~  sudo make install
{{< /codeblock >}}

Why "make binary"? Because mosquitto really isn't very setup to build kindly on CentOS; we would have to change a lot of hardcoded paths to the docbook xsl dependinces. There is a bug marked WONTFIX that explains this (see [issue 1269967](https://bugs.launchpad.net/mosquitto/+bug/1269967)). Trust me, it's not worth the time. Just use make binary.

## It all went well...or so I thought

So everything builds, you install everything, you go to fire up mosquitto and it fails. Turns out, we need to symlink our libwebsockets lib:

{{< codeblock lang="sh" >}}
➜  ~ sudo ln -s /usr/local/lib64/libwebsockets.so.4.0.0 /usr/lib/libwebsockets.so.4.0.0
{{< /codeblock >}}

Well, and it would be helpful to have a very basic mosquitto.conf:

{{< codeblock lang="sh" >}}
autosave_interval 1800
persistence true
persistence_file mosquitto.db
persistence_location /var/mosquitto/
connection_messages true
log_timestamp true

listener 1883

listener 10001 127.0.0.1
protocol websockets
{{< /codeblock >}}

Note the "protocol websockets" line. This is going to enable our implemenation.

Now, we fire mosquitto up:

{{< codeblock lang="sh" >}}
➜  ~ /usr/local/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf -d
{{< /codeblock >}}

## Open up some ports

It would help if we told the instance to allow some traffic:
{{< codeblock lang="sh" >}}
➜  ~ gcloud compute firewall-rules create allow-mqtt --allow tcp:1883
{{< /codeblock >}}

Let us not forget our websocket:
{{< codeblock lang="sh" >}}
➜  ~ gcloud compute firewall-rules create allow-websocket --allow tcp:10001
{{< /codeblock >}}

## Talk with Paho JavaScript

With the server feeling chatty, you can now connect and talk with Eclipse Paho's JavaScript implementation: [Paho JavaScript Client](http://www.eclipse.org/paho/clients/js/). The wire up is fairly straightforward in the most basic setup:

{{< codeblock lang="javascript" >}}
mqttClient = new Messaging.Client(YOUR_HOST, parseInt(YOUR_PORT), MY_CLIENT_ID);

mqttClient.onConnectionLost = onConnectionLost;
mqttClient.onMessageArrived = onMessageArrived;
mqttClient.connect({onSuccess:onConnect});

function onConnect() {
  client.subscribe("#");
}

function onMessageArrived(response) {
  var ret_topic = response.destinationName;
  var ret_payload = response.payloadString;

  // More things!
}
{{< /codeblock >}}

## Where is the docker image?

I haven't built a docker image that implements this build. It's on my list.

## I'm not a fan of Cent, can I do this in Ubuntu?

Sure. The steps are roughly the same, but for a specific Mint 17/Ubuntu 14.04 version, see [Jeremy Gooch's post](http://goochgooch.wordpress.com/2014/08/01/building-mosquitto-1-4/).

## Why all this?

Primarly for use with my Polymer [polymer-glass-timer-mqtt](https://github.com/justinribeiro/polymer-glass-timer-mqtt) tag and my [GDK MQTT Glass Timer](https://github.com/justinribeiro/glass-gdk-timer-mqtt) application. Together, it let's me do some nifty demo's.