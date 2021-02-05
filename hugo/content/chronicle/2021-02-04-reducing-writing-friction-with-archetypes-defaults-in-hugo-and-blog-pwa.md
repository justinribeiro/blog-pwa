---
title: "Reducing Writing Friction With Archetype Defaults in Hugo and Blog-Pwa"
description: "Everyone likes the polish of a finely produced post, but reducing the cognitive load to remember all that metadata and nuance became a necessity to my sanity."
date: 2021-02-04T05:00:13-08:00
tags:
 - web
 - personal
 - writing
---

I've been writing more lately. Some of that writing output is due to the backlog of things that sit on my desk, projects and thoughts that haven't transitioned from notes to bytes. The other part is more nuanced, the nature of being able to write within the platform I've built to deliver these posts, [blog-pwa](https://github.com/justinribeiro/blog-pwa).

It's not like the platform is preventing me from writing. The large bulk of that writing is a text file, a flashing 1980's green cursor on a black screen, and expanse of space to let the words flow with interruption. Really it's the minute of refinement that's prevented me from sitting down to write; the feature additions I've made over the last year to give things polish sometimes get in the way.

_Ah, I forgot a tag, thanks build for reminding me. Ah, I forgot the feature image, that won't look nice. Darn, I'm missing the lower caption of that image. Is that the right image? Where's my photo editor..._

But alas, some of that comes from a lack of the tools around the features I've added more than anything else. Namely, the [front matter](https://gohugo.io/content-management/front-matter/) that [hugo](https://gohugo.io/) provides and the fact I've made custom tweaks to work within the progressive web app the serves this very post.

Normally in a default `hugo new post/my-post.md`, you'd end up with a simple post structure:

{{< codeblock lang="yaml" >}}
---
title: "My Post"
date: 2021-02-04T08:00:00PST
draft: true
---
{{< /codeblock >}}

Said output provided a lot of foot-gun related opportunities for my great ability to misspell many a proper target as I added in the custom metadata I needed to get a crisp render.

Luckily, hugo has the notion of [archetypes](https://gohugo.io/content-management/archetypes/), which are templates for creating new forms of content. I settled on a common `default.md` within the `archetypes` folder (which you may have to create depending on your hugo setup) that would suffice for pretty much any given page on the site:

{{< codeblock lang="yaml" >}}
---
title: "{{ .Name | title | replaceRE "([0-9]*-[0-9]*-[0-9]*|-)" " " | strings.TrimLeft " " }}"
description: ""
date: {{ .Date }}
featureimage: ''
socialimage: "{{ $.Site.Params.imageCDN }}"
tags:
 - web
 - business
 - maker
 - photography
 - iot
 - personal
---
{{< /codeblock >}}

This block is more tailored to my file structure naming (all posts have the date in front) and offers me the common tag categories to reduce (so I don't mistype). Given a command of `hugo new content/chronicle/2021-02-04-hello-world.md` I now get a proper Chicago-style title (which the regex handles and the toml configuration defines) and all the metadata fixings that support some of the finer features of my little PWA:

{{< codeblock lang="yaml" >}}
---
title: "Hello World"
description: ""
date: 2021-02-04T06:52:49-08:00
featureimage: ''
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/"
tags:
 - web
 - business
 - maker
 - photography
 - iot
 - personal
---
{{< /codeblock >}}

If that seems like a simple revision that won't improve things, my productivity and less cognitive load would disagree. Rounding the sharp edge off of having to remember the details of minutiae really allows me to focus on the important and enjoyable: putting pen to paper and just building the content I want.