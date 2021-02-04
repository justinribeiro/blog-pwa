---
title: "Fail a PR based on any audit score with v1.1.0 of Web Performance Audits with Lighthouse Github Action"
description: "The latest release beings a new feature, scores.js, enabling support for a Lighthouse-based data model for failing PRs based on any audit score or category."
date: 2019-11-06T10:09:03-08:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
<picture>
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-640.webp 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-800.webp 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-1024.webp 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-1280.webp 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-1600.webp 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-640.png 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-800.png 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-1024.png 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-1280.png 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-1600.png 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/png">
  <img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover; background-image: url(''data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\''http%3A//www.w3.org/2000/svg\'' xmlns%3Axlink=\''http%3A//www.w3.org/1999/xlink\'' viewBox=\''0 0 1280 853\''%3E%3Cfilter id=\''b\'' color-interpolation-filters=\''sRGB\''%3E%3CfeGaussianBlur stdDeviation=\''.5\''%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\''discrete\'' tableValues=\''1 1\''%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\''url(%23b)\'' x=\''0\'' y=\''0\'' height=\''100%25\'' width=\''100%25\'' xlink%3Ahref=\''data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\''%3E%3C/image%3E%3C/svg%3E'');" src="https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-800.png" alt="scores.js in action as a PR comment">
<figcaption itemprop="caption description">
<span aria-hidden="true">A screenshot of a pull request showing the new score.js feature.</span>
<span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
</figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-800.png"
tags:
- Web
---

While the budget.json support in my [Web Performance Audits with Lighthouse Github Action](https://github.com/marketplace/actions/web-performance-audits-with-lighthouse) was a good start point for many folks already using budgets, there was just something missing from it. How can I check and fail a pull request based on a specific audit or an overall category score?

I thought about this for some time and weighted the options. I could make Github Action input variables that allow setting, but that seemed rather convoluted and restrictive. I could come up with my own specific JSON file, but that too seemed ill conceived. What I settled on was the old adage dance with the one that brought; why not use the data model for Lighthouse?

With that, v1.1.0 introduces a new input, `lighthouseScoringBudget` that takes a file I call scores.js.

scores.js is based on the Lighthouse JSON output data model and maps one-to-one with the existing keys and definitions within lighthouse. This allows an easy to use, vastly configurable file to test any audit score or raw numeric value that you find important.

{{< codeblock lang="javascript" >}}
module.exports = {
  audits: {
    'service-worker': {
      score: 1,
    },
    'first-contentful-paint': {
      score: 1,
      numericValue: 100,
    },
    'first-meaningful-paint': {
      score: 1,
      numericValue: 100,
    },
  },
  categories: {
    performance: {
      score: 0.95,
    },
    accessibility: {
      score: 0.95,
    },
  },
};
{{< /codeblock >}}

No having to wait for me to add special parameters and easily comparable to the standard out from a JSON run of lighthouse:

{{< codeblock lang="bash" >}}
$ lighthouse --output json --output-path=./sample.json --chrome-flags="--headless" https://YOUR_URL_HERE.com
{{< /codeblock >}}

Just pop open that JSON file, determine what audits or categories are important to you, and start failing those pull requests at will.

<picture>
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-640.webp 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-800.webp 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-1024.webp 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-1280.webp 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-1600.webp 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-640.png 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-800.png 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-1024.png 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-1280.png 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-1600.png 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/png">
  <img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog/20191106-github-action-scores-800.png" alt="scores.js in action as a PR comment">
</picture>

In the current iteration of this feature, we can test for either one or two specific keys:

1. `score`: decimal ranging from 0 to 1. If you wanted to verify that your performance is above 95, you'd enter 0.95 like above.
2. `numericValue`: decimal starting at zero. Commonly holds the value out of the trace in milliseconds, good for testing if you want those raw performance numbers.

That's all for now; stay tuned for more features. As always, [PRs and issues are welcome](https://github.com/justinribeiro/lighthouse-action). Now go trace a site and let's make the web fast!
