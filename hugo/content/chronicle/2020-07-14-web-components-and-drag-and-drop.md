---
title: "Handling web components and drag and drop with event.composedPath()"
description: "The web platform gives us the tools to make web components, shadowRoots, and the drag and drop api work happily together. We just have to pull the right levers."
date: 2020-07-14T8:40:23-08:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200714-web-comp-drag-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-web-comp-drag-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-web-comp-drag-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-web-comp-drag-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-web-comp-drag-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200714-web-comp-drag-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-web-comp-drag-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-web-comp-drag-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-web-comp-drag-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-web-comp-drag-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover; background-image: url(''data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\''http%3A//www.w3.org/2000/svg\'' xmlns%3Axlink=\''http%3A//www.w3.org/1999/xlink\'' viewBox=\''0 0 1280 853\''%3E%3Cfilter id=\''b\'' color-interpolation-filters=\''sRGB\''%3E%3CfeGaussianBlur stdDeviation=\''.5\''%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\''discrete\'' tableValues=\''1 1\''%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\''url(%23b)\'' x=\''0\'' y=\''0\'' height=\''100%25\'' width=\''100%25\'' xlink%3Ahref=\''data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\''%3E%3C/image%3E%3C/svg%3E'');" src="https://storage.googleapis.com/jdr-public-imgs/blog/20200714-web-comp-drag-800.png" alt="A deep shadowRoot chain being dragged on mobile with my shim.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">A deep shadowRoot chain being dragged on mobile with my shim.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>
'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20200714-web-comp-drag-800.png"
tags:
  - Web
---

The HTML5 Drag and Drop API is one of those APIs on the web platform that I find people either despise or begrudgingly tolerate. It's not that said API is particularly tricky to use or implement, but it's non-existence on mobile without polyfills or shims is painful to get correct without a lot of code, or if you've tried to use them with shadowRoots and web components, the situation can be doubling confusing.

Most of that confusion comes from the examples or libraries that folks use that are really only looking at `event.target`, which people find just don't work. The reason becomes pretty clear if you look at any web component with some depth of a shadowRoot: `event.target` gives you to the top most element you're hoving over and that's probably not what you want. What to do? `event.composedPath()` to the rescue.

## Events, events, everywhere

The problem that folks run into is that the using `event.target` is not going to give you the depth you want against the delegation of said event. It'll tell us the element on which the event occurred, which in most cases will be our top most web component. Similarly, `event.curentTarget` is going to reference where our handler has been attached. While this is a bit of a simplification, the general gist is that we won't exactly have what we need when it comes to things like ShadowRoots.

Instead, what we want to use is [event.composedPath()](https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath). This gives us the array of nodes and objects where our listeners are going to be invoked, including within the scope of shadowRoots (as long as the mode is not closed).

As an example, let's look a screenshot to see what exactly a `DragEvent` targets when web components are involved:

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200714-event-composed-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-event-composed-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-event-composed-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-event-composed-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-event-composed-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20200714-event-composed-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-event-composed-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-event-composed-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-event-composed-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20200714-event-composed-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog/20200714-event-composed-800.png" alt="">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">The anatomy of a DragEvent.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>


In Box #1 above, you can see that the `event.target` is set to a `main-view` web component. However, we also see that our `event.composedPath()` has `main-view` and a lot of other nodes. Box #2 actually points to the a `drop-list` component in our `path` which is what we want to operate against.

How do we work with this? Let's look a few examples.

## The examples

> Note, all examples are available in on the [demo site](https://justinribeiro.github.io/html5-dragdroptouch-shim/demo/index.html) and in the [justinribeiro/html5-dragdroptouch-shim](https://github.com/justinribeiro/html5-dragdroptouch-shim) repo.

To help illustrate this concept let's mock-up at two simple vanilla web components, `drop-list-item` and `drop-list`.

`drop-list-item` is going to be a simple thing we can drag around, so it needs a few things:

1. It needs to know it's a draggable
2. It needs to tell us when it is be dragged
3. It should listen for other things being dragged over it (in case maybe we wanted to sort a list or something)

To handle this, we write up the basics:

{{< codeblock lang="javascript" >}}
customElements.define("drop-list-item", class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("dragstart", this.__dragStart.bind(this));
    this.addEventListener("dragend", this.__dragEnd.bind(this));
    this.addEventListener("drop", this.__dragEnd.bind(this));
    this.addEventListener("dragover", this.__dragOver.bind(this));
    this.addEventListener("dragleave", this.__dragLeave.bind(this));

    // You _cannot_ just set draggable without the string "true";
    // it will not work
    this.setAttribute("draggable", "true");

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
&lt;style&gt;&#10; :host {&#10; display: block;&#10; padding: 0.5rem;&#10; background-color: #f1f1f1;&#10; margin: 0.25rem;&#10; }&#10; :host([dragging]) {&#10; background-color: hotpink;&#10; color: #fff;&#10; }&#10;&lt;/style&gt;&#10;&#10;&lt;slot&gt;&lt;/slot&gt;
`;
}
    // Important: we need to understand who's dragging so we can
    // grab in the dropzone
    __dragStart(event) {
      event.dataTransfer.setData("text/html", "test");
      this.setAttribute("dragging", "");
    }

    __dragEnd() {
      this.removeAttribute("over");
      this.removeAttribute("dragging");
    }

    __dragOver() {
      if (this.hasAttribute("dragging")) {
        this.removeAttribute("over");
      } else {
        this.setAttribute("over", "");
      }
    }

    __dragLeave() {
      this.removeAttribute("over");
    }
});
{{< / codeblock >}}

As you can see above, we're not doing a lot of heavy lifting at all. We set some attributes based on the events so we can apply some style and as you'll see, so we can figure out who we might need to grab in our drop zone.

How does this relate to a dropzone? Let's look at `drop-list` and see what magic is under the hood:

{{< codeblock lang="javascript" >}}
customElements.define(
  "drop-list",
  class extends HTMLElement {
    constructor() {
      super();
      this.addEventListener("drop", this.__dzDropHandler.bind(this));
      this.addEventListener("dragover", this.__dzDragover.bind(this));
      this.addEventListener("dragleave", this.__dzDragLeave.bind(this));

      // For the sake of the demo, we just set this here
      this.setAttribute("dropzone", "move");

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
&lt;style&gt;&#10;  :host {&#10;    display: block;&#10;    border: 2px dotted grey;&#10;    min-height: 100px;&#10;  }&#10;  :host([active]) {&#10;    border: 2px dotted red;&#10;  }&#10;&lt;/style&gt;&#10;&lt;slot&gt;&lt;/slot&gt;
`;
    }

    /**
     * Functionality for the list container once and item has been dropped
     * @param {object} event drop
     */
    __dzDropHandler(event) {
      event.preventDefault();
      this.appendChild(this.__draggingElement);
      this.removeAttribute("active");
      this.__draggingElement = null;
    }

    __dzDragLeave() {
      this.removeAttribute("active");
    }

    /**
     * Functionality for the list container once we are hover on the list
     * @param {object} event drop
     */
    __dzDragover(event) {
      event.preventDefault();
      this.setAttribute("active", "");
      let found;

      if (!this.__draggingElement) {
        // find what we're looking for in the composed path that isn't a slot
        found = event.composedPath().find((i) => {
          // usually we can just grab event.composedPath()[0], but let's be safe
          if (i.nodeType === 1 && i.nodeName !== "SLOT") {
            return i;
          }
        });

        if (found) {
          // find where we are deep in the change
          const theLowestShadowRoot = found.getRootNode();
          this.__draggingElement = theLowestShadowRoot.querySelector(
            "[dragging]"
          );
        } else {
          this.__draggingElement = document.querySelector("[dragging]");
        }
      }
    }
  }
);
{{< / codeblock >}}

