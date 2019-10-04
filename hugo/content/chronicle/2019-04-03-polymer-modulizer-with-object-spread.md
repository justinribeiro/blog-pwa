---
date: 2019-04-03T08:00:00-08:00
title: "Working around polymer modulizer errors with object rest spread properties"
description: "Turns out converting from Polymer 2 to Polymer 3 or lit-element when you use object rest spread properties is harder than it should be. How to work around the problem."
tags:
- Web
- Polymer
---

With Firefox 67 landing in mid-May with dynamic import() support, now is as good of time as any to start thinking about moving those PRPL'ed Polymer 2 components into Polymer 3 (and eventually, lit-element).

On the surface, this is not a problem for most Polymer web components or web apps. The Polymer team has for a while had [modulizer](https://github.com/Polymer/tools/tree/master/packages/modulizer), which does most of the work for you. It's been a useful tool I've used with success in many instances, but it has one particular carevat: it doesn't support object rest spread.

I know what you're thinking. "Justin that's in the ES2018, you'd have to babel that component anyhow, so you shouldn't be using it." Indeed, for Edge (which is the only thing this set of components cares about that doesn't support it), you indeed have to babel it. Which I do in a custom build tool I built for this set of components (which is build on polymer-build and babel). Support for this Stage Four proposal though is pretty solid and it's a great little language feature.

Which leads us to the larger question, why doesn't modulizer support object rest spread props? Looking at the error on the CLI, we can see that the current version of [Esprima](https://github.com/jquery/esprima) (4.0.1 at the time of this post) doesn't support object rest spread properties. Digging through their sourcecode though, turns out the master branch does support it. Armed with this knowledge we can work around the problem by building a custom version of modulizer for our use case.

First step, let's clone both the [Polymer/tools](https://github.com/Polymer/tools) monorepo and the [Esprima](https://github.com/jquery/esprima) repo:

{{< codeblock lang="bash" >}}
$ git clone git@github.com:Polymer/tools.git
$ git clone git@github.com:jquery/esprima.git
{{< /codeblock >}}

With our repos cloned, let's start by building esprima:
{{< codeblock lang="bash" >}}
$ cd esprima
$ yarn install
$ yarn compile
{{< /codeblock >}}

At this point, you'll have a new build in the `dist` folder.

With our build complete, let's tell modulizer to use this. We're going to update modulizer's `package.json` to point to the local folder:

{{< codeblock lang="bash" >}}
$ cd tools/packages/modulizer
$ vim package.json
# replace dep line
# "esprima": "file:../../../esprima",
{{< /codeblock >}}

With that edit completed, we can install our deps, build, and link modulizer into our path:

{{< codeblock lang="bash" >}}
$ yarn install
$ yarn link
# modulizer now in path
{{< /codeblock >}}

Let's convert our web component.

{{< codeblock lang="bash" >}}
$ modulizer --import-style name --out .
{{< /codeblock >}}

And...we hit another object spread error. What gives? Turns out that we have another dependency, recast, that uses a different version of esprima. To quickly resolve this, we're just going to replace the recast version with our new built version:

{{< codeblock lang="bash" >}}
$ cp esprima/dist/esprima.js tools/packages/modulizer/node_modules/recast/node_modules/esprima/dist
{{< /codeblock >}}

Running our modulizer again, we see our conversion completes without issue! Now you can begin removing your old `importHrefs` and continuing your quest to update to Polymer 3.