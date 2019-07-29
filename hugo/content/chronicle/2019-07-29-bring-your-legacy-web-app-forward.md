---
title: "Bringing legacy web apps forward with three great web platform APIs"
description: "While the popular web frameworks of the day may dominate the online conversation and with the pace of web platform expansion, it can be daunting to parse through a sea of information when you’re just trying to get work done in your legacy web application. We’ve all been there. Let’s talk about three web platform APIs you can start using today to bring your users and development experience a little more happiness."
date: 2019-07-29T13:25:48-07:00
---

There was an audible sigh within the conference room, undeniable in its presence but seemingly out of place within its corporate context. The piercing silence that followed was broken with a single statement from one of the engineers.

“Can we please go one meeting without someone mentioning a rewrite in another framework? We don’t have the time or budget for that.”

Such a statement is not unheard of in many of the engineering meetings I’m asked to attend. While the popular web frameworks of the day may dominate the online conversation, skilled developers work in companies often dismayed at what they consider myopic points of popularity.

“We use a lot of different frameworks across teams and products, but popularity doesn’t help us when it comes to building features across our products,” denoted an engineer from a Fortune 500 corporation who asked to remain anonymous. “We don’t want to develop the same feature 20 times in 20 frameworks.”

For many developers web applications sometimes referred to as legacy rule the day, powering their organizations and external users alike, critical to an organization's ongoing success. Feature development never truly stops but often times developers struggle to add the features that users want, lost in a sea of information that doesn’t account for the notion of changing integrations or requirements.

There is an ease to forgetting the legacy web application when you live in a stream of greenfield development and 18 month rewrite cycles. Examples abound on the web of the latest functionality and paradigms, extruding the merits of the latest frameworks or cutting edge web platform apis and their ease of use. Integrating within an existing web application? For many developers caught between the past and the future, the options can seem both confusing and slim for their existing web applications.

Is the web just frameworks all the way down now? Can I really use that new web platform api right now? What are your options for the developer or team looking to move forward with their existing web apps but can’t readily find a path forward?

You’re not alone, and I am here to tell you the web platform hasn’t left you, your users, or your existing web applications behind. But where to start? Let’s go see a show.

## Tonights Playbill: Progressive Web Platform Apis In Three Acts