In the component above, we can see that our dragOver event handler does some lifting, taking into account the `event.composedPath()`, grabbing the node (which is usually the first item in the array) and then looking through that node to see if we have a `dragging` item.

Since it's a bit hard to visualize, the video I made below shows the behavior in action across a wide range of examples (many of which comes from questions I've received lately).

{{< liteyoutube videoid="MUF6R-tk_vY" videotitle="Web Components, HTML5 Drag and Drop API, and You" >}}

All the examples are available all on the [demo site](https://justinribeiro.github.io/html5-dragdroptouch-shim/demo/index.html) as well if you'd like to give them a spin.

## Making it work on mobile

That's all fine and dandy Justin, but what about mobile you say? None of the polyfills work and what is a person to do?

This entire walk-through stems from that very question. Most of the polyfills or various shims don't use `event.composePath()` and as such and this became a pain in my side (I did not have this lying around in my private toolbelt as this hasn't been a huge ask over the years). Alas, we need something.

 If you happened to follow the the examples above or watched the video, you'll note that they live in [justinribeiro/html5-dragdroptouch-shim](https://github.com/justinribeiro/html5-dragdroptouch-shim) repo. That repo is my opinionated shim that polyfills HTML5 drag and drop support on mobile devices with Event.ComposedPath() support. While this is in large part an ES Modules refactor of Bernado's [dragdroptouch polyfill](https://github.com/Bernardo-Castilho/dragdroptouch) (which deserves the bulk of the love by the way), this version differs in two keys areas:

1. Re: finding the draggable. Uses event.composedPath() to allow use to hunt for draggables within open ShadowRoots

2. Re: finding the dropzone. Uses event.composedPath() to find the target shadowRoot, then uses DocumentOrShadowRoot.elementFromPoint to locate our dropzone target.

This allows it to be more readily be used with ShadowDOM and web components, which is my primary use case for it to be honest. It does however work fine without web components use case for mobile as well.

It's early days for said shim, but I've used on couple projects without issue. It is [available on NPM](https://badge.fury.io/js/%40justinribeiro%2Fhtml5-dragdroptouch-shim) and if you find bugs, do let me know.

## Go further

Now I'm not saying this is the end all be all; there is more you could do (I don't go into list sorting for instance) and you surely would firm up those web components (ala...ditch those events on disconnect and be a good component citizen). Hopefully this gives you a spring board that using the bare metal web platform and the tooling it gives you is not the scary complicated beast some folks make it out to be. We have the tools, you just have to hone in on the right one's for the job.

So get out there, explore the web platform, and build some cool stuff. 🎉🎉🎉
