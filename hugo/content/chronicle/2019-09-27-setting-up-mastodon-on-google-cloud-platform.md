---
title: "Setting Up Mastodon on Google Cloud Platform"
description: "Setting up Mastodon on Google Cloud Platform has been on my list of things to do for a while. Recent life events were a tipping point, so off I went into the wonderful world of my own social network."
date: 2019-09-27T12:24:05-07:00
tags:
- Web
---

Setting up Mastodon on Google Cloud Platform has been on my list of things to do for a while. Recent life events (which I will not get into here) were a tipping point, so off I went into the wonderful world of my own social network (which currently is live at [ribeiro.social/@justin](http://ribeiro.social/@justin)).

> Note: this is what I consider the "friends and family" edition. If I wanted more scale, I'd do this in Kubernetes (which I may do anyhow, just because).

I wanted something a little more robust then a single server setup which I find too brittle, so I settled on:

1. Media stored on Google Cloud Storage.
2. Database on Google Cloud SQL.
3. DNS on Google DNS
4. Email on Mailgun.

Seemed reasonable enough, and when I finally decide to wrap all this in Docker, I won't have to shuffle the large bits around. Let's build us a Mastodon instance!

## Setting up the DNS

One might wonder why we're setting this up first, since we don't have anything to point it to yet. The reason is mostly because we need the domain sorted on Cloud DNS so that we can setup Mailgun, which we need to setup Mastodon during the configuration phase.

First things first: you should probably have a domain name. I settled on [ribeiro.social](https://ribeiro.social) because I am super creative. Once you have your domain name of choice, it's time to run some steps:

1. Go to [Google Cloud DNS](https://console.cloud.google.com/net-services/dns/zones) within the console.
2. Click "Create Zone".
3. Making sure it's public, fill in the relevant information (you can enable DNSSEC if you'd like to set that up too), and click "Create".
4. You now have a zone and some name servers. Take the name servers noted and make sure to update them on your domain name provider.

Fantastic! You're on your way. While those name servers are populating around the globe, let's get Mailgun up and running.

## Setting up the email

[Mailgun](https://www.mailgun.com) has always touted itself as an email service for developers and I've always found incredibly useful in client projects, so I'm recommending it for this limited task. One reason is that based on the limited need for email, we're not going to break the free tier quota.

1. [Get yourself an account](https://signup.mailgun.com/) and login.
2. We need to setup our domain. [Sending > Domains > Add New Domain](https://app.mailgun.com/app/sending/domains)
3. Input the needed domain name (usually mg.yourdomain.com or some such).
4. Make sure you select "Create DKIM Authority". 1024 is easier to deal with, but you can use 2048 as well.
5. Click "Add Domain".
6. You will be shown a set of domain records we need to add to our DNS.

How you proceed from here is up to you: you can add those records via [Google Cloud DNS](https://console.cloud.google.com/net-services/dns/zones) panel or you can use the command line `gcloud dns record-sets transaction` ([quickstart](https://cloud.google.com/dns/records/), [docs](https://cloud.google.com/sdk/gcloud/reference/dns/record-sets/transaction/)).

> Note: the biggest hurdle you will find when doing creating the TXT records within the Cloud Console is the "Warning: A record for this domain has whitespace but is not a "quoted string"". This also happens with 2048 DKIM strings, which won't save when clicking "Create". The trick is to simply break the string into 255 character lines and wrap them with quotes. I know what you're thinking: "that is not intuitive". Yes, I agree.

Once you've got those records saved, it's now time to wait for those records to propogate. With Cloud DNS, this happens pretty quick (one reason I like Cloud DNS). But while that verification of record is happening on Mailgun, let's get our storage setup.

## Setting up Google Cloud Storage

I just don't like all the images tied to a single instance, so storing them in multi-region buckets sounds like a good idea.

1. Go to the [Google Cloud Storage Browser](https://console.cloud.google.com/storage/browser).
2. Click "Create Bucket".
3. Follow the steps in the nifty wizard (I set mine to multi-region, standard storage class)
4. Make sure Google-managed key is selected.
5. Click "Create".
6. This will spin up a bucket but we're not done yet. We're going to need API keys to access and store things on this bucket.
7. Go to [Storage > Settings](https://console.cloud.google.com/storage/settings).
8. Click "Interoperability".
9. Find the section "Access keys for service accounts".
10. Click "Create a New Key" button.
11. Select an existing service account or create a new one (I opted to create a new one specific for this project)
12. Once it generates a an Access Key and Secret, copy them somewhere safe (it won't show you the secret again).

Why do we need these keys? This gives us AWS S3 compatibility mode, which we need to use for the Mastodon. Now that we have storage, let's setup the database.

## Setting up Google Cloud SQL

Similar to storage, I'm just not a fan of having to deal with a database on a single box. So let's fire up PostgreSQL on Google Cloud SQL.

1. Go to the [Google Cloud Platform instances](https://console.cloud.google.com/sql/instances)
2. Click "Create Instance".
3. Select "PostgreSQL".
4. On the "Create a PostgreSQL instance" screen, set the relevent information, noting your generated password for the postgres user.
5. Next, click "Show configuration options".
6. Click "Machine type and storage" section.
7. For the machine type, you can actually drag the slider left, showing "1 shared vCPU" and a warning about this type being used for development. For my small instance, this works fine and saves some money, you can decide for yourself which works best for you. I also took the defaults for 614MB of RAM and 10GB SSD
8. After you fill in all the information, click "Create".

Alright, we have a database server. Let's setup our Mastodon instance.

## Setting up a Google Compute Instance

We need a place to run Mastodon, and while I would normally just spin this in a container, I wanted to play around the internals a little bit so I opted for just a regular old Compute VM.

1. Go to [Google Compute Engine instances](https://console.cloud.google.com/compute/instances)
2. Click "Create Instance".
3. I set this up initially this up on a g1-small, but found that to be a rather slow build experience. I'd recommend at least an n1-standard-1 to start and then just size down later if you so please.
4. In the "Firewall" section, make sure to check allow HTTP and HTTPS traffic.
5. Click "Create".
6. Once created and assigned an IP, make sure to make that IP static so that we can point our domain at it via the [External IP addresses](https://console.cloud.google.com/networking/addresses/list).
7. Once you have that IP address, make sure to create an A record in your DNS zone in [Google Cloud DNS](https://console.cloud.google.com/net-services/dns/zones).

With the machine up and running, connect via SSH (use the "SSH" dropdown next the VM for options that fit your needs). Keep that window or terminal open, we'll come back to it in a second.

## Google Cloud SQL Network setup

Now that we have an IP address for our Compute instance, we need to actually use this IP and tell our PostgreSQL instance to let it access it. This is because I wasn't keen to setup a VPC for this, but if you want to, more power to you.

1. Go to [Google Cloud Platform instances](https://console.cloud.google.com/sql/instances).
2. Select your instance.
3. Click "Edit".
4. In the "Connectivity" section, select "Public IP" and click "Add Network". Put in the External Network IP from your compute instance.

Great, we'll need this in a bit. Let's head back to our SSH session with our Compute instance.

## Setting up prerequisite software

Okay, so now you're staring at this command prompt. We have many things to install.

1. Install Node.
{{< codeblock lang="bash" >}}
jdr@rsms:~$ curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
{{< /codeblock >}}
2. Install Yarn.
{{< codeblock lang="bash" >}}
jdr@rsms:~$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
jdr@rsms:~$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
jdr@rsms:~$ sudo apt-get update && sudo apt-get install yarn
{{< /codeblock >}}
3. Install a whole lot of dependencies. It took me a little digging to reconcile this list from various sources, but it works okay so we're going to roll with it.
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo apt install imagemagick ffmpeg libpq-dev libxml2-dev libxslt1-dev file git-core g++ libprotobuf-dev protobuf-compiler pkg-config nodejs gcc autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm3 libgdbm-dev nginx redis-server redis-tools postgresql postgresql-contrib letsencrypt yarn libidn11-dev libicu-dev
{{< /codeblock >}}
4. Now let's set up our user account where all this is going to live.
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo adduser mastodon
{{< /codeblock >}}

Now let's switch over to our new user, and setup some more.

## Setting up the mastodon user

1. Switch over to the user.
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo su - mastodon
{{< /codeblock >}}
2. Setup the Ruby environment variables.
{{< codeblock lang="bash" >}}
mastodon@rsms:~$ git clone https://github.com/rbenv/rbenv.git ~/.rbenv
mastodon@rsms:~$ cd ~/.rbenv && src/configure && make -C src
mastodon@rsms:~$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
mastodon@rsms:~$ echo 'eval "$(rbenv init -)"' >> ~/.bashrc
{{< /codeblock >}}
3. Log out of the user and log back in so our env variables can take effect.
{{< codeblock lang="bash" >}}
mastodon@rsms:~$ exit
jdr@rsms:~$ sudo adduser mastodon
{{< /codeblock >}}
4. Verify that rbenv is a function.
{{< codeblock lang="bash" >}}
mastodon@rsms:~$ type rbenv
rbenv is a function
rbenv ()
{
    local command;
    command="${1:-}";
    if [ "$#" -gt 0 ]; then
        shift;
    fi;
    case "$command" in
        rehash | shell)
            eval "$(rbenv "sh-$command" "$@")"
        ;;
        *)
            command rbenv "$command" "$@"
        ;;
    esac
}
{{< /codeblock >}}
5. Now let's build Ruby.
{{< codeblock lang="bash" >}}
mastodon@rsms:~$ git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
mastodon@rsms:~$ rbenv install 2.6.1
mastodon@rsms:~$ rbenv global 2.6.1
{{< /codeblock >}}

Once that finishes compiling, we move on to install Mastodon.

## Installing Mastodon

1. Clone Mastodon via git into a folder we'll call `live`.
{{< codeblock lang="bash" >}}
mastodon@rsms:~$ git clone https://github.com/tootsuite/mastodon.git live
mastodon@rsms:~$ cd live
{{< /codeblock >}}
2. Get the latest stable tag:
{{< codeblock lang="bash" >}}
mastodon@rsms:~/live$ git checkout $(git tag -l | grep -v 'rc[0-9]*$' | sort -V | tail -n 1)
{{< /codeblock >}}
3. Install the required Mastodon dependencies.
{{< codeblock lang="bash" >}}
mastodon@rsms:~/live$ gem install bundler
mastodon@rsms:~/live$ bundle install -j$(getconf _NPROCESSORS_ONLN) --deployment --without development test
mastodon@rsms:~/live$ yarn install --pure-lockfile
{{< /codeblock >}}

Go ahead and exit the mastodon user and let's head back to root and setup the web server.

## Setting up nginx

Setting up nginx seems hard, but this pretty much a copy, replace-some-words, paste job.

1. As the root user, we're going to copy the nginx.conf to example.com.conf (replacing the example.com portion):
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo cp /home/mastodon/live/dist/nginx.conf /etc/nginx/sites-available/example.com.conf
{{< /codeblock >}}
2. Now we have to edit this file, replacing example.com where appropriate:
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo sed -i 's/example.com/yourdomain.com/g' /etc/nginx/sites-available/example.com.conf
{{< /codeblock >}}
3. Enable the new configuration so the site will run:
{{< codeblock lang="bash" >}}
jdr@rsms:~$ cd /etc/nginx/sites-enabled
jdr@rsms:~$ sudo ln -s ../sites-available/example.com.conf
{{< /codeblock >}}

Now let's get some certs with Let's Encrypt.

## Setting up Let's Encrypt

The amount of joy I have for Let's Encrypt knows no bounds.

1. With the previous setup, nginx will error out because it can't find the cert, so we need to sotp nginx for a second.
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo systemctl stop nginx
{{< /codeblock >}}
2. Now, let's start the certbot up in standalone mode to get the cert:
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo letsencrypt certonly --standalone -d example.com
{{< /codeblock >}}
3. Once the bot finishes and generates the required certs, restart nginx:
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo systemctl start nginx
{{< /codeblock >}}
4. Now, this seems counterintuitive, but we need to get the cert again, this time with some additional settings, included pointing to our working directory for the challenge.
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo letsencrypt certonly --webroot -d example.com -w /home/mastodon/live/public/
{{< /codeblock >}}
5. You'll be prompted by certbot to either keep the cert or renew/replace. Select option 2.
6. Boom, we have cert. Now let's make sure it always updates via cron. I'm a fan of the monthly run (though some folks like the weekly to be safer). User choice.
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo vim /etc/cron.monthly/renew-cert
{{< /codeblock >}}
7. Copy and paste the little snippet below into said file and save said file (:wq):
{{< codeblock lang="bash" >}}
#!/usr/bin/env bash
letsencrypt renew
systemctl reload nginx
{{< /codeblock >}}
8. Make sure it's got an exec attr on it so it'll run:
{{< codeblock lang="bash" >}}
#!/usr/bin/env bash
jdr@rsms:~$ sudo chmod +x /etc/cron.monthly/renew-cert
{{< /codeblock >}}
9. Restart cron:
{{< codeblock lang="bash" >}}
#!/usr/bin/env bash
jdr@rsms:~$ sudo systemctl restart cron
{{< /codeblock >}}

## Generating the .env.production file

At this point, it's time to take all the above setup and put it to work.

1. Login to the mastodon user.
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo su - mastodon
{{< /codeblock >}}
2. Start the setup.
{{< codeblock lang="bash" >}}
mastodon@rsms:~$ cd live
mastodon@rsms:~/live$ RAILS_ENV=production bundle exec rake mastodon:setup
{{< /codeblock >}}
3. Now we start answering questions.
4. At some point, you'll be asked "PostgreSQL host": this is the IP address of your Cloud SQL Instance.
{{< codeblock lang="bash" >}}
PostgreSQL host: YOUR_CLOUD_SQL_IP_HERE
PostgreSQL port: 5432
Name of PostgreSQL database: postgres
Name of PostgreSQL user: postgres
Password of PostgreSQL user: YOUR_CLOUD_SQL_USER_PASSWORD_HERE
Database configuration works! 🎆
{{< /codeblock >}}
5. The next step will ask for Redis; we're not hosting this ourselves, so just take the default values.
6. Next, you'll come to the "Do you want to store uploaded files on the cloud?". Answer yes.
7. For the provider, you're going to select "Minio".
8. Next, it's time to enter in our Google Storage details:
{{< codeblock lang="bash" >}}
Minio endpoint URL: https://storage.googleapis.com
Minio bucket name: YOUR_GOOGLE_CLOUD_BUCKET_NAME
Minio access key: YOUR_GOOGLE_CLOUD_BUCKET_ACCESS_KEY
Minio secret key: YOUR_GOOGLE_CLOUD_BUCKET_SECRET_KEY
Do you want to access the uploaded files from your own domain? no
{{< /codeblock >}}
9. Next, it's time input our Mailgun information:
{{< codeblock lang="bash" >}}
SMTP server: smtp.mailgun.org
SMTP port: 2525
SMTP username: YOUR_MAILGUN_SMTP_USER
SMTP password: YOUR_MAILGUN_SMTP_USER_PASSWORD
SMTP authentication: plain
SMTP OpenSSL verify mode: none
E-mail address to send e-mails "from": mastodon@example.com
Send a test e-mail with this configuration right now? Yes
Send test e-mail to: YOUR_EMAIL_ADDRESS
{{< /codeblock >}}
10. Great! Continue answering questions until you finish the setup. Once complete, we have to add the following line to our `.env.production`:
{{< codeblock lang="bash" >}}
S3_SIGNATURE_VERSION=s3
{{< /codeblock >}}
11. Back up the .env.production for safe keeping!

## Setup systemd

1. Make sure you're the root user
2. Copy the systemd service templates from the Mastodon directory:
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo cp /home/mastodon/live/dist/mastodon-*.service /etc/systemd/system/
{{< /codeblock >}}
3. Three files will be copied; edit them to make sure all the paths are correct (they should be):
{{< codeblock lang="bash" >}}
/etc/systemd/system/mastodon-web.service
/etc/systemd/system/mastodon-sidekiq.service
/etc/systemd/system/mastodon-streaming.service
{{< /codeblock >}}
4. If everything looks good, start the services:
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo systemctl start mastodon-web mastodon-sidekiq mastodon-streaming
jdr@rsms:~$ sudo systemctl enable mastodon-*
{{< /codeblock >}}

## Your fancy new social network lives

If everything went according to plan, you should be up and running live on your domain! If something went bump, crash, explosion, you'll have to dig into the [Mastodon Installation Guide](https://docs.joinmastodon.org/administration/installation/) (of which a lot of this is covered in there).

## Tiny details

1. You can do is stop the local PostgreSQL service on the Compute instance from running:
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo systemctl stop postgresql.service
jdr@rsms:~$ sudo systemctl disable postgresql.service
{{< /codeblock >}}
2. If you're only ever going to run production mode, you can make using `tootctl` easier by setting the rails env:
{{< codeblock lang="bash" >}}
jdr@rsms:~$ sudo su - mastodon
mastodon@rsms:~$ echo "export RAILS_ENV=production" >> ~/.bashrc
{{< /codeblock >}}
3. "What about Redis?" Per the Mastodon docs, if you lose Redis on a crash, it's not the end of the world. As long as you back up the database, the .env.production file, and keep the cloud storage in ship-shape, we're golden.
