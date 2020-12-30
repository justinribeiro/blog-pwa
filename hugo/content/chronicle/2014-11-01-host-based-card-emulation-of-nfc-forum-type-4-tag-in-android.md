---
date: 2014-11-01T00:00:00Z
description: Getting started with HCE on Android by emulating a Type-4 tag. Sample code included.
title: Host-based Card Emulation of NFC Forum Type-4 tag in Android
url: /chronicle/2014/11/01/host-based-card-emulation-of-nfc-forum-type-4-tag-in-android/
tags:
- IoT
---

Most people probably think of Host-based Card Emulation in terms of Google Wallet or other payment systems, but you can actually do all sorts of thing with the API. You can get really custom (such as writing your own back and forth communications), but I wanted to try to do something closer to one of the specications that you might commonly find.

With that, I give you the pieces that allow emulating a NFC Forum Type-4 tag (ISO14443-4) using Host-based Card Emulation on Android. Android and example client code are available on github [justinribeiro/android-hostcardemulation-sample](https://github.com/justinribeiro/android-hostcardemulation-sample).

The code base is young, but closely matches the commands as defined in the NFC Forum Type 4 Tag Operation Specification 3.0 (specifically, appendix E "Example of Mapping Version 2.0 Command Flow"). In the picture below, you can see the flow of commands from the NFC reader running on a Pixel to the Nexus 4 and back.

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2014/11/nfc-testing-hce-pixel-android.jpg" alt="NFC reader on Pixel talking to Android HCE">

I'll be at AnDevCon on November 21st at the NFC Forum booth if you'd like to see a demo (along with other things).