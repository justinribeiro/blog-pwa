---
title: "Switching Zotero Items in Bulk to Sentence Case in a Pinch"
description: "No citation manager is going to get sentence case correct, but if you need a jump start in a big library, this script will get you started."
date: 2025-03-20T8:45:38-07:00
tags:
 - zotero
 - code
 - copyedit
featureimage: '<figure aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemtype="http://schema.org/ImageObject">
  <picture>
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250320-zotero-sentence-case-example-640.webp 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250320-zotero-sentence-case-example-800.webp 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250320-zotero-sentence-case-example-1024.webp 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250320-zotero-sentence-case-example-1280.webp 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250320-zotero-sentence-case-example-1600.webp 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
    <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/20250320-zotero-sentence-case-example-640.png 640w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250320-zotero-sentence-case-example-800.png 800w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250320-zotero-sentence-case-example-1024.png 1024w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250320-zotero-sentence-case-example-1280.png 1280w,
                    https://storage.googleapis.com/jdr-public-imgs/blog/20250320-zotero-sentence-case-example-1600.png 1600w"
            sizes="(min-width: 800px) 800px, 100vw" type="image/png">
    <img decoding="async" loading="lazy" width="800" height="538" src="https://storage.googleapis.com/jdr-public-imgs/blog/20250320-zotero-sentence-case-example-800.png" alt="As example of running the sentence case Zotero script on a few items in my Zotero library.">
  </picture>
  <figcaption itemprop="caption description">
    <span aria-hidden="true">As example of running the sentence case Zotero script on a few items in my Zotero library.</span>
    <span class="author" itemprop="copyrightHolder">Justin Ribeiro</span>
  </figcaption>
</figure>'
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20250320-zotero-sentence-case-example-800.png"

---

I thought I had my citations under control. I had been rather pedantic when it came to adding citations to my library. However, with most things at the end of writing the dissertation, my eyes got blurry, and some oddness had slipped in. A few bad merged duplicates occurred (which the amazing editor I worked with, [Alexis Antes](https://www.linkedin.com/in/alexis-antes-7a20ba8), caught straight away). However, the larger issues she noted was the sentence case title issue for my Academy of Management format as required by my program. In particular, my sentence case was all over the place in Zotero, which she kindly informed me is pretty common in her line of work.

On the surface this _seems_ simple. Title case, no problem. Yet, sentence case is anything but simple when you account for proper nouns. It should be noted, Zotero makes this clear in the [documentation](https://www.zotero.org/support/kb/sentence_casing), and there is no magic bullet solve.

Alexis made quick work on the edit, faster than I could (which I needed, given submission manuscript deadlines). But I needed at least a jump start to level my Zotero library (given my 2000+ entries). Proper nouns I could reconcile as part of in-flight writing later on.

I considered writing another Zotero plugin similar to my [Google Scholar Citation Count for Zotero plugin](https://github.com/justinribeiro/zotero-google-scholar-citation-count), but that seemed heavy handed. Further, that might give the impression it is a magic bullet for this problem and I don't write magic bullets. I briefly looked around to see if people had done similar things, but found only various snippets of code that did not inspire confidence (e.g., no error checking, did not understand Zotero entry types, et cetera).

Instead, I came up with the following script. This uses similar-ish tricks I use in GSCC for extra flagging and sub-checking, but at the end of the day, it just tries really hard to give a reasonable starting point of sentence case without having to go one by one manually in Zotero (which I tried, it hurts). This script will not process everything (because Zotero types don't always have title or extra fields, or for other edge cases) and it has some configurability by setting variables (see code comments).

To use this, open Zotero, go to `Tools > Developer > Run JavaScript` and then paste the code in the `Code:` window. From there, select a few items in your Zotero list and click `Run` and you should see the titles change (with output in the `Return value:` window).

> Warning: The following script is not reversible (unless you start applying Title case again via Zotero right pane action). Buyer beware, I am not responsible if this messes up all your stuff, test lightly and use in moderation.

{{< codeblock lang="javascript" >}}
zoteroPane = Zotero.getActiveZoteroPane();

// You have to select some amount of items in Zotero; this won't select them for you
// Use CTRL-A or what not
items = zoteroPane.getSelectedItems();

// Set this to true if you want to reprocess previous changed titles
const skipScCheck = false;

// Set this to false if you don't want sc flags added to extra field
const addScCheck = true;

// This is a holder for output because the command runs async and it won't let you
// dump console.log like a regular devtools panel
const results = [];

// Start loooopin'
for (item of items) {
    // There are a lot of cases in Zotero that I'm not going to trap because
    // I need this dissertation edit done now, but the gist is, all my
    // non-citation stuff should still trap and fall into this try/catch skip
    try {
        const type = item.getField('itemType');

        // Some Zotero types do not have titles or extra fields, so you can't
        // just check for the extra field; if in doubt, add others via
        // https://www.zotero.org/support/kb/item_types_and_fields
        if (type !== 'attachment' || type !== 'note') {
            const extra = item.getField('extra');

            // Do we have a job marker on this item? If yes, skip.
            // Note, this is cheeky at best; changes to extra might cause re-runs
            // similar to issues I had to resolve in the GSCC plugin
            if (skipScCheck || extra.indexOf("sc:1") === -1) {
                const title = item.getField('title').trim();

                if (title !== '') {
                    // This does two things:
                    //   1. It uppercases the first letter of the string, then
                    //   lower cases the rest
                    //   2. Then it searches for ':' or '?' and if it finds it,
                    //   uppercases the first letter after those chars
                    scTitle = `${title.charAt(0).toUpperCase()}${title.substring(1).toLowerCase()}`
                        .replace(/([:?])\s*(.)/g, (match, cg1, cg2) => {
                          return cg1 + ' ' + cg2.toUpperCase();
                        });

                    // Set the title field
                    item.setField('title', scTitle);

                    if (addScCheck && extra.indexOf("sc:1") === -1) {
                        // set a marker to not re-run on this item, same as I do
                        // with GSCC; note, this renders weird in the code block
                        // but there is a new line break to put the sc:1 on the
                        // next line in extra field
                        const appendToExtraField = `${extra}\nsc:1`;
                        item.setField('extra', appendToExtraField);
                    }

                    // Wait for the transaction to complete to the DB
                    await item.saveTx();

                    // Push result to array for later output
                    results.push(scTitle);

                } else {
                    results.push(`Item Skipped based on no title!`);
                }
            } else {
                results.push(`Item Skipped based on SC flag!`);
            }
        } else {
            results.push(`Item Skipped based on type: ${type}`);
        }
  } catch {
    results.push('The top catch tripped; we saved ourselves to keep going!');
  }
}
return results;
{{< /codeblock >}}

Hopefully, you find this script helpful as a start point. Because that's what it is: a start point. You will still need to verify those proper nouns and anything else that meets APA or Chicago formatting or whichever journal you are targeting.

No magic bullets. Just work peeps. :-)