---
date: 2018-06-12T08:00:00-08:00
title: "Added svg support to lit-html VS code extension"
description: "Helping make Visual Studio code extensions better upstream."
imagetwitter: "https://storage.googleapis.com/jdr-public-imgs/blog/20180608-pr-vscode-lithtml-twitter-1024x535.jpg"
imagefb: "https://storage.googleapis.com/jdr-public-imgs/blog/20180608-pr-vscode-lithtml-fb-1200x630.jpg"
imagegplus: "https://storage.googleapis.com/jdr-public-imgs/blog/20180608-pr-vscode-lithtml-gplus-800x360.jpg"
---

I found myself wanting to do some of the cooler
[lit-html](https://github.com/Polymer/lit-html) svg partial templates for a
thing I'm working on, but I found that VS Code didn't have support for syntax
highlighting within the template literal.

I set forth to build an extension for this case, but found that [Matt
Bierner](https://twitter.com/mjbvz) had already built
[vscode-lit-html](https://github.com/mjbvz/vscode-lit-html). Since I am not a
fan of reinventing things, I instead just
[pulled](https://github.com/mjbvz/vscode-lit-html/pull/26) into his repo and he
accepted and released a new version.

<img src="https://storage.googleapis.com/jdr-public-imgs/blog/20180608-pr-vscode-lithtml-gplus-800x360.jpg" alt="Sample of the new svg support in vscode-lit-html">

If I haven't mentioned that I quite like VS Code and the developer ecosystem around it, I do. A lot.