---
tags:
- development
- software
- perl
- Snarl
date: 2009-08-28T00:00:00Z
description: Because the world needs another Perl based mail check script...now with IDLE!
title: "idlemailcheck v0.0.1 released - IMAP IDLE mail check with Snarl notification for Perl"
url: /chronicle/2009/08/28/idlemailcheck-v0-0-1-released-imap-idle-mail-check-with-snarl-notification-for-perl/
---

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2009/08/snarl-gmail-authenticated.png" alt="Initially logged into Gmail">

Since there has been some interest in using <a href="http://justinribeiro.com/chronicle/2009/08/27/how-to-work-with-mailimapclient-idle-command-and-perl-socket/">IMAP IDLE, Perl and Snarl</a>, I wrote a cleaner more useful proof of concept that I have named idlemailcheck.  Since I've never used Google Code, I decided to try it out and host the code there: <a href="http://code.google.com/p/idlemailcheck">idlemailcheck @ Google Code</a>.

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2009/08/snarl-email-received.png" alt="Email received and displayed as Snarl notification">

The code is very raw and could use a improvement.  It is very much a proof of concept and run it at your own risk.  To see what it looks like in action, I've included a few screenshots of the Snarl notifications that appear over there on the left.  The very nice icon comes from a <a href="http://jonasraskdesign.com/">Jonas Rask Design</a>, and is free for personal use.  This version does not play a sound, but subsequent versions will make that an option.  I cannot stress enough that this is a proof of concept and that expectations should be low in this every version.

With that said, the script actually works fine in my limited testing.  I don't have a long term test record of it, but that will come with time. Before running the script you'll need a few things installed.

* <a href="http://www.fullphat.net/">Snarl for Windows</a>
* Win32::Snarl
* IO::Socket::SSL
* Mail::IMAPClient

You'll also need to set the IMAP server address (the IMAP server must support IDLE) as well as your username and password.  The path to the icon also needs to be set in the script.  It does output debug information on the command line, so if something goes wrong, check your terminal window.  I've had success running the script in Cygwin, but running the script within ActiveState's  ActivePerl should also be fine.

With that, I give you idlemailcheck v0.0.1, released under the GPL v2.  You can view the code below, but if you're looking to play with it, be sure to download the code and icon from the <a href="http://code.google.com/p/idlemailcheck/downloads/list">download page</a>.

{{< codeblock lang="perl" >}}
#!/usr/bin/env perl
#######################################
#
#  idlemailcheck - IMAP IDLE mail check with Snarl notification
#
#  Copyright (C) Justin Ribeiro <justin@justinribeiro.com>
#  Project Page - http://www.justinribeiro.com/
#
#   This program is free software; you can redistribute it and/or
#   modify it under the terms of the GNU General Public License
#   as published by the Free Software Foundation; either version 2 of
#   the License or (at your option) any later version.
#
#   This program is distributed in the hope that it will be
#   useful, but WITHOUT ANY WARRANTY; without even the implied warranty
#   of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.
#
#   You should have received a copy of the GNU General Public License
#   along with this program; if not, write to the Free Software
#   Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
#   USA
#
#   08/28/2009
# JDR - Initial Concept Release 0.0.1
#
#  The script logs into an IMAP server of your  choice (which must support
#  the IDLE command), sits at IDLE until the mail server has a new email, and
#  then returns a Snarl notification when new mail arrives.
#
#  This connect portion of the script is based on the Gmail connect script at Perl Monks
#  that was written by polettix and refined by markov: http://www.perlmonks.org/?node_id=649742
#
#  Requirements
#  1. Snarl for Windows (http://www.fullphat.net/)
#  2. Win32::Snarl
#  3. IO::Socket::SSL
#  4. Mail::IMAPClient
#
#  You must set the variables below for your specific IMAP server. If you want the icon
#  to appear, make sure you update to the full path as in the example below.
#
#  Tested with:
#
#  * Gmail
#  * Google Apps for Domain
#
#  Feel free to make changes and additions;  I'm open to suggestions, fixes, and just
#  plain better ways to do things.
#
#  Released under the GPL License.  Use at your own risk.
#
#######################################

use warnings;
use strict;
use Mail::IMAPClient;
use IO::Socket::SSL;
use Win32::Snarl;

