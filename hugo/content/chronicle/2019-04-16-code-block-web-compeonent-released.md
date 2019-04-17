---
title: "code-block v0.1 web component released"
date: 2019-04-16T21:47:30-07:00
description: "Based on Prism.js and LitElement, code-block makes dropping code in simple."
imagetwitter: "https://storage.googleapis.com/jdr-public-imgs/blog/20190416-code-block-custom.jpg"
imagefb: "https://storage.googleapis.com/jdr-public-imgs/blog/20190416-code-block-custom.jpg"
imagegplus: "https://storage.googleapis.com/jdr-public-imgs/blog/20190416-code-block-custom.jpg"
---

Over the last couple of months I've gotten a few emails asking how exactly I make my code samples on this blog work. In the past that would have been a harder question to answer (my original web component for this was less than ideal) but with my recent spring updates, I thought it would be nice to break out that very feature.

Announcing `<code-block>`, a [LitElement](https://lit-element.polymer-project.org/)-based web component that utilizes [Prism.js](https://prismjs.com/).

<img src="https://storage.googleapis.com/jdr-public-imgs/blog/20190416-code-block-custom.jpg" alt="code-block in action">

It's available on [npm](https://www.npmjs.com/package/@justinribeiro/code-block):

{{< codeblock lang="bash" >}}
$ npm i @justinribeiro/code-block
$ yarn add @justinribeiro/code-block
{{< /codeblock >}}

Or you can grab it from the [repo](https://github.com/justinribeiro/code-block):

{{< codeblock lang="bash" >}}
$ git clone git@github.com:justinribeiro/code-block.git
{{< /codeblock >}}

From there, just write code in the element like any 'ol html element.

{{< codeblock lang="markup" >}}
&lt;code-block language=&quot;fortran&quot; theme=&quot;/node_modules/prismjs/themes/prism-okaidia.css&quot;&gt;
program HelloWorld
  write (*,*) 'Hello, world!'   ! This is an inline comment
end program HelloWorld
&lt;/code-block&gt;
{{< /codeblock >}}

Like the version I run on this blog, this component uses dynamic language imports that way you don't have to carry additional weight in your bundle (load only what you need). The v0.1.0 version also includes support for themes, so you can just pass it the path of a theme CSS file and it'll do the rest.

The biggest hurdle with this setup is that you _have_ to make sure you take the `/node_modules/prismjs/**`, otherwise the loading doesn't quite work correctly. I considered alternative approaches, but mostly it had me duplicating large portions of Prism's language support and that seemed very ill-advised.

In the future I'd like to see if I can enable Prism's vast plugin support. In the mean time, grab it, embed some code somewhere, web component style.