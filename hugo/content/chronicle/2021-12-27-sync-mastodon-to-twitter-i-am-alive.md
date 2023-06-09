---
title: "Syndication from Mastodon to Twitter, a Holiday of Good Will"
descripti-on: "I may not be originating content on Twitter but in the spirit of the holidays I spin up a little syndication and sync to meet old friends where they are."
date: 2021-12-27T10:44:42-08:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211227-sync-example-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211227-sync-example-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211227-sync-example-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211227-sync-example-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211227-sync-example-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20211227-sync-example-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211227-sync-example-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211227-sync-example-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211227-sync-example-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20211227-sync-example-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20211227-sync-example-800.png" alt="An example of my syndication sync feeding from my Mastodon instance to Twitter.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">An example of my syndication sync feeding from my Mastodon instance to Twitter.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20211227-sync-example-800.png"
tags:
 - web
 - business
 - personal
 - syndication
---

The holidays are the time of year that no matter how much I have abandoned social media over the last few years the sites and posts find there way to me in one way or another. Dad, look at this post. Husband, didn't you do come up with this project like two years ago? Buddy, Pal, Compadre, look at my family holiday post where we are doing a crazy dance that's popular that you have no idea exists.

One may think that the curmudgeon I am would discount and despise such interactions but it's actually the contrary. I _love_ the freakin' holidays and I will happily revel in that holiday cheer no matter where it is. I will look at your phone, I read your emails, I even will click and follow—hold for effect—your social links. If you send me a physical card, typed or written or scrawled with crayons and smelling of holiday booze, I will store that card in full view for a month if not two and then place it lovingly in my cards collection forever.

Which brings me to the "Justin, what's with the Twitter posts?" segment of this post. Yes those indeed are tweets. No, I am not actually on twitter using the app or reading the feed, but my content is being synced and syndicated from my own Mastodon instance at [ribeiro.social](https://ribeiro.social).

This syndication move is an olive branch to friends who can't leave Twitter which I should have done at the start years ago. My Mastodon posts are not like my previous Twitter existence from pre-2019 which frankly I found absolutely dull to write, a washed out version of myself that didn't bring joy. The posts that are being syndicated now are much closer to me just being me, which is how I use Mastodon given I control and archive it. It's like a feisty little journal with no marketing twist.

Inevitably this will lead to problems from people I can only hope will un-follow and stop sending me angry emails as if I owe them something. The absurdity is not lost on me but clearly lost on them.

So I'm going to have some fun, syndicate some randomness that doesn't conform. How does one syndicate from Mastodon to Twitter you say? Easier said then done, but the lift is not too terrible with the right tool.

## Behind the Scenes

There are a lot of tools out there that do syndication in some form to various social media, both commercial off the shelf and your open source stuff. When it comes to Mastodon however I find mastodon integrations lacking. It's the same reason I wrote my [share-to-mastodon](https://github.com/justinribeiro/share-to-mastodon) web component to fill that gap.

Having recently written a photo roll through a cloud function to talk to Mastodon (which I haven't written about but it's in the [blog-pwa repo](https://github.com/justinribeiro/blog-pwa/blob/main/functions/get-mastodon-photographs/index.js)), I had a passing idea of how I would do this but the edge cases on social media posts are a pain. Boosts and retweets and all kinds of randomness...just sync damnit.

I settled on forking [twoot.py](https://github.com/wtsnjp/twoot.py) into something really really specific to my setup I call [ribeiro-social-sync.py](https://github.com/justinribeiro/ribeiro-social-sync.py).

The reason I forked it was three fold:

1. I wanted a stripped down version that only would ever do Mastodon to Twitter.
2. I did not want to have to disable two-factor auth for my Mastodon account, so I needed it to work with a developer access_token setup.
3. I wanted the tool to add the permalink to the mastodon post, as it's the original source of truth

Basically I stripped the tool down to just the parts I needed, I changed some auth, and then I set it forth with a crontab job. That's it. Chances are you probably don't need those things at which point start with twoot.py instead of my fork.

The setup isn't terrible but there are steps. I had to setup an [elevated project](https://developer.twitter.com/en/docs/projects/overview) in Twitter's Developer portal to be able to make the tweets and I had to generate an app in mastodon with read-only (the url is in Development > New Application in your Mastodon instance). With both sets of keys from each service, that'll give you enough access to make the syndication work. Beyond that, oddly enough, it just sort of works. Shocking really.

I suspect there are edge cases I just haven't hit though I'm not concerned. I added some ellipse math to the text strings just to try to keep it from choking on the tweet side—Mastodon toots can be longer than 280—but it's at best a ship-it-now sort of patch. I suspect Twitter will also choke on some of the double links in the preview, but I'm not going to worry about it. The content is there and that's all that matters.

I'm hopeful that this tiny syndication solution will stick for a while. Others have asked I hop on some other services but I don't think I can syndicate quite as well given both lacking APIs and policies, but we'll see.

In the meantime, syndication! Holidays! Friends! Happy Times! 🥂