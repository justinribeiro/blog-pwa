---
title: "Building module web workers for cross browser compatibility with rollup"
description: "With module based web workers not available in all browsers, that shouldn't stop us from enjoying writing ESM-based workers that just work. Let's explore an old concept with a new tooling twist."
date: 2020-07-17T10:30:01-08:00
imagetwitter: "https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-800.png"
imagefb: "https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-800.png"
imagegplus: "https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-800.png"
tags:
  - Web
---

[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) are an amazing piece of the web platform that more and more folks are (finally) starting to come around on. For those unfamiliar with web workers, they're a great way to free up your main thread for users to keep interacting while you handle more intensive work on another thread.

The problem with web workers in today's web platform building is, why can't I write them as modules? I'm hear to say, good news, you can, but you probably don't want to ship them that way.

On the surface, Chrome and Chromium based browsers today support module workers (do read [Jason Miller's write up on web.dev](https://web.dev/module-workers/) for a full lay of the land), but if you're like me, chances are they don't work everywhere yet where your users are. This leaves you with an annoying set of options:

1. Write all your web workers in the classic way with things like `importScripts` (which can cause execution pausing)
2. Write all your web workers in a more modern fashion of modules, and then do some build dancing

Now, I can attest to having attempted Option 1 with all matter of tooling around it. For anything that is beyond a basic examples, it becomes an absolute nightmare, particularly when shipping it on NPM for use within other projects.

Option 2 is similarly no picnic. A lot of the tooling that is really specific to particular cases. As an example, [Surma's rollup-plugin-off-main-thread](https://github.com/surma/rollup-plugin-off-main-thread) is a nice tool, but doesn't actually output an ES module for non-module worker cases (it'll build AMD, which is okay for most folks). In a lot of internal projects for clients I've worked on lately that are bare metal web, this however really throws their stacks for a loop and they just want that ESM buttery goodness.

What's a person to do? Let's talk about an 3000 year old approach. Well, maybe a decade, which might as well be 3000 years ago at this point on the web.

## Re-Purposing an Old Approach

Now, I'm a big user of [comlink](https://github.com/GoogleChromeLabs/comlink) (so lovely), so the examples below are going to include it even though for the sake of the example you could do this clearly without it. It however, will help illustrate another concept here in a second.

With that out of the way let's look a basic example. Let's define a simple module that asks for some data and then processes it:

{{< codeblock lang="javascript" >}}
// data.js
import * as Comlink from 'comlink/dist/esm/comlink.js';
import magicalFetchApiThing from './api.js';

export async function getSomeData(params) {
  // we take a long time, start it up and check later
  const holder = magicalFetchApiThing(params);

  // our module worker
  const worker = new Worker('./worker.js', { type: 'module' });
  const proxy = Comlink.wrap(worker);

  // where we at yo
  const response = await holder;
  const data = await proxy.hardWork(response);

  // allow the GC to collect wrapper port
  proxy[Comlink.releaseProxy]();

  return data;
}
{{< / codeblock >}}

And let's look at our worker that we might use:

{{< codeblock lang="javascript" >}}
// worker.js
import { expose } from 'comlink';
import { fancyAlgorithm } from './libs/ops.js';

function hardWork(data) {
  let processed = fancyAlgorithm(data);
  // ...yada yada yada checks
  return processed;
}

expose(hardWork);
{{< / codeblock >}}

All things equal if we ran this in Chrome we'd be golden and we've have a magical day. If we ran this in other browsers, not so much. It would be nice if we could keep writing in the modern ESM way, but still have our compat, and we can, with good 'ol `new Blob`. Let's rewrite our `data.js` sample:

{{< codeblock lang="javascript" >}}
// data.js
import * as Comlink from 'comlink/dist/esm/comlink.js';
import magicalFetchApiThing from './api.js';
import workerString from './dist/worker.js';

export async function getSomeData(params) {
  // api takes a long time, start it up and check late
  const holder = magicalFetchApiThing(params);

  // our module worker, in a string
  const workerBlob = new Blob([workerString]);
  const workerUrl = URL.createObjectURL(workerBlob);
  const worker = new Worker(workerUrl);
  const proxy = Comlink.wrap(worker);

  // where we at yo
  const response = await holder;
  const data = await proxy.hardWork(response);

  // allow the GC to collect wrapper port
  proxy[Comlink.releaseProxy]();

  return data;
}
{{< / codeblock >}}

Ignoring how we generate that `dist/worker.js` (we'll get to that in a second), what exactly is going on here?

1. [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) takes our string of data from our as-of-yet unexplained built `worker.js`. Think of it as a file (which, it is, just a lot of bytes).
2. We take said Blob and we use [URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) to create our addressable file. You'll be able to see it in DevTools within the network panel as such:

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img src="https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-800.png" alt="URL.createObjectURL and Blob combine for web platform super powers.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">URL.createObjectURL and Blob combine for web platform super powers.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

3. Since we now have a file and url, we just give that to `new Worker()` and we have our web worker (and works just the same with comlink).

> If you've been around the web platform water cooler over the years, you've probably seen this and it's best known as the inline worker approach. I want to say since like...2008? 2009? The old `BlobBuilder` days.

But how does one get that string to be able to just import? Well, it's time for a two line rollup plugin.

## Two Lines, No Waiting

If we take another look at DevTools, we can see that the imported module for the `import workerString from './dist/worker.js'` indeed has a lot of compressed script in it:

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-code-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-code-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-code-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-code-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-code-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-code-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-code-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-code-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-code-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-code-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img src="https://storage.googleapis.com/jdr-public-imgs/blog/20200717-devtools-worker-blob-code-800.png" alt="">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The code within the created URL and from our rollup build plugin.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

Under the hood, if we're using `import` as in the example, then you have probably already pieced together that our code in that file must look something like this:

{{< codeblock lang="javascript" >}}
// dist/worker.js
export default 'a-big-long-string-of-code......';
{{< / codeblock >}}

How we get there is to build the worker as a default export of string bytes to use with a standard import statement. In this case, we setup a simple `rollup.config.js` that parses, builds, and outputs through a little two line plugin:

{{< codeblock lang="javascript" >}}
// rollup.config.js
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: ['worker.js'],
    output: {
      dir: 'dist/',
      format: 'esm',
    },
    plugins: [
      resolve(),
      terser({
        warnings: true,
        mangle: {
          module: true,
        },
      }),
      // My custom "plugin" that wraps the built worker code into
      // a string that we can use with `new Blob()`
      {
        name: 'worker-to-string',
        renderChunk(code) {
          return `export default '${code}';`;
        },
      },
    ],
  },
  // ... other build stuff
];
{{< / codeblock >}}

Yep, that's it. No huge infrastructure, no fancy dependencies. Two lines, no waiting, output of dist/worker.js complete.

## Shortcomings and Pratfalls

As you can imagine, the above works pretty well with very tightly controlled worker modules. That said:

1. Clearly we're bundling this into a bigger pack than it would be because we get no module de-duplication on the browser side or within other build tools. This can be clearly seen in the screenshot, as comlink is defined within that worker and yet imported by our `data.js` sample file as well. If you're not aware of this, you will burn users on wire weight and parse, so be aware.
2. More advanced techniques within the scope of module workers (ala, dynamic module loading) aren't going to work with this approach. It's a can of worms.
3. While I do call [Comlink.releaseProxy](), depending on your use, you may want to better manage `URL.createObjectURL()` if you're going to call something repeatably (it won't reuse the ref, it'll create a new one). You can clean up and manage your memory of said api via calling `URL.revokeObjectURL(workerUrl);` to deal with collection.

## In the Field

Even with the above caveats, I've found this to be fairly robust _as long as you know your use case_. I wouldn't just throw this on every worker I'm trying to handle (and I'm not going to cover the feature-check load in this article), but I've been using this approach pretty steady for a good while in a number of scenarios with pretty solid results. Work locally on the worker in module format for debugging, build and publish the dist as needed to NPM, use in other places.

In the future, I'll be happy to see this approach superseded as more browsers adopt worker modules and the web platform moves forward. In the mean time...get off the main thread when you can and make the web platform go fast.