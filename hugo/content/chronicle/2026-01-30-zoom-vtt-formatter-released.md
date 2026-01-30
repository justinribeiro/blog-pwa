---
title: "Formatting Zoom VTT Files into Readable Documents"
description: "A new tiny progressive web app enters the arena to help on some qualitative coding tasks."
date: 2026-01-30T14:00:00-07:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20260130-zoom-vtt-formatter-ss-sample-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260130-zoom-vtt-formatter-ss-sample-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260130-zoom-vtt-formatter-ss-sample-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260130-zoom-vtt-formatter-ss-sample-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260130-zoom-vtt-formatter-ss-sample-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20260130-zoom-vtt-formatter-ss-sample-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260130-zoom-vtt-formatter-ss-sample-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260130-zoom-vtt-formatter-ss-sample-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260130-zoom-vtt-formatter-ss-sample-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20260130-zoom-vtt-formatter-ss-sample-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20260130-zoom-vtt-formatter-ss-sample-800.png" alt="Screenshot of the web app using its magic powers on a VTT file.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">Screenshot of the web app using its magic powers on a VTT file.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20260130-zoom-vtt-formatter-ss-sample-800.png"
tags:
 - zoom
 - oss
 - release
---

Zoom is one of those necessary evils that we have become accustomed to. A lot of it has to do with policies and use requirements at any given organization which is fine until you need to do some real work.

Case in point: semi-structured qualitative interviews. Like many researchers, I've conducted a lot of them, and depending on how and who you are talking to, you probably have an IRB looking over your shoulder to make sure you don't do untold things with said interview data. As such, I use trusted and approved human transcribers which gives me a lot more nuance.

But what if you have a reasonable Zoom VTT transcription? Can't I just use that you say?

In it's generic form VTT files can be a real pain to deal with. Which is why I spent the time it takes me to drink a coffee and came up with the [Zoom VTT Formatter Tool](https://zoom-vtt-formatter.pwa.run) progressive web app.* As an all local, no server required tool, the tiny web app runs in your browser, can be installed for ease of use, and takes a lot of the pain out of the VTT use process.

More specifically, the tool removes VTT metadata (e.g., timestamps and line numbers), combines the same person without interruptions by others into a single line without repeating their name across multiple lines, and line breaks for easy qualitative coding in various tools. This tool does not modify the content of the transcript (e.g., spelling, punctuation, et cetera); you'll still have to do your due diligence on that.

We build this? Well, I was inspired by an old tiny script I saw ([sarah37/clean-zoom-transcript](https://github.com/sarah37/clean-zoom-transcript) which does an excellent job), and I have a tendency to write tiny tools for teaching and research purposes. I'm teaching qualitative inquiry in the DBA/PhD Program at Case Western Reserve University at the moment and this tiny tool can be useful for doing preparing to do coding of interviews.

And finally, the code is available [justinribeiro/zoom-transcript-vtt-formatter](https://codeberg.org/justinribeiro/zoom-transcript-vtt-formatter) should you want a fork or to file a ticket. If you were expecting Github and surprised to see CodeBerg, I am still trying to make that move—continues to feel like the right thing to do.

&ast; No AI was used in the making  of this tool. For the love of all things coding, tiny tools of this nature are not terribly time consuming to author. Take a chance on yourself; learn some things, build a tiny tool.