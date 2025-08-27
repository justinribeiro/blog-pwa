---
title: "Parsing Sitemaps to Snapshot a Website to the Internet Archive Wayback Machine"
description: "You know I love mixing zsh, sed, grep, and some curl to get some work done."
date: 2025-08-27T10:00:00-07:00
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20250827-sitemap-sender-800.png"

tags:
 - software
 - cli
 - release
 - oss
---

I don't quite recall how I ended up down this respectively not-very-deep rabbit hole, but sometimes you start thinking about archiving. When it comes to archiving the web, you of course turn to Internet Archive’s [Wayback Machine](https://web.archive.org/), which is great source of history and amusement; I see many of my longer forgotten experiments from long ago archived there and it warms my heart.

The _why_ those sites are in the archive is a different matter. I did not submit those sites directly to the Wayback Machine; through the nature order of other people's own interest or the nature of indexing, many of them have found their way into the archive—this site included.

However, this version of the site is also quite fragmented in the archive it seems. I therefore set out to remedy that to the best of my ability.

## On the Shoulders of Giants

I am of course late to this party. A couple excellent posts set me on the right cow path. Understanding that there exists [an authenticated API](https://foxrow.com/til-api-for-saving-webpages-in-the-wayback-machine) with a strange set of Google Docs [documentation](https://docs.google.com/document/d/1Nsv52MvSjbLb2PCpHlat0gkzw0EvtSgpKHu4mk0MnrA/edit?tab=t.0#heading=h.1gmodju1d6p0) lead me to firing up my existing Archive.org account and finding that, yes, indeed there are access code and secret available for use.

Similarly, I had seen some tools around calling that API, but was most intrigued by the [nifty bash script](https://fabulous.systems/posts/2025/01/bts1-submitting-entire-websites-to-archive-org/) that parsed sitemap.xml and also sent external links in pages. However it did quite a bit more than I wanted, didn't use the authenticated approach, and I also wanted the ability to update based on diff (e.g., only new urls).

Hence, I give you my entrant into the fray, `archive.zsh`.

## The How-It-Works

My version does the three things I wanted:

1. Parse and send slowly (via `delay_wb_availability`, which job queues on the Internet Archive) an entire sitemap.xml to the Wayback Machine
2. Send via the authenticated endpoint
3. Send a single URL as needed

Subsequently, we end up with a few command line flags we can use to accomplish this:

{{< codeblock lang="bash" >}}
# Usage for SiteMap
$ ./archive.zsh [-m PATH_TO_SITEMAP.xml] [-t ACCESS:SECRET]

# Usage for Single URL
$ ./archive.zsh [-u URL] [-t ACCESS:SECRET]
{{< /codeblock >}}

In practice, the sitemap sender shows a stream of pretty text sending each url.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250827-sitemap-sender-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-sitemap-sender-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-sitemap-sender-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-sitemap-sender-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-sitemap-sender-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250827-sitemap-sender-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-sitemap-sender-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-sitemap-sender-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-sitemap-sender-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-sitemap-sender-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20250827-sitemap-sender-800.png" alt="archive.zsh script running in the terminal parsing and sending urls from a sitemap.xml file to the Wayback Machine.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">archive.zsh script running in the terminal parsing and sending urls from a sitemap.xml file to the Wayback Machine.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

A single URL send works similarly, just without the loop or sitemap involved.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250827-url-sender-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-url-sender-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-url-sender-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-url-sender-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-url-sender-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250827-url-sender-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-url-sender-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-url-sender-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-url-sender-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250827-url-sender-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20250827-url-sender-800.png" alt="archive.zsh script running in the terminal sending a single URL to the Wayback Machine.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">archive.zsh script running in the terminal sending a single URL to the Wayback Machine.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

## Get the Script

You can get access to the script in the [repository](https://github.com/justinribeiro/blog-pwa/blob/main/utilities/archive.zsh). I haven't broken it out into it's own repo, namely because there are more robust tools. But should you want to use or write your own variation, it's there for the study.
