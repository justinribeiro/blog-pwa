#!/usr/bin/env python

__author__ = 'Justin Ribeiro <justin@justinribeiro.com>'

import os
import webapp2
import json
import re
import jinja2
import http2push as http2
import logging

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    comment_start_string="/////////+",
    comment_end_string="+/////////",
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
        self.response.headers['Referrer-Policy'] = 'no-referrer, strict-origin-when-cross-origin'
        self.response.headers['Content-Security-Policy'] = ("default-src 'none'; base-uri 'self'; "
                                                            "worker-src 'self'; "
                                                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.google-analytics.com https://www.gstatic.com; "
                                                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                                                            "connect-src 'self' https://storage.googleapis.com https://www.google-analytics.com https://firebaseinstallations.googleapis.com https://firebaseremoteconfig.googleapis.com https://firebaselogging.googleapis.com https://webmention.io/; "
                                                            "img-src 'self' data: https://storage.googleapis.com https://i.ytimg.com; "
                                                            "media-src 'self' https://storage.googleapis.com; "
                                                            "form-action 'self' https://webmention.io; "
                                                            "object-src 'none'; "
                                                            "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; "
                                                            "frame-src https://www.youtube.com; "
                                                            "manifest-src 'self'; "
                                                            "frame-ancestors 'none';")
        self.response.headers['Feature-Policy'] = ("accelerometer 'none'; "
                                                   "ambient-light-sensor 'none'; "
                                                   "autoplay 'self' https://www.youtube.com;"
                                                   "camera 'none'; "
                                                   "fullscreen 'self' https://www.youtube.com; "
                                                   "geolocation 'none'; "
                                                   "gyroscope 'none'; "
                                                   "magnetometer 'none'; "
                                                   "microphone 'none'; "
                                                   "midi 'none'; "
                                                   "payment 'none'; "
                                                   "picture-in-picture 'self' https://www.youtube.com; "
                                                   "speaker 'self'; "
                                                   "sync-xhr 'none'; "
                                                   "usb 'none'; "
                                                   "vibrate 'none'; "
                                                   "vr 'none';")
        self.response.headers['Expect-CT'] = 'max-age=0, report-uri="https://justinribeiro.report-uri.com/r/d/ct/reportOnly"'
        self.response.headers['Report-To'] = '{"group":"default","max_age":31536000,"endpoints":[{"url":"https://justinribeiro.report-uri.com/a/d/g"}],"include_subdomains":true}'
        self.response.headers['NEL'] = '{"report_to":"default","max_age":31536000,"include_subdomains":true}'
        self.response.headers['Origin-Trial'] = 'ArOMTDI8r1lGi6g/R/Ib61VmDtJuiTAUkI895IP0CgltkTDk5SjvBYerOXc8ubE5UHSAn4/50hX50Ltxv6TDzwAAAABqeyJvcmlnaW4iOiJodHRwczovL2p1c3RpbnJpYmVpcm8uY29tOjQ0MyIsImZlYXR1cmUiOiJDb250ZW50SW5kZXgiLCJleHBpcnkiOjE1ODc5OTQwODYsImlzU3ViZG9tYWluIjp0cnVlfQ=='

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
            'bingbot',
            'linkedinbot',
            'mediapartners-google',
            'mastodon',
            'ahrefsbot',
            'yandexbot',
            'msnbot',

            # why googlebot? Because the static representation is 1-to-1 and
            # easier for even new M70+ GoogleBot to parse
            'googlebot',
            'google-structured-data-testing-tool',

            # just because it's cool
            'lynx',

            # web mentions handlers
            'webmention',
            'node-fetch',
            'guzzle',
            'bridgy',
            'go-http-client',
            'ruby',
            'appengine-google',
            'xray'
        ]
        bot_list_search = '(?:%s)' % '|'.join(bot_list_hunt)

        # Fun fact: a lot of webmention tools don't set a user agent, which
        # causes this to die hard, so let's just work around it for now
        if self.request.headers.get('User-Agent') is None or re.search(bot_list_search, self.request.headers.get('User-Agent').lower()):
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

            if 'featureimage' in data:
                data['featureimage'] = unescape(data['featureimage'])

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

                # make our code-blocks render cleaner on old browsers that don't
                # support the CSS; bots generally don't care about this
                data['article'] = data['article'].replace('code-block', 'pre')

                if 'featureimage' in data:
                    data['featureimage'] = unescape(data['featureimage'])

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
