---
title: "Using Lighthouse, Puppeteer, and Jest for Web Performance Testing"
description: "Web performance testing is a must, so let's make some CLI magic with jest, lighthouse, and puppeteer."
imagetwitter: "https://storage.googleapis.com/jdr-public-imgs/blog/20190412-lighthouse-jest-testing-cli.jpg"
imagefb: "https://storage.googleapis.com/jdr-public-imgs/blog/20190412-lighthouse-jest-testing-cli.jpg"
imagegplus: "https://storage.googleapis.com/jdr-public-imgs/blog/20190412-lighthouse-jest-testing-cli.jpg"
date: 2019-04-12T11:22:35-07:00
tags:
- Web
---

Over the last several months, I've had a number of opportunities to help improve web performance testing for some companies. A lot of that work has been to integrate [lighthouse](https://github.com/GoogleChrome/lighthouse) with [jest](https://jestjs.io/), which I find has grown in popularity as folks move to more modern tools in their respective teams.

This isn't the first time I've gone down this road with integrating lighthouse. My [previous example with mocha](https://github.com/justinribeiro/lighthouse-mocha-example) remains quite popular as a start point (though could use it's own update). But I did want to do something a little different inregards to throttling, so I decided to use [puppeteer](https://github.com/GoogleChrome/puppeteer) to handle the network conditions and [WebPageTest connections profile examples](https://github.com/WPO-Foundation/webpagetest/blob/master/www/settings/connectivity.ini.sample) as the baseline.

The end result: [lighthouse-jest-example](https://github.com/justinribeiro/lighthouse-jest-example), a basic project that shows off how to use these tools together to test your web app. The sample under the hood does a few things:

1. It'll start a local web server with HTTPS (which you can add to your cert chain via `certutil`) to run your site against. Or, you can just turn that off and test against a remote endpoint should you so please.
2. You can define urls per test, as opposed to a single entry point if you want to test variations of an approach.
3. You can further define mutliple connection types if you'd like.

This in turn looks not unlike any other jest testing you may run as in the screenshot below:

<img src="https://storage.googleapis.com/jdr-public-imgs/blog/20190412-lighthouse-jest-testing-cli.jpg" alt="testing with lighthouse in jest">

The [repo](https://github.com/justinribeiro/lighthouse-jest-example) has all the details. Have questions or fix? File a ticket and pull requests always welcome.
