---
title: "Workaround for Karma and Chrome headless on Windows Subsystem for Linux, ala WSL"
description: "A quick workaround for running tests when Chrome doesn't want to play nice inside WSL."
date: 2019-10-02T15:26:00-07:00
tags:
- Web
---

Windows Subsystem for Linux (WSL) is a vastly useful thing. When I do work on Windows for those certain projects, WSL has made my life significantly easier.

One the gaps however is that running Chrome headless within WSL is difficult. I'm not blaming WSL for this (it's basically a namespace problem which I'd expect). There are workarounds to be sure, usually involving single process and disabling the GPU, but in a recent demo I was running showcasing [open-wc](https://open-wc.org/) and [karma](http://karma-runner.github.io/latest/index.html), I was in a bind for a workaround on short notice. The fix is it's faster and easier to point to the pre-installed Chrome binary on Windows.

Doing this requires setting the `CHROME_BIN` env variable, which will allow chrome headless to work without issue when using karma:

{{< codeblock lang="bash" >}}
~/src/jdr-wc-template master*
➜  export CHROME_BIN=/mnt/c/Program\ Files\ \(x86\)/Google/Chrome/Application/chrome.exe

~/src/jdr-wc-template master*
➜  yarn test

yarn run v1.19.0
$ karma start --coverage
START:  &lt;your-component&gt;
✔ has a default property hello
✔ allows property hello to be overwritten

Finished in 0.055 secs / 0.038 secs @ 15:23:16 GMT-0700 (Pacific Daylight Time)

SUMMARY:
✔ 2 tests completed

TOTAL: 2 SUCCESS
{{< /codeblock >}}

This is actually one of the cooler things about WSL; you can integrate executables between environments.

Will this fix all your headless chrome problems in the WSL? Probably not; some of my basic headless examples don't run in this configuration. But if you need to run some tests real quick like, this fix just might be for you.
