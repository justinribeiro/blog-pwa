---
tags:
- perl
- Snarl
- releases
- script
date: 2010-11-19T00:00:00Z
description: Short tutorial on how to run idlemailcheck on Windows with Snarl notifications.
title: Installing the environment to run idlemailcheck in Windows
url: /chronicle/2010/11/19/installing-the-environment-to-run-idlemailcheck-in-windows/
---

NOTE: I've released v0.0.3 of the script so that it works with v3.25 of Mail::IMAPClient. <a href="http://code.google.com/p/idlemailcheck/downloads/list">Get it at Google Code</a>.

I've been getting this question a lot recently, so I thought I would address it. How exactly do you run the my idlemailcheck perl script in Windows?

## Step 1: Install Snarl

For the popups to work, you have to install <a href="http://www.fullphat.net/index.php">Snarl</a>. Download, install, go to step 2.

## Step 2: Install Perl with Cygwin

My chosen way to use perl on Windows is via <a href="http://www.cygwin.com/">Cygwin</a>.  Download and run the installer, the installer will download the proper packages to setup the environment (which last time I checked, by default installs perl).  If you want to be sure that it is going to install perl, see screenshot below.

<img src="/images/blog/2010/11/screenshot-20101119-cygwin-install.png" alt="Cygwin package install selection screen">

## Step 2: Get to your command line
Once Cygwin is finished installing, you'll have some new shortcuts in your Start Menu.  Open "Cygwin Bash Shell" and you'll end up with a command line window.  This is the shell we'll be using to install the rest of the needed modules and run our script.

Side Note: Yes, you can use rxvt.exe / terminal if you like (you have that option).  I'm just trying to keep it simple people.  For those that want something different, I use the following to fire up a terminal:

{{< codeblock lang="bash" >}}
rxvt.exe -geometry 110x50+70+50 -sr -sl 10000 -fg white -bg black -fn 14-Consolas -tn cygwin -e \/bin\/bash --login -i
{{< /codeblock >}}

## Step 3: Install Perl modules

Installing perl modules boils down to the following three commands:

{{< codeblock lang="bash" >}}
perl -MCPAN -e 'install Win32::Snarl'
perl -MCPAN -e 'force install IO::Socket::SSL'
perl -MCPAN -e 'install Mail::IMAPClient'
{{< /codeblock >}}

This will install the three modules that you need to make the idlemailcheck work.  In the screenshot below, you can see what the commands look like after they run when the modules have been installed. Note, when you actually install a module for the first time, the output can be quite long as it builds.

<img src="/images/blog/2010/11/screenshot-20101119-modules-install.png" alt="Install commands for perl modules">

## Step 4: Edit Perl script

Download version 0.0.3 of the script from <a href="http://code.google.com/p/idlemailcheck/downloads/list">Google Code</a> and unzip the script and image to some place you'll know where to find it (example, your Cygwin home directory).  Open the idlemailcheck.pl script, edit the login details for you account.

## Step 4: Run the Perl script

At the very least, test the script to check your login details by running this command.

{{< codeblock lang="bash" >}}
perl idlemailcheck.pl
{{< /codeblock >}}

If that worked fine, then hit ctrl-c (that will kill the script) and then if you do not wish to keep the Cygwin command prompt open, you can run:

{{< codeblock lang="bash" >}}
perl idlemailcheck.pl &
{{< /codeblock >}}

From there on out, the script will run until either errors out or something else happens.  Need to kill it?  Use the kill command against the PID that was returned.  Don't remember the PID?  Find it via:

{{< codeblock lang="bash" >}}
ps -as | grep perl
{{< /codeblock >}}

See screenshot below for entire chain of events.

<img src="/images/blog/2010/11/screenshot-20101119-runscript.png" alt="Running the script in various forms">

## Step 5: All done
That's pretty much it.  If you did all of the above steps without running into any trouble, you should be up and running.  Cheers!
