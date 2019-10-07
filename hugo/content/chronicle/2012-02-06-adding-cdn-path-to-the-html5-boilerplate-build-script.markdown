---
tags:
- webdev
date: 2012-02-06T00:00:00Z
description: "A simply update that will add CDN paths to your H5BP build."
title: "Adding CDN path to the HTML5 Boilerplate build script"
url: /chronicle/2012/02/06/adding-cdn-path-to-the-html5-boilerplate-build-script/
---

I've become a fan of using HTML5 Boilerplate in many of the recent projects I've been working on. Sometimes it's a standalone H5BP project, other times I'll integrate it within whatever framework I'm using. In either case I make changes to the build system as needed to fit my particular needs.

If you've never dealt with build systems or scripts, the Ant script that H5BP uses can look daunting. I assure you that it is not. As a simple example, I'm going to show you one of the more basic updates that I often make to the script: adding CDN path information.

The build script does a wonderful job, but I don't want to have to search and replace 27 pages just to add my CloudFront URL to the beginning of link, script or image tags.  So let's make a couple additions and changes.

## Add a CDN.root var in default.properties
First thing we do is add a simple var, which I call CDN.root to the default.properties file. This can simply point to whatever the root path of your CDN location is (ala http://something.cloudfront.net/).  In the block below, I simply add the var under the directory paths.

{{< codeblock lang="java" >}}
dir.js.libs         = ${dir.js}/libs
dir.js.mylibs       = ${dir.js}/mylibs
dir.css             = css
dir.images          = img
cdn.root      = http://blahblablablh.cloudfront.net/
{{< /codeblock >}}

## Let's make some changes to the build.xml
After you have the path setup, you can now use this variable to update the replacereexp matches that do the writing to the final build files.  These changes take place in the HTML rewrite section (line 572 in the Boilerplate 2.0 build.xml). In the block below, you can see that I've updated the replace properties to now append the ${cdn.root} var to those regex writes.

In addition to the existing rewrites, I've added two additional replaceregexp calls, one for the images that may be in the HTML itself, and one for additional JavaScript.

{{< codeblock lang="html" >}}
&lt;echo message=&quot;Update the HTML to reference our concatenated script file: ${cdn.root}${scripts.js}&quot;/&gt;
&lt;!-- style.css replacement handled as a replacetoken above --&gt;
&lt;replaceregexp match=&quot;&amp;lt;!-- scripts concatenated [\d\w\s\W]*?!-- end ((scripts)|(concatenated and minified scripts))--&amp;gt;&quot; replace=&quot;&amp;lt;script defer src=&#039;${cdn.root}${scripts.js}\&#039;&amp;gt;&amp;lt;/script&amp;gt;&quot; flags=&quot;m&quot;&gt;
    &lt;fileset dir=&quot;${dir.intermediate}&quot; includes=&quot;${page-files}&quot;/&gt;
&lt;/replaceregexp&gt;
&lt;!--[! use comments like this one to avoid having them get minified --&gt;

&lt;echo message=&quot;Updating the HTML with the new css filename: ${cdn.root}${style.css}&quot;/&gt;
&lt;replaceregexp match=&quot;&amp;lt;!-- CSS concatenated [\d\w\s\W]*?!-- end CSS--&amp;gt;&quot; replace=&quot;&amp;lt;link rel=&#039;stylesheet&#039; href=&#039;${cdn.root}${style.css}&#039;&amp;gt;&quot; flags=&quot;m&quot;&gt;
    &lt;fileset dir=&quot;${dir.intermediate}&quot; includes=&quot;${page-files}&quot;/&gt;
&lt;/replaceregexp&gt;

&lt;echo message=&quot;Updating IMG tags in the HTML with path to CDN&quot;/&gt;
&lt;replaceregexp match=&quot;src=[&amp;quot;&#039;]/img&quot; replace=&quot;src=&amp;quot;${cdn.root}img&quot; flags=&quot;g&quot;&gt;
    &lt;fileset dir=&quot;${dir.intermediate}&quot; includes=&quot;${page-files}&quot;/&gt;
&lt;/replaceregexp&gt;

&lt;echo message=&quot;Updating JS tags in the HTML with path to CDN&quot;/&gt;
&lt;replaceregexp match=&quot;src=[&amp;quot;&#039;]/js&quot; replace=&quot;src=&amp;quot;${cdn.root}js&quot; flags=&quot;g&quot;&gt;
    &lt;fileset dir=&quot;${dir.intermediate}&quot; includes=&quot;${page-files}&quot;/&gt;
&lt;/replaceregexp&gt;
{{< /codeblock >}}

## Build!
Seriously, that's it.  Once you run a new build, your newfangled CDN path will be in your files. As I stated earlier, it's not too hard once you walk through it.

## Notes and tidbits
This is a pretty basic example, and there are things to note.

One, if you're working on a project by project basis where the CDN root changes, you probably want to make the cdn.root var in the project.properties file. You still should add a cdn.root to your default.properties file (it could be empty for instance) so if you don't use the path, it won't bust the build.

Second, I haven't tried this on the H5BP 3.0 build script, but it could be easily adapted I suspect.

Third, this script doesn't search inside CSS file to update paths (I use SASS for that sort of thing, so I don't often use the build script for that). Possibly I'll have to write a post about that some other time.