#### SETUP - YOU MUST SET THE FOLLOWING OR NOTHING WILL WORK
my $IMAP_server = "imap.gmail.com";
my $IMAP_port = "993";
my $IMAP_user = "";
my $IMAP_password = "";
my $SNARL_disptime = 7; # number of seconds to display snarls alerts

# path to icon
# icon from Jonas Rask Design http://jonasraskdesign.com/ (free for personal use)
# if you use a differnt icon, it must be 128x128 png
my $use_icon = "C:\\path\\to\\stamp.png";


#### EDITING BELOW AT OWN RISK

# Connect to the IMAP server via SSL
my $socket = IO::Socket::SSL->new(
   PeerAddr => $IMAP_server,
   PeerPort => $IMAP_port,
  )
  or die "socket(): $@";

# Build up a client attached to the SSL socket.
# Login is automatic as usual when we provide User and Password
my $client = Mail::IMAPClient->new(
   Socket   => $socket,
   User     => $IMAP_user,
   Password => $IMAP_password,
  )
  or die "new(): $@";

# we set Uid to false so that we can use the message sequence number to email information
$client->Uid(0);

# need these for later
my $noidle = 0;
my $last = 0;
my $buf;
my $bytes_read;
my $my_ID;
my $msg_count;

# Do something just to see that it's all ok
if ($client->IsAuthenticated())
{
   my $winAuth = Win32::Snarl::ShowMessage('Gmail Authenticated', 'You are now logged into Gmail.', $SNARL_disptime, $use_icon);
   print "Log in successful.\n";

   # open inbox folder
   $client->select("INBOX");

  # idle the connection
  my $idle = $client->idle or warn "Couldn't idle: $@\n";
  print "IMAP now idle....waiting for email\n";

  # we sit an wait for the service to return some data
  while($bytes_read = $socket->sysread($buf, 4096))
  {
    # looks like we have something
    print "Read $bytes_read bytes from the socket...\n";

    # what's in the buffer
    print "Data: \n" . $buf . "\n";

    # grab one line at a time from the buffer
    while ( $buf =~ s/^(.*?\R)//o )
        {
          # get the current buffer line
            my $current_line = $1;

        # looking for a valid respone
            if ( $current_line !~ s/\s*\{(\d+)\}\R$//o )
            {
              # we only want "* XXX EXISTS" commands from the IMAP server, where XXX is the message sequence number
            # $last != 1 is to make sure this isn't the last EXISTS command after an EXPUNGE; not a new message senario
              if ( $current_line =~ s/EXISTS//g && $last != 1)
              {

                # we have to end the IDLE before we can get message information, otherwise the IMAP server will get angry
                $client->done($idle) or warn "Error from done: $@\n";

                #check the unseen_count; this is a precaution, because for some reason Gmail at times responds with a new message notifcation, but's it's really not.
                $msg_count = $client->unseen_count||0;

                if ($msg_count > 0)
                {

                  # grab the message sequence number from the string
                  $current_line =~ s/\D//g;
                  $my_ID = $current_line;
                  print "MID = " . $my_ID . "\n";

            # Email Data: Sender's address
              my $from = $client->get_header($my_ID, "From");
              $from =~ s/<[^>]*>//g; #strip the email, only display the sender's name

              # Email Data: Subject
            my $subject = $client->get_header($my_ID, "Subject");

              # Send event to Snarl
              my $winNM = Win32::Snarl::ShowMessage($from, $subject, $SNARL_disptime, $use_icon);

            # make sure we keep the seen flag unset so the message stays unread
                $client->unset_flag("Seen",$my_ID) or die "$0: Could not unset_flag: $@\n"; #

                # restart the IDLE
                $idle = $client->idle or warn "Couldn't idle: $@\n";
            print "IMAP now idle....waiting for email\n";

                next;
                }
                else
                {
                  $idle = $client->idle or warn "Couldn't idle: $@\n";
            print "IMAP now idle....waiting for email\n";
                }
              }
              else
              {
                # we had something other than EXISTS
                $last = 1;
              }
            }
        }
        $last = 0;
  }

  # kill the IDLE
  $client->done($idle) or warn "Error from done: $@\n";

  # Say bye
  $client->logout();
 }
 else
 {
  # ahh !@#$.
  print "Login failed.";
 }
{{< /codeblock >}}
