#!/usr/bin/env python

__author__ = 'Justin Ribeiro <justin@justinribeiro.com>'

import os
import webapp2
import json
import re
import jinja2
import http2push as http2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


def unescape(s):
    s = s.replace("&lt;", "<")
    s = s.replace("&gt;", ">")
    # this has to be last
    s = s.replace("&#34;", "\"")
    s = s.replace("&amp;", "&")
    return s


class MainHandler(http2.PushHandler):

    def get(self):
        self.response.headers['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains; preload'
        self.response.headers['X-Frame-Options'] = 'DENY'
        self.response.headers['X-XSS-Protection'] = '1; mode=block'
        self.response.headers['X-Content-Type-Options'] = 'nosniff'
        self.response.headers['Referrer-Policy'] = 'no-referrer, strct-origin-when-cross-origin'
        self.response.headers['Content-Security-Policy'] = 'default-src \'none\'; base-uri \'self\'; worker-src \'self\'; script-src \'self\' \'unsafe-eval\' \'unsafe-inline\' blob: https://www.google-analytics.com https://www.gstatic.com; style-src \'self\' \'unsafe-inline\'; connect-src \'self\' https://storage.googleapis.com https://www.google-analytics.com https://firebaseinstallations.googleapis.com https://firebaseremoteconfig.googleapis.com https://firebaselogging.googleapis.com; img-src \'self\' https://storage.googleapis.com; media-src \'self\' https://storage.googleapis.com; form-action \'none\'; object-src \'none\'; font-src \'none\'; frame-src https://www.youtube.com/; manifest-src \'self\'; frame-ancestors \'none\';'

        # this list is a little of a cross-mix of bots and a few browsers that
        # can just skip the progressive checks (ala lynx). I've done this to
        # just make the experience a little nicer
        bot_list_hunt = [
            'W3C_Validator',
            'baiduspider',
            'bingbot',
            'embedly',
            'facebookexternalhit',
            'linkedinbot',
            'outbrain',
            'pinterest',
            'quora\ link\ preview',
            'rogerbot',
            'showyoubot',
            'slackbot',
            'twitterbot',
            'vkShare',
            'googlebot',
            'google-structured-data-testing-tool',
            'bingbot',
            'linkedinbot',
            'mediapartners-google',
            'mastodon',
            'lynx',
        ]
        bot_list_search = '(?:%s)' % '|'.join(bot_list_hunt)

        if re.search(bot_list_search, self.request.headers.get('User-Agent').lower()):
            #
            # Are you a bot that doesn't handle JavaScript well? Good news! I
            # have dynamic rendering just for you!
            #
            # More info:
            # https://developers.google.com/search/docs/guides/dynamic-rendering
            #
            name = os.path.join(os.path.dirname(__file__), 'dist/data/',
                                self.request.path.lstrip(
                "/").replace("index.html", "")
                .replace("index.php", ""), 'index.json')
            f = open(name, 'r')
            c = f.read()
            f.close()

            # parse the read
            data = json.loads(c)

            # save our html
            data['article'] = unescape(data['article'])

            # make our code-blocks render cleaner on old browsers that don't
            # support the CSS; bots generally don't care about this
            data['article'] = data['article'].replace('code-block', 'pre')

            # Grab our template
            static_template = JINJA_ENVIRONMENT.get_template(
                'dist/helpers/static.html')

            # Send down the wire
            return self.response.write(static_template.render(data))
        else:
            if self.request.get('static', default_value=False) is not False:
                # Any URL with ?static=true passes through here and generates no
                # JavaScript for an end user PROGRESSIVE ALL THE THINGS
                #
                # In this scenario, I know that our root path data is always in
                # the index.json within the /data/ directory so it's only a
                # matter of open-and-pass
                name = os.path.join(os.path.dirname(__file__), 'dist/data/',
                                    self.request.path.lstrip(
                    "/").replace("index.html", "")
                    .replace("index.php", ""), 'index.json')
                f = open(name, 'r')
                c = f.read()
                f.close()

                # parse the read
                data = json.loads(c)

                # save our html
                data['article'] = unescape(data['article'])

                # Grab our template
                static_template = JINJA_ENVIRONMENT.get_template(
                    'dist/helpers/static.html')

                # Send down the wire
                return self.response.write(static_template.render(data))
            else:
                #
                # All traffic initially starts here: ideally, they get the PWA
                # but in the event they have no javascript enabled, we have a
                # failsafe by injecting the route into <noscript> and then push
                # to the static handler to generate a non-JavaScript page.
                #

                # we set self.name so we can push the needed json faster
                self.name = os.path.join('/data/',
                                         self.request.path.lstrip(
                                             "/").replace("index.html", "")
                                         .replace("index.php", ""), 'index.json')
                push = os.path.join(os.path.dirname(
                    __file__), 'dist/push_manifest.json')
                self.push_urls = http2.use_push_manifest(push)
                header = self._generate_link_preload_headers()
                self.response.headers.add_header('Link', header)

                # Retarget our noscript
                # We chop the URL params for safety and add static param
                data = {
                    'noscript': self.request.path + '?static=true',
                }

                # Grab our template
                pwa_template = JINJA_ENVIRONMENT.get_template(
                    'dist/index.html')

                # Send down the wire
                return self.response.write(pwa_template.render(data))


app = webapp2.WSGIApplication([
    ('/.*', MainHandler)
], debug=True)
