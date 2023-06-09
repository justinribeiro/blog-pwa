---
title: "The Four Cases of Progressive Rendering Fallbacks for Progressive Web Apps"
description: "Trying to determine exactly how progressive you PWA needs to be can be a challenge. The following four cases defined in this article are what I strive to build for content heavy PWAs."
date: 2019-10-08T09:46:13-07:00
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20191008-progressive-web-for-the-win-lynx-edition.png"
tags:
- Web
---

I mentioned [yesterday](https://justinribeiro.com/chronicle/2019/10/07/adding-webmention-support-to-a-progressive-web-app/) that [blog-pwa](https://github.com/justinribeiro/blog-pwa) uses a static rendering layer for cases when the browser or whatever is fetching the page doesn't support JavaScript. This was a slight simplification on my part. blog-pwa defines four primary cases:

1. Are you a known bot or tool that isn't going to understand JavaScript or understand the noscript redirect? _STATIC_
2. Are you a browser that supports JavaScript? _PWA_
3. Are you a browser with JavaScript support turned off? _PWA + NOSCRIPT Redirect to STATIC_
4. Are you a browser with JavaScript support but no ES Modules support? _PWA + NOMODULE Redirect to STATIC._

These four primary cases are what I use for any content serving progressive web app I build today. Doesn't matter the scale, if I'm building a PWA for someone, I consider these four cases the key to serving as many users and bots that I can (though in the case of #4 above, that might serve a different ES5 bundle based on what features I can patch).

> Note: I said "content serving" because some PWA's are offering more native app-like feature sets using things like WebUSB or WebBluetooth and the expectation that these should fallback the same way is not the same in my opinion.

In the case of blog-pwa, this takes place at both the server level (blog-pwa's Google App Engine backend) and the client level (blog-pwa's index.html shell). In most PWA buildouts in the last year or so, I always use server and client approaches.

In the case of server side, I check two cases:

1. Are you a bot or tool in the known list?
2. Are you a request with the url queryparam `static` set to true?

The second option works in conjunction with the blog-pwa's index.html shell, which itself defines two cases to cause clients to redirect with static set to true based on enabled browser feature set:

1. In the no JavaScript support enabled case, we use `noscript` and a `meta` redirect tag.
2. In the no ES Module support case, we use `script nomodule` and `location.href` to handle the redirect.

To make this work, I cheat on first load by injecting a template variable server side into index.html that in modern browsers with JavaScript enabled won't matter to handle the above two cases:

{{< codeblock lang="markup" >}}
&lt;noscript&gt;&#10;  &lt;p&gt;JavaScript appears to be turned off.&#10;  No problem, this Progressive Web App is Progressive!&#10;  Redirecting to static page...&lt;/p&gt;&#10;  &lt;meta http-equiv=&quot;refresh&quot; content=&quot;0;url={{ noscript }}&quot;&gt;&#10;&lt;/noscript&gt;&#10;&lt;script nomodule&gt;&#10;  // IE11 and anything that doesn&apos;t support ES Modules gets the no-JS&#10;  // version of the site&#10;  location.href = &apos;{{ noscript }}&apos;;&#10;&lt;/script&gt;
{{< /codeblock >}}

This isn't fancy or heavy engineering; this is just testing against features. No fancy user agent checking required.

With these cases and the static side setup, I'm able to safely say that the site renders in things like browsers like Lynx quite beautifully.

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20191008-progressive-web-for-the-win-lynx-edition.png" alt="this site running in lynx">

Even more crazy is that you still get a reasonably readable render in something like Internet Explorer 8.

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20191008-progressive-rendering-into-ie8.png" alt="this site running in IE8">

Are there a lot of users viewing my site in these browsers? No. Does that mean I (or you) shouldn't plan for this scenario? I'm of the opinion people should be able to read my content even on the most terrible of connections or browsers.

Should it all looks the same in every browser ever designed? No. A lot of folks might disagree, but the engineering effort to make that happen is significantly high and you better be doing some cost-benefit analysis before you jump into those waters. I've seen projects crash and burn and take down jobs. Don't be that team.

Not every PWA might need these cases or offer more fine grained approaches. If you're not thinking about these cases and you're only relying on those JavaScript based analytics, do you really know how much syndication or user base you're missing? Dig a little deeper and you might be surprised.
