---
categories:
- learning
- Web Apps
- jQuery
date: 2009-10-02T00:00:00Z
description: "An example of what can be accomplished with jQuery UI and the Validation and Form plugins."
title: jQuery UI modal form with Validation and Form plugin integration
url: /chronicle/2009/10/02/jquery-ui-modal-form-with-validation-and-form-plugin-integration/
---

Depending on what camp you find yourself in, there are the people who really like <a href="http://jqueryui.com/">jQuery UI</a> and the people that do not.  I'm one of those people that tends to stay out of the argument because I just want to get things done as quickly and efficiently as possible.  Do I use jQuery UI all the time?  No. Am I using it on fairly large intranet application the team and I are working on?  Yes, because it fits the bill.

Since I haven't found a great deal of UI examples that integrate existing plugins, I thought I'd tackle one that a lot of people might find useful: using a modal form window with the excellent <a href="http://bassistance.de/jquery-plugins/jquery-plugin-validation/">Validation</a> and <a href="http://malsup.com/jquery/form/">Form</a> plugins.  I've been using these plugins for a long time, and they are generally the first thing that I install with every jQuery install because they are just so darn useful.  But how do you make them work with the jQuery UI theme and functionality?  Lets break it down.

Note: this is a basic example, really the bare minimum one could use to get any form up and running.  You could simplify this down further, but I'm trying to make it more understandable.  I added a bit of additional styling to the example that I've omitted below for simplicity sake.  The UI theme in use is called <a href="http://jqueryui.com/themeroller/#ffDefault=Trebuchet+MS,+Tahoma,+Verdana,+Arial,+sans-serif&fwDefault=bold&fsDefault=1.1em&cornerRadius=4px&bgColorHeader=f6a828&bgTextureHeader=12_gloss_wave.png&bgImgOpacityHeader=35&borderColorHeader=e78f08&fcHeader=ffffff&iconColorHeader=ffffff&bgColorContent=eeeeee&bgTextureContent=03_highlight_soft.png&bgImgOpacityContent=100&borderColorContent=dddddd&fcContent=333333&iconColorContent=222222&bgColorDefault=f6f6f6&bgTextureDefault=02_glass.png&bgImgOpacityDefault=100&borderColorDefault=cccccc&fcDefault=1c94c4&iconColorDefault=ef8c08&bgColorHover=fdf5ce&bgTextureHover=02_glass.png&bgImgOpacityHover=100&borderColorHover=fbcb09&fcHover=c77405&iconColorHover=ef8c08&bgColorActive=ffffff&bgTextureActive=02_glass.png&bgImgOpacityActive=65&borderColorActive=fbd850&fcActive=eb8f00&iconColorActive=ef8c08&bgColorHighlight=ffe45c&bgTextureHighlight=03_highlight_soft.png&bgImgOpacityHighlight=75&borderColorHighlight=fed22f&fcHighlight=363636&iconColorHighlight=228ef1&bgColorError=b81900&bgTextureError=08_diagonals_thick.png&bgImgOpacityError=18&borderColorError=cd0a0a&fcError=ffffff&iconColorError=ffd27a&bgColorOverlay=666666&bgTextureOverlay=08_diagonals_thick.png&bgImgOpacityOverlay=20&opacityOverlay=50&bgColorShadow=000000&bgTextureShadow=01_flat.png&bgImgOpacityShadow=10&opacityShadow=20&thicknessShadow=5px&offsetTopShadow=-5px&offsetLeftShadow=-5px&cornerRadiusShadow=5px">UI Lightness</a>.

## Step 1: Setup some div's
What I like to do is always have a return message block that contains informational messages after the form post, as well as a target div for any data that needs to be loaded/refreshed/appended to.  Before jQuery UI, I used to style out my own message blocks and it works totally fine.  But the UI theming is just so darn good, lets put it to use.

