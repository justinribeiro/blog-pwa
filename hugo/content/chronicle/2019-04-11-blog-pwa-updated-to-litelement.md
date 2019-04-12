---
title: "Updating blog-pwa from Polymer to LitElement, Workbox, and Rollup"
date: 2019-04-11T10:12:03-07:00
description: "On the quest for more web standards and more web performance, it was time to take the leap into converting blog-pwa into the latest tools and libraries."
---

After writing a post last month and running a build, I noticed a disturbing fact that my base web component `blog-pwa` was shocking large at 71.9K gzipped. This didn't seem right; I hadn't inherently changed any of the major underpinnings of the my core [blog-pwa](https://github.com/justinribeiro/blog-pwa) project I've used for a number of years. A quick peek at the build and some random TODOs I had left myself during the Polymer2-to-Polymer3 conversion and I quickly realized that I had sort pushed to the back burner some changes.

Instead of fixing those things, it was time to jump in and makes some large perf-gaining changes across the board. I settled to:

1. Move web components from Polymer to LitElement
2. Move from using polymer-cli to rollup for builds
3. Move from using polymer's sw-toolbox generation to workbox
4. Dynamic imports, polyfilled or bust.
5. Drop those dependencies, cut down on dead weight.
6. Start tracking FP, FMP, FID in analytics.

All that, and it has to be fast. On a Moto G4. On 3G. Seems simple enough right? Let's get down to it.

## Moving from Polymer to LitElement

Make no mistake: I still very much love Polymer 3 and the tooling. I use it in a number of other projects and you can build it small and fast. My problem wasn't even really with Polymer 3, but rather the fact I was carrying legacy Polymer dependencies that were causing my build to bloat (I'm looking at you prism-element).

