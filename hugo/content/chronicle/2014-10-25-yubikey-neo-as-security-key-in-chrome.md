---
date: 2014-10-25T00:00:00Z
description: Setting up the Yubikey Neo takes a couple of additional steps before you can use it with Chrome two factor. Let's walk through the steps.
title: Using a Yubikey Neo as a security key in Chrome for two factor auth
url: /chronicle/2014/10/25/yubikey-neo-as-security-key-in-chrome/
tags:
- Web
---

I'm a fan of [two factor authentication](https://en.wikipedia.org/wiki/Two-step_verification) as means to offer better security. Lots of services and sites now support the technique and more are adding the functionality every day. For a full list, see [twofactorauth.org](https://twofactorauth.org/).

Recently, Google Security noted in a [blog post](http://googleonlinesecurity.blogspot.com/2014/10/strengthening-2-step-verification-with.html) that they have add the use of [security keys](https://support.google.com/accounts/answer/6103523). The implemention uses the Universal 2nd Factor (U2F) protocol from the [FIDO Alliance](https://www.fidoalliance.org/).

While currently only working in Chrome, there is tracking ticket on Bugzilla for Mozilla ([Bug 1065729 - Implement the FIDO Alliance u2f javascript API](https://bugzilla.mozilla.org/show_bug.cgi?id=1065729)).

## Making it work with a Yubikey Neo

I picked up a Yubikey Neo for a couple reasons. One, I wanted to scope out the work in Chrome and Google Accounts. Two, I have some NFC things I'd like to use it for later in November.

However, you can't just use the Neo out of the package. A few steps to make it work:

1. Download and install the Neo Manager application for your respective platform: [https://developers.yubico.com/yubikey-neo-manager/Releases/](https://developers.yubico.com/yubikey-neo-manager/Releases/)

2. After install, insert Neo and verify the version. You need a version 3.3 Neo device to use U2F; earlier versions of the Neo won't work and cannot be upgraded.

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2014/10/screenshot-20141024-connection-mode.jpg" alt="Neo Manager app showing status">

3. Change the connection mode to U2F (you can't use OTP and U2F at the same time).

4. Verify the mode again and then head over to [https://security.google.com/settings/security/securitykey/list?pli=1](https://security.google.com/settings/security/securitykey/list?pli=1)

5. Click add and walk through steps and you should have U2F rolling!﻿ See  screenshot below.

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2014/10/screenshot-20141024-security-key.jpg" alt="Security key setup for Google Account">

Since the $50 price tag for the Neo might put some folks off, there is a specific Yubico key preset to U2F only for $18 (see [FIDO U2F Security Key @ Amazon](http://www.amazon.com/Yubico-Y-123-FIDO-U2F-Security/dp/B00NLKA0D8/ref=lh_ni_t?ie=UTF8&psc=1&smid=A3PIGE6HBK2LA8#)). I have not tried this key but it is specifically linked in the Google Support documents.

