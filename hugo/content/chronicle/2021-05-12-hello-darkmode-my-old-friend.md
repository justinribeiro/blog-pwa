---
title: "Deep Into That Darkness (Mode) Peering"
description: "blog-pwa gets a prefers-color-scheme makeover for those seeking a more dark color theme experience for accessibility or aesthetic reasons."
date: 2021-05-12T14:38:10-07:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210513-darkmode-rad-sauce-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210513-darkmode-rad-sauce-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210513-darkmode-rad-sauce-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210513-darkmode-rad-sauce-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210513-darkmode-rad-sauce-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20210513-darkmode-rad-sauce-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210513-darkmode-rad-sauce-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210513-darkmode-rad-sauce-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210513-darkmode-rad-sauce-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20210513-darkmode-rad-sauce-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url(''data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\''http%3A//www.w3.org/2000/svg\'' xmlns%3Axlink=\''http%3A//www.w3.org/1999/xlink\'' viewBox=\''0 0 1280 853\''%3E%3Cfilter id=\''b\'' color-interpolation-filters=\''sRGB\''%3E%3CfeGaussianBlur stdDeviation=\''.5\''%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\''discrete\'' tableValues=\''1 1\''%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\''url(%23b)\'' x=\''0\'' y=\''0\'' height=\''100%25\'' width=\''100%25\'' xlink%3Ahref=\''data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\''%3E%3C/image%3E%3C/svg%3E'');"
      src="https://storage.googleapis.com/jdr-public-imgs/blog/20210513-darkmode-rad-sauce-800.png" alt="A screenshot from Chrome DevTools showing both light and dark  of blog-pwa.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">A screenshot from Chrome DevTools showing both light and dark  of blog-pwa.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20210513-darkmode-rad-sauce-800.png"

tags:
 - web
---

I don't know why I dragged my feet on adding `prefers-color-scheme` to blog-pwa. The [working draft spec](https://drafts.csswg.org/css-color-adjust-1/) has been around a couple years, there's been various support in most browsers and operating systems in some shape or form since around that time as well. I'd seen various implementations the last year that showed the mode was a win for accessibility and power savings.

Yet, it just didn't make the list of things-to-do. Until today.

## My Approach

Dark mode for me is a user choice that people are _really in to_ for what ever reason they may have. Maybe they like the aesthetic, maybe they need the inversion of color for accessibility reasons. Regardless I set forth to do two things:

1. Respect the choice people are making with `prefers-color-scheme`.
2. Respect the light environment they're in with `AmbientLightSensor` and adjust as needed.

On the surface these seem simple enough. "That's what the spec is for Justin" you might be thinking. My primary concern is a case of less complexity for users and a smooth experience.

## The Setup

The first thing I did was make sure my CSS custom properties were indeed square and up-to-date, so that I could easily switch between color themes with ease.

The color pallette in blog-pwa is not huge (fairly monochromatic as it is), so this was a simple enough to simply copy some props and fate them in a `:root[darkmode]` selector:

{{< codeblock lang="css" >}}
:root {
  color-scheme: light dark;
  --bg: #ffffff;
  --primary-text-color: #212121;
  --secondary-text-color: #757575;
  --accent-color-primary: #0049A3;
  --accent-color-secondary: #943D0A;
  --section-color: #e6e6e6;
  --structs-bg: #f1f1f1;
  --structs-hi: #940088;
  --structs-border: #cccccc;
  --skeleton-bg: #cccccc;
  --notice-color-bg: #333333;
  --notice-color-text: #ffffff;
  --notice-color-link: #f1f900;

  /* et cetera... */
}
:root[darkmode] {
  --bg: #121212;
  --primary-text-color: #fafafa;
  --secondary-text-color: #F1f1f1;
  --accent-color-primary: #81d7ff;
  --accent-color-secondary: #D06262;
  --section-color: #444;
  --structs-bg:#333;
  --structs-hi: #FF94F6;
  --structs-border: #555;
  --skeleton-bg: #cccccc;

  /* et cetera... */

  --image-filter: grayscale(50%);
}
{{< /codeblock >}}

A couple of things to note:

1. I set `color-scheme` in the my `:root` CSS pseudo-class to tell the browser do some magic based on what I'm supporting, like setting my form fields and scroll bars to the correct colors.
2. I pull the colors down of all my images with `--image-filter: grayscale(50%)`. This is based on [Thomas Steiner's research about re-colorization](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b) and is further noted in his excellent [reference write-up on web.dev](https://web.dev/prefers-color-scheme/).

This gets me into two modes of color that I can now toggle. Now I just need to figure out which the user prefers.

## Respect the choice, JavaScript edition

In a lot of examples floating around, light and dark mode becomes a toggle in some random place in your application. Github has a toggle they'd been testing and there's even a web component that does this very thing, [dark-mode-toggle](https://github.com/GoogleChromeLabs/dark-mode-toggle), from my colleagues over at Google Chrome.

In both cases, I get it: give the user a choice, test some things out in the process. But if the user has already made that call, then why the hunt-and-switch? Just not my style.

Instead, I went with a check-and-set approach, using the `window.matchMedia` to handle this when the main blog-pwa web component starts up and then listen for changes if the user flips some switches at the operating system level.

{{< codeblock lang="javascript" >}}
// blog-pwa.js
// ...

__setupDarkMode() {
  window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
    const darkModeOn = e.matches;
    const cHtml = document.querySelector(':root');
    if (darkModeOn) {
      cHtml.setAttribute('darkmode', '');
    } else {
      cHtml.removeAttribute('darkmode');
    }
  });

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector(':root').setAttribute('darkmode', '');
  }
}
{{< /codeblock >}}

