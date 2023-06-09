---
title: "App Engine task queue and ngrok, with a splash of commenting out ModuleDoesNotExistError exception"
description: ""
date: 2014-03-27T16:00:00-07:00
tags:
- Web
---

Ever try to use a task queue for App Engine but you find yourself using ngrok for local routing from say a Mirror API subscription ping and it's giving you a ModuleDoesNotExistError because the push queue expects a relative path?

The quick fix is to change dispatcher.py in google_appengine\google\appengine\tools\devappserver2 to not raise the exception and tack on "" to resolve the issue.

Hat tip to Chris Bartling for the [blog post](http://bartling.blogspot.com/2014/01/google-app-enginepython-using-task.html) that sent me in the right direction.

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/19jvm9ppyoq02.png" alt="App Engine task queue and ngrok, with a splash of commenting out ModuleDoesNotExistError exception">