---
title: "lite-youtube Web Component Goes 1.0, Offers More Features"
description: "The secretly popular component tops 75 million loads a month so I decided to level up some features."
date: 2021-11-18T10:41:49-08:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-web-dev-example-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-web-dev-example-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-web-dev-example-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-web-dev-example-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-web-dev-example-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-web-dev-example-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-web-dev-example-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-web-dev-example-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-web-dev-example-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-web-dev-example-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-web-dev-example-800.png" alt="Screenshot of lite-youtube powering the video embed on Google''s web.dev site.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">Screenshot of lite-youtube powering the video embed on Google''s web.dev site.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-web-dev-example-800.png"

tags:
 - web
 - webcomponent
 - release
---
A couple of months ago, I received a couple of cryptic emails that I should check the usage of [lite-youtube](https://github.com/justinribeiro/lite-youtube), the tiny fast web component that powers YouTube video embeds on this site and—before the emails—I presumed a few other sites. I generally don't take random emails at their word but curiosity is a hell of a thing, so I resolved to look at a few more public areas to eyeball some numbers.

Turn out publicly outside random-o-emails, the component was getting some use:

1. Apparently between 30-40 _million_ loads a month via the JSDeliver CDN. Unexpected.
2. Powers the embeds on Google's [web.dev](https://web.dev) site. [The dep is in the infra package.json no less](https://github.com/GoogleChrome/webdev-infra/blob/d1ac66052b85b4064e4cb3d5e7524128f4763882/package.json#L26). Cool cool cool.
3. The [NPM weekly downloads](https://www.npmjs.com/package/@justinribeiro/lite-youtube) looked middling at best, a pedestrian 3,000 a week. The graph looked pretty though.

Having collected and seen enough data the usage is pessimistically in the 65-75M views a month range. Pretty good for a tiny 2.4KB speedy little web component that was a quick cut.

Given that kind of usage, I decided to tend the garden and try to firm up the repo to make sure I don't break people trust or systems in the process. With the latest version—now at v1.3—I've added both foundation and features.

## Playlist Loading Support

This was a feature on the list for a long time and I finally got around to adding this via the `playlistid` attribute. Note, you still must give a `videoid` as well, otherwise no thumbnail will load because playlists don't serve a thumbnail (it's a YouTube thing). On interaction with the component, the YouTube iframe will load the playlist interface.

Code Example:

{{< codeblock lang="markup" >}}
&lt;lite-youtube videoid=&quot;VLrYOji75Vc&quot; playlistid=&quot;PL-G5r6j4GptH5JTveoLTVqpp7w2oc27Q9&quot;&gt;&lt;/lite-youtube&gt;
{{< /codeblock >}}

Try it out (shout out to one of my favorite people, [Tracy Lee](https://twitter.com/ladyleet)):

<lite-youtube videoid="VLrYOji75Vc" playlistid="PL-G5r6j4GptH5JTveoLTVqpp7w2oc27Q9"></lite-youtube>

## Event Loading Support for YouTube JS API

While you could use the `params` attribute to enable the JS API, you still really needed to know when the iframe loaded otherwise it was more of a pain then it was worth. This is documented in [YouTube API docs](https://developers.google.com/youtube/iframe_api_reference#Examples), but the component didn't have a great way to deal with this.

To handle that, you can now listen for the `liteYoutubeIframeLoaded` custom event on the component, allowing further interaction via your the JS API or even just straight iframe postMessage.

{{< codeblock lang="markup" >}}
&lt;lite-youtube&#10;  id=&quot;test-jsapi&quot;&#10;  videoid=&quot;guJLfqTFfIw&quot;&#10;  params=&quot;controls=0&amp;enablejsapi=1&quot;&#10;&gt;&lt;/lite-youtube&gt;
&lt;script&gt;
document.addEventListener('liteYoutubeIframeLoaded', () => {
  player = new YT.Player(document.querySelector('#test-jsapi').shadowRoot.querySelector('iframe'), {
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
  });
}, false);
&lt;/script&gt;
{{< /codeblock >}}

A full example is available at: [main/demo/jsapi.html](https://github.com/justinribeiro/lite-youtube/blob/b7b6da895d7ea66e3467a29f49cc243ee3d18bf9/demo/jsapi.html)

## Image Placeholder Improvements

The image placeholder performs even better now, thanks to using the `loading=lazy` to image placeholder. You can further override that to `eager` via the `posterloading` attribute.

As requested by a few folks, the `posterquality` attribute can now be used to override the image based the YouTube Embed APIs available options (maxresdefault, sddefault, mqdefault, hqdefault).

## No Cookie Support

The YouTube Embed API allows for using a special domain that prevents cookie tracking via `youtube-nocookie.com`. Now, if you add the `nocookie` attribute, the iframe will load with that domain instead.

## Finally, tests

To help spot check and hold my sanity, I did finally add tests for the component which via web-test-runner.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-tests-example-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-tests-example-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-tests-example-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-tests-example-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-tests-example-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-tests-example-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-tests-example-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-tests-example-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-tests-example-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-tests-example-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20211118-lite-youtube-tests-example-800.png" alt="Lite-youtube tests finish a run on the command line.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">Lite-youtube tests finish a run on the command line.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

## Use It Now

While it's still just a tiny web component my hope is that the uptick in use is an ongoing sign that people want faster and easier ways to work with on the web. As always, feel free to start using it today right now with little more than the JSDelivr CDN:

{{< codeblock lang="javascript" >}}
&lt;script type=&quot;module&quot; src=&quot;https://cdn.jsdelivr.net/npm/@justinribeiro/lite-youtube@1.3.0/lite-youtube.js&quot;&gt;&lt;/script&gt;
{{< /codeblock >}}

Or install with your npm or yarns of the world (or bump your existing version in you package.json):

{{< codeblock lang="bash" >}}
npm i @justinribeiro/lite-youtube
# or
yarn add @justinribeiro/lite-youtube
{{< /codeblock >}}

and import somewhere:

{{< codeblock lang="javascript" >}}
import '@justinribeiro/lite-youtube';
{{< /codeblock >}}

Happy coding!
