---
categories:
- perl
- Snarl
- releases
date: 2009-12-17T12:59:07Z
description: "Release 0.0.2, the always connected release."
title: idlemailcheck v0.0.2 released
url: /chronicle/2009/12/17/idlemailcheck-v0-0-2-released/
---

I have been rather busy the last month and a half, but wanted to push out a small update to the original idlemailcheck concept script.

A lot of people have been reporting that IMAP servers which detect inactivity after 30 minutes have been disconnecting the socket.  This was an oversight in my original concept script, as the RFC is quite clear that anything that uses an IDLE call should keep track of the time of the current session and disconnect/reconnect before the 30 minute mark as to not cause is with IDLE calls failing (or the script exiting).

The simple solution is to setup a timer, logout, and then reconnect every 25 or so minutes.  The problem is, I have been working on a 0.1 release with a lot more features (which is not yet done), so the even quicker solution is to create an infinite loop on the main body of the script using while(1) and then letting socket timeout after 30 minutes.  When that happens, the while(1) is hit, and the main body (login, open socket, et cetera) starts over.

I've been using this small update for testing purposes, and combined with KeepAlive set to true to deal with poor/unstable connections, the script works surprisingly well. Yipee for quick fixes!

You can grab the update on the <a href="http://code.google.com/p/idlemailcheck/">idlemailcheck project page</a>.  Feedback (here or on the project page) is always greatly appreciated.

