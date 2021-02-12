---
title: "Defining a Custom Trusted Types Policy for a Workbox Service Worker"
description: "In my quest for all the security I can muster, I stumble into the world of trusted types and making them work with workbox and my service worker."
date: 2021-02-11T16:50:48-08:00
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20210211-workbox-trusted-types-800.png"
tags:
 - web
 - w3c
---

In the process of recently getting ready to improve another portion of [blog-pwa](https://github.com/justinribeiro/blog-pwa), I ran into an interesting error when viewing my content security policy report-only setting in regards to trusted type implementation.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210211-workbox-trusted-types-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210211-workbox-trusted-types-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210211-workbox-trusted-types-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210211-workbox-trusted-types-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210211-workbox-trusted-types-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210211-workbox-trusted-types-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210211-workbox-trusted-types-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210211-workbox-trusted-types-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210211-workbox-trusted-types-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210211-workbox-trusted-types-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20210211-workbox-trusted-types-800.png" alt="A screenshot of the CSP report-only error alerting me to a sink I need to replace with a trusted type.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">A screenshot of the CSP report-only error alerting me to a sink I need to replace with a trusted type.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

As a brief primer, [trusted types](https://github.com/w3c/webappsec-trusted-types) is a recent specification that's been in Chromium browsers since M83 and gives you the means to create policies that build non-spoofable typed values. The goal is to then allow said trusted type to be passed into a sink as a replacement for the string, preventing DOM-based cross-site scripting (DOM XSS) attacks. You can read more about it on the [trusted types repo](https://github.com/w3c/webappsec-trusted-types).

So, where's the bug exactly? To be clear, it's not really a bug in [workbox](https://developers.google.com/web/tools/workbox), but rather the way I've defined the string that starts up the service worker. If we take a peak at the code, we can see I'm just straight up passing a string.

{{< codeblock lang="javascript" >}}
async __loadSw() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/service-worker.js');

    // ...
  }
}
{{< /codeblock >}}

That code works fine without trusted types, but the CSP error is warning me to say "hey, that string gets used as a [createScriptURL](https://w3c.github.io/webappsec-trusted-types/dist/spec/#policies-hdr), you gotta deal with that". So, I wrote a little policy that checks to make sure it's coming from where it should:

{{< codeblock lang="javascript" >}}
async __loadSw() {
  if ('serviceWorker' in navigator) {
    let swUrl;

    // a little function to that our service worker is coming from where it should
    // this is very similar to the 2.3 policy example, but you'd want to change that
    // host hint hint since that probably won't work for you
    const srcSw = url => {
      const parsed = new URL(url, document.baseURI);
      if (parsed.host === 'justinribeiro.com' || parsed.host === 'www.justinribeiro.com') {
        return parsed.href;
      }
      throw new TypeError('invalid sw url');
    };

    // feature check if we have the type
    if (window.trustedTypes && trustedTypes.createPolicy) {
      // define the policy
      const swPolicy = trustedTypes.createPolicy('swPolicy', {
        createScriptURL: src => srcSw(src),
      });

      // create our trusted type
      swUrl = swPolicy.createScriptURL('service-worker.js');
    } else {
      // we don't have trusted types or the polyfill didn't load
      swUrl = srcSw('service-worker.js');
    }

    // use (hopefully) the trusted type
    const wb = new Workbox(swUrl);

    // ...
  }
}
{{< /codeblock >}}

Not terribly complex and better than a no-op policy. The `else` case ideally would go away with use of the [polyfill](https://github.com/w3c/webappsec-trusted-types#polyfill) though I haven't vetted the perf behavior of that polyfill just yet and what the impact might be.

I'm still in the process of ironing out the details of my trusted types implementation, but the above is a night little way to get started without diving into the depths.