{{< codeblock lang="html" >}}
&lt;div class=&quot;ui-widget ui-helper-hidden&quot; id=&quot;client-script-return-msg&quot;&gt;
  &lt;div class=&quot;ui-state-highlight ui-corner-all&quot; style=&quot;padding: 0pt 0.7em; margin-top: 20px;&quot;&gt;
    &lt;p&gt;&lt;span class=&quot;ui-icon ui-icon-circle-check&quot; style=&quot;float: left; margin-right: 0.3em;&quot;&gt;&lt;/span&gt;
    &lt;span id=&quot;client-script-return-msg-rtn&quot;&gt;&lt;/span&gt;
  &lt;/div&gt;
&lt;/div&gt;
{{< /codeblock >}}

Confused?  I was.  The block above is largely taken from the demos from the API documentation, with a few modifications for our return message.  Key things to take away from that code block:

* Any class with "ui-" in front of it is part of the <a href="http://docs.jquery.com/UI/Theming/API#The_jQuery_UI_CSS_Framework">jQuery UI CSS Framework</a>.  If you haven't read that documentation, I highly suggest you do so, as it'll help make using UI much easier. 
* The class "ui-helper-hidden" hides the div via display:none until we need it later (again, that's a stock jQuery UI CSS class) 
* We set the main div block with an ID equal to "client-script-return-msg", and our return message is going into an added span element with the ID equal to "client-script-return-msg". 

We now have our return message block.  Let's now add a target for our form post return and a button we'll use to open the modal dialog:

{{< codeblock lang="html" >}}
&lt;button id=&quot;load-my-modal&quot; class=&quot;ui-button ui-state-default ui-corner-all&quot;&gt;Open Modal Form&lt;/button&gt;
&lt;div id=&quot;client-script-return-data&quot; class=&quot;ui-widget ui-widget-content&quot;&gt;For our example, our form post from the modal will replace this text.&lt;/div&gt;
{{< /codeblock >}}

Pretty straight forward.  You will note that we've used more UI class elements to make things theme friendly and assigned some ID's which we'll be using in our JavaScript calls.

## Step 2: Setup the modal form html
We now turn our attention to the actual form and the modal window that holds it.  First, let's setup the modal div block like so:

{{< codeblock lang="html" >}}
&lt;div id=&quot;my-modal-form&quot; title=&quot;Edit some data&quot;&gt;&lt;/div&gt;
{{< /codeblock >}}

We give it and ID that we'll use later and assign it a title with jQuery UI will use for header display on the modal popup.  You'll note, we don't give this container a ui-helper-hidden class attribute; this is because jQuery UI will take care of that for use when we define that block as dialog.

Now let's add in our error block to catch error messages:

{{< codeblock lang="html" >}}
&lt;div id=&quot;my-modal-form&quot; title=&quot;Edit some data&quot;&gt;
  &lt;div class=&quot;ui-widget ui-helper-hidden&quot; id=&quot;errorblock-div1&quot;&gt;
    &lt;div class=&quot;ui-state-error ui-corner-all&quot; style=&quot;padding: 0pt 0.7em;&quot; 
      id=&quot;errorblock-div2&quot; style=&quot;display:none;&quot;&gt;
      &lt;p&gt;
        &lt;span class=&quot;ui-icon ui-icon-alert&quot; 
          style=&quot;float: left; margin-right: 0.3em;&quot;&gt;&lt;/span&gt;
        &lt;strong&gt;Alert:&lt;/strong&gt; Errors detected!
      &lt;/p&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;
{{< /codeblock >}}

You'll note this looks slightly different for our information block.  Key takeaways:

* We keep the block hidden until the validation plugin needs to display it via the class ui-helper-hidden 
* We give both the main div an ID of errorblock-form1 and the secondary content div the ID of errorblock-form2; you'll need both later 
* There is an empty UL tag on purpose; it's going to hold our error messages 

Now that we have our error block, lets toss in a form:

{{< codeblock lang="html" >}}
&lt;div id=&quot;my-modal-form&quot; title=&quot;Edit some data&quot;&gt;
  &lt;div class=&quot;ui-widget ui-helper-hidden&quot; id=&quot;errorblock-div1&quot;&gt;
    &lt;div class=&quot;ui-state-error ui-corner-all&quot; style=&quot;padding: 0pt 0.7em;&quot; 
      id=&quot;errorblock-div2&quot; style=&quot;display:none;&quot;&gt;
      &lt;p&gt;
        &lt;span class=&quot;ui-icon ui-icon-alert&quot; 
          style=&quot;float: left; margin-right: 0.3em;&quot;&gt;&lt;/span&gt;
        &lt;strong&gt;Alert:&lt;/strong&gt; Errors detected!
      &lt;/p&gt;
    &lt;/div&gt;
  &lt;/div&gt;
    &lt;form action=&quot;testme.php&quot; name=&quot;modal-form-test&quot; id=&quot;modal-form-test&quot; 
      method=&quot;POST&quot;&gt;
    &lt;fieldset&gt;
      &lt;label for=&quot;fullname&quot;&gt;Name&lt;/label&gt;
      &lt;input type=&quot;text&quot; name=&quot;fullname&quot; id=&quot;fullname&quot; 
        class=&quot;text ui-widget-content ui-corner-all&quot; /&gt;
      &lt;label for=&quot;email&quot;&gt;Email&lt;/label&gt;
      &lt;input type=&quot;text&quot; name=&quot;email&quot; id=&quot;email&quot; 
        class=&quot;text ui-widget-content ui-corner-all&quot; /&gt;
    &lt;/fieldset&gt;
    &lt;/form&gt;
&lt;/div&gt;
{{< /codeblock >}}

The only thing to note is that there are no buttons; jQuery UI's dialog takes care of that for use. Now let's write some JavaScript and jQuery code!

## Step 3: Wire things up with jQuery goodness
First things first: let's make our div block with the ID of my-modal-form a modal dialog:

{{< codeblock lang="javascript" >}}
var amodal = $("#my-modal-form").dialog({
   bgiframe: true,
   autoOpen: false,
   height: 300,
   modal: true,
   buttons: {
      'Update Data': function() { $("#modal-form-test").submit(); },
      Cancel: function() { $(this).dialog('close'); aform.resetForm(); }
   }
});
{{< /codeblock >}}

I'm not going explain the whole list of options that a dialog() call has (that's what the <a href="http://jqueryui.com/demos/dialog/">dialog documentation and demo</a> is for) but let's run down the important one's that make our example really work:

