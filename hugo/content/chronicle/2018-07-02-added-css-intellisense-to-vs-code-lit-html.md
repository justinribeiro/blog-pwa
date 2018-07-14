+++
date = "2018-07-02T08:00:00-08:00"
title = "Added CSS intellisense to lit-html-plugin for VS Code"
description = "With version 1.4.1, CSS intelliense becomes part our of lit-html tagged template editing experience."
imagetwitter = "https://storage.googleapis.com/jdr-public-imgs/blog/20180702-vscode-css-twitter-1024x535.jpg"
imagefb = "https://storage.googleapis.com/jdr-public-imgs/blog/20180702-vscode-css-fb-1200x630.jpg"
imagegplus = "https://storage.googleapis.com/jdr-public-imgs/blog/20180702-vscode-css-gplus-800x360.jpg"
+++

After a little bit of digging and some debugging, I was able to complete the addition of CSS intellisense into the [typescript-lit-html-plugin](https://github.com/Microsoft/typescript-lit-html-plugin) language plugin for VS Code. In the video below, we can see css intellisene working for the `<style>` block without any fancy user settings. It just works, and gives a nice clean developer experience that one would expect when authoring lit-html or Polymer/lit-element based web components.

<video autoplay loop muted playsinline>
  <source src="https://storage.googleapis.com/jdr-public-imgs/blog/sc-2018-07-02-css-intellisense-lit-html-vscode.webm" type="video/webm">
  <source src="https://storage.googleapis.com/jdr-public-imgs/blog/sc-2018-07-02-css-intellisense-lit-html-vscode.mp4" type="video/mp4">
</video>

Many thanks to Matt over at Microsoft for taking a look and getting the the pull request merged.

You can start using this now by grabbing the plugin [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) or by configuing the [language service](https://github.com/Microsoft/typescript-lit-html-plugin) for your editor of choice (see project readme for details).
