---
title: "Zotero Google Scholar Citation Count Plugin v4.1 Released"
description: "New locale translations, new preferences panel, and new search options now included."
date: 2024-11-11T8:45:38-07:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20241111-zotero-7-gscc-v411-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20241111-zotero-7-gscc-v411-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20241111-zotero-7-gscc-v411-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20241111-zotero-7-gscc-v411-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20241111-zotero-7-gscc-v411-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20241111-zotero-7-gscc-v411-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20241111-zotero-7-gscc-v411-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20241111-zotero-7-gscc-v411-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20241111-zotero-7-gscc-v411-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20241111-zotero-7-gscc-v411-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20241111-zotero-7-gscc-v411-800.png" alt="The new preferences panel for Google Scholar Citation Count allowing search refinement.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The new preferences panel for Google Scholar Citation Count allowing search refinement.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20241111-zotero-7-gscc-v411-800.png"
tags:
 - zotero
 - software
 - release
 - oss
---

After a few refactors and some additional testing coverage, I’m rolling out [v4.1.1](https://github.com/justinribeiro/zotero-google-scholar-citation-count/releases/tag/v4.1.1) of my [Zotero Google Scholar Citation Count](https://github.com/justinribeiro/zotero-google-scholar-citation-count) plugin. This update brings not only general bug fixes, but also requested features, new controls, and a few thoughtful improvements to how you can interact with citation data.

First off, let's talk search matching. If you've ever played around with citation counts, you know it's a bit of an art (or maybe just a controlled chaos). Google Scholar still offers no sane API, so we have to fallback on search param hacking to really make this work. As has been common since a lot more people have started using the plugin, depending on your literature stream, matching can be painful to say the least.

To help improve the flexibility, I’ve added a new Preferences panel that gives you control adding/removing search parameters, letting you tighten or loosen how strict you want Google Scholar matching to be, depending on your use case. This is just the start point, my plan is to add more options as I tease out (and people offer feedback) around what offers the best matching available. For those in-depth research days when every match matters or when you're just trying to pull up the broad strokes—this one’s for you.

Also in v4.1, I've also brought back expanded locale translation support with some initial translations. This didn't make it over in the initial v4.0 version with the jump to Zotero 7, but it's not easier to contribute translations. See improvements that need to be made? Now it's easy: just make a pull request with the FTL files updated, and you're good to go. No more hacking dtd's or XMLs.

The release is available now: [v4.1.1](https://github.com/justinribeiro/zotero-google-scholar-citation-count/releases/tag/v4.1.1). Happy citing (and counting)!