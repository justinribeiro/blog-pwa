---
tags:
- app-engine
- git
date: 2014-04-04T00:00:00Z
title: 'Issue: error deploying builtins via App Engine git push-to-deploy'
url: /chronicle/2014/04/04/issue-app-engine-git-deploy-builtins-error/
---

I was testing some App Engine things today on one of our internal projects and ran into an interesting senario I had not seen before. If you use App Engine's git push-to-deploy and you make changes to your builtins in app.yaml, this will not get reflected in the updated running configuration.

In my case, I was getting 404's when using /_ah/queue/deferred.

The fix for this is to just do the usual appcfg.py update to push the build and this immediately fixes the issue.

I looked around and didn't come across many results of people having this problem I did find an existing open ticket, [Issue 10139: app.yaml builtins return 404 after push-to-deploy](https://code.google.com/p/googleappengine/issues/detail?id=10139) for this, so if you're have the same issue give it a star or leave some feedback on the ticket with any relevent information.
