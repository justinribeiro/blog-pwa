---
date: 2016-09-10T00:00:00Z
description: As the world of mobile progressive web apps grows, are we leaving those features behind on the desktop?
title: Thoughts on progressive web apps on the desktop
tags:
- Web
---

"Who here has built an offline web app?"

I raised my hand as I sat in that small breakout circle. This was the first Chrome Dev Summit in November 2013. I had expected others to raise their hand, but alas, I found myself soon explaining a desktop offline web app with a small group of people who had come to discuss the topic with Jake Archibald and Alex Russell.

What followed was a conversation about building blocks and roads less taken. The web app in question I hadn’t designed for mobile on the onset, but rather for desktops in remote offices with poor connectivity. The app I had built for a client was responsive across devices but originally designed only for desktops, progressive in it’s approach to features that the user may or may not have had available, used an app shell and a whole lot of other tricks.

The app was robust and fast in use. Users love it and three years later, with a few more updates and features, the app is still in use daily.

That web app would be close to what we call a progressive web app today. Yet desktop progressive web apps haven’t been spoken about much since the onset of the overarching term has started to take a foothold. The examples are often focused on the mobile web side of life.

Is there a place for the desktop progressive web app? Isn't desktop dead?

## In a land of mobile devices, desktop isn’t dead for all of us

