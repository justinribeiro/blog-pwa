---
tags:
- script
- autohotkey
- minecraft
date: 2010-11-19T00:00:00Z
description: Minecraft. AutoHotKey. Awesome goodness.
title: 'Fun Friday: Minecraft hotkeys and UI for OP /give in SMP in AutoHotKey'
url: /chronicle/2010/11/19/fun-friday-minecraft-hotkeys-and-ui-for-op-give-in-smp-in-autohotkey/
---

Fun Friday is something that Alli does in kindergarten at the moment.  Generally, they just have a lot of fun activities (which honestly isn't much unlike the rest of the week).  Along that line, I give you my own version of Fun Friday for the Minecraft playing, AutoHotKey loving community.

I don't play Minecraft a lot, but when I do I go hard core (insert laugh track here).  Since I like to play multiplayer with friends on our little private island, I've got OP.  So I like to be able to give items to not only myself, but to others.  I of course can't be bothered with remembering item id's, so I came up with a little GUI to handle that.  Below is the screenshot of it in action.

<img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2010/11/screenshot-20101117-minecraft-goods-delivery-smp-autohotkey-update.png" alt="My Autohotkey GUI hotkeyed to F4">

Basically, you hit F4 while in the game, the GUI pops up, enter the item id, quantity (if needed for something like one door), and the loop number (how many times to give to the player).  Bam! Awesome action.

## Download Minecraft Hackery v1.0

<a href="https://github.com/justinribeiro/minecraft-hackery-autohotkey">MinecraftHackery.ahk v1.0</a>
The item id image was not created by me and must downloaded from <a href="http://marvk.net/?page_id=184">Marvin @ marvk.net</a>.

## Making the script work

You'll need <a href="http://www.autohotkey.com/">AutoHotKey</a> for one (I have not tested this with AutoHotKey_L!). to edit the script to point to the location of the image you downloaded from marvk.net as well as your player handle.  The script has full instructions in the comments, but the gist of it is, you need to edit the SetMineCraftDefaults() function vars.

{{< codeblock lang="bash" >}}
SetMineCraftDefaults()
{
  ; JDR: do not remove
  global

  ; JDR: set your default user
  dfplayerhandle := "justinribeiro"

  ; JDR: image used to be in the Minecraft wiki
  dfitemkeyimg := "ItemslistV110.png"

  dfquantity := 64
  dfloop := 1
}
{{< /codeblock >}}

## Mappings

1. From Desi's Remaps: F1 toggles hold-left-click. Handy for breaking lots of blocks or mining obsidian.
2. From Desi's Remaps: F2 toggles hold-W, making you move forward automatically. Use with F1 for automated mining action!
3. JDR: F3 toggles hold-s, making you move backward automatically.
4. JDR: F4 prompts for itemid, for use as OP in SMP: make sure to set player var
5. JDR: Ctrl-R toggles crouching.

## Credits

1. F1/F2 mappings from Desi Quintans' Minecraft Remaps v2.1 (<a href="http://www.desiquintans.com">desiquintans.com</a>)
autopilot code from <a href="http://www.autohotkey.com/forum/topic59506.html">jaceguay</a>
2. autocrouch from <a href="http://www.minecraftforum.net/viewtopic.php?f=3&t=60032">avien</a>
3. item id key image from <a href="http://marvk.net/?page_id=184">Marvin</a>
4. <a href="http://www.autohotkey.com/download/">AutoHotKey</a>.  Seriously, my desktop would not be useable without you.

## That is all

That's pretty much it.  Read the comments in the ahk file, as they'll lead you on the path to Minecraft hotkey success.
