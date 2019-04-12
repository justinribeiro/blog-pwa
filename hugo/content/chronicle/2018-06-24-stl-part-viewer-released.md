---
date: 2018-06-24T08:00:00-08:00
title: "stl-part-viewer web component released"
description: "A Polymer 3/LitElement web component that uses Three.js to display an STL model file."
imagetwitter: "https://storage.googleapis.com/jdr-public-imgs/blog/20180624-stl-part-viewer-twitter-1024x535.jpg"
imagefb: "https://storage.googleapis.com/jdr-public-imgs/blog/20180624-stl-part-viewer-fb-1200x630.jpg"
imagegplus: "https://storage.googleapis.com/jdr-public-imgs/blog/20180624-stl-part-viewer-gplus-800x360.jpg"
---

I find myself working with STL files on a fairly regular basis. It's a fairly
simple format, pretty easy to output, and usually my go-to when exporting out of
various CAD system. If you've procured a 3d model to use with your with your
home printer, chances are you've run into STL.

I've been looking to write up and show a few such project STLs this summer, I
decided to dust off an older web component I had sitting around and bring it
into the future.  Hence, welcome `<stl-part-viewer>`.

Built using Polymer 3 and the new lighter base class `lit-element`,
`<stl-part-viewer>` uses three.js as well as my modified stl-loader and
orbit-controls to bring a simple 3D viewer to your browser.

The real magic is in the use of [Intersection
Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
to load the STL file when only in the viewport and will pause the renderer when
the viewer exists the viewport. Combined with the ability to load a dynamic JS
module, you can lazy load the component on an as needed basis.

## Demo

Words, words, words you say. How about a simple demo using the Polymer logo? And
yes, I [open sourced the polymer
STL's](https://github.com/justinribeiro/stl-part-viewer/tree/master/demo) if you
want to print them. :-)

<stl-part-viewer src="https://storage.googleapis.com/jdr-cors-models/polymer/polymer-binary.stl"></stl-part-viewer>

From a code standpoint, the using the viewer is straight forward:

{{< codeblock lang="html" >}}
&lt;stl-part-viewer src=&quot;example.stl&quot;&gt;&lt;/stl-part-viewer&gt;
{{< /codeblock >}}

For a full set of attributes that can be set, visit the repo: [justinribeiro/stl-part-viewer](https://github.com/justinribeiro/stl-part-viewer)

If it looks familiar, the colors and general look are based on
[Cura](https://ultimaker.com/en/products/ultimaker-cura-software) (though the
mirror floor is more reminiscent of the Thingiverse viewer).

## In use

I've published the web component on npm as
[@justinribeiro/stl-part-viewer](https://www.npmjs.com/package/@justinribeiro/stl-part-viewer),
so installing and using in your project is just an npm or yarn command away:

{{< codeblock lang="shell" >}}
npm i @justinribeiro/stl-part-viewer
# or
yarn add @justinribeiro/stl-part-viewer
{{< /codeblock >}}

In use, make sure that you polyfill intersection observer and web components
(see
[README](https://github.com/justinribeiro/stl-part-viewer/blob/master/README.md))
for additional information.