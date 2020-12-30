---
tags:
- photography
- gps
- lightroom
date: 2009-01-02T00:00:00Z
description: "Want to apply those PhotoTrackr GPS logs via Adobe Lightroom and GPS-Support?  It's only five easy steps."
title: Use Phototrackr GPS data with Adobe Lightroom and GPS-Support
url: /chronicle/2009/01/02/converting-a-phototrackr-gps-log-for-use-with-adobe-lightroom/
---

I find GPS useful beyond the standard in car or hiking use.  I often jot down GPS coordinates in my notebook when using the Speed Graphic (along with development information for later) so that I can find the exact spot should I need to return to explore other interpretations (read: I didn't like the way that light looked after all, or I screwed up). Monica had purchased a <a href="http://www.gisteq.com/PhotoTrackrProducts.php">GiSTEQ PhotoTrackr</a> for my birthday for use with the digital kit and I€™ve been fond of it ever since.  It's small and after some <a href="http://justinribeiro.com/chronicle/2008/09/05/mounting-a-gisteq-phototrackr-on-a-camera-flash-shoe/">modification</a>, fits on the hot shoe of pretty much any camera we decide to put it on.

The one thing I'm not really fond of is the software that comes with the PhotoTrackr.  I find it slow and cumbersome and wanted something that would preferably work with Adobe Lightroom (which Monica and I decided to finally start using last spring).  When I stumbled upon Jeffrey Friedl€™s <a href="http://regex.info/blog/lightroom-goodies/gps">"GPS-Support" Geoencoding Plugin for Lightroom</a> I knew I was very close to what I wanted.  But how do you get Phototrackr logs to work with the plugin?

The steps are fairly straight forward and there are a couple of ways to do this, but I'm going to show the path of least resistance.  You could presumably do this with any GPS log, as the conversion is the key.  What you'll need:

* GiSTEQ PhotoTrackr software setup and working
* Friedl€™s <a href="http://regex.info/blog/lightroom-goodies/gps">"GPS-Support" Geoencoding Plugin for Lightroom</a> installed.  If you do not, follow the aforementioned link for the download, and the follow his <a href="http://regex.info/blog/lightroom-goodies/plugin-installation">installation instructions</a>.
* <a href="http://www.gpsbabel.org/">GPSBabel</a>, to convert the log files.

Okay, lets get started.

## Step 1: Find the log you want to use and get ready to count
The first part is the most tricky.  As illustrated in the picture below, the PhotoTrackr software doesn't actually tell you what the filename is of the particular log you'll need to convert.  For that matter, the software doesn't tell you where the log files are stored (C:\Program Files\GiSTEQ PhotoTrackr\LogFiles is that location).  You have to find the log you want and the count (note the red numbers I've added in the screenshot below).  Basically, start at one at the top of the most recent imported logs, and count down to the log item you'd like.  This is not an exact science, but it works.

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"class="aligncenter size-full wp-image-98" title="Step 1" src="/images/blog/2009/01/step1.png" alt="Step 1">

## Step 2: Convert the log to GPX XML so GPS-Support can read it
After you've selected your log file, we're going to convert that log file from NMEA 0183 sentences to GPX XML using GPSBabel. This is pretty easy to do you using the GUI, though you could do it on the command line as well.  Note, you could reasonably do this with any GPS log you have, as long as the points were close enough together; just find the proper starting format for your GPS device (PhotoTrackr uses NMEA 0183).

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"class="aligncenter size-full wp-image-102" title="Step 2" src="/images/blog/2009/01/step2.png" alt="Step 2">

## Step 3: Fire up Lightroom and apply
At this point, we can fire up Lightroom and select the images we want to append with our GPS data.  After we select the images, we invoke GPS-Support via "File &gt; Plugin Extras &gt; Geoencode".  We use the "Geoencode from Tracklog" tab and load the GPX XML file we created as illustrated below.  After we've done this and tweaked any settings (check your timezone!) we click "Geoencode Images".

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"class="aligncenter size-full wp-image-103" title="Step 3" src="/images/blog/2009/01/step3.png" alt="Step 3">

## Step 4: GPS info added
After geoencoding the images, we should see a screen verifying what the just how much success the plugin had in matching dates and times. In this example, you'll note 47 images had GPS data applied, while 120 did not.  This was correct, as the log I chose wasn't long enough to match all the images.

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"class="aligncenter size-full wp-image-105" title="Step 4" src="/images/blog/2009/01/step4.png" alt="Step 4">

## Step 5: Where is the data exactly?
As illustrated below, the data can be seen in the metadata on the right hand sidebar. If you chose to use the writeback option of the plugin, can be added directly to the file (or XMP sidecar in the case of RAW files).

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"class="aligncenter size-full wp-image-108" title="Step 5" src="/images/blog/2009/01/step5.png" alt="Step 5">

Once you've run through this process a few times, it gets to be pretty fast. Friedl€™s GPS-Support plugin is class, as is the excellent open source tool GPSBabel. Having worked out the kinks, I actually use the Phototrackr more then I did before during the summer knowing that I can utilize this rather simple process to apply GPS data with my photography management tool of choice.
