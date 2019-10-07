---
tags:
- web-fonts
- loaders
date: 2014-05-05T00:00:00Z
title: Slimming down web font deliverables
url: /chronicle/2014/05/05/slimming-down-webfonts/
---

Ah web fonts. You either hate'em or you...err you probably dislike them in some way. Used correctly, they can provide a great way to bring a different visual design to your web app. Used poorly, you end up with blank pages of nothingness or slow load times. This makes the web performance gods depressed.

## Get a font loader

Fonts in the head of your document might as well be holding a big sign that says "I like to block my render time!".

[Web Font Loader](https://github.com/typekit/webfontloader) makes life easier on a number of fronts. One, it'll load things via async so we don't block our page from painting as it spins waiting for fonts to download. Two, it gives a common interface for which to load fonts from any font provider we want (you Google and Fontdecks of the world and what not).

Yes, you have to handle the flash of unstyled content. But would you rather be closing in on that mystical 1000ms page load

## Do you really need all those letters?

Your web fonts use needs to go on a diet. Alas, you have options. Presuming your one of the users of Google Web Fonts (I hear there are a few of us out there: see the [view stats](https://www.google.com/fonts#Analytics:total)), you can use just the letters you need. Web Font Loader even supports this:

{{< codeblock lang="css" >}}
WebFontConfig = {
  google: {
    families: ['Roboto'],
    text: 'abcdedfghijklmopqrstuvwxyz!'
  }
};
{{< /codeblock >}}

## Slice some fonts down

I like me a good icon font. Who hasn't used [Font Awesome](http://fortawesome.github.io/Font-Awesome/) to fill in the gaps for when you designer is having one of those "the client asked for another insert-trendy-social-app icon"? And Font Awesome is indeed awesome...unless you don't need the who giant set of icons.

One, you can use just packs that Font Awesome now has or better yet, why not roll your own? [Fontello](http://fontello.com/) does just that, allowing to take only what you need from various fonts and packinging them into some slimmer and more useful. The project is open source and you can use it for all kinds of crazy font slicing and generatoring goodness (it'll even do the CSS for you).

## Worth the tiny cost of time

You don't randomly implement things for the sake of implementation. There needs to be a gain. The gain in this case is both rendering and page weight. A simple example is this very site; slicing down Font Awesome to the bare bones icons needed shaved 40KB. Moving Google Web Fonts into a async loader stopped blocking time in the head of my document by another 400ms. Those are wins.