---
title: "share-to-mastodon web component released"
description: "Having a share button on your website for Mastodon is hard given it's decentralized nature. With my latest tiny web component it's now easier to give users the option."
date: 2020-07-23T12:37:48-07:00
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20200723-fancy-button-800.png"
tags:
  - Web
  - wc
---

Ever since I [ghosted the larger swarm of socials](/chronicle/2019/09/30/ghosting-the-socials-and-expanding-my-open-web-existence/), Mastodon has become my go to collect off the cuff thoughts and share things. [I setup my own instance](/chronicle/2019/09/27/setting-up-mastodon-on-google-cloud-platform/) which I found to be a rewarding experience, and I've just been rambling about to no particular end.

One thing that has been missing though that has bothered me about Mastodon: no one ever has a share button for it on their website. Sure, the [Web Share Target API](https://w3c.github.io/web-share-target/) works great with the PWA version on my phone, but my phone is better used a cup coaster at this point and I'd like some of that sweet sharing action on my Chromebook or desktop.

_Where do you get off Justin, you don't even have a Mastodon share link on your posts!_ Indeed angry internet user, I didn't. My reasons were the same as everyone elses I suspect: the decentralized nature of the platform makes any one target hard to deal with. You don't know (and honestly, I should not need to know) where your instance is.

To remedy this, I've come up with a tiny web component called `<share-to-mastodon>` which does as much of the heavy lifting as possible. Under the hood:

1. On interaction, opens a little modal dialog window asking for the instance url
2. Allows user to select from a default datalist that is present or custom set by the site (the power of `input type=url list` and `datalist`! yeah web platform)
3. Will remember that domain in localStorage if the user wants
4. Does zero tracking of anything
5. Lots of custom css props, every string can be overridden for all your locale needs

You can see this inaction in the little demo video I made or you can just scroll down to the bottom of this post and click the Mastodon link in the share section (unless of course you are on mobile...as I only load it if your device/platform doesn't support the Web Share API).

{{< liteyoutube videoid="idEDQppqer0" videotitle="Demo: share-to-mastodon web component" >}}

To use, you can install it via npm or yarn:

{{< codeblock lang="bash" >}}
npm i @justinribeiro/share-to-mastodon

# or

yarn add @justinribeiro/share-to-mastodon
{{< /codeblock >}}

You can also just include the built dist version (which includes LitElement)

{{< codeblock lang="markup" >}}
&lt;script type=&quot;module&quot; src=&quot;https://cdn.jsdelivr.net/npm/@justinribeiro/share-to-mastodon@0.2.0/dist/share-to-mastodon.js&quot;&gt;
{{< /codeblock >}}

There are lots of available options (do check out the [docs](https://www.npmjs.com/package/@justinribeiro/share-to-mastodon) or the [repo](https://github.com/justinribeiro/share-to-mastodon)), but the general gist is it's pretty simple to use:

{{< codeblock lang="markup" >}}
&lt;share-to-mastodon message=&quot;My website is amazing, come check it out!&quot; url=&quot;https://justinribeiro.com&quot;&gt;&#10; Share The Magical Link&#10;&lt;/share-to-mastodon&gt;
{{< /codeblock >}}

For a more complex, "I really want a button" look, the lightDOM can be styled in conjunction with the many available css custom property options.

{{< codeblock lang="markup" >}}
&lt;style&gt;&#10;.myMagicalCss {&#10; --wc-stm-link-text-decoration: none;&#10; --wc-stm-link-color-initial: #0049a3;&#10; --wc-stm-link-color-visited: #0049a3;&#10;}&#10;.myMagicalCss &gt; div {&#10; display: inline-flex;&#10; justify-content: center;&#10; align-items: center;&#10; padding: 0.5rem;&#10; background: lightblue;&#10; border-radius: 5px;&#10; border: 1px solid #ccc;&#10;}&#10;.myMagicalCss &gt; div:hover {&#10; background: #eee;&#10;}&#10;.myMagicalCss svg {&#10; width: 24px;&#10; margin-right: 0.5rem;&#10;}&#10;&lt;/style&gt;&#10;&lt;share-to-mastodon class=&quot;myMagicalCss&quot;&gt;&#10; &lt;div&gt;&#10; &lt;svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 216.4 232&quot;&gt;&#10; &lt;path&#10; fill=&quot;#2b90d9&quot;&#10; d=&quot;M212 139c-3 16-29 34-58 38-15 2-30 3-46 3-26-2-46-7-46-7v8c4 25 26 27 47 28 21 0 39-6 39-6l1 19s-14 8-41 10c-14 1-32-1-53-6C9 214 1 165 0 116V76c0-50 33-65 33-65C50 3 78 0 108 0h1c29 0 58 3 74 11 0 0 33 15 33 65 0 0 1 37-4 63&quot;&#10; /&gt;&#10; &lt;path&#10; fill=&quot;#fff&quot;&#10; d=&quot;M178 80v61h-25V82c0-13-5-19-15-19-12 0-18 8-18 22v33H96V85c0-14-6-22-17-22s-16 6-16 19v59H39V80c0-12 3-22 9-30 7-7 16-11 26-11 13 0 22 5 28 15l6 10 6-10c6-10 16-15 28-15 11 0 19 4 26 11 6 8 10 18 10 30&quot;&#10; /&gt;&#10; &lt;/svg&gt;&#10; &lt;div&gt;Share This Site&lt;/div&gt;&#10; &lt;/div&gt;&#10;&lt;/share-to-mastodon&gt;
{{< /codeblock >}}

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200723-fancy-button-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200723-fancy-button-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200723-fancy-button-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200723-fancy-button-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200723-fancy-button-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200723-fancy-button-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200723-fancy-button-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200723-fancy-button-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200723-fancy-button-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200723-fancy-button-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20200723-fancy-button-800.png" alt="Using the lightDOM and available slot makes creating your own version of the button UI simple and fast.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">Using the lightDOM and available slot makes creating your own version of the button UI simple and fast.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

Now I readily admit there is a bit of a trick this. One, the component is by default an `display: inline` (as all web components are unless you override the `:host`) and the magically the contained modal and backdrop load. How exactly is that? Quick eyed readers will not that the actual slotted lightdom or string temporarily hide and internals of the web component change, giving you the effect of the modal without additional setup. This has some disadvantages but from a I-am-contained standpoint, it's a little easier to handle.

For now, it fits my initial needs, at least during this first release. Stay tuned, as we're going to dial this component's use up a bit in the coming days.
