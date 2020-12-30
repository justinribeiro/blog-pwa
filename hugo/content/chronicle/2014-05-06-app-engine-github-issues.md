---
tags:
- app-engine
- github
date: 2014-05-06T00:00:00Z
title: Google App Engine and the Github hook issues
url: /chronicle/2014/05/06/app-engine-github-issues/
---

I went ahead and took a bit the bullet and switched over a couple smaller if-it-breaks-no-one-will-call-screaming projects to the recent App Engine feature, the Gitub hook.

## It's like git push-to-deploy, but it's not

If you used the other git method that Google offered, the github hook works similar, sorta. The key difference is that that when you pushed via git directly to the Google source repo, you'd get the build pack right there on your console and it would spew forth interesting and useful messages when things were catching on fire.

The Github hook doesn't do this (mind you it shouldn't...it's a post-hook). So if you need to verify that your recent merge into your master branch did in fact get pulled, packed and deployed you need to log into the Google Cloud console and check under Cloud Development to see how things went.

## Humm, red can't be good

Then you might notice some red icons saying your deploy failed and you then see messages like in the screenshot below.

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2014/05/screenshot-20140505-appenginedeployerror.png" alt="Errr, that's not good." />

You then again check the documentation and note that humm, automatic_scaling is correct but App Engine seems very angry about this. So you fiddle with it, only in the end to learn that removing it completely solves the problem (at least in terms of deploying with git).

What gives? The reality, similar tp my [post on the builtins](/chronicle/2014/04/04/issue-app-engine-git-deploy-builtins-error/), is that pushing code via git (in this case Google's git source repo or Github) can lead to unexpected results. This is fairly well documented in the App Engine tracker, but if you can't be bothered to run a push via non-git repo methods and you need to change configuration, it's not currently going to work for now.