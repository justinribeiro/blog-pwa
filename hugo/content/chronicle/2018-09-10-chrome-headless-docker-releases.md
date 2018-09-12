+++
date = "2018-09-10T08:00:00-08:00"
title = "Added release tags for chrome-headless docker container"
description = "chrome-headless use continues to rise, so lets get some updates into this container."
+++

With over 314K worth of pull from DockerHub and after many requests, I finally got around to creating seperate tags for [chrome-headless](https://hub.docker.com/r/justinribeiro/chrome-headless/) that target each of the channels for Chrome (stable, beta, and dev for linux).

On top of the addition of new release tags, I've also made some minor improvements to the docker image:

1. Added additional font support to allow symbols to properly render in Chrome
2. Cleaned up some up some of the GPU cache issues
3. Updated to debian:stretch-slim

The image size is hovering around ~280MB at this point and while I do have a slimmer version in mind, I'm not quite ready to merge that until I've had some time further testing with it. In the mean time, enjoy new updates and keep using Chrome --headless!