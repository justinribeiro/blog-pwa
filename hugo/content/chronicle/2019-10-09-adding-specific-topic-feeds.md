---
title: "Improving RSS Reader Support and Adding New Topic Feeds"
description: "It's October which means RSS has risen from the grave and seeks feeeeeds. With new topic specific feeds and better code rendering support for RSS readers, you can now enjoy my articles in even more ways!"
date: 2019-10-09T16:10:50-07:00
tags:
- Web
---

With my recent foray into more widespread writing topics, I decided it was time to revisit the concept of topic specific RSS feeds and tag pages. Yeah, you're not going to get the nitty gritty of some of my more personal posts, but hey, at least maybe you'll keep on reading the content you find is relevant for you.

Available now (and in the [blog-pwa](https://github.com/justinribeiro/blog-pwa) codebase) are a new set of topic specific pages and feeds listed on the [tags](/tags/) page and accessible from the home page or the [archive](/chronicle/). Topics currently include:

1. 🕸️ [Web Dev, Web Perf, and Web Platform Articles](/tags/web/)
2. 🥽 [Internet of Things (IoT) Articles](/tags/iot/)
3. 📷 [Photography Articles and Prints](/tags/photography/)
4. 👔 [Management and Business Articles](/tags/business/)
5. 👨 [Personal Articles](/tags/personal/)

Under the hood, there was actually not a great deal of change required for this.

## Handling tag generation in Hugo

The tags are generated via Hugo in a similar fashion to how I generate all my JSON objects. The biggest difference you'll find is that the taxonomy defines it's own RSS template and handles some of the deployment paths via replace and we make our title more specific:

{{< codeblock lang="markup" >}}
&lt;channel&gt;&#10;  &lt;title&gt;{{ .Site.Title }} - {{ .Title }}&lt;/title&gt;&#10;  &lt;description&gt;{{ .Description }}&lt;/description&gt;&#10;  &lt;link href=&quot;{{ replace .Permalink &quot;/tags&quot; &quot;/data/tags&quot; }}index.xml&quot; rel=&quot;self&quot;/&gt;&#10;  &lt;link href=&quot;{{.Permalink}}&quot;/&gt;&#10;  &lt;language&gt;en-us&lt;/language&gt;&#10;  &lt;id&gt;https://justinribeiro.com/&lt;/id&gt;
{{< /codeblock >}}

Along those lines, instead of just generating a big list of tags which would includes a number of old tagging conventions from my perl/jekyll/wordpress post conversions over the years, I override the `/tags/_index.md` and simply made a nicely sectioned version for ease of use. I also decided to do this for each of the tag pages within the content folder, again to make things nicer.

In terms of problems within this approach is that fact that every post needs at least one tag. Sure, I could have written some case logic within the hugo templates, but I figured I might as well backfill as much of the missing tags as needed. Turned out, not that many posts to update.

There was also a more wide spread fix applied at this time as well; `code-block` tags were replaced with `pre`, allowing better code block rendering for CSS clients (which did not understand the web component obviously). Both tag and overall RSS feeds have this patch, allowing for a much nicer rendering remotely.

## Handling the tags in the PWA

This part was actually rather easy because of the structure of existing views. The `blog-chronicle.js` web component already had a `posts` array parser, so with a little retrofitting of the data layer, it could now serve to display tags and tag specific pages as well.

At that point, it only required a couple new routes within vaadin-router in the `blog-pwa.js` web component, and everything worked without a hitch.

No additional JavaScript weight or logic required. You gotta love it when a plan comes together.

## Future planning

I'm not sold on only those using those tags (and I really need to clean the old ones, which do properly function still within the Hugo generation and PWA). For now, this will at least give user a chance to pick the right feed for them.

What are you waiting for? Subscribe to a feed or read a tag! You know you want to.
