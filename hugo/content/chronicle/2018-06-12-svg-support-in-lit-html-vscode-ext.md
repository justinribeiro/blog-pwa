---
date: 2018-06-12T08:00:00-08:00
title: "Added svg support to lit-html VS code extension"
description: "Helping make Visual Studio code extensions better upstream."
imagetwitter: "https://storage.googleapis.com/jdr-public-imgs/blog/20180608-pr-vscode-lithtml-twitter-1024x535.jpg"
imagefb: "https://storage.googleapis.com/jdr-public-imgs/blog/20180608-pr-vscode-lithtml-fb-1200x630.jpg"
imagegplus: "https://storage.googleapis.com/jdr-public-imgs/blog/20180608-pr-vscode-lithtml-gplus-800x360.jpg"
tags:
- Web
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

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog/20180608-pr-vscode-lithtml-gplus-800x360.jpg" alt="Sample of the new svg support in vscode-lit-html">

If I haven't mentioned that I quite like VS Code and the developer ecosystem around it, I do. A lot.