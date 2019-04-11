# blog-pwa

What started as an experiment in mixing Hugo, Polymer, and the PRPL pattern to build a progressive web app blog that turned into my actual blog.

## Features

* It's a progressive web app with all the fixin's (service worker, PRPL pattern, H2, et cetera)
* The base PWA component and it's bundle weight just *17.1KB* gzip'ed.
* Renders if there is no JavaScript via `<noscript>` injected fallback to static generation
* Renders metadata to linkbots when sharing without the need for client JavaScript via server side detection and alternative render path

## The basics

* [lit-element](https://lit-element.polymer-project.org/) app shell and web components
* [Hugo](https://gohugo.io/) to manage posts and metadata
* [workbox](https://developers.google.com/web/tools/workbox/) for generating precache and runtime caching service worker
* [rollup](https://rollupjs.org) for component bundles and splitting for our PRPL loading
* [h2-push via http2push-gae](https://github.com/GoogleChrome/http2push-gae) for Google App Engine for serving
* Polyfills only load on need; no extra bytes shipped (including for dynamic imports).

## The not-so-basics

I wrote a couple `zsh` utility scripts to power most of the shuffle and build of the site. Why not an `npm` script or a `gulp` or `grunt` task you ask? Frankly, because I just felt like writing some shell scripts. Don't you want to sometimes just write some shell scripts? Is that just me?

The gist of the tools employed and their uses include.

* `sed` is amazing and helps wrangle some of the JSON output from Hugo (years of old posts + multiple times moved = fun!)
* `zmv` is the thing you've probably never heard of about but might want to try. Renames files fast to proper type (Hugo won't output pure JSON at moment)
* `jq` is blazing fast over lots of files; validates my json output so I know things will load in the PWA and Python
* `polymer-cli` handles the dev serving
* `workbox-cli` handles the service worker generation
* `rollup cli` handles the es modules and bundles splitting for prod builds
* `http2-push-manifest` is super useful and works out of the box with http2push-gae

## Setup

```bash
➜ git clone git@github.com:justinribeiro/blog-pwa.git
➜ cd blog-pwa
➜ chmod +x utilities/builder.zsh

# check for tooling
➜ ./utilities/builder.zsh -t check

# get deps
➜ ./utilities/builder.zsh -t setup

# run dev env
➜ ./utilities/builder.zsh -t dev
```

## By the web perf numbers

A progressive web app is only as good as the web performance it offers. I mean, who wants to sit around waiting 10 seconds for a blog post to initially load? No one.

Pulling up a trusty Moto G4 on 3G over on WebPageTest, we can see just how fast we are:

![image](https://user-images.githubusercontent.com/643503/55971657-c1beb100-5c36-11e9-83d6-7029fc27670a.png)

Just want the traces and the raw numbers? Check out the [results on WebPageTest](https://www.webpagetest.org/result/190411_T6_d96d381edba4bfb2726642074cb7e136/).
