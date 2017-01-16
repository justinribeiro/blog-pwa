---
categories:
- app-engine
- wordpress
- jeykll
- route-53
date: 2014-03-10T00:00:00Z
title: "From Wordpress to Jekyll, from shared hosting to Amazon Route 53 and Google App Engine"
url: /chronicle/2014/03/10/from-wordpress-to-jeykll-from-shared-hosting-to-google-app-engine/
---

I had not been happy with my web site performance in a while. The overall feeling was a combination of things; the slow DNS resolution, the slow web server response times, the data gaps I had on the page due to API changes or missing RSS feeds.

The problem was it wasn't just a feeling; the numbers didn't lie. Google Analytics was showing huge spikes in Site Speed times, sometimes in upwards of 30-40 seconds on any given day. 40 seconds to render a static, cached page from Wordpress? This could not be right. But alas my personal spot checking via a little curl script showed that things weren't working out on the shared server; the server slowed to a crawl in random and annoying ways.

And so begins a journey of great peril. Okay, not really. The whole move went smoothly and the performance numbers back up the my new belief: the site got way faster.

## Moving from Wordpress to Jekyll / Hyde

First: I like Wordpress. I deploy it a lot for clients and I have no issues. I could have easily just moved lock, stock, and barrel to App Engine using the PHP runtime and Cloud MySQL and things would have worked without much fuss.

But alas, I wanted something different.

So I fiddled for a while with a whole bunch of different projects and finally settled on [jekyll](http://jekyllrb.com/) and [hyde](http://hyde.getpoole.com/). Why swap the off canvas responsive layout that I came up with last year? That layout worked great, but I found the sidebar distracting and the header was kind of blah. I wanted something simplier. Hyde fit that need and offered some nice jekyll setup out the gate.

Even with Hyde's san defaults, I did make a few changes to the _config.yaml. I prefer to keep things seperate and at the same path, so I modified the permalink, source, and build targets:

{{< codeblock lang="yaml" >}}
permalink: /chronicle/:year/:month/:day/:title/
source: source/
destination: build/
{{< /codeblock >}}

This makes things slightly easier later on when deploying to App Engine (though you could just use the default _build directory, it'll work fine).

Moving from Wordpress to Jekyll is fairly straightforward. You have to install a few gems (sequel, mysql2, htmlentities) otherwise the [documented import script](http://import.jekyllrb.com/docs/wordpress/) will not run. The biggest issue is that anything within wp-content such as uploaded images won't get pulled down. You'll have to move them into your project however you can (I tarballed them and moved them via scp). From there, I just used sed to crush the old paths (though if your primary domain path didn't change, there would be no need to do this):

{{< codeblock lang="bash" >}}
$ sed -i 's/http:\/\/justinribeiro.com\/chronicle\/wp-content\/uploads\//\/public\/img\/blog\//' *.markdown
{{< /codeblock >}}

A couple layout tweaks and static file generation later and my site was up and running.

## Getting App Engine ready

With a static site built, it was time to prep for App Engine. If you've never used App Engine it's fairly straightforward. You install the SDK, you create your project in the Cloud Console (used to be called the APIs Console), and then you can setup your app.yaml. My app.yaml is based off of the gist [darktable/app.yaml](https://gist.github.com/darktable/873098), which itself got it's mime types from the [HTML5 Boilerplate](http://html5boilerplate.com/) .htaccess file. If we take a look at one block, we can get a general idea what's going on:

{{< codeblock lang="yaml" >}}
application: justinribeiro-web
version: 1
runtime: python27
api_version: 1
threadsafe: yes

handlers:
...

- url: /chronicle/(.*\.js)
  mime_type: text/javascript
  static_files: build/\1
  upload: build/(.*\.js)
  expiration: "7d"

...
{{< /codeblock >}}

If we take a look at just the snippet, we're telling App Engine to use the python runtime (which we could use), but that also for a static file type JavaScript within the build directory, make sure we set that types header to cache for 7 days. Cache = good, and it'll vary based on the resource. If we dig through more of the app.yaml, we'd find stuff like:

{{< codeblock lang="yaml" >}}
pagespeed:
  enabled_rewriters:
  - CombineCss
  - MinifyCss
  - PrioritizeCriticalCss
  - WebpOptimization
  - add_instrumentation
  - InsertDnsPrefetch
  - ProxyImages
  - InlinePreviewImages
  - RemoveComments
  - CollapseWhitespace
{{< /codeblock >}}

Here, we're enabling the PageSpeed service on App Engine (which by the way is really awesome). Note, you'll need to enable billing to use this feature as it's not free. You could also do this locally against your build before deploying as well, but I just really like the service (mod_pagespeed similarly awesome).

## Deploying to App Engine with git and push-to-deploy

One of the new preview features on App Engine is [git and push-to-deploy](https://developers.google.com/appengine/docs/push-to-deploy). My primary repo for the site lives in a private repo on Github, so being able to push my master branch with the build is an added and simple bonus. I hadn't had a chance to really test it out, but I decide why not.

Instead of the usual:

{{< codeblock lang="bash" >}}
$ appcfg.py update myApplication/
{{< /codeblock >}}

I can instead just push to my remote:

{{< codeblock lang="bash" >}}
$ git push appengine master
{{< /codeblock >}}

Setup was painless (see above link) and I haven't had any issue with pushing to the remote repo on the Google side. Note you have to push to master; your build cannot live in a different branch on App Engine.

## Moving DNS to Route 53

I moved all of my DNS to Amazon's [Route 53](http://aws.amazon.com/route53/). I use Route 53 all the time these days so choosing it wasn't a great leap for me. Depending on your existing host will determine how you go about creating your domain records on 53. In my case, I exported my zone file and then used the [cli53](https://github.com/barnybug/cli53) to do the heavy lifting:

{{< codeblock lang="bash" >}}
$ cli53 create justinribeiro.com
INFO     HostedZone:
INFO       ResourceRecordSetCount: 2
INFO       CallerReference: XXXXXXXXXXX
INFO       Config:
INFO         Comment:
INFO       Id: /hostedzone/XXXXXXXXX
INFO       Name: justinribeiro.com.

$ cli53 import justinribeiro.com --file justinribeirocom_zone.txt
INFO     ChangeInfo:
INFO       Status: PENDING
INFO       SubmittedAt: 2014-03-09T21:52:25.346Z
INFO       Id: /change/XXXXXXXXXXXX
{{< /codeblock >}}

You could just as well use the web interface, but I find cli53 to be a great tool for getting stuff done fast. You can also use the aws-cli, but that generally requires writing or generating the xml required to create records (there some good perl tools that do this).

If you can't pull the zone file from your existing host, you can piece one together by using dig otherwise you'll have to create the records manually.

## The speed bump

Did all the shenanigans of moving things around work? You bet they did. All said and done after the dust settled, in comparision to the week prior using page timings in Google Analytics my average page loads time dropped from 19.60 seconds to 2.71 seconds. Server response time dropped 91%, domain look dropped another 50%. Mind you, I'm not the greatest fan of playing the averages (histograms are you friend), but overall things were looking on the up and up.

Spot testing showed significant improvements and all of the sudden my traffic numbers also came up. Funny thing how fast loading sites lose less users.

And so goes the story of a faster web site and a happier me.
