---
tags:
- Eclipse
date: 2013-05-10T00:00:00Z
title: Making Eclipse 4.2 a little darker with CSS and Eclipse Color Themes
url: /chronicle/2013/05/10/making-eclipse-4-2-a-little-darker-with-css-and-eclipse-color-themes/
---

Coming from the command line editors, I have a tenancy to like my code editors somewhat dark. And while I'm sure you could show me other such editors or yell at me to keep using said command line editors, Eclipse is where I spend most of my development time (the tooling is solid). With the recent updates to Eclipse Juno I can now make things a little darker.

## What it looks like
<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2012/12/screenshot-20121213-getfoggy.jpg" alt="Eclipse 4.2 Windows, foggy" />

## The tools
If you want a quick breakdown on how to style eclipse, look no further than Lars Vogel's article <a href="http://www.vogella.com/articles/Eclipse4CSS/article.html">Styling Eclipse</a>.

I used <a href="http://marketplace.eclipse.org/content/eclipse-4-chrome-theme#.UMtcPGeWlhc">Eclipse Chrome Theme</a>, which gave me some quick rough rules. I then jumped to <a href="http://marketplace.eclipse.org/content/eclipse-4-tools-css-spy#.UMtbl2eWlhc">CSS Spy</a> and found the last pieces that I wanted to style out. Then I used Eclipse Color Themes for the main code editor itself (much quicker <a href="http://eclipsecolorthemes.org/?view=theme&id=12716">FoggyDay</a>).

## The code
The following is the code. It's not perfect (you may lose some label text in places), but it works about 95% of the time.

{{< codeblock lang="css" >}}
.MTrimmedWindow.topLevel {
  margin-top: 2px;
  margin-bottom: 2px;
  margin-left: 2px;
  margin-right: 2px;
}

.MPartStack {
  font-size: 8;
  font-family: 'Segoe UI';
  swt-simple: true;
  swt-tab-renderer:
    url('bundleclass://net.jeeeyul.eclipse.themes/net.jeeeyul.eclipse.themes.rendering.ChromeTabRendering');

  padding: 1px 6px 8px 6px; /* top left bottom right */
  swt-tab-outline: #252525;
  swt-outer-keyline-color: #252525;
  swt-unselected-tabs-color: #4d4d4d #4d4d4d #1e1e1e 99% 100%;
  swt-shadow-visible: false;

  swt-selected-tab-fill: #1e1e1e;
  chrome-selected-tab-fill-highlight: #1e1e1e;

  chrome-selected-tab-color: #c7dd0c;
  chrome-unselected-tab-color: #d0d0d0;

  swt-shadow-color: #282828;

  chrome-shiney-shadow: false;
  swt-mru-visible: true;

  swt-corner-radius: 6px;
}

.MPartStack.active {
  swt-inner-keyline-color: #FFFFFF;
  swt-tab-outline: #282828;
  swt-outer-keyline-color: #282828;
  swt-unselected-tabs-color: #484848 #484848 #1e1e1e 99% 100%;

  swt-selected-tab-fill: #1e1e1e;
  chrome-selected-tab-fill-highlight: #1e1e1e;

  chrome-selected-tab-color: #c7dd0c;
  chrome-unselected-tab-color: #d0d0d0;
  chrome-shiney-shadow: false;
}

.MPartStack.empty {
  swt-unselected-tabs-color: #252525 #252525 #252525 99% 100%;
  swt-tab-outline: #282828;
  swt-outer-keyline-color: #282828;
}

.MTrimmedWindow {
    margin-top: 2px;
  margin-bottom: 2px;
  margin-left: 2px;
  margin-right: 2px;
  background-color: #595959;
}

.MTrimBar {
  background-color: #595959;
}

.MTrimBar#org-eclipse-ui-main-toolbar {
  background-color: #474747 #474747;
}

CTabFolder.MArea .MPartStack,CTabFolder.MArea .MPartStack.active {
  swt-shadow-visible: false;
}

CTabFolder Canvas {
  background-color: #494949;
}

#org-eclipse-ui-editorss {
  swt-tab-renderer:
    url('bundleclass://org.eclipse.e4.ui.workbench.renderers.swt/org.eclipse.e4.ui.workbench.renderers.swt.CTabRendering');
  swt-unselected-tabs-color: #F0F0F0 #F0F0F0 #F0F0F0 100% 100%;
  swt-outer-keyline-color: #B4B4B4;
  swt-inner-keyline-color: #F0F0F0;
  swt-tab-outline: #F0F0F0;
  color: #F0F0F0;
  swt-tab-height: 8px;
  padding: 0px 5px 7px;
}

#org-eclipse-ui-trim-status{
  chrome-border-top-visible: true;
  chrome-border-top-color: #282828;
  chrome-padding-top: 1;
}

.MToolControl.TrimStack {

  handle-image: url(chrome://drag-handle?height=22&background-color=#595959&embossed=false);
}

.MTrimBar .Draggable {
  handle-image: url(chrome://drag-handle?height=22&background-color=#595959&embossed=false);
}

.MTrimBar#org-eclipse-ui-main-toolbar .Draggable {
  handle-image: url(chrome://drag-handle?height=22&background-color=#474747&embossed=false);
}

.MTrimBar#org-eclipse-ui-main-toolbar .TrimStack {
  handle-image: url(chrome://drag-handle?height=22&background-color=#474747&embossed=false);
}


#org-eclipse-ui-main-toolbar #PerspectiveSwitcher {
  eclipse-perspective-keyline-color: #282828;
  background-color: #595959 #595959 100%;
  handle-image: none;
  chrome-show-perspective-name: false;
}

#PerspectiveSpacer{
  chrome-border-bottom-color: #282828;
  chrome-border-bottom-visible: true;
}

/* User CSS */
#SearchField {
     visibility: hidden;
}

Tree {
  background-color: #494949;
  color: #e0e0e0;
}
{{< /codeblock >}}
