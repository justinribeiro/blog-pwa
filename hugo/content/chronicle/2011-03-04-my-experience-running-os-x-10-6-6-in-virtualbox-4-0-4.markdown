---
categories:
- OS X
- Virtualbox
- VM
date: 2011-03-04T00:00:00Z
title: My experience running OS X 10.6.6 in Virtualbox 4.0.4
url: /chronicle/2011/03/04/my-experience-running-os-x-10-6-6-in-virtualbox-4-0-4/
---

For the record, I don't have any problem buying a retail copy of OS X.  I do have a problem not being able to easily virtualize that copy without being labeled a criminal for something I just bought. So since I don't consider it a crime to use something I paid for how I'd like, I decided I was going to virtualize OS X on AMD hardware come hell or high water.  I quickly looked around to see if I could somehow get 10.6.6 working in Virtualbox 4.0.4 as quickly as possible.

The following isn't so much a guide as it is my general findings of what worked for me.

* Run through <a href="http://tek411.blogspot.com/2010/06/osx-in-virtual-box-hackintoshed-vm.html">this guide</a> on installing 10.6.2.  It's pretty spot on.  You'll have to go find Havok's torrent, which I will not link to here (namely, because I don't have it handy...if I run across it, I'll post the link). 

* While you're installing that, go grab the <a  href="http://support.apple.com/kb/dl1349">10.6.6 combo update from Apple</a>. It tops just over 1GB in size.  Do not install the update via software update in OS X.  It'll just screw things up. 

* Go grab Nawcom's 10.6.6 Legacy kernel update. The <a href="http://blog.nawcom.com/?p=538#more-538">blog post</a> about explains the details, and here's the <a href="http://dl.nawcom.com/Kernels/10.6.0/legacy_kernel-10.6.0.pkg.zip">direct download</a>. 

* Presuming you were successful installing 10.6.2 from the torrent, simply run the 10.6.6 update but do not restart.  When it's complete, run the legacy kernel update.  Once that's done, rebooting will often lead to a kernel panic and it won't properly reboot.  You'll have to hard kick the virtualbox power button on that instance, but once you do that you should be back up and running. 

* Contrary to popular belief, you can up the resolution beyond 1280x1024 in Virtualbox and OS X.  What you have to do is see if what your listed video modes are by hitting the down arrow at the boot screen before OS X boots (see screenshot).  Once you have your target, type -x "Graphics Mode"="[YOUR MODE]" and hit enter.  It will then boot OS X into that resolution. 

* The problem with this of course is that the increased resolution does not seem to stick across reboots (even if you change the plist boot file to match).  For me, I didn't give it much thought (my VM is for testing purposes and isn't an every day boot), so if you're looking for a solution, I don't have one.  I did try the VBoxManage setextradata option, but that didn't work for me. 

And that's about it.  I can't speak to the ins and outs; as I mentioned before, it's not a daily use sort of thing for me.  Everything I need it to do (run a little Xcode, debug some apps) it does without fail.  Your mileage of course will vary.

<img src="/images/blog/2011/03/screenshot-20110304-videomodes.png" alt="Video modes in Virtualbox">

<img src="/images/blog/2011/03/screenshot-20110304-videomodebooted.png" alt="Booted up, running at proper resolution.">
