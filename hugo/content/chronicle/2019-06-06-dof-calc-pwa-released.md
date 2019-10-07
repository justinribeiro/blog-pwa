---
title: "Building a tiny PWA for calculating depth of field for my film cameras"
description: "Just because I shoot film doesn't mean I can't come up with another tiny progressive web app to help."
date: 2019-06-06T18:13:21-07:00
tags:
- Web
---

My overall addiction to writing tiny progressive web apps only continues to grow. Since that addiction is growing I decided to mix it with another addiction of mine, film photography.

Yep, still shooting film. Look around the [archives](/chronicle/) and you will not doubt find other written pieces of my adventures [fixing film cameras](/chronicle/2019/04/22/repairing-a-busted-copal-0-aperture-and-custom-printing-a-lens-board/) and lens and [developing film](/chronicle/2019/04/08/developing-4x5-kodak-super-xx-film-pack-with-an-sp-445/). I even have a darkroom in my house...gasp!

Alas, I love mixing the old and the new. So I decided to do some math and fill a gap I often have, the [depth of field calculator pwa](https://dof-calculator.pwa.run/). I readily admit this is niche to say the least (then again, so are all my other tiny PWAs). If you've ever jumped between film formats and you're not using a ground glass and you're just trying to recall what the acceptable sharpness is for a given shot, then this is the PWA for you. Well, at least if you want the simple version.

This PWA weights in at just 3.4KB gzipped. It's not particularly fancy; it allows you to define your own lens and film combinations (which many other online dof calculators don't do which always frustrated me), and allows to find the most common numbers you'd need (such as hyperfocal distance). It is by no means is exhaustive. It won't handle tilt or find the Scheimpflug wedge (I use a loupe on a ground glass, so I never calc that number which I find is not very useful in the field...a personal choice to be sure).

But, like many of my other tiny PWAs it does the one thing I need it to do, and only that. No cloud save. No 75MB download. Just me, a tiny bit of code running really fast, and a number that I need.

All the [source code is available on github](https://github.com/justinribeiro/dof-calculator-pwa) and you can use the PWA on [https://dof-calculator.pwa.run/](https://dof-calculator.pwa.run/). As always, pull requests and bug reports are welcome.

Now go shoot some film! Or digital! Just get out there and make some photographs with whatever you've got (remember: it's supposed to be fun).