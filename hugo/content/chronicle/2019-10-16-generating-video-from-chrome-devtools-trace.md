---
title: "Generating Video From a Chrome Devtools Trace With devtools-to-video"
description: "Sometimes stakeholders need to quickly see their web performance. Luckily, we can turn those Chrome DevTools trace screenshots into a video with my latest command line tool."
date: 2019-10-16T07:55:51-07:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
<picture>
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-640.webp 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-800.webp 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-1024.webp 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-1280.webp 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-1600.webp 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-640.png 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-800.png 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-1024.png 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-1280.png 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-1600.png 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/png">
  <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-800.png" alt="devtools-to-video cli in action">
<figcaption itemprop="caption description">
<span aria-hidden="true">The command line tool makes generating video from your trace easy and quick.</span>
<span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
</figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-800.png"
tags:
- Web
---

When it comes to diagnosing web performance problems, you do a lot of living in DevTools. Between the Performance Tab and the all powerful chrome://tracing, these are the sorts of things I work with on a daily basis.

The problem with living in this paradise of useful information is that the information has a tendency to only make sense to a few folks. When you talk to upper management, traces tell a story that visually can be hard to decipher in bit sized meetings.

Pictures of traces speak a thousand words. Video of what a user is experiencing get resources assigned to fix web performance problems.

In a perfect world, I'd have WebPageTest just rolling runs at my behest with video output, but in a lot of on many projects WebPageTest isn't running internally and testing externally is a non-starter. We need a method to generate some video with some feeling. Enter [devtools-to-video](https://github.com/justinribeiro/devtools-to-video).

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
<picture>
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-640.webp 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-800.webp 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-1024.webp 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-1280.webp 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-1600.webp 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-640.png 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-800.png 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-1024.png 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-1280.png 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-1600.png 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/png">
  <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20191016-devtools-to-video-800.png" alt="devtools-to-video cli in action">
<figcaption itemprop="caption description">
<span aria-hidden="true">The command line tool makes generating video from your trace easy and quick.</span>
<span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
</figcaption>
</figure>

devtool-to-video is a little cli tool written in node that utilizes ffmpeg to generate a video from a Chrome DevTools trace and put a timer on the bottom that shows the time progression. An [example of the video output](https://www.youtube.com/watch?v=guJLfqTFfIw):

{{< liteyoutube videoid="guJLfqTFfIw" >}}

This is similar in concept to WebPageTest though their output video timer is way cooler. This simply utilizes the presentation time (pts) within the ffmpeg to give us a quick means to create the video without a lot overhead via drawtext.

Using devtool-to-video is pretty simple. Install the cli tool via npm or yarn:

{{< codeblock lang="bash" >}}
npm i @justinribeiro/devtools-to-video
# or
yarn global add @justinribeiro/devtools-to-video
{{< /codeblock >}}

Once installed, we have a few command line options to deal with:

{{< codeblock lang="bash" >}}
➜ devtools-to-video -h


  DEVTOOLS-TO-VIDEO
  Output a video file from screenshot frames within a Chrome DevTools JSON trace file.
  Usage: `devtools-to-video [options ...]`


Global Options

  -i, --input string    File path to Chrome DevTools trace JSON file.
  -o, --output string   Output file name for video file.
  -c, --hideClock       If set, hides the time scale clock on the output video file.
  -l, --label string    If set, adds the label above the time scale clock in the output video file.
  -f, --frames number   Sets the frames per second of the output video.
  -h, --help            Print out helpful usage information for this program.
  -v, --version         Print out current program version number.

Version

  0.2.1
{{< /codeblock >}}

In practice, we generate our trace with screenshots enabled from the performance tab in DevTools, export and download that file, and then run it through our tool:

{{< codeblock lang="bash" >}}
➜ devtools-to-video -i profile.json -o sample.mp4 -l '3G Slow @ Moto G4'
 STARTING UP  Checking environment and setting up params.
 CONVERT  Spawning FFMPEG worker with open pipe.
 CONVERT  Begin piping screenshots from DevTools trace to FFMPEG.
 SCREENSHOTS  Processed 21 screenshots into video file.
 CONVERT  DevTools trace successfully converted to MP4.
 LABEL PASS  Adding label and time scale to MP4.
 LABEL PASS  Finished adding label and time scale to MP4.
 COMPLETE  DevTools trace to video is now complete! Your file sample.mp4 is ready
{{< /codeblock >}}

Take file, show stakeholders, make case that you need better web performance.

Generating a video from a trace is also not a new concept; I used a much more convoluted approach a year or so ago that was just unreliable. Then I saw Kris Selden's [trace-to-mp4.js gist](https://gist.github.com/krisselden/bf98fb0c192fcb73ed32e79c0a7972d2), and my faith in ffmpeg was restored. From there it was just a matter of double passing the video with a filter within ffmpeg (which is it's own can of worms, but I love ya ffmpeg).

So go out there and trace your sites and apps, and keep making the web faster.
