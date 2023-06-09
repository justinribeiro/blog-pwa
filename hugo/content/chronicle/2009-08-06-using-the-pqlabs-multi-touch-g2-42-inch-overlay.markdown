---
tags:
- technology
- business
- multi-touch
date: 2009-08-06T00:00:00Z
description: "It's not often you have not one but two 42 inch multi-touch screens in the office."
title: Using the PQLabs Multi-Touch G² 42 inch overlay
url: /chronicle/2009/08/06/using-the-pqlabs-multi-touch-g2-42-inch-overlay/
---

Back in July, I talked about the fact I was working on a secret project that utilized 42 inch multi-touch overlays (see <a href="http://justinribeiro.com/chronicle/2009/07/12/mounting-a-laptop-on-a-chief-flat-panel-cart-using-a-6-99-document-holder/">here</a>).  While I didn't go into details as to what exactly those overlays were, I can now talk about it and review their functionality.  On the block today, <a href="http://multi-touch-screen.net/product.html">PQLabs Multi-Touch G²</a>.

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2009/08/pqlabs-overlay01.jpg" alt="pqlabs-overlay01">
## An Introduction
Before I started using the overlays I met with some of the PQ Labs team in their office in San Jose for a test run to validate that the product would meet a certain level of need (I wasn't the end user in this case). Yang Qi, who was an extreme help through out the development, walked me though demo's and let me play with a number of overlays on different screen sizes and angles in their demo room.  Beyond the demo's, I also was able to see what some of their partners were able to produce (some of the apps that <a href="http://22miles.com/">22 Miles</a> produced were simply spectacular).  The hardware and software was solid in the lab, but how would it play out in person?
## Setting up the hardware
About two weeks later, two brand new 42 inch units had arrived.  The units came packed in custom molded foam which held the units nicely in place.  While the boxes looked battered, upon opening everything looked as if it had just come of the assembly line.

The hardware overlay itself is a not only a thing of beauty, but very well made.  Black brushed aluminum composes the frame (which holds the tiny IR cameras which you can't see) on top of a thick piece of tempered glass.  The unit has a good weight to it, but can be easily handled by one person. A single USB connection jettisons out of the black frame for connection to a PC or Mac; there is no need for an external power source.

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2009/08/pqlabs-overlay02.jpg" alt="pqlabs-overlay02">

Setting up the units was simple enough; included with each unit were three rolls of thin, gray, 3M double sided tape.  The width across this tape was 3/8 of an inch, and I had my doubts that this tape would hold a unit of this size.  I was proven wrong almost immediately to the point of it wasn't even funny; when you apply that tape and attach that unit, do not expect any wiggle room. That tape is amazingly sticky once it touches glass or plastic.  So much so that once that overlay glass touches it, it pretty much is not coming off without a fight.  More on how to remove the overlay later.

Once the unit is attached, it blends in rather well.  Most people didn't even notice the overlay on the 42 inch LCD they were applied to (the black frame and black monitor bezel were a very good match).  To handle the USB cord, I simply used black gaffers tape to tape it under the bezel to the rear computer connection.

## Writing software for the overlays
Once connected to a computer, installing the multitouch server application allows the overlay to function immediately within the operating system environment.  I was using them with Windows XP SP3, and had no problems navigating around.  You can simulate a right click, double click, single click, click and hold...pretty much anything you would do with a mouse.

Running the demo's or playing with Google Earth really shows the overlays potential, since it offers support for five simultaneous touches.  The goal (or at least the people who wrote the presentation) was to utilize the SDK and examples provided to offer an interactive experience for the users at a conference.

Now, the SDK has support for C, C++, C#, Flash, Flex, AIR, WPF and .NET.  The sample code and documentation is pretty basic but from a few tiny demo's I wrote, workable.  Having spoken with Yang, I know that they're working hard to make the SDK and supporting documentation better.  In the mean time, you can write some powerful stuff (<a href="http://22miles.com/">22 Miles</a> has written some truly stellar software for them).

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2009/08/pqlabs-overlay03.jpg" alt="pqlabs-overlay03">

## In Use
The overlays work at HD resolutions, and I had no problem pairing them with a LCD's running at 1920x1080.  There isn't much lag time, though I will say if you drag your non-use fingers, the screen reads it as multiple touches (any screen would mind you).  The five point multi-touch works great in applications that support it.

## Removing the overlay from the screen
Remember I said the tape was quite sticky?  It took my some time to figure out a good method for removal.  PQLabs recommends a knife between the overlay and the screen, and that's pretty much what I had to do.  It was extremely hard (that tape does not want to give), and I soon found that a very good putty knife worked better than a knife.  You have to be patient, and I recommend two people for the job. If you're expecting the tape to fail...I would say probably not.

## The verdict
The <a href="http://multi-touch-screen.net/product.html">PQLabs Multi-Touch G²</a> is a seriously cool piece of hardware that lives up to even the highest of expectations in my opinion.  It's a very high quality item with a good team behind it working to make it even better.  I don't know what I want to do first: write a game for them or write a Linux driver.  You're right, I'd just work on both at the same time.

I will say that I found the 42 inch size to be the way to go; we had originally looked at 50 inch, and in practice, the 42 inch model was much more usable in my opinion (not so much head bobbing while looking around the screen).

Can I recommend this overlay? Yes.  Can you buy this overlay today?  Yes, just head over to <a href="http://multi-touch-screen.net/product.html">their website</a> and you can have one delivered to you door pretty quick.

## The presentation...
People are going to ask to see what the presentation that actually ran on these two screens looked like, and I can only say that I can't show it (not for the usual reasons mind you). It was no fault of the hardware or SDK, but rather something largely out of my control. It's another story for another time. I will say the Flash presentation worked...sort of.

But you want some video right? The following video was taken of <a href="http://card.ly/jamesduvall">James Duvall</a> working the screens in my office.  You're probably wondering why we're playing games on these screens; that would be because we were testing to see if we could write games for them ourselves (in particular we were testing the lag).

<iframe width="560" height="315" src="https://www.youtube.com/embed/vL3ek3vldqI" frameborder="0" allowfullscreen></iframe>
