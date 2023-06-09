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

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2014/11/nfc-testing-hce-pixel-android.jpg" alt="NFC reader on Pixel talking to Android HCE">

I'll be at AnDevCon on November 21st at the NFC Forum booth if you'd like to see a demo (along with other things).