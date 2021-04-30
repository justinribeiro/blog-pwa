---
title: "Upgrading My Web Components to Lit 2.0"
description: "blog-pwa, code-block, stl-part-viewer, share-to-mastadon and probably some others have all gotten the bump."
date: 2021-04-29T17:23:27-07:00
featureimage: ''
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/"
tags:
 - web
---

With the nearly complete [Lit](https://lit.dev/) 2.0 release on the horizon, I've gone forth and bumped to the latest release candidate for a number of components I maintain:

1. [stl-part-viewer](https://github.com/justinribeiro/stl-part-viewer) was major bumped to 2.0
2. [code-block](https://github.com/justinribeiro/code-block) was major bumped to 1.0
3. [share-to-mastodon](https://github.com/justinribeiro/share-to-mastodon) was bumped to 1.0

Besides those components, I also bumped [blog-pwa](https://github.com/justinribeiro/blog-pwa) to latest version. With a bit of a quick refactor and basically zero changes to the build setup, I see about a 12% decrease in wire size (the entire setup including the lazy paths sits about 15KB, down from 18KB in recent builds).

If you're looking to upgrade your web components to the latest version of LitElement and Lit, do check the [upgrade guide](https://lit.dev/docs/releases/upgrade/). The only other thing I'd point out that if you're using storybook you'll run into a bit of trouble with the TemplateResult change in 2.0, but there is a [draft PR in progress](https://github.com/storybookjs/storybook/pull/14600) in the storybook repo to resolve that.

Sans that...my your retrofit adventure be smooth and web performant!