* autoOpen: false keeps our dialog from automatically opening on page load 
* modal: true makes our dialog modal, which basically means you aren't doing anything else with the underlying page until you dismiss the dialog box 
* buttons: setups our buttons for our form action.

Let's talk about the buttons for a second.  You will note that one button that we are calling "Update Data" has function defined that runs $("#modal-form-test").submit();  This does exactly what it says.  But Justin you say, I thought we were using the Validation and Form plugins?  We are...just not right there.  Only thing we want that button to do is submit the form (for the purposes of this example).

The cancel button does two things: $(this).dialog('close'); closes the dialog box, and aform.resetForm(); resets the form state.  But Justin, where did you get aform?  Ah, you're catching on.  We have to define our validate() function.

{{< codeblock lang="javascript" >}}
var aform = $("#modal-form-test").validate({
  errorContainer: "#errorblock-div1, #errorblock-div2",
  errorLabelContainer: "#errorblock-div2 ul",
  wrapper: "li",
  rules: {
    fullname: "required",
    email: {
        required: true,
        email: true
            }
  },
  messages: {
    fullname: "Please enter your name.",
    email: {
        required: "Please enter your email address.",
        email: "Please enter a valid email address."
            }
  },
  submitHandler: function(form) {
    jQuery(form).ajaxSubmit({
        target: '#client-script-return-data',
        success: function() { $('#my-modal-form').dialog('close'); successEvents('#client-script-return-msg'); }
     });
   }
});
{{< /codeblock >}}

A fair amount of code, but it's not too bad.  Lets break it down.

