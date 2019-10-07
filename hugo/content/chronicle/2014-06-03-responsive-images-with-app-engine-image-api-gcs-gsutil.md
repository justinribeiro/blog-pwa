---
date: 2014-06-03T00:00:00Z
description: Picture tag on the horizen and responsive images the Google Cloud Storage way with Python. Sample code included.
title: Serving Responsive Images via Google Cloud Storage and Images Python API
url: /chronicle/2014/06/03/responsive-images-with-app-engine-image-api-gcs-gsutil/
tags:
- Web
---

Ah responsive images. Love'em, but hate the flame war.

Which method is best? They all have their plus and minus points, but the long and short is we need something.

With &lt;picture&gt; coming soon, the already excellent picturefill polyfill and with src-set, I decided to write up a little sample on how to use Google Cloud Storage in conjunction with the Images Python API to get a serving url which we can modify with a size that you can use in src-set or <picture> for responsive image goodness.

After deploying the project (or better yet, integrating into an existing project), you can push content through gsutil and pull the serving url from the command line. The readme in the repo explains the process.

Want to see a demo? I've got a jsfiddle that does just that: [Responsive images from Google Cloud Storage](http://jsfiddle.net/justinribeiro/kTVHd/)

This of course does not take into account things like art direction (do I want the same image resized to small screens or something specific to that screen), but for those I-need-something-now, it works rather well and you can use it now with the existing and excellent [Picturefill image polyfill](https://github.com/scottjehl/picturefill).

For all the code, visit the sample on Github: [justinribeiro/resp-img-get-serving-url-appengine](https://github.com/justinribeiro/resp-img-get-serving-url-appengine)

