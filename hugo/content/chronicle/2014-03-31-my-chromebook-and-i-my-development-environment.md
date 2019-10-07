---
tags:
- chrome-os
- chromebook
- development
date: 2014-03-31T00:00:00Z
title: 'My Chromebook and I: building a development environment'
url: /chronicle/2014/03/31/my-chromebook-and-i-my-development-environment/
---

I've always bounced around from workstation to workstation; my development environment has been at whatever keyboard I'm sitting at any particular time.

When I first received a Samsung 5 series Chromebook at I/O 2011 I found it a curious thing. From a the-web-is-empowering-platform perspective, it was a wonderful device. From a use-me-to-develop, it made me scratch my head. It wasn't your typical device for that sort of thing.

The Chromebook itself shined; the battery on that 5-series was fantastic (still is going strong even in 2014), and I went for broke: I dumped my travel laptop and tried to understand the Chromebook. I used developer mode, SSH'ed into other remotes and developed that way. I tried ChrUbuntu when it offered support back in 2012. The setup worked, but trying to say "Hey this is totally a fantastic working environment" would have been a lie. It worked for me, but I made no qualms that my setup would work for others.

Outside my use case, over the time I had the 5-series it impressed. I started buying them for a wide range of people; my daughter Alli, my parents, as gifts. They just worked and people seemed to like them.

## Enter the Pixel + Crouton

The Pixel brought a level of performance and build quality that I found quite nice. The battery life not as great as the 5-series, but I was willing to trade in some battery for speed (I can pull about 4 hours with the Pixel).

Getting setup to develop has become a simplier tool path with [Crouton](https://github.com/dnschneid/crouton). For the average user I'm not going to say using crouton is easier, but if you have an understanding of chroots from you various Linux or BSD's, then crouton isn't much of a stretch.

Setting up crouton with a basic window manager is pretty straightforward. I usually keep the basic LTS backed XCFE4 chroot around to run Eclipse when needed (for the Pixel, you'll need to make some adjustments, such as adding touch support and dpi changes to X). But the chroot that really shines that I use pretty much daily is a what I call the clipower cli.

Just a command line? Really? Justin, it's 2014. Get it GUI. All the good tools it seems are on the command line. Well, at least the one's I'm using.

{{< codeblock lang="bash" >}}
chronos@localhost ~ $ sudo sh -e ~/Downloads/crouton -n clipower -t cli-extra -r saucy

{{< /codeblock >}}

A couple things on that command are a bit different. On the one hand, I'm using -n to name my chroot (clipower). Secondly, I'm adding the cli-extra which builds a more command line friendly environemnt. Finally, I'm using saucy and not precise as my base (which gives me a little easier access to some of the newer tooling without having to do the add target dance).

## Building my command line enviroment
The following is my setup; yours I'm sure will vary. This gets me up and running for most of my recent projects, though not all.

1. Install some tools we need

{{< codeblock lang="bash" >}}
$ sudo apt-get install zsh curl git python python-pip ruby ruby-dev nodejs npm
{{< /codeblock >}}

2. From bash to zsh

{{< codeblock lang="bash" >}}
$ chsh -s /bin/zsh
{{< /codeblock >}}

3. Setup oh-my-zsh

{{< codeblock lang="bash" >}}
$ curl -L https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh | sh
{{< /codeblock >}}

I usually run a few of the plugins, such as git, ssh-agent, pip, rsync, aws, extract, jsontools.

4. Setup git

{{< codeblock lang="bash" >}}
➜  ~ git config --global user.name "Justin Ribeiro"
➜  ~ git config --global user.email "me"
➜  ~ git config --global credential.helper 'cache --timeout=3600'
➜  ~ git config --global push.default simple
➜  ~ ssh-keygen -t rsa -C "me"
{{< /codeblock >}}

5. Install Google Cloud SDK

{{< codeblock lang="bash" >}}
➜  ~ curl https://dl.google.com/dl/cloudsdk/release/install_google_cloud_sdk.bash | bash
{{< /codeblock >}}

Note, the script when run will ask you if you want to let it install the directory into path; this didn't work for me in zsh, but the bash completion did. I manually went and added the install directory to my path in .zshrc and it worked fine afterward.

6. Setup you auth for Google Cloud SDK

{{< codeblock lang="bash" >}}
➜  ~ gcloud auth login
{{< /codeblock >}}

7. Install Amazon Web Services CLI

{{< codeblock lang="bash" >}}
➜  ~ sudo pip install awscli
{{< /codeblock >}}

Note, this won't install the autocomplete so you'll need to add that the .zshrc. Similarly, you can't auto-populate the creds file so I pull this from a private repo.

## An editor, oh an editor

That command line tool set pretty much gives me everything I need at the base level. But when it comes down to code editors I've wavered. I use different editors on my workstation (I'm not a one-editor-fits-all guy). On the one hand I could use vi, but I really haven't used vi since I worked on Solaris in the late 90's. Emacs has grown on me lately, namely because my friend and co-worker Jacob keeps showing me nifty emacs things.

But I was feeling frisky so I tried [Caret](https://chrome.google.com/webstore/detail/caret/fljalecfjciodhpcledpamjachpmelml?hl=en) and I quite like it. It's Sublime-like, works very well on Chrome OS, and overall has been a pretty good editor. Sure, it's not nearly as full featured as Sublime or emacs, but it gets the job done for the smaller stuff.

## Gotcha's and what nots

The one thing that I really haven't dove into is running Vagrant VM's. To my knowledge, this should work fine though you have to enable the proper modules and deal with enabling the VT-x (see [thread](https://github.com/dnschneid/crouton/issues/675)). I haven't worried as much about this, primarly because I can still SSH into machines and remote VM's to deal with this issue.

The other issue is key handling. You can run this in crosh tab in Chrome, but I find using [Crosh window](https://chrome.google.com/webstore/detail/crosh-window/nhbmpbdladcchdhkemlojfjdknjadhmh?hl=en-US) is a lot less of a hassel so that Chrome won't swallow key bindings.

## Working and evolving

Honestly, the setup is one of my new favorite development environments. It's a crazy cross of tooling, but it works very smoothly (I'm writing this very blog post in that setup). It's become my evening hacking platform. I suspect I'll add to it as time goes on (and I've only changed four times in the lat year). That's the beauty of constantly evolving development environments right? :-)