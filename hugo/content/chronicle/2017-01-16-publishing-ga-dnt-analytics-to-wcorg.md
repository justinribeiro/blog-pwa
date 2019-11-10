---
date: 2017-01-16T16:06:47-08:00
title: "Published ga-dnt-analytics to webcomponents.org"
description: "Need a Google Analytics custom element with Do Not Track and debug support? This is the one for you."
imagetwitter: "https://storage.googleapis.com/jdr-public-imgs/blog/20170116-gadntanalytics-twitter-1024x535.jpg"
imagefb: "https://storage.googleapis.com/jdr-public-imgs/blog/20170116-gadntanalytics-fb-1200x630.jpg"
imagegplus: "https://storage.googleapis.com/jdr-public-imgs/blog/20170116-gadntanalytics-gplus-800x360.jpg"
tags:
- Web
---

If you happen to have read my [last piece](/chronicle/2017/01/13/experimenting-with-a-progressive-web-app-blog/) on building the progressive nature of this blog, you'll note I made mention of `blog-analytics`. This was something I made specifically to handle a few cases around the routing of the site (listening to things from `app-route`).

This works fine, but with it buried in that experiment it wasn't much use to me or anyone else. So instead, I pulled it out for easier use into `<ga-dnt-analytics>`.

## Using our element

The one thing that I've never been a fan of is debugging Google Analytics. It's not that it can't be done, but it was never very developer friendly in my workflow. With `<ga-dnt-analytics>` I seek to resolve that.

For instance, I want to debug:

{{< codeblock lang="markup" >}}
&lt;ga-dnt-analytics debug=&quot;true&quot;&gt;&lt;/ga-dnt-analytics&gt;
{{< /codeblock >}}

Great! Now I look at my console and low and behold:

<img src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2017/e9e55dd8-dc03-11e6-8f3b-147be85ae76f.png" alt="ga-dnt-analytics in DevTools console">

Now I'd like to turn on production. Let's update our element:

{{< codeblock lang="markup" >}}
&lt;ga-dnt-analytics key=&quot;UA-XXXXX-XX&quot;&gt;&lt;/ga-dnt-analytics&gt;
{{< /codeblock >}}

With that, I can now use JavaScript to send any payload I like:

{{< codeblock lang="javascript" >}}
document.querySelector(&#039;blog-analytics&#039;).send({
  hitType: &#039;pageview&#039;,
  page: window.location.pathname,
  location: window.location.href,
  title: &#039;My Title&#039;
});
{{< /codeblock >}}

Or, if I'm just stamping this on every page, I can just set it to ping on pageview:

{{< codeblock lang="markup" >}}
&lt;ga-dnt-analytics pageview=&quot;true&quot;&gt;&lt;/ga-dnt-analytics&gt;
{{< /codeblock >}}

## Why Do Not Track support?

The Do Not Track support comes for the very slick piece of code written by Mozilla's [Schalk Neethling](https://github.com/schalkneethling/dnt-helper). Why support it? Because I believe if a user doesn't want me pinging for analytics, I should respect that. Seems even more relevent today than ever.

## Where to get it

I've published the element on the new [webcomponents.org](https://www.webcomponents.org/element/justinribeiro/ga-dnt-analytics), and you're just an install away via bower:

{{< codeblock lang="bash" >}}
bower i justinribeiro/ga-dnt-analytics --save
{{< /codeblock >}}

Have an issue? Let me know on the repo: [justinribeiro/ga-dnt-analytics](https://github.com/justinribeiro/ga-dnt-analytics).