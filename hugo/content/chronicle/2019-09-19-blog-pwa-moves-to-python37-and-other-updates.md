---
title: "blog-pwa Moves to GAE Python 3.7 Runtime and Other Updates"
description: "With Python 2.7 soon walking into the sunset, it was time to move my trusty blog-pwa app to the new App Engine runtime and fix a few issues along the way."
date: 2019-09-19T16:11:06-07:00
tags:
- Development
- Web
---

`blog-pwa` has been my trusty site-runner for quite a while at this point. We've seen the frontend transformed a few times, from Polymer 2 to Polymer 3 and finally today's build of LitElement. What doesn't get a lot of fanfare is the backend that powers it, Google App Engine.

I've been a huge fan of Python 2.7 on App Engine for a long time. Stability-wise GAE hasn't ever hiccuped, hasn't ever given me so much as a mild headache. That said, as we all know, Python 2.7 is coming to it's end of life this year and I've been a bit behind the ball in doing the 2-to-3 conversion. Alas, no more!

As of [PR #64](https://github.com/justinribeiro/blog-pwa/pull/64), I've converted the base libs and the project to use GAE's Python 3.7 runtime. This includes some additional rework to the old http2push lib, which I gutted and revised to handle a problem I noticed a few months ago: that preload'ed resources were being dup'ed at the fetch layer in Chrome and Firefox.

Note, this wasn't actually an issue with the browsers. Alas, I failed to revise the lib some time ago and forgot to add `crossorigin` to the header definition. This is now resolved, resulting in a faster load time experience.

{{< codeblock lang="python" >}}
# Justin says: This is specific to the content path json file; it is
# used by fetch() on the client, but we push the resource early so it
# doesn't have to wait. Said resource must use as=fetch and have the
# crossorigin set otherwise it'll dup in the browser
json_target = '%s%s' % (host, str(self.name))
preload_links.append(
    '<%s>; rel=preload; as=fetch; crossorigin=anonymous;' % json_target)

for url, v in urls.items():
    # Construct absolute URLs per spec.
    url = '%s%s' % (host, str(url))
    t = str(v.get('type', ''))
    if len(t):
        # if you don't crossorigin these, they will not work
        preload_links.append(
            '<%s>; rel=preload; as=%s; crossorigin=anonymous;' % (url, t))
    else:
        preload_links.append('<%s>; rel=preload' % url)
{{< /codeblock >}}

Speaking of which, the `app.yaml` has been axed and chopped to meet the new definition for the Python 3.7 runtime. If you haven't looked at the change, it might come as a shock, but for the most part it is very similar and easier to handle.

Finally, I added a few revisions to some of the loading libs within `index.html`, notably that the web components polyfill loader no longer loads every time. Unless you're on something rather old at this point, it's just not needed in most cases, so now it checks before loading.

I suspect that I'll be making some additions as the year comes to a close to blog-pwa. I'd like to revise the rollup configuration (which is a little thin if I'm being honest) and add some additional features that I've had in my notebook for a while. In the mean time, happy times with a little Python 3.7 Google App Engine update.
