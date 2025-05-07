---
title: "A Tiny Analysis of Nginx Compression Directives and a new Rollup Web Asset Build Size Plugin"
description: "I did not set out to run this analysis, or fork and write an opinionated rollup plugin, but here we are."
date: 2025-05-06T13:51:30-07:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-new-plugin-output-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-new-plugin-output-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-new-plugin-output-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-new-plugin-output-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-new-plugin-output-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-new-plugin-output-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-new-plugin-output-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-new-plugin-output-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-new-plugin-output-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-new-plugin-output-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-new-plugin-output-800.png" alt="My forked and opinionated rollup plugin showing showing compression level setting and differences between two builds of this very blog engine.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">My forked and opinionated rollup plugin showing showing compression level setting and differences between two builds of this very blog engine.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-new-plugin-output-800.png"

tags:
 - web
 - rollup
 - plugin
 - research
 - webperf
---

It will come to no surprise to anyone that web performance is something I hold dear. As such, I’ve always taken a multi-pronged approach to try to give me the visibility I need to make choices on what kinds of performance I can control to the best of my ability. One of those sort of low hanging fruit items in the web development space is asset file size, the very code that gets sent down the wire to the browser that ultimately is parsed and used to make a web page or application work.

As a whole, the web development community does a particularly poor job at handling asset file sizes. The bloated world of web frameworks, of which a treatise of literature has been written, are particularly showy in their detrimental effects on web performance (Russell, A. 2024, January 31. <cite><a href="https://infrequently.org/2024/01/performance-inequality-gap-2024/">The Performance Inequality Gap, 2024</a></cite>. Infrequently Noted.). Yet, we have tools that help developers understand dependency weight while writing code (e.g., <cite>[wix/import-cost](https://github.com/wix/import-cost)</cite>) and build artifact sizes (e.g., <cite>[rollup-plugin-size](https://github.com/luwes/rollup-plugin-size)</cite>; <cite>[webpack size-plugin](https://github.com/GoogleChromeLabs/size-plugin)</cite>; <cite>[Lighthouse's total-byte-weight](https://developer.chrome.com/docs/lighthouse/performance/total-byte-weight/)</cite>).

I’ve used Wes's rollup plugin (itself a port of Jason’s webpack plugin) for a quite some time. That said, the plugin always left me with discrepancies in various projects, primarily because the plugin always set the maximum amount of compression as part of its analysis. This is a non-configurable setting; an assumption of that the operation of compression when shipping assets is always set to the maximum, which in my experience seemed to not be the norm. Server configurations deviated wildly in practice, and while looking at some cross-referenced data, it annoyed me the other say. This lead to me asking the research question: To what extent do web server configurations operate with the maximum compression levels for gzip and brotli?

## Method and Descriptive Statistics

To investigate this question, I conducted a (quick) exploratory analysis of nginx server configuration practices as documented in publicly accessible GitHub repositories. Leveraging the GitHub REST API, I systematically queried the API to find via regex the presence and specified values of the [gzip_comp_level](https://nginx.org/en/docs/http/ngx_http_gzip_module.html#gzip_comp_level) and [brotli_comp_level](https://github.com/google/ngx_brotli?tab=readme-ov-file#brotli_comp_level) directives—key configuration parameters that regulate HTTP compression efficiency in nginx. According to the official nginx documentation, these parameters accept integer values within bounded ranges: gzip_comp_level permits values from 1 to 9, and brotli_comp_level from 0 to 11, with both defaulting to 6. These parameters offer developers a means to calibrate server-side performance trade-offs between compression efficacy and computational overhead.

Mindful of GitHub’s API query rate limitations (which I experienced to great effect when building my dataset for Study 2 and Study 3 as part of my PhD dissertation), I assembled a set of 970 discrete configuration instances containing declared `gzip_comp_level` values. Descriptive analysis of this dataset revealed a mean compression level of approximately 4.88 (SD = 1.67), with the median value at 5 and the modal value at 6. This pattern indicates a near-symmetric distribution centered slightly below the default, with minimal right-skew (skewness = .05). All allowable values (1 through 9) were represented, confirming the full exploitation of the compression parameter’s expressive range. The distribution also displayed platykurtic characteristics (kurtosis = -.66), suggesting a slightly flattened shape relative to the Gaussian norm, with thinner tails and reduced extremity.

The corresponding dataset for `brotli_comp_level` was comparatively smaller, comprising 784 valid observations. Here, the average compression level was somewhat higher at 5.87 (SD = 1.67), with both the median and the mode aligning with the default level of 6, signaling a pronounced normative convergence. The distribution exhibited moderate positive skewness (skewness = .72), indicating a discernible, though not extreme, inclination toward higher compression levels. In contrast to the gzip configuration, the kurtosis for brotli_comp_level was elevated (kurtosis = 3.86), suggesting a leptokurtic distribution characterized by a sharper peak and heavier tails, which implies a greater concentration of values around the central tendency interspersed with sporadic deviations.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-samples-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-samples-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-samples-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-samples-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-samples-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-samples-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-samples-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-samples-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-samples-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-samples-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20250506-compare-samples-800.png" alt="Bar graphs of gzip_comp_level and brotli_comp_level showing roughly normal distributions with no skew to maximum compression settings.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">Bar graphs of gzip_comp_level and brotli_comp_level showing roughly normal distributions with no skew to maximum compression settings.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

These descriptive findings offer an initial empirical window into developers’ configuration behavior with respect to server-side compression practices, revealing shared conventions (e.g., accepting the default compression levels) and distributional nuances across the two compression schemes.

## A Forked and Opinionated Rollup Plugin

The descriptive statistics help us understand that not all developers set compression settings to the maximum available value. While I won't make any casual claims as to why that is (that would be not-so-great-science), future research would be wise to look into the cost/benefit of compression level trade-off at higher levels at the server and client levels (which frankly, would take me more time). Our analysis does allow that we should have some flexibility when being able to read this signal in our build pipelines however to align with our infrastructure.

So what’s a web performance fella to do? We fork and do some rewriting, that’s what.

Subsequently, I forked Wes's [rollup-plugin-size](https://github.com/luwes/rollup-plugin-size) and released my opinionated version of a rollup build size reporter, [rollup-plugin-asset-build-size-compare](https://github.com/justinribeiro/rollup-plugin-asset-build-size-compare). This version builds off our findings and allows:

1. Allows setting of `compressionLevel` to be able to fine tune to match you server configuration.

{{< codeblock lang="javascript" >}}
// rollup.config.js
import size from '@justinribeiro/rollup-plugin-asset-build-size-compare';

//...
plugins: [
  size({
    compression: 'brotli',
    compressionLevel: 8,
  })
]
{{< /codeblock >}}

2. Allows multiple invoke and writing of different statistic files, so you can compare compression options.

{{< codeblock lang="javascript" >}}
// rollup.config.js
import size from '@justinribeiro/rollup-plugin-asset-build-size-compare';

//...
plugins: [
  size({
    compression: 'brotli',
    filename: '.build-size-brotli.json',
  }),
  size({
    compression: 'gzip',
    filename: '.build-size-gzip.json',
  }),
]
{{< /codeblock >}}

I've made some other minor revisions, particularly around cleaning up and documenting the internals. This is mostly for my own edification but also so I can begin building in some additional features based on some other findings to be reported later.

You can get started using the latest version by install from NPM:

{{< codeblock lang="bash" >}}
npm i -D @justinribeiro/rollup-plugin-asset-build-size-compare
# or
yarn add @justinribeiro/rollup-plugin-asset-build-size-compare --dev
{{< /codeblock >}}

## Limitations

For my initial exploration, data acquisition was conducted expediently via GitHub’s Search API, without further stratification or segmentation of the repositories in which the compression directives were identified. I did not look at other uses of similar directives (e.g., Apache), nor did I run additional robustness checks; my analysis remains intentionally descriptive in scope. Accordingly, I will refrain from advancing any causal inferences as to why directives are used in these ways (that wouldn't exactly be great science).

Nevertheless, given my brief read through the lit stream, previous research (with a dash of common sense I would contend) has demonstrated that compression is not without computational cost on either the server or client side. Decompression (or deflation) overhead can precipitate performance regressions under specific conditions; it was not an unknown cost on mid and low-tier mobile devices for instance (though my previous data on that is quite antiquated and could use a revision). Regardless, further research with a more rigorous methodological design would be warranted.

And frankly, I had a spare moment. Why not have some fun. :-)

