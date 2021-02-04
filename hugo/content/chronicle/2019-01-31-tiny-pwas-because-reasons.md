---
date: 2019-01-31T08:00:00-08:00
title: "Tiny PWAs and why I keep building them"
description: "The search for useful tiny apps is hard, but progressive web apps and the growing api surface on the web platform are starting to fill the gap."
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20190131-car-dashboard-pwa.jpg"
tags:
- Web
---

I did not set out to build tiny progressive web apps. Well, that’s not true; I set out to build PWAs that solve particular problems in my life, which ended up being tiny. Then it just became fun.

You see my car, a 2005 Prius, has a terrible glitch in the dashboard where the dash simply doesn’t work. No speedometer, no gasoline gauge, nada. I can fix it by doing some solder work, but that require me to tear down the dash which is rather time consuming.

My kids also have a particular issue; they like to sleep in the dark but have a furious appetite for Monica or myself to read to them. A lot. They’re at the Harry Potter stage, which means you’re _reading_. This is serious work and a lot of joy. They love the little reading LEDs I make, which means they go missing on a daily basis.

Both the above cases would lead one to say “surely there is a app for that!” A quick look leads to speedometer apps with ads and 30MB download weight, and simple screen light that also have ads that weight in at 5MB.

I collectively sighed. None looked reasonable to me. Maybe I was grumpy. Maybe I don't trust things in app stores much anymore. It's a mixed bag.

Which lead me down the rabbit hole: how quickly can I build these sort of apps as PWAs? Do I have enough API surface on the web platform?

For the speedometer, we can look at the [GeoLocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation). The GeoLocation API has a Position interface, which contains a Coordinates object, coords. This Coordinates interface contains not only things you might expect (latitude, longitude), but also contains a property called speed, which is represented as the device velocity in meters per second. Chrome on Android returns this prop with very little effort, at which point it's just a matter of some quick math to do the mph/kmh conversion.

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog/20190131-car-dashboard-pwa.jpg" alt="Running my speedometer PWA">

That said, both the speedometer and the reading light have a problem; how do we keep the screen on? Luckily, there’s a new API we can play with called the WakeLock API.

The [WakeLock API](https://www.w3.org/TR/wake-lock/) allows us to prevent our device from going into power saving mode and generally prevent the screen from turning off using a simple bit of code:

{{< codeblock lang="javascript" >}}
const startWakeLock = () => {
  try {
    navigator.getWakeLock("screen").then((wakeLock) => {
      appOpts.wakeLock = wakeLock.createRequest();
    });
  } catch(error) {
    // no experimental wake lock api build
  }
}
{{< /codeblock >}}

Now, this API is subject to change ([comments welcome](https://github.com/w3c/wake-lock/issues)), as we’re still trying to sort out what the permissions model looks like among other things. You can also read an article about it Pete LePage recently wrote on, _[
I’m Awake! Stay Awake with the WakeLock API](https://developers.google.com/web/updates/2018/12/wakelock)_. But the API, when flipping the flag within Chrome, works as expected giving me the ability to build out said PWAs.

Along those lines, the experimental [AmbientLightSensor API](https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor) behind the chrome://flags#enable-generic-sensor-extra-classes also allows me to detect when it's dark outside, allowing me to have a proper low-light style with very little code effort:

{{< codeblock lang="javascript" >}}
const startAmbientSensor = () => {
  if ('AmbientLightSensor' in window) {
    navigator.permissions.query({ name: 'ambient-light-sensor' })
      .then(result => {
        if (result.state === 'denied') {
          return;
        }
        const sensor = new AmbientLightSensor({frequency: 0.25});
        sensor.addEventListener('reading', () => {
          if (sensor['illuminance'] < 3 && !appOpts.dom.body.classList.contains('dark')) {
            appOpts.dom.body.classList.toggle('dark');
          } else if (sensor['illuminance'] > 3 && appOpts.dom.body.classList.contains('dark')) {
            appOpts.dom.body.classList.toggle('dark');
          };
        });
        sensor.start();
    });
  }
}
{{< /codeblock >}}

The end result, smoothly switching based on our lumens, is quite pleasant:

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog/20190131-day-night-mode.png" alt="Day/night mode via the AmbientLightSensor API">

The end result [speedometer pwa](https://speedometer.pwa.run/) is astonishing tiny; just 1.7KB for the speedometer and 800B for the reading light. The service worker is tiny as well, as it doesn’t have to work too hard as we’re not dealing with anything but a version index file for the most part. You can grab a look at the source code on Github: [justinribeiro/speedometer-pwa](https://github.com/justinribeiro/speedometer-pwa).

The [screen reading light](https://readinglight.pwa.run/) is similarly of small size, also available on Github: [justinribeiro/readinglight-pwa](https://github.com/justinribeiro/readinglight-pwa).

These two tiny PWAs are really just the tip of my tiny PWA stash; I've started making all kinds of them. Getting them all written up and pushed to Github, well, I'm still working on that. It was the holidays, so sue me. :-)

In the mean time, try some new web platform APIs and give the tiny PWA writing a spin. You just might find some joy in it! 🎉