Developers are increasingly exploring the API space that the web platform offers. Look no further than the recent stats for traffic to MDN Web Docs, the de facto clearinghouse for web platform api information for developers today, with [21% year-over-year user growth and 13.3 million monthly users over the last year](https://github.com/mdn/pab/blob/master/meeting-notes/2019-01-notes.md).

The web platform and its capabilities have grown leaps and bounds over the years, [with your modern web browser containing some 10,000 or so APIs](https://thewebplatformpodcast.com/184-mdn-web-doc). The task to understand and utilize those APIs can seem daunting no different as if you were adopting a new framework.

Further compounding the problem is the notion of what the word progressive means when it comes to the web platform. Too often it’s expanded to mean “progressive web app”, which depending on whom you speak with can have a wildly wide definition across the various technological and ideological camps.

For our intents and purposes, progressive simply means that we’re developing gradually or in stages. We have an existing app, we want to add new features that users are asking for, we want a web platform API and possibly a sugared library that we can use without having to completely rewrite a large portion of our codebase.

As our play begins, let’s look at three specific web platform features that you can take and run with in your web applications, legacy or not, today.

## Act 1: Setting The Scene With Web Components

As the lights come up on our stage, a team of developers sits around a table, sipping coffee. Bursting into the room, a messenger arrives with a new requirement from the boss. We need a view into some data, design already has the mock, and it’s not only got to work in the legacy web app, but it’s going to be used by a team on the other side of the world in a new modern framework.

“How are we possibly going to do that?”

Turns out, the web platform has your covered. Enter [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), the name of a collective set of web standards that include the Custom Elements API, Shadow DOM API, and the HTML Template API. While you can use any of these APIs separately, combined they give us the very means to deliver:

1. A reusable component, can work both in our legacy application as well as a wide range of modern frameworks. Concerned about interoperability? [Custom Elements Everywhere](https://custom-elements-everywhere.com/), a project created by [Rob Dodson](https://twitter.com/rob_dodson), runs a suite of tests against each framework to identify interoperability issues, and highlight potential fixes already implemented in other frameworks.
2. An encapsulated component, allowing us to develop without the constraint of having to fight with legacy CSS or JavaScript interfering with the specific requirements and look we need to achieve.
3. A composable component, allowing us to define our own declarative API for use by others.

No only is this available on the platform, we can write our web component in vanilla JavaScript.

{{< codeblock lang="javascript" >}}
customElements.define('hi-readers', class extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
      &lt;style&gt;#hi { color: green; }&lt;/style&gt;&#10;
      &lt;div id=&quot;hi&quot;&gt;You all make the web better!&lt;/div&gt;
    `;
  }
});
{{< /codeblock >}}

Need a specific browser that doesn’t support those APIs? The polyfill has you covered. Heard bad things about web components and how they are not useful compared to framework X? 10% of page loads in Chrome today are using web components and companies like Salesforce among many others are all in on web components.

Looking for that more refined web components experience? [LitElement](https://lit-element.polymer-project.org/ ) is a simple base class for creating fast and lightweight components. How about some spice? [Nutmeg](https://github.com/abraham/nutmeg) let’s you generate a vanilla web component skeleton with things like TypeScript, Karam test runner, and web component best practices in mind. Using Vue.js? [Their CLI](https://cli.vuejs.org/guide/build-targets.html#web-component) has web component as an output option. Ionic Framework team built [Stencil](https://stenciljs.com/) which outputs web components by default. Even Angular now has [Angular Elements](https://angular.io/guide/elements ) which package as custom elements. Using web components regardless of your ecosystem has never been easier.

When it comes to progressive web platform features, Web Components ranks up there as one of the most useful things you can use today to start bringing your legacy web applications into the future.

## Act 2: Confront Your Computational Antagonist With Web Assembly

As the curtain draws open, a celebration is taking place. The stunning web component worked without a hitch, working great in both the legacy applications and the latest framework. The developers gather to pop a bottle of champagne when the messenger bursts into the room again, out of breathe.

“Words got around the company about the web component. There’s another two teams that want to use it, but they need the component to crunch the data like the ‘ol Windows app. Boss says we gotta make it happen.”

The bottle now placed gently onto the table, the room bursts into a cackle of voices, all shouting to be heard. A computer is thrown through a window.

“We can’t make this happen, that app is in C++!”

“JavaScript is fast, but it isn’t that fast.”

“We can’t do this!”

While this may appear a far fetched scenario, within the cauldron applications in many organizations are native applications of old, filled with a plethora of custom legacy C/C++ libraries that are used to handle those computational tasks that have long been outside the reach of the web platform. No more; look towards [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly), a safe, portable, low-level compilation target that complements and runs alongside your JavaScript.

While compiling a library to WebAssembly can appear daunting given the scope of options, breaking it down into its basic development steps is much easier to understand the path forward:

1. Wrap up your C/C++ library with an API surface that you’d like to use within your web application.
2. Use a tool like [Emscripten to compile](https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm), allowing us to limit the complexity for compiling your wasm module.
3. Include the generated JavaScript and wasm binary file and simply include into your web application

The resulting output from our build can be easily instantiated where we need within our web app.

{{< codeblock lang="markup" >}}
&lt;script src=&quot;a.out.js&quot;&gt;&lt;/script&gt;&#10;
&lt;script&gt;
  Module.onRuntimeInitialized = (_) => {
    const computeTPSreport = Module.cwrap('tpsReport', 'number', ['number']);
    console.log(computeTPSreport(201902));
  };
&lt;/script&gt;
{{< /codeblock >}}

With support in all the major browsers today, you can start porting you legacy libraries and utilizing them in your web apps today. [Emscripten now outputs WASM](https://emscripten.org/docs/compiling/WebAssembly.html#webassembly) and has a host of helpers and tooling to help you. by Want to test the waters without the need for the build tooling? Try out WebAssembly today with [webassembly.studio](https://webassembly.studio/), allow you to write, build, and test without leaving your browser. Think about just writing an algorithm more performantly without the legacy library? [Rust has an amazing guide](https://rustwasm.github.io/book/) for building for web assembly, and languages like [Go and many others are adding support](https://github.com/golang/go/wiki/WebAssembly).

## Act 3: Resolve (Faster) With Service Worker

As our play draws to a close, our cast has shipped a web component sprinkled with some WebAssembly for computational jet fuel. Users are happy, and developers breath a sigh of relief for having shipped. Just then a report arrives.

“Says here some of those other apps are loading a lot quicker than our legacy web app and they work offline. Could we possibly match that?”

The web platform again comes to our aid via [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API). While consider a pillar of the progressive web app story, service workers are simply a means for us as developers to control network requests and caching. They’re the low-level network proxy the web platform was missing for a number of years, and gives us the ability to improve performance and make our web applications more resilient to various network conditions.

Normally, this is where the simple example of a Service Worker would go, extruding the direct benefit of what the web platform has given us. Experience at many companies has taught me however that even the most simple service worker example is often too low-level and terrifies developers. Coupled with various footguns that make service workers difficult for developers (“how do I refresh this thing, why won’t it let go”), I’ve since taken a new approach rather than speak about the low-level boilerplate. Instead, I offer you the alternative library that is much more accessible for many developers, Workbox.

[Workbox](https://developers.google.com/web/tools/workbox/) is an open source library that defines sets of best practices for service workers and takes out the complexity of the boilerplate we’d find ourselves having to write. The [project](https://github.com/GoogleChrome/workbox) is the culmination of many years of work from Google engineers [Jeff Posnick](https://twitter.com/jeffposnick) and [Philip Walton](https://twitter.com/philwalton) (among many other committers) to hone and simplify the common recipes that we as developers may want to use to make our web applications faster and resilient, from caching our CSS and JavaScript, to handling those pesky Google Fonts offline.

How easy is it to get started? You’re just an import and a route away:

{{< codeblock lang="javascript" >}}
// sw.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// serve from cache, update in background
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate(),
);
{{< /codeblock >}}

Put aside the too often recited “service workers really only work for single page application designs”. With a deep [list of recipes and cache strategies](https://developers.google.com/web/tools/workbox/guides/common-recipes) and version 4.0.0’s [workbox-window](https://developers.google.com/web/tools/workbox/modules/workbox-window) to help make simplify registration, Workbox allows you to bring the resilience and performance to any web application, regardless of architecture paradigm. The beauty of this library? It’s just built on top of the web platform.

## The Curtain Call: Web App Manifest

As the actors take their bows, your leaps of joy from your theatre seat result in shouts of “Encore!” The web platform has so much more to offer, but the ease to which these APIs slip into your existing web applications has you wanting more.

A shout from the stage: Web App Manifest.

The [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) is a specification for a JSON-based file that holds your web apps metadata. This file helps inform our websites’ [install experience on a homescreen on mobile devices and desktops](https://medium.com/@kennethrohde/progressive-web-apps-coming-to-all-chrome-platforms-80e31272e2a8). It’s simple format and a single file that gives our users a pleasant experience with very little effort.

{{< codeblock lang="javascript" >}}
// manifest.json
{
  "name": "FAA Flight Planning",
  "short_name": "FAA Plan",
  "description": "Build a flight plan.",
  "start_url": "/",
  "theme_color": "#f1f1f1",
  "background_color": "#f1f1f1",
  "icons": [{
    "src": "/images/manifest/faa-512.png",
    "sizes": "512x512",
    "type": "image/png"
  }],
  "display": "standalone"
}
{{< /codeblock >}}

From there, users get a slightly better icon and desktop experience. From there you’ll be able to extend the use of your Workbox service worker and take advantage of [beforeinstallprompt](https://developers.google.com/web/fundamentals/app-install-banners/#listen_for_beforeinstallprompt) to handle just how you want to handle the install to homescreen experience for an even more progressive experience.

## The Web Evolves, But Doesn’t Require You To Abandon All

The APIs I’ve selected to highlight above may seem like odd choices to some. They come not from my opinion, but rather from my own experience working with many organizations who feel like they’re trapped on highly useful but often isolated web apps.

The web platform and its APIs are constantly evolving, giving us more APIs and tools to build amazing experiences for our end users. Just because your web application has been around for a decade doesn’t mean you have to abandon a useful code base for a nuts and bolts rewrite. By taking a progressive approach and using platform APIs and lightweight libraries, you can start using more of the what the web platform offers.

The end result: happier users and hopefully a happier developer experience.
