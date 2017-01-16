---
categories:
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

<img src="/images/blog/2014/05/screenshot-20140505-appenginedeployerror.png" alt="Errr, that's not good." />

You then again check the documentation and note that humm, automatic_scaling is correct but App Engine seems very angry about this. So you fiddle with it, only in the end to learn that removing it completely solves the problem (at least in terms of deploying with git).

What gives? The reality, similar tp my [post on the builtins](/chronicle/2014/04/04/issue-app-engine-git-deploy-builtins-error/), is that pushing code via git (in this case Google's git source repo or Github) can lead to unexpected results. This is fairly well documented in the App Engine tracker, but if you can't be bothered to run a push via non-git repo methods and you need to change configuration, it's not currently going to work for now.