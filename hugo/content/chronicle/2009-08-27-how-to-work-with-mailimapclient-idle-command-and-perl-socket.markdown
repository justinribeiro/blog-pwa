---
tags:
- perl
- Snarl
- Scripting
date: 2009-08-27T00:00:00Z
description: I couldn't find an example, so I made one myself.
title: How to work with Mail::IMAPClient IDLE command and Perl socket
url: /chronicle/2009/08/27/how-to-work-with-mailimapclient-idle-command-and-perl-socket/
---

_NOTE: The following example is deprecated with the May 2010 3.25 release of Mail::IMAPClient.  See Phil's <a href="http://cpansearch.perl.org/src/PLOBBES/Mail-IMAPClient-3.25/examples/idle.pl">IDLE example</a>, which uses the new idle\_data() and makes life easier._

I've been ill recently and I haven't had time to refine this to what I want it to be, but I'm going to put it out there since I can't find a single example of how to do this otherwise.  How exactly do you use the IDLE command that the Mail::IMAPClient implements?  The short answer is a Perl socket read.  The longer answer is the following short piece of code.

I by no means am expert when it comes to Perl, and I'm even less of an expert when it comes to the use of sockets.  The following small example does work, though I'm sure someone can offer a much more refined version.  The following script is based on the <a href="http://www.perlmonks.org/?node_id=649742">Gmail connect script at Perl Monks</a> that was written by <a href="http://www.perlmonks.org/?node_id=439923">polettix</a> and refined by <a href="http://www.perlmonks.org/?node=markov">markov</a>.  They did a nice job and I simply added to their example.

{{< codeblock lang="perl" >}}
#!/usr/bin/env perl
use warnings;
use Mail::IMAPClient;
use IO::Socket::SSL;

# Connect to the IMAP server via SSL
my $socket = IO::Socket::SSL->new(
   PeerAddr =&gt; 'imap.gmail.com',
   PeerPort =&gt; 993,
  )
  or die "socket(): $@";

# Build up a client attached to the SSL socket.
# Login is automatic as usual when we provide User and Password
my $client = Mail::IMAPClient-&gt;new(
   Socket   =&gt; $socket,
   User     =&gt; 'yourusername',
   Password =&gt; 'yourpass',
  )
  or die "new(): $@";

# Do something just to see that it's all ok
if ($client-&gt;IsAuthenticated()) {
   print "Logged in.\n";

   # open inbox folder
   $client-&gt;select("INBOX");

  my $idle = $client-&gt;idle or warn "Couldn't idle: $@\n";
  print "IMAP now idle....waiting for email\n";

  while($bytes_read = $socket-&gt;sysread($buf, 4096))
  {
    print "Read $bytes_read bytes from the socket...\n";
    print "Data: \n" . $buf . "\n";
    print "IMAP now idle....waiting for email\n";
    $client-&gt;done($idle) or warn "Error from done: $@\n";
    $client-&gt;idle or warn "Couldn't idle: $@\n";
  }

  $client-&gt;done($idle) or warn "Error from done: $@\n";

  # Say bye
  $client-&gt;logout();
 }
{{< /codeblock >}}

<img src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2009/08/screenshot-20090827-perlidletest.png" alt="A simple set of output from the test script">

The example above requires you change out the username and password, and presumes that you're connecting to Gmail (or in my case, Google Apps for Domain).  Since Google now offers the IDLE command, the output looks something like the screenshot to the left.  It's very basic output (this was only a quick test), but the connection sits in idle and waits for the IMAP server to return data to the open socket.  It's very quick in my limited tests (there's very little delay).  I haven't worked out all the kinks in this little test, but it gives you some idea on how to read the socket in conjunction with IDLE.

This all came about because I've been working with a combination of <a href="http://www.fullphat.net/index.php">Snarl</a> (a notification system for Windows) and it's Perl module <a href="http://search.cpan.org/%7Eaberndt/Win32-Snarl-0.03/lib/Win32/Snarl.pm">Win32::Snarl</a>  for alerts from various scripts.  Both Snarl and the Perl module work quite well.  Here's the same script, but with Snarl support (it will display alerts through Snarl).

{{< codeblock lang="perl" >}}
#!/usr/bin/env perl
use warnings;
use Mail::IMAPClient;
use IO::Socket::SSL;
use Win32::Snarl;

# Connect to the IMAP server via SSL
my $socket = IO::Socket::SSL-&gt;new(
   PeerAddr =&gt; 'imap.gmail.com',
   PeerPort =&gt; 993,
  )
  or die "socket(): $@";

# Build up a client attached to the SSL socket.
# Login is automatic as usual when we provide User and Password
my $client = Mail::IMAPClient-&gt;new(
   Socket   =&gt; $socket,
   User     =&gt; 'yourusername',
   Password =&gt; 'yourpass',
  )
  or die "new(): $@";

# Do something just to see that it's all ok
if ($client-&gt;IsAuthenticated()) {
   my $winAuth = Win32::Snarl::ShowMessage('Gmail Authenticated', 'You are now logged into Gmail.', 5);
   print "Logged in.\n";

   # open inbox folder
   $client-&gt;select("INBOX");

  my $idle = $client-&gt;idle or warn "Couldn't idle: $@\n";
  print "IMAP now idle....waiting for email\n";

  while($bytes_read = $socket-&gt;sysread($buf, 4096))
  {
    print "Read $bytes_read bytes from the socket...\n";
    print "Data: \n" . $buf . "\n";
    print "IMAP now idle....waiting for email\n";
    my $winNM = Win32::Snarl::ShowMessage('New Email', $buf, 5);
    $client-&gt;done($idle) or warn "Error from done: $@\n";
    $client-&gt;idle or warn "Couldn't idle: $@\n";
  }

  $client-&gt;done($idle) or warn "Error from done: $@\n";

  # Say bye
  $client-&gt;logout();
 }
{{< /codeblock >}}

Your mileage may vary with the examples above; they're brief to say the least. My goal is to write a very light Gmail check script, along with adding Snarl notifications to some of my other perl scripts.  At least when I'm feeling better.
