---
categories:
- wordpress
- sftp
- jail
date: 2014-04-02T00:00:00Z
title: Steps to setup Wordpress in a SFTP jail
url: /chronicle/2014/04/02/steps-to-setup-wordpress-in-sftp-jail/
---

I have a few servers that I once in a while have to drop a Wordpress install on where folks need access. Given that more access generally leads to people confused I always set them up in a jail. This usually requires that I pull up my zsh history and run through the song and dance. I could automate it, but it's one of those tasks that I'd spend more time writing a script then just punching in some quick commands.

1. Setup a group that'll be assigned to users that need a jail in sshd_config. This is one of those things I only do once when I fire up and instance.

{{< codeblock lang="bash" >}}
Match Group sftponly
  ChrootDirectory /home/%u
  ForceCommand internal-sftp
  AllowTcpForwarding no
{{< /codeblock >}}

2. Let's do some user ops.

{{< codeblock lang="bash" >}}
➜  ~  useradd $USER
➜  ~  passwd $USER
➜  ~  usermod -aG sftponly $USER
{{< /codeblock >}}

3. Setup our jailed home directory

{{< codeblock lang="bash" >}}
➜  ~  sudo -u $USER mkdir -pv /home/$USER/my.awesome.domain.something
➜  ~  chown root. /home/$USER
➜  ~  chmod 755 /home/$USER
➜  ~  chgrp -R $USER /home/$USER
{{< /codeblock >}}

4. Ditch the shell

{{< codeblock lang="bash" >}}
➜  ~  usermod -s /bin/false $USER

{{< /codeblock >}}

5. Pull Wordpress and unpack

{{< codeblock lang="bash" >}}
➜  ~  cd /home/$USER/my.awesome.domain.something
➜  ~  wget http://wordpress.org/latest.tar.gz
➜  ~  tar zxf latest.tar.gz
➜  ~  mv wordpress/* .
➜  ~  rm -rf wordpress/

{{< /codeblock >}}

6. Setup Wordpress with the usual config (wp-config dance, pull plugins, et cetera).

7. Add said new server block to nginx

{{< codeblock lang="bash" >}}
server {
  server_name my.awesome.domain.something;
  access_log logs/my.awesome.domain.something.access.log main;
 
  root home/$USER/my.awesome.domain.something;
}
{{< /codeblock >}}

8. Add user to sshd_config

9. Lock down Wordpress

{{< codeblock lang="bash" >}}
➜  ~  find . -type d -exec chmod 755 {} \;
➜  ~  find . -type f -exec chmod 644 {} \;
{{< /codeblock >}}

And so completes a fast and furios Wordpress setup in a jail. User happy, me reasonably happy, on to other coding things.