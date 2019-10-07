---
tags:
- Pidgin
- theme
- xml
date: 2010-05-30T00:00:00Z
description: You can have a buddy list theme?  I know.  Here's how.
title: Reorganizing buddy list icons and status in Pidgin with a custom theme
url: /chronicle/2010/05/30/reorganizing-buddy-list-icons-and-status-in-pidgin-with-a-custom-theme/
---

<a href="http://www.pidgin.im/">Pidgin</a> is one of those great cross platform tools that is always on my install list when setting up a new workstation.  It makes connecting to the multitude of instant messaging platforms simple, all in one nice managed application. To boot it's open source, which not only warms my heart, but also allows me to bend it to my will should I need to.

Now, I'm not a big IM user, nor am I much into skinning or theming.  However, the arrangement in the buddy list has never been to my liking. In this short example, I'll show you the power of creating a single XML theme file that will shift your buddy icons and status fields around.

<img src="/images/blog/2010/05/pidgin-theme01.jpg" alt="the before and after" >

##  Setting up your custom theme folder
If you use Pidgin, you have a directory called .purple in either your home directory in Linux or your Application Data on Windows. Examples:

/home/{YOUR_USER}/.purple/themes
C:\Documents and Settings\{YOUR_USER}\Application Data\.purple\themes

To setup your custom theme, you need this set of folders underneath themes:

{THEME_NAME}\purple\blist

Example on one of my Windows machines:

C:\Documents and Settings\tmpuser\Application Data\.purple\themes\justintest\purple\blist

## Adding the theme.xml and editing
Inside the blist folder, you need to create your theme file, theme.xml.  The Pidgin developer wiki page on <a href="http://developer.pidgin.im/wiki/BuddyListThemes">buddy list themes</a> has information as to all the settings, as well as additional examples.  The following is my example in the above screenshot (basically colored group bars and buddy icon to the right).

{{< codeblock lang="xml" >}}
&lt;theme type=&quot;pidgin buddy list&quot; name=&quot;justin-test&quot; author=&quot;Justin Ribeiro&quot;&gt;
  &lt;description&gt;Justin&apos;s Test&lt;/description&gt;
  &lt;blist color=&quot;#FFFFFF&quot;&gt;&lt;/blist&gt;
  &lt;selected text_color=&quot;#000000&quot;&gt;&lt;/selected&gt;
  &lt;groups&gt;
    &lt;expanded text_color=&quot;#000000&quot; font=&quot;Italic&quot; background=&quot;#EAFCE6&quot;&gt;&lt;/expanded&gt;
    &lt;collapsed text_color=&quot;#000000&quot; font=&quot;Normal&quot; background=&quot;#EAFCE6&quot;&gt;&lt;/collapsed&gt;
  &lt;/groups&gt;
  &lt;buddys&gt;
    &lt;placement status_icon=&quot;3&quot; name=&quot;1&quot; emblem=&quot;2&quot; protocol_icon=&quot;4&quot; buddy_icon=&quot;0&quot; show_status=&quot;5&quot;&gt;&lt;/placement&gt;
    &lt;background color=&quot;&quot;&gt;&lt;/background&gt;
    &lt;contact_text font=&quot;Normal&quot; color=&quot;#000000&quot;&gt;&lt;/contact_text&gt;
    &lt;online_text font=&quot;Normal&quot; color=&quot;#000000&quot;&gt;&lt;/online_text&gt;
    &lt;away_text font=&quot;Normal&quot; color=&quot;#707070&quot;&gt;&lt;/away_text&gt;
    &lt;offline_text font=&quot;Normal&quot; color=&quot;#787878&quot;&gt;&lt;/offline_text&gt;
    &lt;idle_text font=&quot;Italic&quot; color=&quot;#909090&quot;&gt;&lt;/idle_text&gt;
    &lt;message_text font=&quot;Normal&quot; color=&quot;&quot;&gt;&lt;/message_text&gt;
    &lt;message_nick_said_text font=&quot;Normal&quot; color=&quot;&quot;&gt;&lt;/message_nick_said_text&gt;
    &lt;status_text font=&quot;Italic&quot; color=&quot;#969696&quot;&gt;&lt;/status_text&gt;
  &lt;/buddys&gt;
&lt;/theme&gt;
{{< /codeblock >}}

The key for reshuffling the buddy icon and status icons is in the <buddys> sub tag <placement>.  If you look in the example above, you'll note that I simply renumbered the attibutes to put them in the order I wanted (start at 0 all the way to the left, and then each number heads right).  Simple uh?

Now open the Preferences in Pidgin and select your theme as in the screenshot below.  It's that simple, really.

<img src="/images/blog/2010/05/pidgin-theme02.jpg" alt="my custom pidgin theme">

## Conclusion
Most people I know were not aware that you could theme Pidgin beyond changing the GTK theme (some people didn't know that either).  In a land were most people change themes, maybe Pidgin works well enough that most people simply don't care to change the themes.  There are themes out there you can download and install, but you don't find many.

Hopefully this little XML will help you not only tame and mold your buddy list to your liking, but maybe it jumpstarts your interest in theming Pidgin.
