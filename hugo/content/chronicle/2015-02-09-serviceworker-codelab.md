---
date: 2015-02-09T00:00:00Z
description: A beginning codelab for building offline web apps with Service Worker.
title: Getting started with Service Worker
url: /chronicle/2015/02/09/serviceworker-codelab/
tags:
- Web
---

The offline web is near and dear to my heart. Most people say it's not possible at scale, but I'd beg to differ. There are a significant amount of approaches I've used over the years, from index shells to the File and FileSystem API's, but all these approaches left much to be desired.

Enter [ServiceWorker](https://github.com/slightlyoff/ServiceWorker), a new API that just landed in Chrome 40. If you haven't heard, Service Worker is near on the best thing since sliced offline bread and it makes for an approach to make the offline web a larger reality. Right now, Chrome has the goods (as does Opera's use of Blink), but Firefox has it in nightly builds and the Internet Explorer folks have it under consideration.

Sure, we don't have the whole load of bread yet (periodic background sync and push notifications have not landed), but the initial implementation is powerful enough to start creating web applications that utilize it. Think of it as progessive offline enhancement.

To that end, I wrote up a codelab that we ran this week at GDG Oakdale with 25 people that builds a basic offline Github issue list using ServiceWorker, fetch() and the Github v3 API. The feedback was great and after some slight updates, it's now fully up for general public use:

* [Instructions and steps](https://justinribeiro.github.io/service-worker-codelab-gdg-oakdale/)
* [Source Code](https://github.com/justinribeiro/service-worker-codelab-gdg-oakdale)

Of course those instructions use ServiceWorker! What if you're on a train in a tunnel working on the codelab? I know how it is.

Many thanks to James Duvall and Walter Kuppens who helped me test and clean up my often poor use of the English language before the event.

HUGE THANK YOU to Jake Archibald and Alex Russell, who have worked tirelessly on Service Worker over the last couple years. The future looks bright for Service Worker and it's going to make the web better, and that would not have happened without them.