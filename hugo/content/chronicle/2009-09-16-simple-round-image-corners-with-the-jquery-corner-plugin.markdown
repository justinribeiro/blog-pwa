---
categories:
- jQuery
- webdev
date: 2009-09-16T00:00:00Z
description: "You hate breaking out the photo editor for a nice rounded corner photo. Use the jQuery Corner plugin instead."
title: Simple round image corners with the jQuery Corner plugin
url: /chronicle/2009/09/16/simple-round-image-corners-with-the-jquery-corner-plugin/
---

I use <a href="http://jquery.com/">jQuery</a> quite a bit, it's my tool of choice to bring interactivity to pretty much any web app or web page.  You can do an amazing amount of work with very little code.  One of the great things is that the community is very active and there are many plugins to help get things done even faster.

Recently I've been using <a href="http://www.malsup.com/jquery/corner/">jQuery Corner</a>, a plugin that was created by <a href="http://methvin.com/jquery/jq-corner.html">Dave Methvin</a>, and later collaborated with <a href="http://www.malsup.com/jquery/corner/">Mike Alsup</a> for improvements.  I've used Mike's Form plugin for quite some time, and finding a need for some rounded interface blocks, the Corner plugin worked without fail.

The plugin has a lot of options, but the most simple is to simple have a nice round corner:

{{< codeblock lang="javascript" >}}
$("#mydivid").corner();
{{< /codeblock >}}

Wouldn't it be nice if you could apply that to an image?  Unfortunately, it's not that simple.  But it's really not terribly hard either.  What you have to do is create div, give that div a height and width (preferably to the size of the image), and than apply the corner() call to the div.  See sample code:

{{< codeblock lang="css" >}}
#testmeA
{
  width: 100px;
  height: 100px;
  background: url("sample.jpg") no-repeat;
}
{{< /codeblock >}}

{{< codeblock lang="javascript" >}}
$("#testmeA").corner();
{{< /codeblock >}}

The result?  The very cool image to the left, with nice rounded corners with not a photo editing program in sight.  If you want to verify that I'm not pulling a fast one, my sample image is <a href="http://justinribeiro.com/projects/jquery/sample.jpg">here</a>. For you photography folks, that's a 135/2.8 Vivitar in an m42 mount with Automatic (A) and Manuel (M) lever that allows use with the Pentax Spotmatic F's bright field focusing feature (oddly, I don't have a Spotmatic F to use it with).  

But Justin you say, this must be obvious to anyone that has used this plug-in.  You may well be correct, but it wasn't obvious to me until I found a need for said rounded corner image and I can't find anyone who is using it for this sort of case.  But it works so well I just can't help but love it.

Does it work with the different Corner options?  You bet.

{{< codeblock lang="javascript" >}}
$("#testmeB").corner("cool 10px");
$("#testmeC").corner("bite 10px");
$("#testmeD").corner("wicked 20px");
{{< /codeblock >}}

The simple power of a very good plugin.  Next time your looking for a quick rounded corner image, break out jQuery and the Corner plugin and leave the photo editor behind.



