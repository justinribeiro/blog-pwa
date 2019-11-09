---
title: "Three Reasons You Betrayed Your Modern Web Tooling"
description: "In the modern web development era tools are held like swords in meeting rooms, poking holes in coffee cups in the name of process. From hard fought battles, here are three reasons your tools are not working for you and what to do to stave of that arrow to your project."
date: 2019-10-01T09:46:54-07:00
tags:
- Web
- Business
---

No one wants to believe the DevTools trace. I have many theories as to why, some proven others less so. One prevailing theory I have is that people don’t understand how to read said trace, so I do the only reasonable thing and teach them. Surely that’ll work I always think, knowledge is power.

Apparently it’s not enough power, as they still won’t believe it.

Finger pointing will ensue. Passive aggressive comments will be made. Somehow it will become not only my fault, but my problem. Which is funny because if it’s really my problem I’ll fix it. I will propose a plan, people will immediately push back and protect their tiny kingdoms.

Among the ensuing fray of competing kingdoms waging their various troops forward shouting the battle cries of yore, “Ops, chaaarrrge”, “UX through the flank”, and “AGGGILEE!!!” it’s clear no one has a clue what’s going on.

Mind you the villagers do. Yeah, they’re your users suffering at the hands of your petty turf war.

A comment from the lead developer leaves their quiver and flies through the air destined for my heart, to end the ensuing threat of more of my trace analysis.

“We’re using modern web tooling and we followed so-and-so’s guide and they’re an expert.”

The arrow strikes true, resulting in a hushed silence upon the battlefield. A smirk comes across my face.

“A craftsperson never blames their tools.” The arrow falls lifeless to the floor, my armour in tact.

You see I hear this argument more often than not these days. Pick a fancy web tool and I’ve probably got a terrible story of poor engineering around it. The three rather generic reasons I’ve seen time and again for this poppycock:

1. *Time investment for learning*. Not all tools are intuitive; some are harder to learn than others and that requires time and invest to use correctly in a project to get the performance you may want. I sometimes call this the “WebPack conundrum”.
2. *Single information source*. Too many folks send cited sources and articles that gloss over or misstate the impact of said tool usage, yet these often single point information source then becomes the gospel truth in a given team.
3. *Hope-based Development*. People don’t put in the work to verify anything, resulting in “write once, it works on my machine, it built so it's not my problem” thinking. I call it hope-based because I'm being optimistic that people actually are hopeful their code works better, but experience tells me they too often don't care.

Ultimately these things conspire against the very best web tooling because just because a tool is good doesn’t mean it can’t be misused. A lot of work has been done on many such tools to push warnings and messages to developers in an attempt to prevent such harsh and poor performing development modes from slipping into production, but if you’ve got a team that’s done any or all of the above three points, a warning isn’t going to stop them.

What can you do to prevent such malfeasance? For starters, I’d never take any article or tutorial on the web as a single source of truth. There are rare exceptions, but even in those cases it comes back to doing your due diligence, not just from a single developer but rather a team effort.

1. *Managers*: Give your developers time to actually study what they’re working on. Tight deadlines are all fine and dandy until you ship a steaming pile of code that only functions on a set 12 core processors. You want cutting edge? Give them time.
2. *Developers*: Know your tools and and which ones are right for the job at hand. What every you choose out of your toolbox, you have to trace. Trace on your desktop, trace on device. Run tests. Find the edges of the performance and tooling. Study reasons why, test your hypothesis.
3. *Designers*: Get to know the web. Understand that for all our progress, we have constraints that differ on devices and network connections. Dig in, learn what works and what might not get you to 60 fps.
4. *Quality Assurance*: You’re the last line of defence. Get some Lighthouse tests in your mix and verify that web app is going to work for users in a wide range of places and device types. Look beyond upper management's high speed Wifi and iPhone X existence.

Ultimately it’s not the tools that betrayed you, but rather your approach to them and the code you write. Tools won’t save you from poor engineering; you have to put in not just the work to write the lines of code, but also understand what those lines of code actually going to do. The tools will only get you so far, and then it comes down to actually verifying how that deliverable is going to perform.

When in doubt, run a trace and work through it. If everyone started doing these things, just maybe I’ll get less arrows shot at me at my next meeting.
