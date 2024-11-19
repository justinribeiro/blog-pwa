---
title: "lite-youtube Web Component v1.6 Released"
description: "v1.6 brings auto-pausing, custom CSS properties, named slot thumbnails, and COEP credentialless support."
date: 2024-11-15T8:45:38-07:00
tags:
 - web
 - webcomponent
 - release
 - oss
---

It has been a hot minute since I released a new version of `lite-youtube`. This is not due to a lack of my own personal use or the apparently staying power it has (75 million loads per  month via JSDelivr is nothing to sneeze at). Rather, I've been rather stringent about _what_ goes into lite-youtube to maintain it's small size and general performance footprint.

That said, it was time for some additional features based on feedback from the community. So let's break it down.

## Automatic pausing of videos off screen

Automatic pausing of videos off screen was highly requested (so many emails). In v1.6, the attribute `autoPause` is introduced as an opt-in feature to avoid breaking the existing behavior. There are a couple reasons to make this opt-in initial in my mind. One, while this uses a standard Intersection Observer to make the determination of when to pause off screen, it also requires a forced load of the iframe with a the JS API enabled to be able to control the iframe with postMessage. I hadn't had time to fully profile this performance change, so it'll stay opt-in until v2.0.

## Added Custom CSS Properties

The latest update introduces two new CSS custom properties, giving you greater control over the appearance of your videos:

1. `--lite-youtube-aspect-ratio`: Adjust the aspect ratio of your videos to fit your design needs. This property enables you to easily create custom aspect ratios beyond the default settings.

2. `--lite-youtube-frame-shadow-visible:` Opt for a flat, modern look by disabling the frame shadow with this property.

These additions make it easier to align your embedded videos with your specific style preferences and branding and have minimal adjustments to the existing internals of the component.

## Custom Poster via Named Slot

This update introduces a new `image` named slot, allowing you to set a custom poster image for your videos. This addresses not only asks around custom features, but also around the weirdness of certain YouTube API image problems (e.g., YouTube doesn't always generate every image per bug reports) With this feature, you can easily replace the default thumbnail with an image of your choice, offering greater flexibility to match your content’s style or branding.

{{< codeblock lang="markup" >}}
&lt;lite-youtube videoid=&quot;guJLfqTFfIw&quot;&gt;&#10;  &lt;img slot=&quot;image&quot; src=&quot;your-image-here.jpg&quot; alt=&quot;My Video Image&quot;&gt;&#10;&lt;/lite-youtube&gt;
{{< /codeblock >}}

## Support for credentialless Attribute Enhances COEP Compatibility

The latest update introduces support for the `credentialless` attribute, aligning with the Cross-Origin Embedder Policy (COEP). By adding `credentialless` to the internal injected YouTube `iframe` element, this allows us to embed third-party iframes that do not implement COEP themselves, facilitating smoother integration of external content. This feature was enabled by default starting in [Chrome M110](https://developer.chrome.com/blog/iframe-credentialless/), so it's a nice-to-have.

## Use v1.6 Now

Although it's currently a small web component (and always will be as long as I'm shipping it), its growing adoption reflects a continued demand for quicker and simpler tools for working on the web. You can start using it immediately via the JSDelivr CDN, which delivers lite-youtube an impressive 75 million times per month!

{{< codeblock lang="javascript" >}}
&lt;script type=&quot;module&quot; src=&quot;https://cdn.jsdelivr.net/npm/@justinribeiro/lite-youtube@1/lite-youtube.js&quot;&gt;&lt;/script&gt;
{{< /codeblock >}}

Alternatively, you can install it using npm, yarn, or your preferred package manager—or simply update the version in your existing package.json:

{{< codeblock lang="bash" >}}
npm i @justinribeiro/lite-youtube
# or
yarn add @justinribeiro/lite-youtube
{{< /codeblock >}}

and `import` somewhere in your respective code:

{{< codeblock lang="javascript" >}}
import '@justinribeiro/lite-youtube';
{{< /codeblock >}}

Find a bug or feel like contributing? Follow along on the [Github repo](https://github.com/justinribeiro/lite-youtube).

Happy coding!