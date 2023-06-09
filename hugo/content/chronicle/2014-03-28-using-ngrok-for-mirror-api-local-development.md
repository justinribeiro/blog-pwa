---
tags:
- ngrok
- mirror-api
- google-glass
date: 2014-03-28T00:00:00Z
title: Using ngrok for local Mirror API subscription callback development
url: /chronicle/2014/03/28/using-ngrok-for-mirror-api-local-development/
---

Working with Mirror API subscriptions is pretty straightfoward if you're developing against an outside host. At the very least you could then use the [subscription proxy](https://developers.google.com/glass/tools-downloads/subscription-proxy) when you don't have SSL on your outside host and you'd be fine. But...you'd still have to be out there in the wild wild web. Wouldn't it be nice to work locally? Then let's setup a tunnel with ngrok!

## Setting up ngrok
[Ngrok](https://ngrok.com/) does a lot of very awesome things such as multiple simultaneous tunnels and request replay (request replay is actually probably my favorite feature...super handy). If you want a deep dive, the [documentation](https://ngrok.com/usage) is very clear and a great resource. But let's pretend you don't have the time and just need to get up and running now. After you download, install and fire up your ngrok account, you need to run the opening shell command:

{{< codeblock lang="bash" >}}
$ ngrok -authtoken YOURTOKEN TARGETPORT
{{< /codeblock >}}

You only need the authtoken once. Since my locally developed application is running on App Engine dev server I point to port 8080 but the port will likely be different based on your development environment.

{{< codeblock lang="bash" >}}
$ ngrok 8080
{{< /codeblock >}}

At this point ngrok is going to display some status information including the randomly generated domain that we're going to use for our subscription callback.

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2014/03/screenshot-20140328-ngrok-mirror-callback.png" alt="ngrok and app engine doing their thing" />

In the screenshot you can see that I've already been testing; ngrok is showing requests coming into an endpoint (/glassupload) and in the App Engine log console behind it, you can see that request is actually making its way to the endpoint.

Sidebar: if you run the most recent build of ngrok in cygwin64...things have a tenancy to crash. Hence, the windows command line.

## Setting your subscription to the ngrok endpoint

I'm not going to get into the basics of auth'ing to the Mirror API (I've written about that in the past). But let's say you've never set up a subscription and would like to. The below python covers the basics, first inserting a contact that we can share to and then inserting a subscription that listens for INSERT operations:

{{< codeblock lang="python" >}}
mirrorService = buildMeSomeService(credentials)

# Create a contact
mirrorService.contacts().insert(body={
  'id': 'my-magical-contact-id',
  'displayName': 'My Magical Contact',
  'imageUrls': 'http://something/outthere.jpg',
  'acceptTypes': ['image/jpeg']}
.execute()

# Subscribe
mirrorService.subscriptions().insert(body={
  'collection': 'timeline',
  'userToken': 'something_I_set_to_id_user',
  'verifyToken': 'something_known_only_to_me',
  'callbackUrl': 'https://MYRANDOMASSIGNMENT.ngrok.com/myCallback',
  'operation': ['INSERT']}
).execute()

{{< /codeblock >}}

The key line in above said code is out callbackUrl. This is where we set out ngrok url, along with whatever route or endpoint we're trying to get to.

## Profit

Now, when we share something through our magical contact on Glass, it'll handoff through out ngrok tunnel and back to our localhost. We can view these requests via the localhost:4040 server that ngrok sets up that looks something like this:

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2014/03/screenshot-20140328-ngrokpanel.png" alt="ngrok and app engine doing their thing" />

Here we can see I've got some requests coming in, the json that Mirror API sent back, and the ability to replay that request with just a click of the button. Pretty nifty right? Now go forth and write some more Glassware!
