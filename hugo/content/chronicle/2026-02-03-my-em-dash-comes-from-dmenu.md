---
title: "How I Insert my Em-Dash and Other Special Characters with Rofi and i3 Hotkey"
description: "You will take my em dash from my cold dead writing fingers."
date: 2026-02-03T15:00:00-07:00
tags:
 - oss
 - writing
 - rofi
---

My use of the em dash has grown over the years. On the one hand my use was never gated by the curious and ill-fitted the stigma of the AI overuse of it—which is lampooned with expert precision in [McSweeny's Internet Tendency piece](https://www.mcsweeneys.net/articles/the-em-dash-responds-to-the-ai-allegations)—but rather school teachers when I was younger telling me to stop using the em dash. This was not the way to write they said.

I disagreed. I had read Melville and Faulkner, watched Steinbeck use it to replace commas with pop, and watched Dickinson use it as an art form all its own. Twain used it in a speaking manner—that aside you make with your mouth as pull the audience closer—and I loved it.

Stigma's however are hard to break. Some years past, I had written a book that was forced into a style by the editor that I did not care for and then I watched the book get axed without a proper copy ever hitting the shelves. It was not until I found myself really writing again in the depths of my research and in other papers and small missives that I drew closer to coming to terms with a fun fact: I get to write however the hell I want to.

This empowering fact leads to the now misidentified writer—my use of the em dash seems AI-like to many. The irony is that I do not use the AI to write and that the AI is the weighted gains of books and writings far and wide that use the em dash to great effect. The AI is, as we say, a [stochastic parrot](https://dl.acm.org/doi/pdf/10.1145/3442188.3445922) after all.

Regardless, people do ask how I insert them so quickly as I write. They see this in chats or in real time document editing and they often ask if I have it mapped to a hotkey, which I sort of do as the little looping video below shows.

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/VideoObject">
  <video autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/jdr-public-imgs/blog/20260203-emdash-rofi-bash-i3wm-h264.mp4" type="video/mp4">
  </video>
  <figcaption itemprop="caption description">
    <span>This is how I em dash fast—all through a tiny rofi menu in i3wm in Linux.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>

There are lots of ways to do this depending on your operating system; the way I do it on Linux within [i3wm](https://i3wm.org/) is with a [little bash script](https://github.com/justinribeiro/dotfiles/blob/linux-desktop/bin/special-chars.sh) tied to a [rofi](https://github.com/davatorium/rofi) menu tied to a [i3wm hotkey definition](https://github.com/justinribeiro/dotfiles/blob/linux-desktop/.i3/config#L53) that also allows me to quick search not just for my beloved em dash but for other characters that I use often. My slightly tweaked version comes from a 9-years-old script from [Martin B. Fraga](https://github.com/mbfraga/scripts/tree/master) that I happened to stumble upon in an old forum post and it works amazing.

I would trade this fast and friendly menu for nothing; it brings me such joy as I write. While debate might rage on about punctuation use and AI and what is right, I care little—scratch that, not at all—for the conversation. I just want to write, in my voice, as I see fit.

Expect more em dashes.
