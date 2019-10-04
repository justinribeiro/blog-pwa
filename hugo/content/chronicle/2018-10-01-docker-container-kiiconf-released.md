---
date: 2018-10-01T08:00:00-08:00
title: "Kiiconf web configurator docker container released"
description: "I dig the web config for my Whitefox keyboard, but I really want it contained locally. Docker to the rescue!"
imagetwitter: "https://storage.googleapis.com/jdr-public-imgs/blog/20181001-kiiconf-whitefox-twitter-1024x535.jpg"
imagefb: "https://storage.googleapis.com/jdr-public-imgs/blog/20181001-kiiconf-whitefox-fb-1200x630.jpg"
imagegplus: "https://storage.googleapis.com/jdr-public-imgs/blog/20181001-kiiconf-whitefox-gplus-800x360.jpg"
tags:
- IoT
---

I did not need another mechnical keyboard. That's what I kept telling myself while clicking the complete order button on Kono's website. The [Whitefox](https://kono.store/products/whitefox-mechanical-keyboard), with it's open source design and firmware, was just too much for my curious heart to take. _Think of the configurations, Justin...think of the bug fixes._

Before long, the keyboard was on my desk, configured with my custom layout and binds. It was such a smooth experience, not a single hiccup, that I honestly thought I had been dreaming.

<img src="https://storage.googleapis.com/jdr-public-imgs/blog/20181001-kiiconf-whitefox-gplus-800x360.jpg" alt="My WhiteFox keyboard sitting on my desk in all it's foxness.">

As with all dreams, I longed for more control. The web configurator and firmware generation was cool, but I wanted to run it in my own little sandbox, in it's own little world. I set out to understand the underpinnings and see about building a docker container.

## Roads paved with good but lacking documentation

The first stumbling block I ran into was that the documentation for actually getting the web configurator and the firmware generation up and running was at best written, but lacking. The docs are largely out of date across the required repos, leading to a little more digging that might normally be required for this sort of container. Nonetheless, I like a challenge.

Issue number one was determining exactly what the web configurator required. The docs in the repo made some sense, but from digging into the partial dev docker image in that repo and the build commands, I could see I was going to have a few issues. I [forked kiiconf](https://github.com/justinribeiro/KiiConf), made some changes to the lighttpd config to handle the `dist` output and we had some UI.

Issue number two was sorting out the firmware build. The [deps were fairly clear](https://github.com/kiibohd/controller) in what to install via apt, but firing it up I noticed a few things missing. For one, it required Python's `pipenv` (which was failing in the container on spin up). Second, it needs some pythons deps to run the build scripts (which it wasn't going to get within the `pipenv` since that was going to have to go).

The problem was how to go about it. I could hard fork a lot of the submodules that kiiconf needed, re-write some scripts, and sort of end up with a version all my own, but this didn't feel like the way to go. I wanted configuration, I wanted to run my own firmware builds, but I wasn't going to have the full time to devote to it. So, I turned to my old friend `sed` and decided to do some chop and replace.

## When life gives you script errors, sed to the rescue

`sed` is one of those tools I don't know by heart. It has deep usefulness and the manual leads to receipes for many occasions. In this case, it was all about the checks we didn't want and the paths we really needed.

The first chop was to remove the `pipenv` checks within controller build's `cmake.bash`. This would allow the script to no longer fail when attempting to setup the build. No need to replace, just a straight up chop:

{{< codeblock lang="sh" >}}
sed -i.bak -e '34,44d' /KiiConf/controller/Keyboards/cmake.bash
{{< /codeblock >}}

Having resolved that issue, the firmware now half built. Turns out some of the paths were bad specific to the `kll` build script cases for kiiconf. Not a problem, `sed` replacement to the rescue again.

{{< codeblock lang="sh" >}}
sed -i.bak '163s|^.*$|set ( DefaultMap_Args ${DefaultMap_Args} ${PROJECT_BINARY_DIR}/${MAP}.kll )|' /KiiConf/controller/Lib/CMake/kll.cmake \
sed -i.bak '192s|^.*$|set ( PartialMap_Args ${PartialMap_Args} ${PROJECT_BINARY_DIR}/${MAP_PART}.kll )|' /KiiConf/controller/Lib/CMake/kll.cmake
{{< /codeblock >}}

If you ask me "Justin, are these good fixes", my answer is that they work but aren't good fixes. My obvious inclination is to learn _if_ these issues are upstream bugs and should be fixed. (_Note, the above [path problem was just fixed upstream](https://github.com/kiibohd/controller/commit/5dd72c2b5b36cd9c33e9d1061ece96a0b0c770ea), yipee!_) That's where I'll head next but in the mean time, sometimes you just want something that works.

## It's alive!
Low and behold, patched build script lines and some creative installing later, our [kiiconf docker image](https://github.com/justinribeiro/dockerfiles/blob/master/kiiconf/Dockerfile) is up and running, complete with firmware builds and output. For the daring among you, you can grab the docker image from the repo and fire it up as such:

{{< codeblock lang="sh" >}}
$ git clone git@github.com:justinribeiro/dockerfiles.git
$ cd dockerfiles/kiiconf
$ docker build -t justinribeiro/kiiconf .
$ docker run -it -p 9999:80 justinribeiro/kiiconf
# open http://localhost:9999
{{< /codeblock >}}

