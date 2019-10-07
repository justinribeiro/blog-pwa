---
tags:
- ssl
- spdy
date: 2014-04-10T00:00:00Z
title: Making the jump to always on SSL and SPDY
url: /chronicle/2014/04/10/move-to-always-ssl-and-spdy/
---

As you may have noticed, the domain is now defaulting to run through SSL. I've been meaning to do this for some time, but logistically I had not had a full amount of time to digest the issues that might arise (I'm still expecting something to go wrong, old content or not). I finally got around to going through the process of setting up SSL billing for my domain through Google Apps for Business (I'm only using SNI, which I realize is leaving some folks behind on older hardware but I'm willing to take that chance).

The setup isn't terrible; the longest part was probably getting the SSL cert issued. From there it was just a matter of adding secure: always to my routes and re-deploy via git.

The added side benefit is that App Engine SSL supports [SPDY](http://en.wikipedia.org/wiki/SPDY) which is pretty cool (and performs lovely). Browser support is pretty solid and you can install the module in apache or nginx (I've run SPDY in both and haven't had any ill affects).