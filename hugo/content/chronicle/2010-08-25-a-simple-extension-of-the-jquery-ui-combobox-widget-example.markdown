---
categories:
- learning
- jQuery
date: 2010-08-25T09:00:53Z
description: "A simple example of extending the jQuery UI combobox widget and a little bit of overall widget love."
title: A simple extension of the jQuery UI combobox widget example
url: /chronicle/2010/08/25/a-simple-extension-of-the-jquery-ui-combobox-widget-example/
---

NOTE: this is based on the previous 1.8 combobox example from the documentation; this isn't the example from 1.8.4, as the project I'm working has not made the jump to 1.8.4 yet.  It should nonetheless give you some idea should you want to meld comboxbox to your needs.

The combobox widget from jQuery UI is quite nice.  It works right out of the documentation with very little effort.  However, it isn't a complete example as it doesn't include a destroy, and I needed it to hide in some instances as well.  How to do that?  Let's see.

## Before you keep reading (or just plain leave)
If you haven't read the <a href="http://jqueryui.com/docs/Developer_Guide#The_widget_factory">jQuery UI Developer docs on the widget factory</a>, you might want to do that first.  Also, the article <a href="http://bililite.com/blog/understanding-jquery-ui-widgets-a-tutorial/">Understanding jQuery UI widgets: A tutorial</a> is quite good as well.

## Destroy the widget
The destroy method removes an said instance of our widget from the DOM element.  Think of it as setting things back to the way they were before you invoked the widget.  For our combobox widget, this means we basically need to remove the input and button that it creates, turn the visibility of the original select back on, and make sure you can't call other methods for combobox on the element anymore (at least without another create).  Our simple destroy method looks like this:

{{< codeblock lang="javascript" >}}
destroy: function() {
  // ditch the combobox button
  this.element
     .next("input")
     .next("button").remove();

  // ditch the combobox input
  this.element
     .next("input").remove();
  
  // show the old select
  this.element.show();
  
  // final kill
 $.Widget.prototype.destroy.apply(this);
}
{{< /codeblock >}}

<a href="http://api.jquery.com/remove/">.remove()</a> does the dirty work of getting rid of said element from the DOM.  Note, I remove button first and the input.  The select gets shown again, and then the combobox is killed off.  Pretty simple.


## Make me hide!
I have a set of cases in the project I'm working on that call for not a destroy, but a show/hide.  It's not a straight toggle in my case, so I separated said methods: 

{{< codeblock lang="javascript" >}}
hide: function() {
  this.element
    .next("input").hide()
    .next("button").hide();
},
show: function() {
  this.element
    .next("input").show()
    .next("button").show();
}
{{< /codeblock >}}

Not anything particularly special uh?  Simple chained show and hide for both elements.  And you thought working with widgets was hard.

## Widgets are fun
While the example above is quite simple (I know you didn't need me to tell you how to do it), the larger part of the story is that the widget factory that jQuery UI has can be powerful when you need to do some work.  It's also quite a bit of fun.  So the next time you think, humm, how to do this...don't discount the widget.  They are your friend.
