---
title: "Experimental barcode-reader web component released"
date: 2019-05-14T08:21:30-07:00
description: "barcode-reader is a web component that reads barcodes via the Shape Detection API via a Web Worker, but with LitElement."
tags:
- Web
---

Some time ago, back in the Polymer 2 days, I had a very specific version of a `barcode-reader` web component that was pretty nifty. It was an early-days experiment based on the now-enabled Shape Detection API within Chrome. I even for a while worked to one of the better performing polyfills, [barcode-detector-polyfill](https://github.com/giladaya/barcode-detector-polyfill/pulls?q=is%3Apr+author%3Ajustinribeiro+is%3Aclosed), allowing that component to operate without worry of which was the right shim/polyfill to load.

As with most things however, I never felt it was a very clean sample to release. It had quirks, and while many people implored me to release it, I just felt it would sow more confusion as to anything useful from a learning standpoint (it was terribly slow on mobile, even with a web worker).

Fast forward to a couple of weeks ago, and I needed a barcode-reader component in a little demo I was putting together for an internal corporate talk. With Shape Detection now available in Chrome, I decided to shed the weighty logic, and build a little component in litElement (I have a grander vision for the components API, but it could have easily stood alone).

Now available ([available on npm](https://www.npmjs.com/package/@justinribeiro/barcode-reader))and [Github](https://github.com/justinribeiro/barcode-reader), the build out includes:

1. Uses Shape Detection API available in Chrome M74 (see [Chrome Status](https://www.chromestatus.com/feature/4757990523535360)).
2. Module scripts on DedicatedWorker. You can try the feature with '--enable-experimental-web-platform-features' flag (see [https://crbug.com/680046](https://crbug.com/680046))
3. Uses [Comlink](https://github.com/GoogleChromeLabs/comlink) for the proxy of the worker
4. Built as a web component via [LitElement](https://lit-element.polymer-project.org/)

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog/201905010-barcode-chrome-devtools-remote-debug.png" alt="Debugging barcode-reader from a remote device in Chrome DevTools">

Please note, this is not production ready by any means, but if you want to grab with npm or yarn to play with, please do!

{{< codeblock lang="bash" >}}
npm i @justinribeiro/barcode-reader
# or
yarn add @justinribeiro/barcode-reader
{{< /codeblock >}}

In use, it had basically only a `start()` and `stop()` method (so you could potentially display said component in some sort of modal based on some ideally a user action...you probably wouldn't want it running flat out all the time).

{{< codeblock lang="javascript" >}}
customElements.whenDefined('barcode-reader').then(() => {
  const barcodeReader = document.querySelector('barcode-reader');

  // start the camera stream
  // always looks for
  // facingMode: {
  //   exact: 'environment',
  // }
  barcodeReader.start();

  // component returns a custom event with results
  document.addEventListener('barcodes-found', (event) => {
    console.log(event.detail.barcodes);

    // if you want to stop streaming, ala, I'm hiding you now
    barcodeReader.stop();
  }, false);
});
{{< /codeblock >}}

If you're looking for more of an app-like approach, I highly recommend [Paul Kinlans'](https://paul.kinlan.me/) [QR Snapper](https://github.com/PaulKinlan/qrcode) as a good example.

Have questions or comments? Make sure to ping me on the repo, as I plan on starting to iterate through a more useful version.
