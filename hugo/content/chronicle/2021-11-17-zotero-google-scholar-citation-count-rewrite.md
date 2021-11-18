---
title: "Pulling Google Scholar Citation Counts with a Zotero Plugin for Sorting Papers"
description: "While various versions of this plugin floated around, old habits die hard for this old software engineer: let's do a little retrofit rewrite."
date: 2021-11-17T06:56:42-08:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-goodness-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-goodness-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-goodness-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-goodness-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-goodness-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-goodness-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-goodness-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-goodness-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-goodness-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-goodness-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url(''data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\''http%3A//www.w3.org/2000/svg\'' xmlns%3Axlink=\''http%3A//www.w3.org/1999/xlink\'' viewBox=\''0 0 1280 853\''%3E%3Cfilter id=\''b\'' color-interpolation-filters=\''sRGB\''%3E%3CfeGaussianBlur stdDeviation=\''.5\''%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\''discrete\'' tableValues=\''1 1\''%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\''url(%23b)\'' x=\''0\'' y=\''0\'' height=\''100%25\'' width=\''100%25\'' xlink%3Ahref=\''data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\''%3E%3C/image%3E%3C/svg%3E'');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-goodness-800.png" alt="The plugin option in the sub-menu injects Google Scholar citation count data in the extra field within Zotero.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The plugin option in the sub-menu injects Google Scholar citation count data in the extra field within Zotero.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-goodness-800.png"
tags:
 - web
 - personal
 - doctorate
---

> Just looking to use the plugin for Zotero? Head to [justinribeiro/zotero-google-scholar-citation-count](https://github.com/justinribeiro/zotero-google-scholar-citation-count) and download the latest version.

I had not used [Zotero](https://www.zotero.org/) until I came into the doctorate program, but on first load it looked and felt familiar. The software, an open source stalwart within the research community, had the telltale signs of something built with Firefox's Gecko and after a quick peek under the hood I was indeed proved correct.

This gave me some piece of mind—if something happened with said software I knew that I could go into that code base, patch it, and contribute up stream.

It came as no surprise that when I found the want of Google Scholar's citation count to use as sorting gauge within sub-collections of papers and research, I turned to the vast Zotero ecosystem of tools and plugins. Someone must have written this already I thought and sure enough I was not wrong. There were forks upon forks, piecemeal approaches for different use cases and needs and most largely orphaned. This did not seed confidence and after looking at the underlying code of many versions they all left me with a "I don't want that code running" sort of feeling.

Old habits die hard it seems: I forked and set forth to rapidly rewrite into something I could use and that maybe would allow others to use as well.

Hence, [justinribeiro/zotero-google-scholar-citation-count](https://github.com/justinribeiro/zotero-google-scholar-citation-count) was born.

## The Problem with Google Scholar

Google Scholar is massive pain in the neck in terms of integration. Having used many of Google's APIs for many a company, Google Scholar is a no-mans-land as not a single API is available for integration use. As such you have to fetch and parse in terrible ways, resulting in having to fight the recaptcha and possibly get straight up IP banned.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-robotsss-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-robotsss-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-robotsss-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-robotsss-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-robotsss-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-robotsss-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-robotsss-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-robotsss-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-robotsss-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-robotsss-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20211117-zotero-gscc-robotsss-800.png" alt="The pesky recaptcha, the bane of my Google Scholar experience even when I'm just searching regularly on Google Scholar let alone in this plugin.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The pesky recaptcha, the bane of my Google Scholar experience even when I'm just searching regularly on Google Scholar let alone in this plugin.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

This is the primary reason that I forked and decided to rewrite this plugin. While there are a _lot_ of versions of this plugin from various folks with specific patches that all generally point back to the original from [Anton Beloglazov](https://beloglazov.info/) back in 2011, not a single one correctly handled this case when handling a sub-collection or large groups of papers. You'd inevitably get stuck at the recaptcha because of the setTimeouts that the various plugins used to create async calling which was neither ideal nor controllable.

While others might point out that there is [Zotero Citation Counts Manager](https://github.com/eschnett/zotero-citationcounts), it neither updates sub-collections nor did it find much data for my currently smallish library using Crossref, Inspire HEP, and Semantic Scholar. While still others might say "hey Justin aren't you a Google Developer Expert, can't you get them to fix Google Scholar?" to my knowledge I still am (when it suits Google truth be told) and alas, I don't actually know anyone on that team.

So instead of hashing about the state of citation world, I decided I needed something new and something old.

## Firefox XPI my Old Friend

I honestly could not remember the last time I had written or worked on a Firefox XPI—though I recall vaguely the [add-on system and the marketplace](https://www.youtube.com/watch?v=Iu2aOk6b_Gs) of ye old days. I presumed it would be like riding a bike. I was mostly correct.

I had recalled the old import referencing and the JSMs which don't make for a great development experience, but it was likely going to be just me chipping on this so I wasn't going to concern myself with a lot of tooling. Having looked thorugh some of the sparse documentation within Zotero plugin docs, I knew that I really was going to have to accomplish a couple things:

1. I was going to need `async/await` to be able to handle the queue.
2. I was going to need to keep track of the recaptcha window state so I could hold the queue as needed.
3. I was going to have to setup some preferences so I could further refine my speed.
4. I was going to need at least some tests to keep my sanity.

## All About that (Recaptcha) Window

While rewriting most of the logic and adding async/await into the fetch and parse operations was fast and straight forward, the pesky problem was what to do about that recaptcha window. Having dug through the Zotero source code, their openWindow method doesn't return a window handle, which means I couldn't tell when that window was completed by the user. If you can't tell when it was completed, there is no way to promise wrap it and await.

To get around this, I went directly to the window-watcher itself and wrapped that to return a promise:

{{< codeblock lang="javascript" >}}
/**
  * Open a user interactive window, holds the window reference, and waits to
  * complete the recaptcha check before resolving promise
  * @param {string} targetUrl The url which caused the recaptcha
  * @return {Promise}
  */
openRecaptchaWindow: async function (targetUrl) {
  alert($__gscc.localization.string.recaptchaAlert);

  const checkWindowClosed = (modalWindowHandle, resolve) => {
    if (modalWindowHandle.closed) {
      $__gscc.debugger.info('recaptcha window closed');
      resolve();
    } else {
      $__gscc.debugger.info('waiting for recaptcha user complete...');
    }
  };

  const windowWatcher = Components.classes[
    '@mozilla.org/embedcomp/window-watcher;1'
  ].getService(Components.interfaces.nsIWindowWatcher);

  const recaptchaWindow = windowWatcher.openWindow(
    window,
    targetUrl,
    '_blank',
    'chrome,dialog,modal,width=950,height=700,centerscreen,resizable',
    null
  );

  return new Promise((resolve) =>
    checkWindowClosed(recaptchaWindow, resolve)
  );
}
{{< /codeblock >}}

Even if we have to use the internal access for the XPI, we still have [window.closed](https://developer.mozilla.org/en-US/docs/Web/API/Window/closed) to work with because web platform specs.

This allows us to control the flow without so much as a second thought:

{{< codeblock lang="javascript" >}}
$__gscc.debugger.warn(
  'Google Scholar asking for recaptcha, opening window.'
);
// wait for user
await $__gscc.util.openRecaptchaWindow(targetUrl);

// retry our data getter
const retryResponse = await this.retrieveCitationData(item);

// ...yada yada yada
{{< /codeblock >}}

Tacking on the rest of the features in my list, I threw in a little Jest for testing (the mocks are a pain), some quick types based on the Zotero Schema with JSDoc (otherwise I'd lose my mind), and some preferences for good measure.

## The End Result

The end result is pretty convenient as you can see in the demo video below. I would never claim that citation count is the end-all-be-all to say the least; it's another data point and this was more for my own curiosity than anything else.

{{< liteyoutube videoid="KdtnpvVlNXs" videotitle="A demo of of the Zotero Google Citation Count plugin" >}}

If you want to give the plugin a spin, you can download the latest version from via [justinribeiro/zotero-google-scholar-citation-count](https://github.com/justinribeiro/zotero-google-scholar-citation-count).

Happy researching!