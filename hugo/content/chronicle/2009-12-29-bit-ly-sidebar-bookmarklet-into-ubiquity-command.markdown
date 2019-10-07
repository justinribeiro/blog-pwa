---
tags:
- ubiquity
- script
date: 2009-12-29T12:57:43Z
description: "Converting the Bit.ly sidebar bookmarklet into an Ubiquity command is just three lines away!"
title: "Bit.ly sidebar bookmarklet into Ubiquity command"
url: /chronicle/2009/12/29/bit-ly-sidebar-bookmarklet-into-ubiquity-command/
---

If there is one thing that annoys me, it's very long links.  But what annoys me even more is having to open up a URL shorter service to generate said short link.  Bookmarklets, small pieces of javascript in bookmark form, work very well...but I don't run the bookmark tool bar or want another button to deal with.  Instead, I'd much prefer to use <a href="https://mozillalabs.com/ubiquity/">Ubiquity</a>, a command interface for Firefox.

It just so happens you can turn any bookmarklet into an Ubiquity command in just three lines of code.  There is a <a href="http://www.azarask.in/blog/post/ubiquity-tutorial-turn-bookmarklets-into-commands/">very clear tutorial</a> on the subject (complete with video walkthrough).

I decided that I wanted to run the <a href="http://bit.ly/pages/tools">bit.ly sidebar bookmarklet</a>, which will not only shorten the link for the current page you're viewing, but also give the the stats on said link (traffic, conversations, and history). I added a short description and the icon to my version of the command (which makes it a couple lines longer), but it works a treat!  Below you'll find the command to install (you'll need Ubiquity installed first).

<a href="/projects/ubiquity/bitly-sidebar-slideout.html">Bit.ly sidebar slideout Ubiquity command</a>

The source code is below:

{{< codeblock lang="javascript" >}}
CmdUtils.makeBookmarkletCommand({
name: "bit.ly sidebar slideout",
icon: "http://bit.ly/static/images/favicon.png",
description: "Conversion of bit.ly sidebar bookmarklet; slides out to shorten your long link, then shows Traffic, Conversations, and History.",
homepage: "http://justinribeiro.com/projects/ubiquity/bitly-sidebar-slideout.html",
author: {name: "Justin Ribeiro", email: "justin@justinribeiro.com"},
license: "GPL",
url: "javascript:var%20e=document.createElement('script');e.setAttribute('language','javascript');e.setAttribute('src','http://bit.ly/bookmarklet/load.js');document.body.appendChild(e);void(0);"
});
{{< /codeblock >}}

Simple, quick, effective.  Just how I like it!

Note, if you've got the Mozilla General Utility Commands installed, you can use the "create bookmarklet" command that is available to convert any bookmarklet(s) you already have into a Ubiquity command.  So even if you don't want to muck around with three lines of code, you can still use the power of Ubiquity.
