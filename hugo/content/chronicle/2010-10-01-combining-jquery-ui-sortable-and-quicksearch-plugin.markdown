---
categories:
- learning
- jQuery
- quicksearch
date: 2010-10-01T00:00:00Z
description: "Working with jQuery UI's sortable and quicksearch plugin doesn't have to be hard."
title: Combining jQuery UI sortable and quicksearch plugin
url: /chronicle/2010/10/01/combining-jquery-ui-sortable-and-quicksearch-plugin/
---

If there is one thing I like it's jQuery UI's <a href="http://jqueryui.com/demos/sortable/">sortable</a>.  It's easy to implement, can be serialized for form submits with a single line, and generally looks pretty sweet.  However, when you've got a lot of options in connected lists, you need a list filter.  I've tried a few, written a few, but I always end up coming back to Rik Lomas' very awesome <a href="http://github.com/riklomas/quicksearch">quicksearch</a>.

Out of the box, two connected lists with sortable and quicksearch on one of those lists (for this example, list #2), and you will soon find that quicksearch, even after an item is moved from list #2 to list #1, quicksearch will still filter the item over on list #1.  We don't want it to do that, but we don't want to go hacking up Rik's awesome work.  So let's use what we've got.

## Update your sortable options
What we need to do is use some type of an identifier on list items so quicksearch so we can check for it.  Sortable makes that easy with the sortreceive command.  Presuming that you've already set up your connected sortable list, let's bind to sortreceive and tell it to add/remove a class as such.

{{< codeblock lang="javascript" >}}
$("#sortable1").bind( "sortreceive", function(event, ui) {
  $(ui.item).addClass("nofilter");
});

$("#sortable2").bind( "sortreceive", function(event, ui) {
  $(ui.item).removeClass("nofilter");
});
{{< /codeblock >}}

Basically what it's saying above, if I move an item to #sortable1, add the class nofilter.  If I move an item to #sortable2, remove the class nofilter.  Piece of cake.  Now to update quicksearch.

## Update quicksearch hide
In quicksearch, there are a number of methods you can add code to.  What we want to do it use hide to check to see if our class nofilter is on an item.

{{< codeblock lang="javascript" >}}
hide: function () {
  if (!$(this).hasClass('nofilter')) {
    this.style.display = "none";
  }
}
{{< /codeblock >}}

Again, not much to see here. If the list item that quicksearch is working on matches the filter the user is putting in and doesn't have our class, then we hide it.  If it has our class, the it doesn't hide.

## Conclusion
You don't have to write a lot of code or go hacking the internals to make sortable and quicksearch to play nice.  Using the basic methods available to use in both jQuery and quicksearch, we're able to achieve a simple combination of the two.
