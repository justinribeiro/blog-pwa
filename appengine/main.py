#!/usr/bin/env python

__author__ = 'Justin Ribeiro <justin@justinribeiro.com>'

import os
import sys
import webapp2
import logging
import json
import re

from google.appengine.ext.webapp import template

import http2push as http2

def unescape(s):
  s = s.replace("&lt;", "<")
  s = s.replace("&gt;", ">")
  # this has to be last
  s = s.replace("&#34;", "\"")
  s = s.replace("&amp;", "&")
  return s

class MainHandler(http2.PushHandler):

  def get(self):

    bot_list_hunt = [
          "Slackbot",
          "facebookexternalhit",
          "Facebot",
          "Twitterbot",
          "developers\.google\.com\/\+\/web\/snippet\/",
          "LinkedInBot"
        ]
    bot_list_search = '(?:%s)' % '|'.join(bot_list_hunt)

    if re.search(bot_list_search, self.request.headers.get('User-Agent')):
      #
      # Are you a link bot? You don't need much, so I return you only the basics.
      # of the page metadata
      #
      # IMPORTANT NOTE: This does not generate for GoogleBot! Don't add it to
      # the list, this is a bad idea. GoogleBot will handle the PWA just fine.
      name = os.path.join(os.path.dirname(__file__), 'dist/data/',
        self.request.path.lstrip("/").replace("index.html", "")
        .replace("index.php", ""), 'index.json')
      f = open(name, 'r');
      c = f.read()
      f.close()

      # parse the read
      data = json.loads(c)

      # Grab our template
      bot_template = os.path.join(os.path.dirname(__file__),
        'dist/helpers/bots.html')

      # Send down the wire
      return self.response.write(template.render(bot_template, data))
    else:
      if self.request.get('static', default_value=False) is not False:
        #
        # Any URL with ?static=true passes through here and generates no
        # JavaScript for an end user PROGRESSIVE ALL THE THINGS
        #
        logging.debug('should return the static render, no pwa')

        # In this senario, I know that our root path data is always in
        # the index.json within the /data/ directory so it's only a
        # matter of open-and-pass
        name = os.path.join(os.path.dirname(__file__), 'dist/data/',
          self.request.path.lstrip("/").replace("index.html", "")
          .replace("index.php", ""), 'index.json')
        f = open(name, 'r');
        c = f.read()
        f.close()

        # parse the read
        data = json.loads(c)

        # save our html
        data['article'] = unescape(data['article'])

        # Grab our template
        static_template = os.path.join(os.path.dirname(__file__),
          'dist/helpers/static.html')

        # Send down the wire
        return self.response.write(template.render(static_template, data))
      else:
        #
        # All traffic initially starts here: ideally, they get the PWA
        # but in the event they have no javascript enabled, we have a
        # failsafe by injecting the route into <noscript> and then push
        # to the static handler to generate a non-JavaScript page.
        #

        # I make what's probably a untested assumption and only set the
        # push resources in the event the PWA comes into play
        #push = os.path.join(os.path.dirname(__file__), 'dist/push_manifest.json')
        #self.push_urls = http2.use_push_manifest(push)
        #header = self._generate_link_preload_headers()
        #self.response.headers.add_header('Link', header)

        # Retarget our noscript
        # We chop the URL params for safety and add static param
        data = {
            'noscript': self.request.path + '?static=true',
            }

        # Grab our template
        pwa_template = os.path.join(os.path.dirname(__file__),
          'dist/index.html')

        # Send down the wire
        return self.response.write(template.render(pwa_template, data))

app = webapp2.WSGIApplication([
    ('/.*', MainHandler)
], debug=True)