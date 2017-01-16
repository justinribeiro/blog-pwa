---
categories:
- android
- nfc
- chrome
date: 2014-11-15T00:00:00Z
description: Sometimes you want your Android HCE to talk to the NCF reader in a Chrome App. Sample code included.
title: Android HCE talking to Chrome App with NFC reader
url: /chronicle/2014/11/15/host-based-card-emulation-talking-to-chrome-app/
---

The other day over on Google+, I showed off the [Chrome DevTools console spitting out bytes of our NFC conversation](https://plus.google.com/106603156529760508714/posts/SdT2eCSkhFr). Screenshots are good, video demo and code samples are better. So, without further ado, the pieces to make this all work together.

First, the Chrome App source code:
[https://github.com/justinribeiro/hce-to-chromenfc-app](https://github.com/justinribeiro/hce-to-chromenfc-app)

No need to build chrome-nfc, I've included the proper build in that repo. It's as turnkey as I could make it.

Second, the Android App source code:
[https://github.com/justinribeiro/android-hostcardemulation-sample](https://github.com/justinribeiro/android-hostcardemulation-sample)

Third, my slightly modified Chrome-NFC fork:
[https://github.com/justinribeiro/chrome-nfc/tree/type4-conversation](https://github.com/justinribeiro/chrome-nfc/tree/type4-conversation)

Finally, the video of it all in action:

<iframe width="640" height="360" src="//www.youtube.com/embed/IPoio0FtmGY?rel=0" frameborder="0" allowfullscreen></iframe>
