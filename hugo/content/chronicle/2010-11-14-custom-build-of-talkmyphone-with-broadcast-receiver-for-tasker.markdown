---
tags:
- Android
- clone
- tasker
- talkmyphone
date: 2010-11-14T00:00:00Z
description: Life automated to the power of Android...and Tasker...and TalkMyPhone.
title: Custom build of TalkMyPhone with broadcast receiver for Tasker
url: /chronicle/2010/11/14/custom-build-of-talkmyphone-with-broadcast-receiver-for-tasker/
---

I like when things just work.  When that doesn't happen, I start hacking to make it so.  Worst case, it doesn't work but I learn something.  Best case, I get something that fits my need.  So begins the tale of my forwarding communications story.

For some time, I've wanted my mobile phone to stop being mobile.  I wanted it to forward all communications based on location, from phone calls, to voicemail, to SMS.  When I was sitting at my desk I just didn't want to touch it.  This dream did not come true in my Treo days, it didn't come true for the short time I tried the iPhone, but ohh, this Nexus One and Android thing had potential.  I originally set out to begin writing my tools and then a funny thing happened.

First, Tasker comes on to the scene. Make no mistake, <a href="http://tasker.dinglisch.net/">Tasker for Android</a> is a powerful tool for anyone that finds themself wanting to automate any number of things.  It makes my phone a much more powerful tool and for that I can't shout to the heavens loud enough just how nice it is.  Combined with the awesome <a href="http://sites.google.com/site/steelgirderdevelopmentsite/home/locale-google-voice-plug-in">Google Voice plugin</a> from Steelgirder and a half dozen auto dialer tasks and I was half way home (oh the phone number disaster I keep...).

<a href="http://code.google.com/p/talkmyphone/">TalkMyPhone</a> is an open source application for Android that allows you to get notifications through XMPP, which is what Google Talk runs on.  But beyond that, it allows you to reply to SMS from your IM client as well as access other data on your phone without touching your phone.  So very cool, so very useful.

But the one key piece that I wanted to accomplish I could not. I wasn't able to shutdown TalkMyPhone when I left the office, it just didn't have the hook.  Reading the <a href="http://groups.google.com/group/talkmyphone-users/browse_thread/thread/f238a874513d8e52">following forum post</a>, I could start it, but I couldn't stop it.  I would simply have to wait for the next version.

But as I mentioned earlier, TalkMyPhone is open source, its code readily available for hacking on Google Code.  Why not take a dive in, see about writing something quickly that might get me over the hump until the offical update comes out?  And so, I give you my custom build of TalkMyPhone.  This is basically the 2.06 beta that was released on October 6th, but with one difference.  It implements a broadcast receiver that Tasker can call via Action Intent, allowing the state of the connection service that TalkMyPhone uses to be toggled.  This function is available within the app already (the start/stop button) but Tasker can't click that button.  So I simply wrapped the calls in something Tasker could use (so to speak).

I originally tried to get the latest code commits working with this update, but I wasn't having much luck (my broadcast receiver worked fine, but there seemed to be some other bugs with the recent refactoring going on).  For those interested, <a href="http://code.google.com/r/justindavidribeiro-talkmyphone-tasker/">my clone of the trunk</a> is located on Google Code as well.

<img src="http://justinribeiro.com/chronicle/wp-content/uploads/2010/11/20101114-tasker1.png" alt="">

As you see in the above screenshot, once you install my version of TalkMyPhone, you create a new Task within Tasker (you can name it whatever you like), click the plus icon, select Misc > Action Intent, and enter ".TalkMyPhone.TOGGLE" (case sensitive) and set the target to Broadcast Receiver.  Click done, and presuming that you have setup TalkMyPhone already, you can test the task to see it in action.

So if you've read this far and are feeling lucky, I offer up my humble build for download.  I've tested it on my Nexus One and in emulation, but your mileage may vary.

<blockquote>DISCLAIMER: I offer my little addition/solution/hack/whatever as-is with no warranty, I'm not responsible if your phone explodes, et cetera.  I have not extensively QA'ed this so I can't speak to battery life. I recommend you uninstall TalkMyPhone if you already have it, and install my version clean (which requires you to re-setup TalkMyPhone).</blockquote>

<a href="/chronicle/downloads/talkmyphone-jdr.apk"> -- Download talkmyphone-jdr.apk</a>

Enjoy, use at own risk, don't yell too loudly at me.
