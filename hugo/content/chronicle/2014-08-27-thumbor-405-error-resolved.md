---
date: 2014-08-27T00:00:00Z
description: Resolving Thumbors 405 method not allowed with a simple pull request (now in master).
title: Thumbor and the case of the 405 method not allowed
url: /chronicle/2014/08/27/thumbor-405-error-resolved/
tags:
- Web
---

On my ongoing quest for better responsive images for use with picture, I've been trying different things. I've [previously written](https://www.justinribeiro.com/chronicle/2014/06/03/responsive-images-with-app-engine-image-api-gcs-gsutil/) about using the Image API service on App Engine and Google Cloud Storage to great gain. However, maybe you're not on that stack and maybe you want something more?

So I've been working with [Thumbor](https://github.com/thumbor/thumbor), in particular a set of Thumbor servers running behind an Elastic Load Balancer which is connected to Cloudfront as a custom origin. I'm not going to write about that paricular setup at the moment (though there are a few guides out there). Instead, let's talk about the HEAD request.

For those of you who aren't particually familiar with HTTP 1.x methods, a HEAD request acts identical to a GET, except it doesn't return to you the body. Basically, you're just getting the headers.

This can come in handy when you're in the need for a check to see if a particular resouce exists or may have changed since the last time you accessed it. The plus side of this is that if it hasn't changed you're not burning bandwidth pulling the entire object down. If it has changed, you could make a determination as to what your web/Android/iOS/Glass/whatever app should do.

So then you run into a problem. Your Cloudfront distribution is smart, and it allows that HEAD request. If you're previsouly polled for an image and Cloudfront has it on the edge, it'll return to you a nifty header among others:

{{< codeblock lang="bash" >}}
X-Cache: Hit from cloudfront
{{< /codeblock >}}

However, if Cloudfront doesn't have it, it'll simply pass the request through to the origin. Thumbor will return a different sort of response:

{{< codeblock lang="bash" >}}
405 Method Not Allowed error.
{{< /codeblock >}}

Not one to sit around and complain, I went ahead and setup a virtualenv locally, read a little bit on [Tornado.Web] (http://www.tornadoweb.org/en/stable/), read through the source code, and made a few tiny edits to Thumbor (which, for as feature deep as Thumbor is, pretty easy to work on. Build chain is a bit hairy for testing though, be forewarned). My [pull request](https://github.com/thumbor/thumbor/pull/342) was accepted and merged into Thumbor's master branch, so it's all good. 405 error should no longer occur.

Thumbor is really a great tool, with a deep set of options. Having been using it for the better part of a month, I'm feeling like it's a really nice fit for responsive images on the web. A little more testing will tell.