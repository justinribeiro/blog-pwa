---
date: 2017-01-13T15:59:02-08:00
title: "Experimenting with a progressive web app blog"
description: "An experiment in mixing Hugo and Polymer PRPL into a progressive web app blog."
imagetwitter: "https://storage.googleapis.com/jdr-public-imgs/blog/20170113-trace-twitter-1024x535.jpg"
imagefb: "https://storage.googleapis.com/jdr-public-imgs/blog/20170113-trace-fb-1200x630.jpg"
imagegplus: "https://storage.googleapis.com/jdr-public-imgs/blog/20170113-trace-gplus-800x360.jpg"
tags:
- Web
---

The holidays can lead to many things: too many cookies, lacking motivation to read email, a reminder that instructions that come with toys are a user experience nightmare, and that you're pretty sure the build server is on fire since you left the office.

Ah, the holidays.

What I did not expect to come out of the holidays was to experiment with a progressive web app blog _thing_. Wasn't on the list, no idea what compelled me to do so. Alas, here I am writing about said experiment and if you're reading this, fantastic! That means (hopefully) that experiment is working.

How did it come to be? I'm glad you asked.

## The general plan

From a pwa/blog perspective, I had explored various ideas around the topic last year. There was the [zuperkulblog-progressive-hugo mash up](https://github.com/justinribeiro/zuperkulblog-progressive-hugo) I made based on [Rob Dodson's](https://twitter.com/rob_dodson) ChromeDevSummit 2015 code. There was [dealing with linkbots and their need for metadata from progressive web apps](/chronicle/2016/05/11/progressive-web-apps-and-social-networks/) approach, which is working out nicely in a couple of spots.

I had notions. Some of of those notions seemed workable if not working.

One of the primary notions was __progressive__, something that would render if JavaScript wasn't available but still provide a nice, offline-first approach that wasn't terribly heavy and worked well on that middle of the road devices.

Instead of over thinking it, I decided on a path:

1. Use Hugo to write posts and spit out JSON.
2. Build an app shell using Polymer, web components, and the PRPL pattern.
3. Use Google App Engine to serve H2 and H2 Push.
4. Use python on App Engine to serve a static variant.
5. Use python on App Engine to serve a metadata rich variant to serve to link bots for social link sharing.

## Set up

Given the moving pieces to this puzzled path, I decided to break them apart into their own worlds and then bring them back together into a shippable package. Folder wise,
it looks a little something like this:

{{< codeblock lang="bash" >}}
➜ tree -L 1
├── app          <--- Our Polymer frontend
├── appengine    <--- Our App Engine python and yaml
├── hugo         <--- Our Hugo setup and content
├── ship         <--- What is built and deployed
└── utilities    <--- Utility scripts to make life easier
{{< /codeblock >}}

With stucture defined, let's piece this together.

## Stage One: build an app engine config

I consider the App Engine side to be the smaller bit of this puzzle.

First, we're going to build on top of [http2push-gae](https://github.com/GoogleChrome/http2push-gae), which will give us HTTP2 push for App Engine. This also allows us to use [http2-push-manifest](https://github.com/GoogleChrome/http2-push-manifest) to generate our static resources to push from the frontend.

Second, our we're going to write a bit of python to handle three cases:

1. You want the PWA
2. You want the static generated site with no JavaScript
3. You're a linkbot and you only care about metadata

From a simplified code perspective, it looks something like this:

{{< codeblock lang="python" >}}
class MainHandler(http2.PushHandler):
  def get(self):
    # Are you a bot? Here&#039;s some metadata!
    if re.search(bot_list_search, self.request.headers.get(&#039;User-Agent&#039;)):
      #
      # Are you a link bot? You don&#039;t need much, so I return you only the basics
      # of the page metadata
      #
      # IMPORTANT NOTE: This does not generate for GoogleBot! Don&#039;t add it to
      # the list, this is a bad idea. GoogleBot will handle the PWA just fine.
      logging.debug(&#039;return the bot render&#039;)
    else:
      if self.request.get(&#039;static&#039;, default_value=False) is not False:
        #
        # Any URL with ?static=true passes through here and generates no
        # JavaScript for an end user PROGRESSIVE ALL THE THINGS
        #
        logging.debug(&#039;return the static render, no pwa&#039;)
      else:
        #
        # All traffic initially starts here: ideally, they get the PWA
        # but in the event they have no javascript enabled, we have a
        # failsafe by injecting the route into &lt;noscript&gt; and then push
        # to the static handler to generate a non-JavaScript page.
        #
        logging.debug(&#039;return the pwa&#039;)
{{< /codeblock >}}

The key thing to key in mind is that we're going to take some data and throw it into a template. This is what drives both the bot and static paths; they're going to process the target path the user wants, find our JSON, parse it, and drop it into different templates specific to their use cases. Let's have a look at the static code path:

{{< codeblock lang="python" >}}
# Strip some cruft from the old old days just in case
name = os.path.join(os.path.dirname(__file__), &#039;dist/data/&#039;,
  self.request.path.lstrip(&quot;/&quot;).replace(&quot;index.html&quot;, &quot;&quot;)
  .replace(&quot;index.php&quot;, &quot;&quot;), &#039;index.json&#039;)

# open our file
f = open(name, &#039;r&#039;);
c = f.read()
f.close()

# parse the read
data = json.loads(c)

# safe that html
data[&#039;article&#039;] = unescape(data[&#039;article&#039;])

# Grab our template
static_template = os.path.join(os.path.dirname(__file__),
  &#039;dist/helpers/static.html&#039;)

# Send down the wire
return self.response.write(template.render(static_template, data))
{{< /codeblock >}}

Not a lot of magic. Find, open, parse, inject, send.

From a progressive web app perspective, we do a little more work. As you probably noticed, I don't use the `@http2.push()` on our `get`. Instead, I choose to inject only when in the PWA code path is in use.

{{< codeblock lang="python" >}}
push = os.path.join(os.path.dirname(__file__), &#039;dist/push_manifest.json&#039;)
self.push_urls = http2.use_push_manifest(push)
header = self._generate_link_preload_headers()
self.response.headers.add_header(&#039;Link&#039;, header)

# Retarget our noscript
# We chop the URL params for safety and add static param
data = {
    &#039;noscript&#039;: self.request.path + &#039;?static=true&#039;,
    }

# Grab our template
pwa_template = os.path.join(os.path.dirname(__file__),
  &#039;dist/index.html&#039;)

# Send down the wire
return self.response.write(template.render(pwa_template, data))
{{< /codeblock >}}

You'll also notice that I actually render a pwa_template here instead of only serving the `index.html` file. This is because I need to append the `?static=true` to our URL target the user requested in the event that they have no JavaScript enabled. This also me to inject into the `<noscript>` and safely guide them where they need to be.

Now that we have a handler, let's build a frontend.

## Stage Two: build the pwa

It's not a secret, I'm a fan of web components. With the v1 specs landing and having shipped a number of Polymer apps for other folks, it seemed like a natural fit for me to just web component this into production.

That, and someone asked me about a question about the [SHOP demo](https://github.com/Polymer/shop). "Can you use that to make a blog?" I don't know I said. This is that answer.

So, I fired up the old `polymer-cli` and generated the shop demo via the `polymer init`. Yeah, it's really that simple to get started. If you have tried the `polymer-cli` I highly recommend you should.

From that base I came up with a basic structure that followed the sorts of data I would have:

1. Static pages like About and the Home page.
2. Blog Archives, which would ideally be a long list of stuff I've written.
3. Blog Post, the actual content which someone might read.

This resulted in four main web components:

1. `<blog-pwa>`: the app shell
2. `<blog-static>`: for generic static page content
3. `<blog-chronicle>`: for a list of my blog archives
4. `<blog-entry>`: for a blog entry/post

I knew that I'd be generating some methods and styles that would likely be used by these components, so I also created `BlogUtilsBehavior` and a shared styles file to make life a little easier. One particular thing that I tested and liked was the way SHOP handled the flacky connection, so I pulled `_getResource` into my utils:

{{< codeblock lang="javascript" >}}
/**
 * Get a resource with XHR and account for flaky internet connections. This
 * is one for one from the Polymer SHOP demo.
 * @param  {Object} request  XHR request object.
 * @param  {Number} attempts Number of XHR rquests to run for flaky connects.
 * @return {Void}
 */
_getResource: function(request, attempts) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', request.onLoad.bind(this));
  xhr.addEventListener('error', function(e) {
    // Flaky connections might fail fetching resources
    if (attempts > 1) {
      this.debounce('_getResource',
        this._getResource.bind(this, request, attempts - 1), 200);
    } else {
      request.onError.call(this, e);
    }
  }.bind(this));
  xhr.open('GET', request.url);
  xhr.send();
}
{{< /codeblock >}}

The next piece I wanted to handle was the analytics side. The SHOP demo had a very basic approach to Google Analytics that wasn't great for debugging or sending other sorts of data to GA, so I wrote a new custom element with a different approach:

1. Allow debug mode for GA
2. Implement send() hook
3. Respect Do Not Track (via [schalkneethling/dnt-helper](https://github.com/schalkneethling/dnt-helper))

You can see the entire source code for [&lt;blog-analytics&gt;](https://github.com/justinribeiro/blog-pwa/blob/master/app/src/blog-analytics.html), but the general use allows me to do things like set events and send data on path changes (or anything else really):

{{< codeblock lang="javascript" >}}
this.fire('analytics', {
  hitType: 'pageview',
  page: window.location.pathname,
  location: window.location.href,
  title: page.title
});
{{< /codeblock >}}

Or just straight up send some data:

{{< codeblock lang="javascript" >}}
this.$$('blog-analytics').send(payload);
{{< /codeblock >}}

Since I knew that I wanted to make things offline friendly, I took a very similar approach to SHOP and generated things like `<blog-network-warning>` and `<blog-missing>`. The one key difference between my approach and SHOP was that `<blog-missing>` takes into account the fact that `importHref()` can cache the fail and this causes us a massive headache. To resolve this, I drop in a hard reload:

{{< codeblock lang="javascript" >}}
Polymer({
  is: 'blog-missing',
  _tryReload: function() {
    window.location.reload();
  }
});
{{< /codeblock >}}

Note this is likely to be resolved soon, as `importHref()` is being refactored and [pull request 4209](https://github.com/Polymer/polymer/pull/4209) exists now to help resolve this. When that lands, this shouldn't be needed.

Finally, I needed to display some code in certain posts. So I built [&lt;code-block&gt;](https://github.com/justinribeiro/blog-pwa/blob/master/app/src/code-block.html), which extended [&lt;prism-highlighter&gt;](https://github.com/PolymerElements/prism-element). It's not terribly fancy and most notably extends to support some additional languages I've had on the blog over the years:

{{< codeblock lang="markup" >}}
&lt;code-block lang=&quot;javascript&quot;&gt;
  console.info(&#039;be fancy code block!&#039;);
&lt;/code-block&gt;
{{< /codeblock >}}

Piece by piece, our components come together to form a working blog. Now, for some offline.

## Stage Three: Service Worker and Static things

Generating a service worker with the `polymer-cli` is pretty straight forward. `sw-precache-config.js` is going to define what you want, between the `polymer.json` config and the dependencies, you'll end up with some things for service worker to precache.

What we can't ignore is our runtime cache however. One, we have to think about our users connection, two we have to think about our users device, and three web perf web perf web perf. For me, I'm fine with the runtime cache always serving images from the cache and I'm fine with `fastest` for my JSON data.

The main thing I add to `sw-precache-config.js` is runtime caching for our static route:

{{< codeblock lang="javascript" >}}
{
  urlPattern: /.*\?static\=true/,
  handler: 'networkOnly',
  options: { },
}
{{< /codeblock >}}

Why would I do this? "People who don't have JavaScript enabled aren't going to get the Service Worker Justin" you might say. Indeed, you would be correct. But what if you have the service worker and simply want the static page?

This was a connundrum resolved easily with just letting the ever-awesome `sw-precache` know "hey, do me a solid, network only on that static is that cool?". No routing into our index.html shell, problem resolved.

Speaking of static, how does our shell handle that? Recall above that our python actually injects into our index.html a static url to redirect to in the case of no JavaScript. From a shell standpoint, it's pretty straightforward:

{{< codeblock lang="markup" >}}
&lt;noscript&gt;
  &lt;p&gt;JavaScript appears to be turned off.
  No problem, this Progressive Web App is Progressive!
  Redirecting to static page...&lt;/p&gt;
  &lt;meta http-equiv=&quot;refresh&quot; content=&quot;0;url={{ noscript }}&quot;&gt;
&lt;/noscript&gt;
&lt;blog-pwa unresolved&gt;
  &lt;header&gt;
    &lt;h1&gt;Justin Ribeiro&lt;/h1&gt;
  &lt;/header&gt;
&lt;/blog-pwa&gt;
{{< /codeblock >}}

Our `meta http-equiv=refresh` does all the heavy lifting and away our user is wisked off to a not-so-interactive-but-similar-looking static page (you can even try it on this [very blog post](/chronicle/2017/01/13/experimenting-with-a-progressive-web-app-blog/?static=true) if you like).

## Stage Three: build the helpers

PWA looking good. Lets talk about things our PWA sucks at.

In the given state with the app shell, we need JSON to render that view and to do that JavaScript is needed. I'm fine with this; it's my goal to deliver this shell like app experience but I know that I need more for those who can't or don't want that.

Similarly, I know that a class of bot out there are not terribly into the JavaScript realm of life. So while I may be able to do this in my PWA and GoogleBot will be just fine:

{{< codeblock lang="javascript" >}}
/**
 * Set HTML document title and meta description for search engines.
 * @param {Object} page Page metadata to set.
 */
_setPageMetaData: function(page) {
  // Flip the metadata on load
  // Note, Google Search will index this
  document.title: page.title + ' - Justin Ribeiro';
  document.querySelector('meta[name=\'description\']')
    .setAttribute('content', page.description);

  this.fire('announce', page.title);
  this.fire('analytics', {
    hitType: 'pageview',
    page: window.location.pathname,
    location: window.location.href,
    title: page.title
  });
}
{{< /codeblock >}}

Your linkbots of the world (ala Twitterbot and the like) will have none of it. That metadata is lost to them.

We can resolve this however. Since we have seperation of our views and data, we can simply create views that work in those cases aided by the App Engine's use of `webapp2` and `Django` templating on the server. As noted in the section above, we simply open our JSON, load up a template (in the code below, our bot template) and we render:

{{< codeblock lang="markup" >}}
&lt;!doctype html&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
  &lt;meta charset=&quot;utf-8&quot;&gt;
  &lt;title&gt;{{ title }} - Justin Ribeiro&lt;/title&gt;
  &lt;meta name=&quot;description&quot; content=&quot;{{ description }}&quot; /&gt;
  &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=no&quot;&gt;
  &lt;meta itemprop=&quot;name&quot; content=&quot;{{ title }} - Justin Ribeiro&quot;&gt;
  &lt;meta itemprop=&quot;headline&quot; content=&quot;{{ title }} - Justin Ribeiro&quot; /&gt;
  &lt;meta itemprop=&quot;description&quot; content=&quot;{{ description }}&quot;&gt;
  {% if imagegplus %}
  &lt;meta itemprop=&quot;image&quot; content=&quot;{{ imagegplus }}&quot;&gt;
  {% endif %}

  &lt;meta name=&quot;twitter:card&quot; content=&quot;summary_large_image&quot;&gt;
  &lt;meta name=&quot;twitter:site&quot; content=&quot;@justinribeiro&quot;&gt;
  &lt;meta name=&quot;twitter:title&quot; content=&quot;{{ title }} - Justin Ribeiro&quot;&gt;
  &lt;meta name=&quot;twitter:description&quot; content=&quot;{{ description }}&quot;&gt;
  &lt;meta name=&quot;twitter:creator&quot; content=&quot;@justinribeiro&quot;&gt;
  {% if imagetwitter %}
  &lt;meta name=&quot;twitter:image:src&quot; content=&quot;{{ imagetwitter }}&quot;&gt;
  {% endif %}

  &lt;meta property=&quot;og:type&quot; content=&quot;article&quot; /&gt;
  &lt;meta itemprop=&quot;og:headline&quot; content=&quot;{{ title }}&quot; /&gt;
  &lt;meta property=&quot;og:title&quot; content=&quot;{{ title }} - Justin Ribeiro&quot; /&gt;
  &lt;meta property=&quot;og:description&quot; content=&quot;{{ description }}&quot; /&gt;
  &lt;meta property=&quot;og:site_name&quot; content=&quot;Justin Ribeiro&quot; /&gt;
  &lt;meta property=&quot;og:url&quot; content=&quot;{{ permalink }}&quot; /&gt;
  &lt;meta property=&quot;article:published_time&quot; content=&quot;{{ datePublished }}&quot; /&gt;
  &lt;meta property=&quot;article:modified_time&quot; content=&quot;{{ dateModified }}&quot; /&gt;
  {% if imagefb %}
  &lt;meta property=&quot;og:image&quot; content=&quot;{{ imagefb }}&quot; /&gt;
  {% endif %}

&lt;/head&gt;
&lt;body&gt;
  &lt;!--
    Why is this empty? Turns out, link bots don&#039;t care much about
    the body of a document, just &lt;head&gt; metadata.
  --&gt;
&lt;/body&gt;
&lt;/html&gt;
{{< /codeblock >}}

> Note: The one thing I'll point out is that technically you could inject into the PWA shell with Django and skip the redirect and style down the content. I considered this approach but didn't test it enough to use it...yet.

## Stage Four: hugo to json

At this point in the story, you're probably thinking "Wow, a router, a shell, bot and static templates...do you have any data at all to fill that gap?" Let us turn to hugo.

I like [hugo](https://gohugo.io). It's written in Go, it's fast and efficent. I don't have to wait around when I use hugo.

Yet there are some things hugo is not yet designed to do. Ala, spitting out JSON files. For this, we have to help hugo by writing some layouts that basically look like JSON with some go templating. An example looks something like this:

{{< codeblock lang="javascript" >}}
{
  &quot;title&quot;: &quot;{{ .Title }}&quot;,
  &quot;description&quot;: &quot;{{ .Description }}&quot;,
  &quot;article&quot;: &quot;{{ $content }}&quot;,
  &quot;date&quot;: &quot;{{ .Date.Format &quot;Mon Jan 2, 2006&quot; }}&quot;,
  &quot;datePublished&quot;: &quot;{{ .Date.Format $.Site.Params.ISO8601 }}&quot;,
  &quot;dateModified&quot; : &quot;{{ .Date.Format $.Site.Params.ISO8601 }}&quot;,
  &quot;pagetype&quot;: &quot;post&quot;,
  &quot;words&quot;: &quot;{{ .FuzzyWordCount }}&quot;,
  &quot;readingtime&quot;: &quot;{{ .ReadingTime }}&quot;,
  &quot;permalink&quot;: &quot;{{ .Permalink }}&quot;,
  &quot;filename&quot;: &quot;{{ .File.Path }}&quot;,
  &quot;imagetwitter&quot;: &quot;{{ $.Params.imagetwitter }}&quot;,
  &quot;imagefb&quot;: &quot;{{ $.Params.imagefb }}&quot;,
  &quot;imagegplus&quot;: &quot;{{ $.Params.imagegplus }}&quot;
}
{{< /codeblock >}}

Looks strange, but I've used this a few times in different places with hugo and it works pretty well. When running `hugo`, we get our JSON...in an HTML file. To resolve this, I turn to `zmv` and move the files to their new home in the `app/data/` directory so our frontend can access them:

{{< codeblock lang="bash" >}}
➜ autoload zmv
➜ zmv -Q '(**/)(*).html' '$1$2.json';
{{< /codeblock >}}

Normally, this is enough. But in the case of years and years of blog posts and frankly a lot of content management moves (Perl thing I wrote, to something else I wrote, to Wordpress, to Jeykll, to Hugo), I ended up with a lot of cruft. To keep my sanity, I use `sed` to clean things up a bit:

{{< codeblock lang="bash" >}}
# Note: You could technically group these sed commands into one.
# I chose not to for my own memory sake.

# Optional: strip newline start in article
&#x279c; sed -r -i -- &#039;s/\&quot;article\&quot;: \&quot;\\n\\n/\&quot;article\&quot;: \&quot;/g&#039; **/*.json(D.)

# Optional: strip newline double at ending &lt;p&gt;
&#x279c; sed -r -i -- &#039;s/\&amp;lt;\/p\&amp;gt;\\n\\n/\&amp;lt;\/p\&amp;gt;/g&#039; **/*.json(D.)

# Kinda important; escape slashes in certain cases
&#x279c; sed -r -i -- &#039;s/(\\)/\\\\/g&#039; **/*.json(D.)
&#x279c; sed -r -i -- &#039;s/(\\[n])/n/g&#039; **/*.json(D.)
{{< /codeblock >}}

Great! JSON! Wait, are they good? I validate the files with `jq` since neither the PWA or the python will be happy if the JSON files aren't valid.

{{< codeblock lang="bash" >}}
#!/bin/zsh
for file in **/*.json(D.); do;
  jq -c .title $file 1> /dev/null
  if [[ $? -eq 4 ]]; then
    echo "file: $file"
  fi
done
{{< /codeblock >}}

Some might question why I'm using `jq` for this. One, `jq` is amazing. Two, `jq` is blazing fast for this purpose even if this requires shell code. I tried other validators that were simply too slow over 350+ files.

Easy right? Well, easy is relative. If only we had some way to automate all this.

## Stage Five: building a builder

To handle all the various things that need to happen to make stable happen, I wrote a couple `zsh` utility scripts to power most of the shuffle and build of the site.

Why not an `npm` script or a `gulp` or `grunt` task you ask? Frankly, because I just felt like writing some shell scripts. Don't you sometimes just want to write some shell scripts? Is that just me?

The main script that does the heavy lifting is `builder.zsh` which as you can guess, builds things:

{{< codeblock lang="bash" >}}
# check for tooling
➜ ./utilities/builder.zsh -t check

# get deps
➜ ./utilities/builder.zsh -t setup

# run dev env
➜ ./utilities/builder.zsh -t dev

# build prod env to send to app engine
➜ ./utilities/builder.zsh -t prod
{{< /codeblock >}}

Are these scripts super-safe? They could use some work, but for the most part work fine. Your mileage will vary of course.

Why a `zsh` script? Personal choice; I use zsh everywhere, from servers down to my watch. I switched years ago now, and I've never looked back.

## Test on an actual device

A progressive web app is only as good as the web performance it offers. I mean, who wants to sit around waiting 10 seconds for a blog post to initially load? No one.

I pulled out my trusty [LG Optimus Exceed 2](http://www.lg.com/us/cell-phones/lg-VS450PP-optimus-exceed-2) to test on. Never heard of it? It's because it was a new middle of the road Android KitKat powered device from about 2.5 years ago. The device could be had pre-paid at your local market for between $15-$35 USD (I bought it for $21 on Amazon a while back).

How does that device fair on regular 3G for a first and second load? [View the chrome timeline comparison](https://chromedevtools.github.io/timeline-viewer/?loadTimelineFromURL=https://storage.googleapis.com/jdr-public-traces/TimelineRawData-20170112-LG-VS450PP-regular3G-justinribeiro-com-firstrun.json?dl=0,https://storage.googleapis.com/jdr-public-traces/TimelineRawData-20170112-LG-VS450PP-regular3G-justinribeiro-com-secondrun.json?dl=0).

Just want the timelines json files? Download via links below:

* [Download - First load](https://storage.googleapis.com/jdr-public-traces/TimelineRawData-20170112-LG-VS450PP-regular3G-justinribeiro-com-firstrun.json)
* [Download - Second load](https://storage.googleapis.com/jdr-public-traces/TimelineRawData-20170112-LG-VS450PP-regular3G-justinribeiro-com-secondrun.json)

I'm okay-happy with the results; I'm of the opinion I can make it faster. The SHOP demo runs at about the same clip on that device, but longer frames are common (the device just doesn't have the power).

"But Justin, no one is using that device or devices like it." Here's the thing. You're wrong. One reason I bought this phone to test on was because I saw actual people, normal human beings out in the world who don't have $650 USD to drop on a phone, using that device.

The web should be fast for everyone. Testing experiments like this informs our designs and architectures so we can make the web faster.

I want to make the web better for everyone.

## All the code

This site is running on the very concepts talked about in this post. All the code is out in the repo [justinribeiro/blog-pwa](https://github.com/justinribeiro/blog-pwa) so you can have a look. I have lots of TODOs and comments in the code along with general "what I was think at the time" so hopefully some folks find that of use.

Issues are always welcome as there are no doubt some kinks to be worked out and of course fork away (though you'll probably want to ditch my blog posts :-).

Happy 2017 everyone. Time to #usetheplatform and #movethewebforward.