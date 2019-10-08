---
title: "Adding Webmention support to a Progressive Web App"
description: "On my quest to do more things IndieWeb, I set forth to add webmention support to blog-pwa and get a feel for webmentions work in practice."
date: 2019-10-07T14:18:51-07:00
tags:
- Web
---

On my ongoing quest to independence from third party content silos, one of things that was inherently missing was engagement. Surely I would want some way to interact beyond [@justin@ribeiro.social](https://ribeiro.social/@justin); people should be able to write replies and what not on their own blogs, and I should be able to surface that on the site. Enter Webmention.

[Webmention](https://www.w3.org/TR/2017/REC-webmention-20170112/) is a W3C recommendation specification that at the top level allows notifications that one URL links to another. You can think of this as a primitive that allows us to build federated services around the things people might write or comment about all around the web.

A simple example is your write a response to one of my posts on your blog, linking to my original post. You then ping said url and express what exactly you did (maybe it was a comment, maybe it was a review), and then my endpoint accepts them and I can display them or reply back as I see fit.

The spec is one of many concepts to come out of [IndieWeb](https://indieweb.org/), a community focused on people and the independent web. As you probably guessed I really like this concept. Problem was, how do I implement this when it comes to a progressive web app?

## How our PWA is built

As I've written about before, [blog-pwa](https://github.com/justinribeiro/blog-pwa) is my little place I call home. I've worked on it for nearly three years and it's powered my site for a long time with success. Built with web standards like web components and service worker, my custom progress web app blog setup is truly progressive, supporting no-javascript clients and bots via a nifty static generator. For a long time this was limited to linkbots for your social networks and what not, but over the years I've tweaked it to support a wide range of other services, including old IE (via no-module), lynx (just because) and Googlebot (static one-to-one representation of the PWA, which I technically don't have to do anymore).

> In IndieWeb parlance I've been told this is considered [selfdogfooding](https://indieweb.org/selfdogfood). I was not aware this was a thing to be honest, but I use what I build to be sure. Term at will.

Having read a [lot of documentation](https://indieweb.org/Webmention-developer) from the wiki, I set forth to handle what I hoped would be the easy bit: setting up the receiver.

## Receiving webmentions with webmentions.io

[webmention.io](https://webmention.io/) is an [open source](https://github.com/aaronpk/webmention.io) and hosted service for receiving webmentions. I've initially opted for the hosted version to jump start things and on the surface this seemed pretty simple.

After logging into webmention.io, we're presented with a couple links to set in the head of our documents:

{{< codeblock lang="markup" >}}
&lt;link rel=&quot;webmention&quot; href=&quot;https://webmention.io/justinribeiro.com/webmention&quot; /&gt;&#10;&lt;link rel=&quot;pingback&quot; href=&quot;https://webmention.io/justinribeiro.com/xmlrpc&quot; /&gt;
{{< /codeblock >}}

> Note: you could also do this via [http headers](https://indieweb.org/webmention-implementation-guide) if you so please.

With the this now in the head of my document, I decided to just roll the dice and test to see what the various webmention tools out there would think about this. The end result will probably not shock you.

## A receiver unseen

With blog-pwa now rocking the proper setup, I went over to [Bridgy](https://brid.gy/), an open source connector that takes a look at your social media reactions and turns them into webmentions you can use on your site. After login and little timeline parsing, Bridgy had found some interactions, but was reporting that webmention support on my domain was not setup.

A quick glance quickly revealed what I suspected: it was having trouble parsing the progressive web app output case. Bridgy wasn't the only one; [Telegraph](https://telegraph.p3k.io/), [Webmention.app](https://webmention.app/), [IndieWebify.me](https://indiewebify.me) all initially struggled to properly see the link references.

I could have sat here and complained, but this stuff is open source so I got down to work. blog-pwa can render static output as needed; what I needed was User Agents to point them to the correct case.

In the specification, the fetch GET case is not defined but senders should send "webmention" within their user agent. Since most of these were working with some type of GET to do the initial parsing and targeting of incoming mentions, I just needed to find these User Agents:

{{< codeblock lang="python" >}}
# web mentions handlers
webmention_bot_hunt = [
  'webmention',
  'node-fetch',
  'guzzle',
  'bridgy',
  'go-http-client',
  'ruby',
  'appengine-google',
  'xray'
]
{{< /codeblock >}}

You might be thinking that guzzle is a PHP HTTP client and node-fetch is a node client and you would be correct. What I found was that most of the GET processors used their respective library's default User Agent, which means I had to stretch a bit to make them all work. In the case of [Webmention.app](https://webmention.app/) its user agent was set to unknown (but [I patched that last week](https://github.com/remy/wm/pull/11), cheers [Remy](https://remysharp.com/) for the merge!).

The thing to keep in mind here is that these are fetch-and-parse operations; they're not doing this via headless Chrome (my temptation to make a webmention parser with headless is running really deep at the moment), so we're not going to get DOM parsing.

This also extends to [h-card](http://microformats.org/wiki/h-card) and [h-entry](http://microformats.org/wiki/h-entry) microformats, which weren't being read from my PWA body either. This too was needed within the static generation side, allowing for posts and replies to carry more context.

With those fixes in place, all the webmention services I tested had no trouble reading or sending webmentions to my site.

> Note: say what you will, but always have a static rendering plan when it comes to PWAs that are displaying content (ala, the word _progressive_). There are lots of tools out there, including the fabulous [Rendertron](https://github.com/GoogleChrome/rendertron) that can help with this if you've not engineering a specific solution and case for static generation.

## A little manual webmention action

With data flowing, I wanted to continue tackling collection first. One thing I didn't want to stop people from doing was just manually sending me a link letting me know "hey, I commented on this".

To handle this, I wrote a little form (they one at the very bottom of this post) that handles this. By no means is the lower form idea a new one; I had originally seen this concept on [Jeremy Keith's site](https://adactio.com/).

Writing such a form is actually pretty simple. Here, I just a use a standard form with a little click bind from my lit-element and a simple POST:

{{< codeblock lang="markup" >}}
&lt;form
  id=&quot;webMentionForm&quot;
  action=&quot;https://webmention.io/justinribeiro.com/webmention&quot;
  method=&quot;POST&quot;&gt;
  &lt;input
    type=&quot;hidden&quot;
    name=&quot;target&quot;
    .value=&quot;${this.metadata.permalink}&quot; /&gt;
  &lt;label for=&quot;source&quot;&gt;
    Written a response or comment to this post? Fantastic! I&#10;    support&#10;    &lt;a href=&quot;https://indieweb.org/Webmention&quot;&gt;WebMentions&lt;/a&gt;. Paste&#10; and send your URL here:
  &lt;/label&gt;
  &lt;input
    type=&quot;url&quot;
    name=&quot;source&quot;
    placeholder=&quot;https://your-amazing-response-url-here/&quot;
    id=&quot;webMentionSource&quot; /&gt;
  &lt;button @click=&quot;${e =&gt; this.__submitWebMention(e)}&quot;&gt;
    &#128666; Send Webmention
  &lt;/button&gt;
 &lt;/form&gt;
{{< /codeblock >}}

From a JavaScript perspective, the thing to keep in mind is that we could technically change our headers to request `Location` header access to see allow the user to see the status of their webmention being processed, but I wasn't really sold on that from a user experience perspective.

{{< codeblock lang="javascript" >}}
  async __submitWebMention(event) {
    event.preventDefault();
    let message =
      'Thank you for sharing! Your Webmention has been received and is currently be processed.';
    const action = this.shadowRoot.querySelector('#webMentionForm').action;
    const target = this.metadata.permalink;
    const source = this.shadowRoot.querySelector('#webMentionSource').value;

    if (source !== '') {
      // technically, we could get the location header and show them the ticket,
      // but I'm not 100% sold on that as a user experience
      const response = await fetch(action, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `target=${target}&source=${source}`,
      });

      if (!response.ok) {
        message =
          "Oh no, your Webmention didn't seem to make it through. Please try again.";
      }

      // show our snackbar popup to let the user know it's all good
      this.dispatchEvent(
        new CustomEvent('display-snackbar', {
          bubbles: true,
          composed: true,
          detail: {
            message,
          },
        }),
      );

      this.shadowRoot.querySelector('#webMentionSource').value = '';
    }
  }
{{< /codeblock >}}

> Note: if you're using Content Security Policy, make sure to allow webmention.io in your form target settings otherwise this will not work!

## Rendering those mentions (or not)

With mentions now flowing, my final step was to actually render this at the footer of my blog entries. Most of the implementations I've reviewed of late handle this at build time (see examples for [eleventy](https://mxb.dev/blog/using-webmentions-on-static-sites/), [jekyll](https://github.com/aarongustafson/jekyll-webmention_io), and [hugo](https://paul.kinlan.me/using-web-mentions-in-a-static-sitehugo-/)), but  [webmention.io has an API](https://github.com/aaronpk/webmention.io#api) and it's easy enough to write a fetch function to get that data in a number of different forms.

The problem became pretty clear to me: if I did this on a every render, I run the risk of pummeling that API for data in high traffic cases. I didn't think that would be very cool. There is also the risk of large payloads based on interactions and I didn't really dig that concept either for low bandwidth scenarios (of which I'd rather have content render rather than likes).

What I settled on at the moment is to only render the interaction counts (which currently is a small payload and given that I haven't parsed a lot of webmentions data yet, not heavy).

{{< codeblock lang="javascript" >}}
async __getInteractionCounts() {
  const response = await fetch(
    `https://webmention.io/api/count?target=${this.metadata.permalink}`,
    {
      method: 'GET',
      mode: 'cors',
    },
  );

  if (response.ok) {
    const data = await response.json();
    if (data.count > 0) {
      this.interactions = `There are currently ${data.count} interactions with this piece on the open web.`;
    } else {
      this.interactions = `There are currently no interactions with this piece. Be the first!`;
    }
  }
}
{{< /codeblock >}}

I suspect I'll put a tiny cache in blog-pwa's GAE layer to handle this in the future, so I get a level of control and I can shrink the payloads to a smaller, more succinct set of data I can render. I don't want to hide those responses.

## Looking ahead

I have a few next steps that I'll be tackling:

1. I have some PR's I'm going to push to clean up a lot more user agents, that way if you have a PWA-style static render and are using bot string matching, that you'll have an easier time.
2. Along the lines of above, I need to open a ticket and see if that makes sense to put into the spec.
3. I iced the web component I wrote for the interaction list, but that's going to get published on NPM.
4. I'm probably going to implement Remy's webmention.app CLI tool into my make deployment script. Testing it locally over the weekend, his tool (and site) work great.

In the meantime, if you have a mention you can ping me below in the form

¡Viva la web abierta!
