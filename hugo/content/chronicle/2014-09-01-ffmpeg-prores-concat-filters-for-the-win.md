---
categories:
- ffmpeg
- prores
- concat
date: 2014-09-01T00:00:00Z
description: Sometimes you need to do some very custom stuff with video. ffmpeg, ProRest and concat oh my!
title: ffmpeg, ProRes and concat filters for the win
url: /chronicle/2014/09/01/ffmpeg-prores-concat-filters-for-the-win/
---

So you have the need to process a whole lot of video masters, but they all need to be converted to ProRes HQ. Sure, you could open said video file and queue it up in the video editing suite of your choice, or you could go command line style with a whole load of wonderful compute instances on your favorite cloud provider. I like that latter option.

## In the land of ffmpeg, all ProRes is not created equal

I heart ffmpeg. For a lot of years I've made it do some amazing things that it shouldn't have had to do, and I was able to that with the wonderful contributions of the community. ffmpeg is a powerhouse.

While most people believe that the land of ProRes is Apple's, ffmpeg actually has a few different ProRes codec options. Your results may vary, but only prores_ks offered artifact free output for the masters I was dealing with. Let's walk through a basic recoding command:

{{< codeblock lang="bash" >}}
ffmpeg -i masterSomethingOther.mov -codec:v prores_ks -profile:v 3 -pix_fmt yuv422p10le -qscale:v 11 -codec:a pcm_s16le masterProRes.mov
{{< /codeblock >}}

A couple things of note. -qscale:v 15 is a important flag, otherwise you're going to spin up a bitrate that's probably way above our input. 11 in our case is a good mix of quality but not too much bitrate (9 would offer use better quality). You need to test for youself which looks best for your content. -profile:v is telling ffmpeg to use ProRes HQ (0 would be proxy, 1 is LT and so on). I'm not in this case using -vendor ap10 (which fools Final Cut into thinking quicktime did the encoding) namely because I didn't need that. For a full discusion and list of other options, read [ffmpeg's encoding/vfx guide](https://trac.ffmpeg.org/wiki/Encode/VFX).

## Concat filters, you're new friend

Let us a presume that I need to add black in and outs for those new ProRes masters I just completed. There are a few ways to do this with a single ffmpeg command but for the sake of the brevity, let's breakout a few commands to make things a little easier.

First, we generate some silence with our virtual device:

{{< codeblock lang="bash" >}}
ffmpeg -f lavfi -i aevalsrc=0:0:0:0:0:0::duration=10 silence10sec.ac3
{{< /codeblock >}}

Note, you could shorten the command above with aevalsrc=0 and use the -t option to limit the amount of time that the job runs as well.

Now, you can create black video using the same lavfi virtual device, but I've found the following method just as reliable. First I generate a black frame with ImageMagick:

{{< codeblock lang="bash" >}}
convert -size 1920x1080 xc:#000000 black-frame.png
{{< /codeblock >}}

Then, knowing my target frame rate of 29.970 fps, I generate out my master-in-out.mov:

{{< codeblock lang="bash" >}}
ffmpeg -r 30000/1001 -loop 10 -i black-frame.png -i silence10sec.ac3 -codec:v prores_ks -t 10 -profile:v 3 -pix_fmt yuv422p10le -qscale:v 11 -codec:a pcm_s16le master-in-out.mov
{{< /codeblock >}}

Yes, you could just as easily use a single ffmpeg command that uses a map. I like to break them out. Your milage may vary.

## Putting them together with concat filter

ffmpeg has a great [concat filter](http://www.ffmpeg.org/faq.html#Concatenating-using-the-concat-filter). You can make it do some amazing things. With normal mpegs (grain of salt added) you can use a simple version on concat that would simply combine the files together without doing any really heavy re-encoding (I've tried...it's wonky). With ProRes, it's best to not leave things to chance. So we write up a terribly long but super awesome command to combine and map among out files:

{{< codeblock lang="bash" >}}
ffmpeg -i master-in-out.mov -i masterProRes.mov -i master-in-out.mov -filter_complex '[0:0] [0:1] [1:0] [1:1] [2:0] [2:1] concat=n=3:v=1:a=1 [v] [a]' -map '[v]' -map '[a]' -codec:v prores_ks -profile:v 3 -pix_fmt yuv422p10le -qscale:v 11 -codec:a pcm_s16le output.mov
{{< /codeblock >}}

Basically what we're doing is telling concat we have some data to map from out files (ala, that video and audio channels: [0:0] [0:1] [1:0] [1:1] [2:0] [2:1]), have 3 inputs (concat=n=3) and that we're outputting one stream each of video and audio (v=1:a=1 [v] [a]). The rest looks very similar to our first output command, generating the concat into ProRes HQ.

## Spawn and run

Depending on your bang-per-buck needs, you can fire up any number if instances on Amazon or Google to handle this workload. Use the -threads 0 option to let ffmpeg decide how many threads to spawn and then spin the results into that background by adding </dev/null >/dev/null 2>&1 & to the command.

Again, this varies on what kind of encoding job you're running; on fairly predictable material, I can spawn eight processing jobs on a 16 core box and expect about 100% utlization across the board (without great deal of waiting in the queue). On other's I can spin more (because ffmpeg determines only one core can handle the work for a particular item). Again depends.

## At the end of the day, ffmpeg rocks
Amazon's Elastic Transcoder won't do ProRes (Zencoder does do ProRes, but the pricing for what I was running was less to run this myself on a few instances). And ffmpeg gets the job done with little more than a script and a few commands.