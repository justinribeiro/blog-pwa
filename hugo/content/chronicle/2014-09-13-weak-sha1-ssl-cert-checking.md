---
date: 2014-09-13T00:00:00Z
description: Start testing today and start getting your certs up-to-date with this online testing toolset.
title: Checking for weak SSL SHA-1 certificates
url: /chronicle/2014/09/13/weak-sha1-ssl-cert-checking/
tags:
- Web
---

Ah, SHA-1. We've known for a while that's it's been breakable (see [Schneier's write-up back in 2005](https://www.schneier.com/blog/archives/2005/02/cryptanalysis_o.html)) and even before that it was widely known that SHA-1 wasn't going to last forever. Machines get faster, attacks get refined, and we move to more secure operations.

That time is now rapidily upon us. Mozilla, Google, and Microsoft have deprecated SHA-1 and it won't be in use by 2017. Chrome will soon start showing warnings when SSL certificates are using SHA-1. You don't want to be that site.

How to test? [Shaaaaaaaaaaaaa](https://shaaaaaaaaaaaaa.com/) is a tool that will quickly check your site's SSL cert to see if it's been issued with SHA-1. If it has, you'll need to generate a new CSR and send it to get your site' SSL cert re-issued with SHA-2. The site has all the details.

Need a more powerful tool? The project is [open source and available on GitHub](https://github.com/konklone/shaaaaaaaaaaaaa) and has a commmand line client.

I recently changed over the cert for this site using StartSSL which took a total of 10 minutes. Different CA's require a different path for re-issue but in most cases it can be done. Don't delay: at least make a note to yourself to check into this before you find yourself in a pickle.