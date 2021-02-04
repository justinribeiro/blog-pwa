---
date: 2017-01-16T16:06:47-08:00
title: "Published ga-dnt-analytics to webcomponents.org"
description: "Need a Google Analytics custom element with Do Not Track and debug support? This is the one for you."
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20170116-gadntanalytics-twitter-1024x535.jpg"
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

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2017/e9e55dd8-dc03-11e6-8f3b-147be85ae76f.png" alt="ga-dnt-analytics in DevTools console">

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