---
title: "Google Scholar Citation Count for Zotero adds support for Zotero 8"
description: "Why buy when I can spend 30 minutes putting some scrap steel to good use."
date: 2026-01-29T13:00:00-07:00
tags:
 - zotero
 - oss
 - release
---

With [Zotero 8](https://www.zotero.org/blog/zotero-8/) now officially out, I've gotten quite a few requests to update [Google Scholar Citation Count for Zotero](https://github.com/justinribeiro/zotero-google-scholar-citation-count) with support. From what I can tell from the forums a lot of plugins haven't quite made the leap given the [changes](https://www.zotero.org/support/dev/zotero_8_for_developers) available for developers. At a glance, this did not give me a great deal of hope and was the leading reason I've been dragging my feet on it. That said, I did finally sit down today to actually do the work and it wasn't as terrible as I had expected.

This was to some extent because of the refactor I had done sometime ago that cleaned out a lot of cruft. That, and my plugin isn't all that complex. If you're a developer who does have a complex setup, one might look at the [migration helper scripts](https://github.com/zotero/zotero/tree/main/scripts/migrate-fx140).

Regardless, version [5.0.0](https://github.com/justinribeiro/zotero-google-scholar-citation-count/releases/tag/v5.0.0) of my plugin adds the proper support for Zotero 8. It adds not additional features or changes. Download the XPI, install, and you should be off an running!

Now time to actually start thinking but adding a few new features. 😊