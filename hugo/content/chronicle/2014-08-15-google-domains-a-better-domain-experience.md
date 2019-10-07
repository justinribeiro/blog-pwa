---
date: 2014-08-15T00:00:00Z
description: Initial thoughts and bugs with Google Domains
title: 'Google Domains: a better experience'
url: /chronicle/2014/08/15/google-domains-a-better-domain-experience/
tags:
- Web
---

When you build web applications, at some point you'll find yourself dealing with domain names. Maybe you're not the person handling the day to day DNS, maybe you're not even the person buying the domain. But at some point, you've probably found yourself in a horrible panel filled with ads and more ads with confusing navigation promising you a brand new kitten if you just click this totally unrelated button.

I've had the displeasure of using them all. Some are okay (Dreamhost and Namecheap), others are the pit of all evil (GoDaddy, which inspired my kitten rant above). Basically it boils down to the fact that domain handling in and of itself isn't inherently a huge profit center, but add-on services are (which most hosts sell). I'm not knocking the need to sell add-on services, but if it's blocking me from trying to actually work with the domain I need to, it's problematic.

I've been testing out [Google Domains](https://domains.google.com/about/) for a few months since the invitation rolled in from I/O. My overall impression is that it's a signifcantly improved domain experience. It's pretty straightforward, but like all the others, once you get into the nitty gritty of handling domain records, you're into the advanced portion of the program (and it's not exactly simple in some cases).

Google, like others, offers some convenience setups for various services (Squarespace, Google Apps, et certera). They also have a sythetic record setup for things like App Engine (which is quite nice).

Note, there are is a defect currently with SSL custom domain setup in Google Apps pointing to App Engine id. Google Domains will happily detect it for you and create a synthetic record. On the surface, this sounds good, but in practice it causes an immediate problem. You'll start getting SSL connection errors on the previously working setup. On the three transfers I've completed, I've gotten this error. If you switch to a 3rd party name servers (ala Route 53) the error will persist.

Note, this bug has been acknowledged (see [Derek Monner's comment](https://plus.google.com/106603156529760508714/posts/R3VjCiSYJaQ) on my post on Google+) and will be fixed in short order. For those still having the issue, you can fix it now via the following steps:

1. Remove Synthetic record in Google Domains
2. Add normal CNAME ghs.googlehosted.com into Google Domains or your 3rd party DNS
3. Remove App Engine application from Google Apps.
4. Add application back to Google Apps.
5. On App Engine Apps > Settings for yourappengine-id, assign address (it will only show HTTP)
6. Go to Security > SSL for Custom Domains, and reassign URL.
7. Everything works again

Sans this issue, I haven't found any others (and reporting the issue resulted in a near immediate response...this is why you file bugs people).

The other angle, which I haven't fully tested but initially looks good, is that Google's name servers are pretty speedy. I've been using a number of services lately for DNS (Route 53, Cloudflare) and while I think it's hard to compare them (they really serve different DNS needs), I'm always looking for any web perf gain I can get.

Overall, I think it's simply a nicer experience to use. We gave away 10 or so invites at GDG Oakdale, and the overall reviews have been positive. I also gave a few invites to clients (we received a few from the Google Analytics folks for this purpose) and the clients really seem to like it.  Can't ask for more than that! :-)
