---
date: "2018-12-10T08:00:00-08:00"
title: "Building a tiny speedometer progressive web app"
description: "With my Prius dashboard on the fritz, I turn not to an app store, but rather the GeoLocation API, AmbientLightSensor API, and to create tiny no-frills PWA."
tags:
- Web
- PWA
---

## Making DNS work for us
DNS is the phonebook of the internet. A phonebook was a thing that telephone companies used to drop off at your house so you could look up people by name and find a phone number. When we type in a domain name, say justinribeiro.com, we're really be routed to an IP address, as seen with `dig`:

<img src="https://storage.googleapis.com/jdr-public-imgs/blog/20181018-dig-external.png" alt="Output from dig command on justinribeiro.com">

On the internet, we need unique IP addresses to really sort things out (let's ignore SNI for now). The funny thing though is, an internal, non-public-routeable IP address can be set on an A record. In this case, let's look at checkcheck.ribeiro.house with `dig`:

<img src="https://storage.googleapis.com/jdr-public-imgs/blog/20181018-dig-internal.png" alt="Output from dig command on checkcheck.ribeiro.house">

Looks odd doesn't it? Isn't the 192.168/16 prefix [covered in RFC 1918](https://tools.ietf.org/html/rfc1918#section-3) as a private address space? Indeed, you'd be correct. Thing is, DNS doesn't care. It just tells us where we should be going, even if you can't get there on the outside wide open internet. To our internal users on the network however, that's a routable domain name. Now we just need a cert.

## Let's Encrypt to the rescue
I sometimes see the question "why can't I use Let's Encrypt to generate intranet certs for my gear/servers?" On the whole, this doesn't make a lot of sense when you step back from it; Let's Encrypt is a public certificate authority and generally operates by validating valid DNS, routable DNS names.

In the past, you'd have to at least temporarily have your site available to do the proper validation. This was a non-starter from an intranet standpoint for most. But with DNS-01 challenge, we don't need the site to have world routable access. We just need a provider with DNS on the outside we can update with a challenge record.

This works magically for our internal PWA, allowing us to generate a cert for our chosen domain, even if it only ever route internally.

Let's look at an example. Let's say that my domain is hosted on Google's Cloud DNS and I'm using the popular and flexible acme client [dehydrated](https://github.com/lukas2511/dehydrated). We can install the [Google Cloud hook](https://github.com/spfguru/dehydrated4googlecloud) and presuming we're logged into the proper account in `gcloud` cli, we can generate the cert for our domain and install on our internal web server and have users access it via said chosen domain:

<img src="https://storage.googleapis.com/jdr-public-imgs/blog/20181018-acme-cert-gen.jpg" alt="concatenated output from running dehydrated command">

All of the sudden, not only do we get progressive web features, we also get an added layer of security internally (which is often lacking in my experience at a lot of companies). You could very well do so for any number of additional end points.

## Always more perf
Now you might be saying "Justin, I still don't know how to setup the scripts to run that renew, I'm still at a loss as to how I'm going to manage that, and our old web server was sold to us by Netscape." I hear you, you want more perf. Concerned person, meet [caddy](https://caddyserver.com).

Caddy has a number of features that really make progressive web apps humm, from H2 and QUIC support to automagic TLS. That automagic TLS work with DNS-01 challenge and a number of [DNS providers](https://caddyserver.com/docs/tls.dns.googlecloud), and unlike the setup above, is frankly a TLS cert install you're ever likely to see:

<img src="https://storage.googleapis.com/jdr-public-imgs/blog/20181018-caddy.png" alt="Caddy running with little more than a config file serving on TLS.">

Progressive web app. Intranet. TLS. Speed.

## You can't dooooo thiiisssss
This is the portion of the post where I explain counterpoints to the approach.

1. _You're leaking information about your internal network to possible attackers._ Totally agree, you're tipping your hand what you're running on the inside, what with possible name choices and internal IPs. You should be weight what this means for your org.

2. _Run your own intranet CA and push certs to clients like real ops._ Again, not denying that's an option. In a lot of big orgs with the expertise and infra to do so, that's a very real approach. For many orgs however, they don't have that in their back pocket.

3. _It's cheapers to just do this in the cloud._ Might be, sure. For some folks, that's not going to be an option (my a/v receiver is staying off the internet).

4. _Seems like a lot of work for just progressive web features._ So are OS updates and security patches, but you do those (right? right??? please do those. please).

5. _My intranet apps don't need security._ This one makes me sad. Security should not be optional when running applications, regardless of whether it's the web or not.

6. _This is an old technique, consumer routers/firewalls used to do this for setup._ Again, not claiming I'm the first, just hoping to help developers and their users reach their potential.

## Try it at home!
Make no mistake, I've rolled this out for corps with nary a hiccup. I also run this sort of setup at home (albiet with some additional layers outside the topic of this post). My home network has a fair amount of devices on it, many of which have one-off Android or iOS applications that haven't seen an update since 2012. The devices don't live on the internet and I don't want them to (oh, the carnage that would be).

I do want to control them, preferably with a progressive web app that anyone on my network can pop open at their leisure (yeah, I'm a trusting person). So, over the years, I've written various little PWA pieces to control those devices with pretty solid success.

So if you're feeling like "hey, I have this spare Intel NUC and a dire need to reverse engineer a protocal that my kids toy uses from this wifi-connected app", then spin a up a domain, get yourself a cert, and come on board the progressive web application revolution.