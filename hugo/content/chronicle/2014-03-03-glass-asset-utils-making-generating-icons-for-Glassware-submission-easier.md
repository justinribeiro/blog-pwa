---
categories:
- Glass
- tool
date: 2014-03-03T00:00:00Z
tags: []
title: 'glass-asset-utils: making generating icons for Glassware submission easier'
url: /chronicle/2014/03/03/glass-asset-utils-making-generating-icons-for-Glassware-submission-easier/
---

I enjoy writing Glassware. Besides being able to control my house without so much as lifting my phone, I just love the testing odd edge cases. It's just a lot of fun.

Late last year, as the Mirror API came out of preview and into the mainstream API console for more open use, you could start submitting your Glassware following the guidelines. Pretty nifty I thought.

The hurdles weren't that great, but I noticed you had to generate a fair amount of icons. I'm not much of a designer and didn't want to bother anyone with having to build icons for my projects, so I forked the very awesome [Android UI Utils](https://code.google.com/p/android-ui-utils/) project and decided to create a glassware icon generator.

And so, glass-asset-utils was born.

If you want to just play with tool, it's available live on App Engine: [http://glass-asset-utils.appspot.com/icons-submission.html](http://glass-asset-utils.appspot.com/icons-submission.html).

If you're looking for the code, the code is on Github: [justinribeiro/glass-asset-utils](https://github.com/justinribeiro/glass-asset-utils)

The generator follows the [Glassware Launch Checklist](https://developers.google.com/glass/distributing/checklist) so if you find that I'm missing something, please let me know. No server side code is run; it's all on the client side in browser (Chrome recommended). If you really don't trust me you can always fork and run it anywhere you like (App Engine is not a requirement).