---
title: "Fighting with Dynatrace to Send Custom User Timings with Performance Observer"
description: "Performance for the web is important. Tracking that web performance with Dynatrace however is not as easy at it seems."
date: 2019-09-16T16:08:18-07:00
tags:
- Development
- Web
- Performance
---

I’ll track web performance anyway I can. It’s important for end users. It’s important for developers. You should do it. We as the web community and browser vendors have some amazing tools and APIs that have significantly made this easier, and they continue to get better every day.

Collecting that as real time user data can be a challenge, especially if you’re using a large, third-party library that may not exactly be doing what you think it’s doing.

Which leads me to dealing with Dynatrace. I say “dealing with”, because it’s been a pain in my side for longer than it should have been. For those uninitiated with the world of application performance management, better known as APM, many of the competitors in the space have JavaScript libraries that are laced with good intentions but wrapped in a warped and outdated view of how browser’s work. Don’t believe me? Just look at [Patrick’s third-party-web](https://github.com/patrickhulce/third-party-web) impact list and tell me different.

> "Justin, Dynatrace isn't in that list". Due to the way the Dynatrace library is often setup, it's hard to see within Chrome UX report and it's not surfaced in the above link. I've traced this _hard_, and given a baseline of 80ms of work for a one such component we have in one production environment, the overhead for Dynatrace was nearly 350ms when traced. On mobile devices the impact was so noticeable, I worked around it by loading it after the thread idled (contrary to Dynatrace recommendation).

But I digress. How does one work with custom user timings, and how do we send them to Dynatrace?

[User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) is a nifty little platform feature to mark and measure certain aspects of your code that may be important to you. I use them a lot to determine how various sections, modules, and web components load. Set some marks and measure:

{{< codeblock lang="javascript" >}}
performance.mark("my-comp-start");
someThingToMeasure();
performance.mark("my-comp-end");

performance.measure('was-i-fast', "my-comp-start", "my-comp-end");
{{< /codeblock >}}

Already, you’ve probably come to the conclusion “well, if I can set them can’t I just send them to any ‘ol APM or telemetry system I want?” Triple word score, indeed you can.

These marks and measures can further be surfaced via various methods. One such example is to do so via `PerformanceObserver()` and then send to our telemetry service:

{{< codeblock lang="javascript" >}}
const observer = new window.PerformanceObserver(list => {
  const __sendPerfData = (entry) => {
    // ... send to telemetry
  };
  const entries = list.getEntries();
  for (let i = 0; i < entries.length; i++) {
    // try to be smart about this
    if ('requestIdleCallback' in window) {
      requestIdleCallback(
        () => {
          __sendPerfData(entries[i]);
        },
        {
          timeout: 2000,
        },
      );
    } else {
      // fallback scenario
      __sendPerfData(entries[i]);
    }
  }
});

// the types of entries we want to listen for
observer.observe({ entryTypes: ['mark', 'paint', 'measure'] });
{{< /codeblock >}}

> Note: I would be remiss to not mention that these measures and marks also appear when you’re running traces in DevTools (you are running traces aren’t you?) and can be surfaced in Lighthouse as well (because you're always measuring right?).

How does one send said information to Dynatrace? Well if we look at the documentation for their JavaScript library we find...nothing. Turns out, that is not public information. No wiki. No docs site. Nada. If you don’t have an account with Dynatrace and the proper permissions, you can’t actually get to said docs or examples. When you finally do get access you have to download a zip file of what I can only describe as lackluster documentation. That’s probably being too nice.

The docs and examples leave much to be desired. After culling through methods with very little description, we settle on two: `enterAction` and `leaveAction`. The parameters seem straight forward enough (some labels and numbers representing milliseconds), so we set our `__sendPerfData()` method within our `PerformanceObserver()` and away we go:

{{< codeblock lang="javascript" >}}
if (window.dtrum) {
  const dtrumId = window.dtrum.enterAction(
    'WcTelemetry',
    entry.mark,
    entry.startTime,
    entry.entryType,
  );
  const endTime = entry.duration || entry.startTime;
  window.dtrum.leaveAction(dtrumId, endTime, entry.startTime);
}
{{< /codeblock >}}

Turns out, that doesn’t work. Asking Dynatrace support leads to a fruitless conversation and Fiddler traces, the end result being “your code is correct, the library is being loaded wrong”. At which point they ask you to inject 18K worth of JavaScript at the head of your document.

Imagine my joy. Or me throwing a chair through a window. It’s choose your own adventure people. The latter is closer to reality.

Turns out that 18K of injected code doesn’t work either, other than making the perf numbers look in worse in my traces (color me surprised). Which left me pondering: how hard is it to send numbers to a service? So begin the journey of debugging their terrible library. You see, said Dynatrace library doesn’t throw an error when calling any of that code. It’ll run their code all day long and never send those numbers.

Digging through their minified code reveals a call stack that made me consider becoming an alcoholic. It was at this point colleague Dave pointed out that the only thing that seems to make it work is by using their `now()` method, which was of no use to us in practice. Taking a look at `now()` did reveal that it uses milliseconds since Epoch. This becomes clue number one: the library doesn’t understand DOMHighResTimeStamp from our Performance entries, it want’s old-school time from the Epoch.

A quick change to the code and we see data on the wire:

{{< codeblock lang="javascript" >}}
if (window.dtrum && entry.entryType === 'measure') {
  // performance.timeOrigin comes from High Resolution Time Level 2.
  // performance.timing is the legacy and deprecated by Navigation Timing Level 2 specification.
  const timeOrigin = performance.timeOrigin || performance.timing.navigationStart;
  const dtrumId = window.dtrum.enterAction(
    'WcTelemetry',
    entry.name,
    timeOrigin + entry.startTime,
    entry.entryType,
  );
  const endTime = entry.duration + entry.startTime + timeOrigin;
  window.dtrum.leaveAction(dtrumId, endTime, entry.startTime + timeOrigin);
}
{{< /codeblock >}}

Except, all is not well. You see, Dynatrace will send that data, but that data appears nowhere. Turns out that Dynatrace also doesn’t support high resolution time _at all._ Which means now we have to `trunc()` some things:

{{< codeblock lang="javascript" >}}
if (window.dtrum && entry.entryType === 'measure') {
  const timeOrigin = performance.timeOrigin || performance.timing.navigationStart;
  const dtrumId = window.dtrum.enterAction(
    entry.name,
    'WcTelemetry',
    Math.trunc(timeOrigin + entry.startTime),
  );
  const endTime = Math.trunc(entry.duration + entry.startTime + timeOrigin);
  window.dtrum.leaveAction(dtrumId, endTime, Math.trunc(entry.startTime + timeOrigin));
}
{{< /codeblock >}}

Yeah, trunc. Terrible, but alas, that code works and custom user timings begin to appear.

In summary:

1. Dynatrace doesn’t support DOMHighResTimeStamp from custom user timings; if you try, it’ll never error out, but your dashboards in Dynatrace will never populate.
2. Dynatrace will happily send high precision numbers, but won’t actually store them (again, not that we have any indication of this error or documentation wise).
3. Presuming you have the docs, none of this information is in there.
4. Presuming you have a support contract, that’ll prove absolutely worthless in any attempt to debug this.

I question if Dynatrace has anyone who understands the web. That may sound like a harsh criticism, but it’s 2019, your JavaScript library is heavy and weighs down performance minded code and your documentation is junk.

In case you missed it, I’m not particularly having it anymore.

If we don’t hold our third party vendors accountable, things won’t get better. Do better. Build a faster web. If you don't, well, there are always other vendors with an eye towards performance and to the future.