With that little bit of code, we're good to go. Well, except if JavaScript is disabled.

## Respect the choice, no JavaScript edition

Given the static render case, maybe someone still wants a dark theme but isn't running JavaScript. blog-pwa supports this already due to the architecture (yes, I wanted Lynx support), but could I make dark mode work? Sure enough, we simply set a media query in our static template and we're good to go:

{{< codeblock lang="css" >}}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #121212;
    --primary-text-color: #fafafa;
    --secondary-text-color: #F1f1f1;
    --accent-color-primary: #81d7ff;

    /* yada yada yada ... */
  }
}
{{< /codeblock >}}

Boom: more support for users, no matter what their preference.

## Stop the eye burning with AmbientLightSensor

The one thing that annoys me most about most light/dark toggles is that I don't want to have to flip them all the time. If I'm in a sunny room with lots of light, a dark theme does not suffice in most cases. If I'm lying in bed at night reading, I really want dark mode.

Alas, I felt like I could toy with this concept with `AmbientLightSensor`. This of course isn't my first go-around with that [API](https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor); I built my [PWA speedometer](/chronicle/2019/01/31/tiny-pwas-and-why-i-keep-building-them/) with that API a while back (much to the vitriol of the orange site internet trolls who pummeled my inbox for some unknown reason). This time around, I just wanted it to trigger dark mode if the light was low (presuming the user hadn't already made that choice):

{{< codeblock lang="javascript" >}}
// blog-pwa.js
// ...

__setupDarkMode() {
  window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
    const darkModeOn = e.matches;
    const cHtml = document.querySelector(':root');
    if (darkModeOn) {
      cHtml.setAttribute('darkmode', '');
    } else {
      cHtml.removeAttribute('darkmode');
    }
  });

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector(':root').setAttribute('darkmode', '');
  } else if ('AmbientLightSensor' in window) {
    navigator.permissions
      .query({ name: 'ambient-light-sensor' })
      .then(result => {
        if (result.state === 'denied') {
          return;
        }
        const sensor = new AmbientLightSensor({ frequency: 0.25 });
        sensor.addEventListener('reading', () => {
          const cHtml = document.querySelector(':root');
          if (sensor.illuminance < 3) {
            cHtml.setAttribute('darkmode', '');
          } else if (sensor.illuminance > 3) {
            cHtml.removeAttribute('darkmode');
          }
        });
        sensor.start();
      });
  }
}
{{< /codeblock >}}

How useful this is given it's behind a chromium flag is meh (#enable-generic-sensor-extra-classes for those so inclined), but I'm playing with it to see if I gives me an okay experience. Jury is still out, but I think the pattern would hold well in practice for most applications.

## The end is into the darkness or something

In all, it's not a lot of code to write. The standards are still in flux, but are workable to be able to deliver to users who need a darker theme with not much trouble.

The hardest part? Getting the dark mode colors not only pleasing but also WCAG 2.1 compliant. Color is not exactly my thing says the black and white film photographer. Who would have guessed. :-)