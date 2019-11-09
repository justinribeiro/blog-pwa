---
title: "Web Performance Audits with Lighthouse for Github Actions Released"
description: "Sometimes you just want those Lighthouse web performance numbers to pop onto a pull request. With my latest Github Action, that is now a simple workflow step away."
date: 2019-11-02T16:37:27-07:00
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
<picture>
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-640.webp 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-800.webp 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-1024.webp 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-1280.webp 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-1600.webp 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-640.png 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-800.png 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-1024.png 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-1280.png 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-1600.png 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/png">
  <img src="https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-800.png" alt="Lighthouse audit results right on your pull request!">
</picture>
<figcaption itemprop="caption description">
<span aria-hidden="true">A screenshot of a pull request comment from my latest Lighthouse tool,  Web Performance Audits with Lighthouse for Github Actions.</span>
<span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
</figcaption>
</figure>'
tags:
- Web
imagetwitter: "https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-800.png"
imagefb: "https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-800.png"
imagegplus: "https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-800.png"
---

I'm just going to say it: I can pretty much integrate [Lighthouse](https://github.com/GoogleChrome/lighthouse) anywhere. I've put in [tests](https://github.com/justinribeiro/lighthouse-jest-example), I've written it into [Visual Studio code tasks](https://justinribeiro.com/chronicle/2018/06/26/running-lighthouse-audits-in-vs-code-via-tasks/), I've wired it into [docker](https://hub.docker.com/r/justinribeiro/lighthouse/), I made it dance at [Chrome Dev Summit on giant screens as a game](https://stickmanventures.com/blog/2016/11/21/demonstrating-web-performance-at-chrome-dev-summit-2016/), I've even made a [few commits here and there](https://github.com/GoogleChrome/lighthouse/pulls?q=is%3Apr+author%3Ajustinribeiro+is%3Aclosed).

Which is to say, I _really_ like lighthouse. It's a useful tool that I wish more developers would use. It's one reason I keep writing integrations and examples, hoping that more buy-in for web performance is always just around the next corner.

In today's case, I'm releasing [Web Performance Audits with Lighthouse](https://github.com/marketplace/actions/web-performance-audits-with-lighthouse), a new Github Action that has a number of nifty features that I hope folks will enjoy.

The biggest feature takes a page from the [lighthousebot style for Travis](https://github.com/GoogleChromeLabs/lighthousebot) and injects a comment with the audit results right onto your pull request:

<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
<picture>
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-640.webp 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-800.webp 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-1024.webp 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-1280.webp 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-1600.webp 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
  <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-640.png 640w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-800.png 800w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-1024.png 1024w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-1280.png 1280w,
                  https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-1600.png 1600w"
          sizes="(min-width: 800px) 800px, 100vw" type="image/png">
  <img src="https://storage.googleapis.com/jdr-public-imgs/blog/20191102-github-action-lh-800.png" alt="Lighthouse audit results right on your pull request!">
</picture>
<figcaption itemprop="caption description">
<span aria-hidden="true">A screenshot of a pull request comment from my latest Lighthouse tool,  Web Performance Audits with Lighthouse for Github Actions.</span>
<span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
</figcaption>
</figure>

If you're looking at the screenshot and wondering "wait, budget.json fails?", you'd be correct. You can use your existing [budget.json for Lighthouse](https://developers.google.com/web/tools/lighthouse/audits/budgets) (which you're already using on the CLI right?) right into your configuration:

{{< codeblock lang="yaml" >}}
name: Audit Web Performance
on: [pull_request]
jobs:
  perf:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Generate Lighthouse Report
        uses: justinribeiro/lighthouse-action@v1.0.1
        with:
        with:
          secret: ${{ secrets.GITHUB_TOKEN }}
          url: https://justinribeiro.com/
          wptConnectionSpeed: threegfast
          lighthouseBudget: .github/test/budget.json
      - name: Saving Lighthouse Audit Artifacts
        uses: actions/upload-artifact@master
        with:
          name: lighthouse-artifacts
          path: './results'
{{< /codeblock >}}

The full feature list includes:

- Uses [Puppeteer](https://github.com/GoogleChrome/puppeteer) to start up Chrome with [network emulation settings defined by WebPageTest](https://github.com/WPO-Foundation/webpagetest/blob/master/www/settings/connectivity.ini.sample). This is similar connection setup to my existing [lighthouse-jest-example](https://github.com/justinribeiro/lighthouse-jest-example).
- Supports saving of artifacts to the Github Action run.
- Supports custom Lighthouse configuration via JavaScript file.
- Supports Lighthouse budget.json for failing PRs.
- Posts results of audit run as a comment on your PR.

If you want to see an example of this action in an actual Github workflow, you can see it in use in my [blog-pwa repo](https://github.com/justinribeiro/blog-pwa/blob/master/.github/workflows/main.yml) where I'm using it to test site changes on deployments of PRs to Google App Engine.

You can get started using the action today via the [marketplace](https://github.com/marketplace/actions/web-performance-audits-with-lighthouse). The [repo is also available](https://github.com/justinribeiro/lighthouse-action) and happy to accept feature requests and pulls, so let me know what you're thinking. I've written this as simply and straight forward as I could think of, so if you're looking to understand a little how it all works, this example is a great way to dive in.

If you happen to be at [Chrome Dev Summit](https://developer.chrome.com/devsummit/) this month, find me and we'll chat about all things Lighthouse, all things web performance.

Now get out there and start testing even more of your deployments and let's make the web fast!
