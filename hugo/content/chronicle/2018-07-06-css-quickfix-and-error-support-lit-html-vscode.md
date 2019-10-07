---
date: 2018-07-06T08:00:00-08:00
title: "Added CSS quickfix and error reporting to lit-html-plugin for VS Code"
description: "With version 1.6.0, CSS quickfix and error reporting becomes part our of lit-html tagged template editing experience."
imagetwitter: "https://storage.googleapis.com/jdr-public-imgs/blog/20180706-vscode-cssquick-twitter-1024x535.jpg"
imagefb: "https://storage.googleapis.com/jdr-public-imgs/blog/20180706-vscode-cssquick-fb-1200x630.jpg"
imagegplus: "https://storage.googleapis.com/jdr-public-imgs/blog/20180706-vscode-cssquick-gplus-800x360.jpg"
tags:
- Web
---

It took a little effort to get it just right, but I've been able add CSS quickfix and error reporting to the [typescript-lit-html-plugin](https://github.com/Microsoft/typescript-lit-html-plugin) language plugin for VS Code. In the video below, we can see css quickfix and error reporting working for the `<style>` block without any fancy user settings (albiet with a flame emoji that didn't make it into the pull request :-). It's also smart enough to understand the difference between the various other pieces of code that might be in your tagged template.

<video autoplay loop muted playsinline>
  <source src="https://storage.googleapis.com/jdr-public-imgs/blog/sc-2018-07-06-css-quickfix-lit-html-vscode.webm" type="video/webm">
  <source src="https://storage.googleapis.com/jdr-public-imgs/blog/sc-2018-07-06-css-quickfix-lit-html-vscode.mp4" type="video/mp4">
</video>

Many thanks again to Matt over at Microsoft for putting up with my questions and taking the time to review and merge that pull request.

You can start using this now by grabbing the plugin [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) or by configuing the [language service](https://github.com/Microsoft/typescript-lit-html-plugin) for your editor of choice (see project readme for details).