* errorContainer: "#errorblock-div1, #errorblock-div2" - a lot of people wonder why you have to set both the parent errorblock-div1 its child errorblock-div2 as the errorContainer.  The reason is that if you do not, our error messages won't properly appear. errorblock-div1 is hidden, but we also need to be able to not only show errorblock-div2, but also reset it's message state when a submit or cancel happens. 
* errorLabelContainer: "#errorblock-div2 ul" - remember that empty UL we put in?  This become our container for error messages. 
* wrapper: "li" - by default, the Validation plugin puts error messages into LABEL containers, but since we're targeting a UL, we want to make sure we use LI 
* rules: and messages: - these correspond to our form inputs and are for validation of the data.  If you use the metadata plugin, you can do this inline on the form elements, but for the sake of this example, I've left them in place to make the example a little easier to understand 
* submitHandler: this does all the form posting work and is part of the Form plugin (using the ajaxSubmit(); ) 
* target: - which block we want our return data to go into, in this case the previously setup div client-script-return-data 
* success: - the function runs $('#my-modal-form').dialog('close'); to close the dialog on a successful submit, and then runs my custom function successEvents(); which I'll show you shortly. 

The successEvents() function is something I came up with to make things pretty, but to also make return messages fade out and hide after a certain amount of time.  The function looks like:

{{< codeblock lang="javascript" >}}
function successEvents(msg, datatable) {

    // JDR: microseconds to show return message block
    var defaultmessagedisplay = 10000;

    // JDR: fade in our return message block
    $(msg).fadeIn('slow');

    // JDR: remove return message block
    setTimeout(function() { $(msg).fadeOut('slow'); }, defaultmessagedisplay);
};
{{< /codeblock >}}

As you can see, the function simply fades in our return message block (which we hide to start) and then fades it out after 10 seconds.

## Step 4: The backend AJAX call
The backend form post script could do anything you want it to do.  The thing to remember that in this example we're just returning HTML to our return block (not JSON or XML).  The example is important however, as it has the last key piece to our return message block:

{{< codeblock lang="html" >}}
&lt;script type=&quot;text/javascript&quot;&gt;
    jQuery(function() {
        var stringMsg = &quot;&lt;strong&gt;Success!&lt;/strong&gt; Your information was updated.&quot;
        $(&quot;#client-script-return-msg-rtn&quot;).html(stringMsg);
    });
&lt;/script&gt;

&lt;div&gt;
  &lt;label&gt;Name: &lt;?php echo $_POST[&quot;fullname&quot;];  ?&gt;&lt;/label&gt;
  &lt;label&gt;Email: &lt;?php echo $_POST[&quot;email&quot;]; ?&gt;&lt;/label&gt;
&lt;/div&gt;
{{< /codeblock >}}

The only major thing to note is that we had originally set up a span with the ID of client-script-return-msg-rtn to handle our return message. $("#client-script-return-msg-rtn").html(stringMsg); does the work of setting that message in that block (the var stringMsg is defined above it).  We don't we unhide it?  Because the successEvents() function takes care of that for us.

## Step 5: The last step
The last step is a simple one: we have to tell our button to open the dialog box.  To do so, we attach a click event:

{{< codeblock lang="javascript" >}}
$('#load-my-modal').click(function() {
  $('#my-modal-form').dialog('open');
});
{{< /codeblock >}}

And here's a little nifty trick I picked up somewhere (for the life of me I forget where, and if you're the author please email me because I like to give credit where credit is due).  Let's make all our buttons have a nice UI hover effect:

{{< codeblock lang="javascript" >}}
var abuttonglow = $(".ui-button:not(.ui-state-disabled)")
  .hover(
    function() {
        $(this).addClass("ui-state-hover");
    },
    function() {
        $(this).removeClass("ui-state-hover");
    }
  ).mousedown(function() {
      $(this).addClass("ui-state-active");
  })
  .mouseup(function() {
      $(this).removeClass("ui-state-active");
  });
{{< /codeblock >}}

## Final Thoughts
While it may look like a lot of code for what is a fairly simple procedure, this set of tools allows a robust and consistent experience to be displayed to the user.  The example above can styled with <a href="http://jqueryui.com/themeroller/">Themeroller</a> without so much as a single line of code changed. Using the Validation and Form plugins would also us even more possibilities without having to write a lot of supporting code (and I don't know about you, but I can't stand writing validation rules in JavaScript by hand...that's so 1997).

Happy coding!
