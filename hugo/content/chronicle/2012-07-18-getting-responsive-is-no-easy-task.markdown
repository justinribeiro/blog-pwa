---
categories:
- build
date: 2012-07-18T00:00:00Z
title: "Getting responsive is no easy task"
url: /chronicle/2012/07/18/getting-responsive-is-no-easy-task/
---

If you've been to my site before, you'll have recently noticed a change. A new layout! Given that the last design went like in late 2006, it's been a wee bit too long between updates.

I took a "mobile first" approach this time around. If you've never seen or heard Luke Wroblewski talk about the approach, it's worth a look (or a <a href="http://www.lukew.com/resources/mobile_first.asp">read</a>). I also made the layout responsive; it'll size and shift based on the overall resolution of the target device or platform.

Responsive design is not easy. What you see here is just about as bare bones as it gets. There's nothing inherently fancy about it. At the increased age of 32, I simply wanted a blog that didn't have 10px fonts all over the place and worked on mobile devices with ease.

The overall technique was based on Jason Weavers' <a href="http://jasonweaver.name/lab/offcanvas/">Off Canvas Approach</a>. Mine differs slightly, namely that I have media queries and slightly different CSS to handle my non-three column approach (his didn't use media queries). However, the JavaScript is nearly the same (looking for resize, adding classes, showing the hidden off canvas navigation).

Off canvas navigation on the desktop browsers is actually pretty simple; it just works. Overflow-x works, things stay where they should, it's logical. Mobile is not. Mobile is mean. This shouldn't be news (I have to work on the mobile platforms daily, so I might be in the minority), but mobile browsers leave much to be desired. Overflow-x is nightmare, touchstart events throw things all over the place, and when you have it working something else goes sideways (literally).

To remedy mobile, the list is rather long. I had to slip a container div in place (which I tried hard to hold out on, but it was the only consistent implementation that worked in mostly everything), tweak a lot more of the CSS blocks than I wanted to (damn you inline-block and your temptations...the floats work better).

Sans the responsive nature that focuses on the main content, I did write a series of caching providers that grab data from Google+, Twitter, Github, and Last.fm. Because those services have either API's, JSON, or RSS feeds, it's relatively easy to pull that data and cache it.  From the cache, AJAX loads that aside after the $.when completes on the responsive.init(). It overall makes things much faster.

Sans the custom stuff, I stood on the shoulders of giants. <a href="http://modernizr.com/">Modernizer</a>, along with it's <a href="http://yepnopejs.com/">YepNope</a> integration handles the async loading. The font is <a href="http://www.google.com/webfonts/specimen/Open+Sans">Open Sans</a> from Google Web Fonts. The icons are from <a href="http://gregoryloucas.github.com/Font-Awesome-More/">Font Awesome More</a>, a fork of the popular <a href="http://fortawesome.github.com/Font-Awesome">Font Awesome</a>. The CSS3 only tool tips are from <a href="https://github.com/AdamWhitcroft/CSS.Tooltips">Adam Whitcroft</a>. <a href="https://github.com/BorisMoore/jsrender/">JSRender</a> is in there for the templates (I like it, even if it's not yet beta...it's very fast).  The build script for the entire thing is based off the <a href="https://github.com/h5bp/ant-build-script/">ant-build-script</a> used by HTML5 Boilerplate (okay, admittedly, I customized the heck out of it for this non-standard use of Wordpress).

I will release all the little PHP providers and the little bit of JavaScript to hook them up to a frontend. If I get the urge, I'll port over the layout to a standard wordpress theme (which at the moment, it isn't even close to).

Overall, I'm pleased with it. It's a signifcant speed bump (93/100 on Pagespeed, rendering is snappy), though it may not have the overall flair (what can I say, I'm not a designer :-). If it serves me six years like the last one, I figure I'll be doing okay.
