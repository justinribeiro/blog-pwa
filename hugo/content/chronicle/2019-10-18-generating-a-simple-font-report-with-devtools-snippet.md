---
title: "Generating a Simple Font Report With a Devtools Snippet"
description: "Sometimes you just need to know what font definitions are on a page and simple DevTools snippet with TreeWalker can help."
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
<picture>
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-640.webp 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-800.webp 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-1024.webp 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-1280.webp 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-1600.webp 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-640.png 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-800.png 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-1024.png 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-1280.png 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-1600.png 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/png">
  <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-800.png" alt="devtools snippet font report">
<figcaption itemprop="caption description">
<span aria-hidden="true">A screenshot of the DevTools console output of the snippet running against justinribeiro.com.</span>
<span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
</figcaption>
</figure>'
date: 2019-10-18T09:23:42-07:00
tags:
- Web
---

As with most weekday mornings, links and articles are dropped into our random channel as either points of potential interest or swords drawn discussion. The topics have a lot of range, but the one that recently caught my eye was and article regarding finding [improper font definitions in a page](https://blog.lemi.travel/how-my-butt-helped-fix-font-problems-on-the-web/).

The article had a useful premise, thought I wasn't big on the code example or the page injection (which I found hard to read personally, but your mileage will vary). Instead, I decided I'd just write a variation of the snippet to output a unique report and use the DOM's [TreeWalker](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker) instead.

TreeWalker has been in the [spec](https://dom.spec.whatwg.org/#interface-treewalker) and in browsers for a long time and allows you to get a given document's subtree and take a look at the nodes within. The nice thing about TreeWalker is that it's fast and if you've ever used say [lit-html](https://github.com/Polymer/lit-html/blob/a1b538f693abbc17d03ab84b96c497f63cd1535b/src/lib/template.ts#L53) or other such libraries, congratulations, you've used TreeWalker without even knowing it.

With our API in mind, we can transverse and go about finding out what our `getComputedStyle()` is for a given text node as in the DevTools snippet below.

{{< codeblock lang="javascript" >}}
function findTextNodesFor(element){
  let node;
  const discoveredTextNodes = [];
  const walkTree = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
  while(node = walkTree.nextNode()) {
    discoveredTextNodes.push(node);
  }
  return discoveredTextNodes;
}

weights = {
  100: "Thin",
  200: "Extra Light",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semibold",
  700: "Bold",
  800: "Extra Bold",
  900: "Black"
};

fonts = new Set();

findTextNodesFor(document.querySelector('body'))
  .filter(node => !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentNode.nodeName))
  .forEach(node => {
  const computedStyle = window.getComputedStyle(node.parentNode);
  const font = computedStyle.fontFamily || "";
  const size = computedStyle.fontSize;
  const weight = computedStyle.fontWeight;
  const weights = {
    100: "Thin",
    200: "Extra Light",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "Semibold",
    700: "Bold",
    800: "Extra Bold",
    900: "Black"
  };

  fonts.add(`${size} ${weights[weight]} ${font}`);
});

console.table([...fonts].sort());
{{< /codeblock >}}

This will output a nifty little table of only the unique fonts we find (if you've not used [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), I highly recommend you take a look at the docs to see how if can make your life easier).

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
<picture>
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-640.webp 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-800.webp 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-1024.webp 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-1280.webp 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-1600.webp 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-640.png 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-800.png 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-1024.png 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-1280.png 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-1600.png 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/png">
  <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20191018-devtools-font-report-800.png" alt="devtools snippet font report">
<figcaption itemprop="caption description">
<span aria-hidden="true">A screenshot of the DevTools console output of the snippet running against justinribeiro.com.</span>
<span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
</figcaption>
</figure>

Now, there are some gotcha's to keep in mind here:

1. This won't show you the browsers _computed_ display. Chrome DevTools for instance will show you the font(s) that system are actually being rendered as opposed to just the font definition that is being applied to the node.

2. This won't transverse the custom element with shadowDOM (because that's a whole other can of worms).

Sans that, you get a nice little way to see exactly what's being defined and if you may need to re-evaluate your font strategy.
