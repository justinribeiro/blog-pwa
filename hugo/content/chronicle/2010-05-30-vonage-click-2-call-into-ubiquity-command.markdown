---
categories:
- ubiquity
- vonage
date: 2010-05-30T00:00:00Z
description: Connect call without pushing buttons on a phone...all with Ubiquity.
title: Vonage click 2 call into Ubiquity command
url: /chronicle/2010/05/30/vonage-click-2-call-into-ubiquity-command/
---

I've used Vonage phone service for a lot of years (6 or 7 years...I forget).  While I don't use a lot of the features offered any more, I actually still use their old Click 2 Call service to be save time in dialing numbers.

Vonage actually gives you <a href="https://secure.click2callu.com/">all the information</a> you need to be able to write a Click 2 Call service.  I decided that since a majority of the time I'm in a browser, I'd write a simple Ubiquity to handle this action.  It is included below.  Note, you'll have to replace the necessary variables in the source with your Vonage information before using.

{{< codeblock lang="javascript" >}}
CmdUtils.CreateCommand({
  names: ["vonage"],
  icon: "http://www.vonage.com/favicon.ico",
  description: "Make a call from your Vonage number (click 2 connect)",
  help: "vonage {phone-number-to-call}",
  author: {name: "Justin Ribeiro", email: "justin@justinribeiro.com"},
  license: "GPL",
  homepage: "http://www.justinribeiro.com/",
  arguments: [{role: 'object', nountype: noun_arb_text}],
  preview: function preview(pblock, args) {
    pblock.innerHTML = "Number to call: <b>" + args.object.html + "</b>.";
  },
  execute: function execute(args) {
    var baseUrl = "https://secure.click2callu.com/tpcc/makecall";
    var params = { username: "YOURUSERNAME", password: "YOURPASSWORD", fromnumber: "YOURVONAGENUMBER", tonumber: args.object.text};
    jQuery.get( baseUrl, params, function( makeCall ) {
      var content = $(makeCall).find('000:Request Successful');
      if (!content[0]) {
          $(pBlock).alert('Call failed, please try again. Response:' + makeCall);
          return;
      }
      else
      {
        $(pBlock).alert('Dialing your phone now. Response:' + makeCall);
                return;
      }
    });
  }
});
{{< /codeblock >}}

The key thing this won't do is work with you SimulRing number.  If you pick up any phone that isn't the actual Vonage phone, it'll disconnect you.  This isn't a problem with the script, but rather just the way the click 2 call service works.