That said, [LitElement](https://lit-element.polymer-project.org/) from the Polymer team is the future and for good reason. It's tiny, takes some of the good parts from Polymer, and is fast. Making the move required a little re-think in terms of how blog-pwa should function:

1. I wanted the same dynamic route loading to keep the PRPL pattern and ditch weight in my app shell and base bundles, but I didn't want `app-route` for this.
2. I wanted to ditch any of the observers I was using to do any sort of rendering data work.
3. I needed to rework the CSS to take advantage of LitElements use of [Constructable StyleSheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets).

To start, I gutted the initial app shell component and converted to extend LitElement. This wasn't particularly problematic, given that shell didn't carry much weight and lazy loaded other portions that might be needed for rendering internal views. The larger problem was how to handle the routing. I wanted something light with enough features that I wouldn't have to shim heavily. Enter [vaadin-router](https://github.com/vaadin/vaadin-router);

Vaadin-router weighs in at just 7.8K gzipped, is framework-agnostic, and doesn't really care how you create your web components. In my case, I decided it would be part of my app shell and would instantiate after the DOM has been updated the first time via LitElements `firstUpdated()` lifecycle method.

From there, it was just a matter of converting my routes into express.js-style syntax, and using the `action()` method to defined my dynamic imports:

{{< codeblock lang="javascript" >}}
const outlet = this.shadowRoot.querySelector('main');
const router = new Router(outlet, null);
router.setRoutes([{
  path: '/',
  children: [
    {
      path: '',
      component: 'blog-static',
      action: () => {
        __import('blog-static.js').then(() => {
          const check = this.shadowRoot.querySelector('blog-static');
          check.mount('index');
        });
      }
    },
    //... more routes ...
{{< /codeblock >}}

You're probably wondering what's with the `__import()` method. We'll get to that in a bit.

From there, it was really about how to define what those inner view component actually do. As you can see, our `<blog-static>` element has a public method called `mount()` that allows us to tell it what we'd like it do data-load wise with some additional house keeping.

For these inner views, I decided to write a new base class called `BlogElement` that would extend LitElement and handle our shared CSS and some of the methods I use to keep the pages metadata in check so that users get a nice experience. The shared CSS would be key for our components that extend BlogElement, because this allows us to use `super.styles` to stay within that optimal performance for our often reused components:

{{< codeblock lang="javascript" >}}
static get styles() {
  return [
    super.styles,
    css`
      #shoutout p {
        font-size: 28px;
      }

      /* ... other styles ... */
    `
  ];
}
{{< /codeblock >}}

With styles and mounting sorted, removing the limited amount of observers that blog-pwa uses was painless. With our main elements converted, it was time to figure out how to get this to all work with things that doesn't support dynamic imports.

## Dynamic imports and where to find them

I could very well just skip this. I _could_ have written a multi-build output. I _could_ have changed the way that served on App Engine. Really, where's the fun in that?

Dynamic imports have been in a Chrome and Safari for a while at this point, but Firefox still doesn't have them (though will come mid-May) and neither does Edge (though the whole Chromium move happening is will soon make that moot). Regardless, I didn't want to babel it and I wanted to check load a polyfill or a shim.

After a lot of various testing, I settled on a modified version of [uupaa's importModule.js](https://github.com/uupaa/dynamic-import-polyfill/blob/master/importModule.js) that I load only if the browser doesn't support dynamic import:

{{< codeblock lang="javascript" >}}
// Only load the dynamic import polyfill if we need it
function __loadDynamicImportCheck(src) {
  window.polyfillDynamicImport = false;
  try {
    new Function('import("./' + src + '")')();
  } catch (e) {
    var s = document.createElement('script');
    s.src = '/src/polyfill-dynamicimport.js';
    s.dataset.main = src;
    document.head.appendChild(s);
    window.polyfillDynamicImport = true;

    s.onload = () => {
      __import(src);
    }
  }
}
__loadDynamicImportCheck('blog-pwa.js');
{{< /codeblock >}}

Once you have that, we write a little global function that we use within our components or really anywhere we might need a dynamic import:

{{< codeblock lang="javascript" >}}
function __import(src) {
  if (window.polyfillDynamicImport) {
    return importModule(`./src/${src}`);
  } else {
    return new Function('return import("./' + src + '")')();
  }
}
{{< /codeblock >}}

You might be wondering why I use `new Function()` as opposed to just returning the import. This is specifically to handle the case where Firefox with throw an error during parsing when it see's a dynamic import, causing the rest of our script to fail (along with our PWA).

Now, I haven't tested this solution heavily enough to say "you should do this everywhere!". I would be remiss to not also point out that if you're using content security policy (CSP) like I do, `new Function()` is particularly problematic because it requires `unsafe-eval`, even if you use SHA hashing or nonce's. Your mileage will vary, but it works okay for I want to use it for until we have more support for dynamic imports.

## Things load, things render, let's build some stuff with rollup

With our components loading and rendering, we need to build them into something we can ship. `blog-pwa` for a long time has used the polymer-cli for this, but with some issues with mjs files, I decided it was time to cut out the middle and just move to [rollup.js](https://rollupjs.org/).

I wasn't exactly new to using rollup, but in my case this would be a slightly different sort of thing given my dynamic import shim. What I decided to do was simply feed all components into the inputs and output a directory full of the various bundles and components. If you come from the `polymer.json`, you can sort of think of this like combining your `fragments` array with your `entrypoint`:

{{< codeblock lang="javascript" >}}
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';

export default {
  input: [
    'src/app.js',
    'src/blog-pwa.js',
    'src/blog-static.js',
    'src/blog-entry.js',
    'src/blog-chronicle.js',
    'src/lazy-resources.js',
    'src/3d-utils.js',
    'src/code-block.js'
  ],
  output: {
    dir: 'build/default/src',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    resolve(),
    minify({
      mangle: {
        exclude: { "__import": true }
      },
      comments: false,
      plugins: ['transform-remove-console']
    })
  ]
};
{{< /codeblock >}}

The other thing you can see we're doing during this build is to use the babel-minify plugin to handle the transform down into a smaller files. This again is not unlike polymer-cli (which uses babel and rollup to handle these sorts of things seamlessly), though we do no babel-helpers or compile targets.

The one thing that rollup doesn't so is handle the shuffling of other resources that we may need for our build, like our `index.html` or our images or JSON data files. Polymer-cli does this for us, but since we're not using that here, we write up some commands that do the copies and movement within our `package.json`:

{{< codeblock lang="javascript" >}}
// package.json
"scripts": {
  "build:clean": "rm -rf build && mkdir -p build/default/src && mkdir build/default/node_modules",
  "build:copyDeps": "cp -r node_modules/@webcomponents/ build/default/node_modules  && cp -r node_modules/intersection-observer/ build/default/node_modules && cp -r node_modules/prismjs/ build/default/node_modules && cp -r src/polyfill-dynamicimport.js build/default/src",
  "build:copyRoot": "cp index.html build/default && cp robots.txt build/default && cp manifest.json build/default && cp push_manifest.json build/default",
  "build:copyData": "cp -r images/ build/default && cp -r data/ build/default && cp -r helpers/ build/default",
  "build:minify": "yarn html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --removeAttributeQuotes --remove-tag-whitespace --removeOptionalTags --minify-css true --output build/default/index.html build/default/index.html",
  "build:modules": "rollup -c",
  "build:dist": "yarn build:clean && yarn build:copyDeps && yarn build:copyRoot && yarn build:copyData && yarn build:minify && yarn build:modules"
},
// ...
{{< /codeblock >}}

## We have a build, now let's make sure our service worker is ticking

[Workbox](https://developers.google.com/web/tools/workbox/), the unsung hero of making service workers easy to work with. Getting workbox working with the build really was only a matter of converting the old sw-precache config into the newer workbox config format. This is all very well documented on on the [migration docs for sw-* tools](https://developers.google.com/web/tools/workbox/guides/migrations/migrate-from-sw), so I won't rewrite those docs here.

That said, I did decide to rewrite my runtime caching strategies to be more workbox friendly, replacing some rather specific routes I previously used with better patterns. I also decided to use [workbox-window](https://developers.google.com/web/tools/workbox/modules/workbox-window) which weighs in at just 2K gzipped within `<blog-pwa>` to handle the install and updates for of my service worker:

{{< codeblock lang="javascript" >}}
// blog-pwa.js / _ensureLazyLoaded() method
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/service-worker.js');

  wb.addEventListener('activated', (event) => {
    if (!event.isUpdate) {
      this._setSnackBarText('Ready to work offline.');
    }

    // Get the current page URL + all resources the page loaded.
    const urlsToCache = [
      location.href,
      ...performance.getEntriesByType('resource').map((r) => r.name),
    ];
    // Send that list of URLs to your router in the service worker.
    wb.messageSW({
      type: 'CACHE_URLS',
      payload: {urlsToCache},
    });
  });

  wb.addEventListener('waiting', (event) => {
    this._setSnackBarText(
      'New and updated content is available.',
      0,
      true,
      async () => {
        wb.addEventListener('controlling', (event) => {
          window.location.reload();
        });
        wb.messageSW({type: 'SKIP_WAITING'});
      });
  });

  wb.register();
}
{{< /codeblock >}}

You can see I'm actually using a combination of [advanced recipes](https://developers.google.com/web/tools/workbox/guides/advanced-recipes) from the workbox docs. One, on initial install and activation, I prime the existing page resources into the cache via the `messageSW()` that workbox-window provides. Two, I don't use `skipWaiting` within my workbox config, so I can instead utilize the `SKIP_WAITING` hook that workbox injects on build.

## Measuring real user performance via Google Analytics

With a solid build now working well, it was time to make sure I could get some additional performance numbers so I could get view into real user performance down the line. To do so, I wrote a small method to pull send some relevant data into Google Analytics:

{{< codeblock lang="javascript" >}}
// blog-pwa.js
__sendPerfData() {
  perfMetrics.onFirstInputDelay((delay, evt) => {
    ga('send', 'event', {
      eventCategory: 'Perf Metrics',
      eventAction: 'first-input-delay',
      eventLabel: evt.type,
      eventValue: Math.round(delay),
      nonInteraction: true,
    });
  });

  performance.getEntriesByType('paint').forEach((entry) => {
    ga('send', 'event', {
      eventCategory: 'Perf Metrics',
      eventAction: entry.name,
      eventLabel: entry.entryType,
      eventValue: Math.round(entry.startTime),
      nonInteraction: true,
    });
  });
}
{{< /codeblock >}}

In this case, I've injected the [FirstInputDelay library](https://github.com/GoogleChromeLabs/first-input-delay), which weighs in at about 400 bytes gzipped, to handle that calculation. The other metrics, such a first paint and first contentful paint come from the [Performance Timeline API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_Timeline).

Lastly, I wrap this in a `requestIdleCallback()` to make sure we're not blocking anything important. I also set a timeout, making sure it does indeed run:

{{< codeblock lang="javascript" >}}
// blog-pwa.js / _ensureLazyLoaded() method
if ('requestIdleCallback' in window) {
  requestIdleCallback(this.__sendPerfData, { timeout: 2000 });
} else {
  // booo
  this.__sendPerfData();
}
{{< /codeblock >}}

## All that work, but is it smaller and faster

I would be remiss to just declare this complete, the task at hand finished. Obviously, we have to trace and compare our start point and outcome.

From a size standpoint, we see immediate wins:
{{< codeblock lang="bash" >}}
----------------------   Old         New
blog-pwa shell size:    71.9KB      19.9KB
{{< /codeblock >}}

The entire base load also saw a decrease in size with all lazy loaded assets complete:

{{< codeblock lang="bash" >}}
--------------------------   Old         New
page size w/LL components:  86.6KB      32.7KB
{{< /codeblock >}}

Solid improvements, saving the bytes. Let's look at some of the WebPageTest numbers on a Moto G4 on 3G Fast profile:

{{< codeblock lang="bash" >}}
-------------------------------  Old         New
First View - start render:      1.690s      1.279s
First View - speed index:       2.067s      1.730s
First View - first interactive: 2.926s      2.491s
First View - RUM First Paint:   1.542s      1.154s
{{< /codeblock >}}

Again, solid improvements, nearly half a second.

Checking in our Lighthouse metrics:

{{< codeblock lang="bash" >}}
-------------------------------  Old         New
First Contentful Paint:          0.8s        0.6s
Speed Index:                     2.0s        1.7s
Time to Interactive:             2.1s        0.7s
First Meaningful Paint:          0.8s        0.6s
First CPU Idle:                  2.1s        0.7s
{{< /codeblock >}}

The big improvement there being TTI and CPU Idle, which we want on those constrained devices.

If you'd like to see all the data, do check the [WebPageTest result](https://www.webpagetest.org/result/190411_T6_d96d381edba4bfb2726642074cb7e136/1/details/) for a deeper look.

## Concluding thoughts

All in all, I find moving to LitElement pretty straight forward. Mind you, I've done this in a few other places before I circled back to blog-pwa, but understanding what you want your component to do is most of the heavy lifting in my opinion. Be harsh in your choice of dependencies, consistently measure and trace, and chop.

[blog-pwa](https://github.com/justinribeiro/blog-pwa) started out as an experiment to apply the approaches of progressive web app techniques with new web platform features such a web components and service worker. Given that it powers this very site, one would think that I wouldn't push the boundaries further given the above performance numbers.

But what would be the fun in that? Who benefits from stagnation? No one, that's who.

In the future, I'll keep exploring with blog-pwa. I'll keep refining those numbers and overall I'm going to have fun breaking and fixing things. Onward we go!