There is a lot of data out there that shows [mobile is no longer a choice but a necessity](https://www.thinkwithgoogle.com/nordics/research-study/consumer-barometer-explore-our-new-mobile-trends-and-audience-insights/). The mobile web is sometimes the only experience some people will experience with our web applications, [particularly as use by millennials grow](https://www.consumerbarometer.com/en/stories/millennials). Mobile cannot be ignored.

That said, desktop internet use isn’t dead. In the United States, [75% still use a desktop for browsing](https://www.consumerbarometer.com/en/graph-builder/?question=M1&filter=country:united_states). Other reports put the number lower.

Beyond the consumer experience of the web, desktop takes on a different form.

My job on a good day is to build applications for organizations and teams to make them more efficient (paperwork being the not-so-good days). They’re the sort of apps that live behind closed doors and policy; you’re not going to see them as a consumer on your device of choice.

This is often the _OMG-IE-undead-versions-are-in-use-here_ sort of locations. People will tell you the web is ancient in these organizations, in that it-belongs-in-a-museum kind of way.

For some, that may very well be the case (and on my not-as-awesome days, I too have to fire up IE7/8 in a VM to work). But in my experience, more and more are converting to evergreen browsers in these organizations.

The reasons are much more varied than you would expect in a business setting, from basic value propositions and investment to simply user preference of using something that is nicer and offers them the features they’re used to using outside of the office.

If the foothold of progressive web apps grows in the mobile world that many users use on a daily basis, there is little doubt they'll be a need for them in the desktop corporate landscape.

## Your assumptions about the desktop might be skewed
As web developers we use the desktop browser different than an average user. We use the desktop to develop and we sometimes fall prey to assumptions about the platform from that experience. You’ve probably experienced this when testing for mobile on the desktop. We open DevTools and we use device emulation to test, expecting a one for one experience.

We know that this approach for mobile devices is ill conceived; what works smoothly on our desktop testing environment is not the same as on device. This is why we have things like [remote debugging](https://developer.chrome.com/devtools/docs/remote-debugging) and [network throttling](https://developers.google.com/web/tools/chrome-devtools/profile/network-performance/network-conditions?hl=en) to help us test a close as possible to what our users might experience.

Yet that assumption also informs our perspective on the overall capabilities of desktop browser experiences. Users have powerful machines and faster internet connections right? If I assume this, then I might not look at the overarching APIs and features that make up the progressive web app experience as something that my desktop web app might need.

A case in point is after a PWA talk I gave recently. A kind person came up to explain that desktop progressive web apps didn’t make sense.

“Why would I use those features for the desktop? My users don’t need offline, they’re always connected to the LAN. Seems like a mobile-only approach.”

That’s a valid question in my opinion. Do desktop systems and the types of the connections they experience need the sorts of benefits that Service Worker bring? Is the progressive web app approach only for mobile?

Desktop’s can suffer the same ills as any mobile device, no matter how fast you think your LAN or uplink may be. Our assumptions about the desktop experience are like mobile; we believe in a perfectly fast and always connected world that does not exist.

Searching my own experience with desktops and connections has been a mixed bag; for every wonderful organizational setup there has been the slow on-premise gateways, bad WLAN and satellite uplinks, remote offices that are simply neglected. This doesn’t even account for the mobile laptop user in the field who is at the mercy of shaky connections.

Even my own corporate office with it’s redundant connections and failover couldn’t help but go offline when the local utility company mistakenly used a backhoe in the wrong location and chopped cables in half last month.

When turn to look at hardware, just how fast are those desktops? Is that old desktop under the desk four years old? Is it bogged down with stacks of corporate software that the end user despises but has no control over (I’m looking at you horrible antivirus software)? Is it an entry level Chromebook? Is that so called fast LAN connection happenstance wifi hanging by it's PoE wire from the vent?

Even with best laid plans, problems will occur. Skips and pops and drops ruin productivity whether it's from a network issue or whether the machine is bogged down outside the user's control.

If we as web developers have the means to use the latest web technologies that mitigate these issues then why not give your users a faster more resilient experience? As Alex Russell points out in his article [_Service Workers and PWAs: It’s About Reliable Performance, Not “Offline”_](https://infrequently.org/2016/05/service-workers-and-pwas-its-about-reliable-performance-not-offline/), "It’s hard to stress enough how much better reliable performance is." Why can't we do the same for the desktop?

## Don’t short change the progressive web feature set on desktop
We can create reliable performance for our desktop web apps today using Service Worker given its offline and resilient nature, but that's only part of the progressive web application story.

Desktop web apps have in my experience suffered from three pain points that progressive web app features can help resolve today:

1. *Poor task re-engagement*. I’ve seen a variety of re-engagement on the desktop over the years, but they don’t quite work to the effect you’d want in practice. In page notifications can go ignored when there isn't focus or others relied on plugins. Today we have [Push Notifications](https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web?hl=en) and they work rather well in re-engaging with tasks that need to be updated by users in approval workflows (among other approaches).
2. *Data sync operations*. With Service Worker, we now get [Background Sync](https://developers.google.com/web/updates/2015/12/background-sync?hl=en) that can allow us to do give our users a more robust experience after they save work. No longer are they stuck waiting for operations to complete.
3. *No TLS*. One of the beauties of Service Worker is that it requires TLS. Why is that good for your desktop web app? Because I’ve heard this more times then I can count over the years. “That app is internal, we don’t need TLS.” Yeah, not so secure and frankly there is no excuse for this. But slowness! Psssft. Just watch [Emily Schechter take down the HTTPS myths](https://www.youtube.com/watch?list=PLNYkxOF6rcIAWWNR_Q6eLPhsyx6VvYjVb&v=e6DUrH56g14).

These three pain points standout for me based purely on some internal data for apps I’ve rolled out this year. Your milage will of course vary, but in two cases the Push Notifications implementations alone have seen task response time improvements by seeing engagement of ~40% on notifications range in comparison to email notifications (which are often ignored).

These sorts of features weren’t just made for the mobile web: they can increase the usage desktop web applications but also increase the overall performance of your users.

"But Justin, I can’t use all these features and I can’t just roll out a new copy of my app tomorrow." Which leads me to this very important point.

## Don’t lose focus of what progressive means

I’ve heard the following two definitions repeated to me in the last month:

1. Progressive = responsive
2. Progressive = my browser isn’t supported, site won't load

Before you balk at these definitions, consider they likely came about in response to examples that initially shipped as lacking the progressive approach (they only worked in browser X). Early examples and experiments are great by the way, just don’t take them as forever ongoing cannon.

The definition of progressive is "happening or developing gradually or in stages". Which is to say progressive enhancement, core in the progressive web app story, is about making sure that if a user doesn’t have that feature your application still works.

This is true on any device form factor. Getting into the mindset of "only work when all is there" is not reasonable in my experience; you can dictate all you want but users will gravitate to what they want to use. In the example I explain at the beginning, it was progressive through and through; if you used Firefox without File API, the app still worked. If you used Safari on iOS, the app still worked.

Further, focus on those gradual steps, desktop, mobile or wherever your platform may be. A great example of this during [Thao Tran’s segment in the Progressive Web App Summit keynote](https://youtu.be/9Jef9IluQw0?t=15m35s) where she speaks about differing and at times pain-point specific implementations that resolve user frustrations.

You don’t have to replace your entire application tomorrow. Progressive requires forward thinking. Spend the time, do the engineering, develop your progressive implementation. Your clients, your users, and your fellow developers will thank you.

## Oh that pesky desktop icon and window
When I initially wrote this draft for this piece back in July, I hadn't considered the desktop icon problem or window mode. On mobile, the PWA experience gives you that icon-on-homescreen appeal and that app-like single window. On desktop currently this isn't the case (though it does work fine on Chrome OS).

There are some technical hurdles around this which is why we haven't yet seen it. That said, I question the assumption that desktop PWA requires a desktop icon. Yes, it'd be a nice option. But how do people use the web on desktop today?

Simply walking around an office floor might tell a better story. Tabs rules the day and I would question a icon-to-window only approach on the desktop. We want our webs apps robust and user friendly and if we have to adhere to the icon and window approach on desktop, possibly that's an anti-pattern.

For me today, writing PWAs for the desktop in corporate environments, the icon and launcher conundrum is simply not a showstopper. That doesn't mean we should have a conversation about the concept of icons and desktop OS launchers.

## Desktop icon conundrum expanded
After I published the initial version of this piece [Kenneth Christiansen](https://twitter.com/kennethrohde), Chrome/Blink and web platform hacker extraordinaire, reached out to have a conversation about the concept of the icon and the notion of what it means on the desktop to end users.

"I still think that the icon makes sense on desktop in some cases," Kenneth wrote. "Apps like a calculator, or hangouts/instant messaging, or a file manager are nice to have around at the same time as your regular browser tabs."

I wholeheartingly agree on that; some things make sense to have and icon and window. But how do we handle this from a usability perspective? How do we determine to start a progressive web app in a tab or window?

"Maybe on desktop we want to be able to move between all states and just have the OS remember
and maybe use the display: mode as the default for the icon", Kenneth wrote. "'standalone' and 'fullscreen' is about maximizing real estate; on desktop starting in a tab and be able to move to standalone or fullscreen easily and then remember that choice when launched from a desktop launcher seems okay to me."

This seems to me a like a reasonable approach. The concept that you may start in a tab (as if typing an existing url by memory or address bar recall) gives the user a reasonable approach to the fictionless web that they know; they don't have to change their expection of what will happen when they hit enter, the progressive web app simply loads.

The notion that the application display mode would hint or offer a state switch is intriguing. Consider a possible basic flow of what that might look like:

1. Vist Calculator site.
2. Install Calculator PWA.
3. Calculator supports launching in standalone mode, click here to default to that mode.

By the time the user makes the selection in item 3 above, the last used mode will be used when launching from the launcher (tab, standalone, full screen, et cetera). The user could of course change this via the UI (the ability to set to a different window mode) and when manually loading from a tab, things will stay in a tab like always regardless of mode (no change in user expectation).

Further, a tab or PWA could be marked allowing the changing of display mode at any time, allowing the user a great deal of power to work the way they want.

This is one such senario; Kenneth and I tossed around ideas like tab marking and the concept of a display: floating mode (which could very well be standalone). We both agree that the icon in launcher for PWAs in Chrome OS is particularly nice (if you haven't tried it, you should, it's a very clean and smooth integration that feels very natural).

The careful reader might say "umm, Justin, why discuss this further? You just said that you didn't much care about the icon in the previous section." This is true; for me an icon is not the end all be all experience that defines the PWA experience.

However that's not the case for all users. For many an icon is how you start to work or play on the web. From emerging markets where the desktop is now just arriving after years of mobile only, to kids brought up on tablets, to people who simply don't recall URLs, icons and their OS launcher is a mainstay.

Remember we build for users all over the world, not just ourselves or our contained corporate environments.

## The story of progressive web apps is at the beginning, let us not leave the desktop behind

Progressive web apps are just now coming into focus. [Examples](https://github.com/hemanth/awesome-pwa) and [more examples](https://pwa.rocks/) abound. Paradigms and approaches are growing, [browser vendors are actively engaged](https://twitter.com/jaffathecake/status/745167284377780224), the [Progressive Web App Dev Summit](https://events.withgoogle.com/progressive-web-app-dev-summit/) showed what a future might look like for so many web applications.

My fear is that in our excitement we leave the desktop behind in this conversation, that people see the progressive web app story as only framed by the initial mobile focus. This would be a travesty and defeat the purpose of the power that these new features bring to the web as a whole.

Progressive web apps are going to be amazing for users. Let's just make sure we don't forget desktop web experience in the midst of change.