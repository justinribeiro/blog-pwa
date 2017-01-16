---
categories:
- sql
- wordpress
date: 2014-03-04T00:00:00Z
tags: []
title: Creating 301 redirects for Wordpress via SQL
url: /chronicle/2014/03/04/creating-301-redirects-for-wordpress-via-sql/
---

I've gotten a lot of "move my site" requests lately. Friends, clients, you name it. Everyone seems to want to move their site somewhere else for reasons untold.

A few of those instances are the move-my-Wordpress-setup, which on the surface doesn't sound hard. Then you realize the domain is changing. Then you realize they have a different permalink scheme. Then you here the words why don't the old bookmarks work and...well, we all know where this goes.

To help elivate this, I wrote a quick little SQL script that you can run against an existing Wordpress install that will help generate mod_rewrite rules. In the scripts case, it generates 301 permenatly moved redirects, but you could seemily modifiy it to your hearts content to do as you wish.

{% gist 9276714 %}

That script will generate a column full of data that looks like (sans the wrapping):

```
RewriteCond %{HTTP_HOST} ^blog.olddomain.example$ [NC]
RewriteCond %{QUERY_STRING}  ^$
RewriteRule ^/2013/10/22/justins-contextual-google-glass-development/$ http://www.mynewblog.example/blog/2013/10/22/justins-contextual-google-glass-development/? [R=301,NE,NC,L]
```

I didn't use this script on my blog (which I recently switched over to App Engine and my Git + Hyde + Jeykll setup), but I did use it on our corporate blog at Stickman, as well as a half dozen other sites in the last month. Comes in mighty handy.
