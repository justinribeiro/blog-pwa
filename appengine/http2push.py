#!/usr/bin/env python
#
# Copyright 2015 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

__author__ = 'Eric Bidelman <ebidel@>'

# Justin says: I've diced this up a lot, swapped a few things for Python 3.7,
# and it runs different than the Eric's version, so if you think this is
# copy-paste, you'd be mistaken.
#
# Buyer beware. There be dragons (and speed).

import logging
import json
import webapp2


PUSH_MANIFEST = 'push_manifest.json'

manifest_cache = {}  # filename -> list of push URL mapping.


def use_push_manifest(filename):
    global manifest_cache

    push_urls = {}

    # Read file only if it's not in memory.
    if filename in manifest_cache:
        push_urls = manifest_cache[filename]['push_urls']
    else:
        try:
            with open(filename) as f:
                push_urls = json.loads(f.read())

            manifest_cache[filename] = {'push_urls': push_urls}  # cache it.
        except IOError as e:
            logging.error("Error reading %s: %s" % (filename, e.strerror))

    return push_urls


class PushHandler(webapp2.RequestHandler):
    """Base handler for constructing Link rel=preload header."""

    push_urls = use_push_manifest(PUSH_MANIFEST)

    def _generate_link_preload_headers(self, urls=None):
        """Constructs a value for the Link: rel=preload header.

        The format of the preload header is described in the spec
        http://w3c.github.io/preload/:

          Link: <https://example.com/font.woff>; rel=preload; as=font

        Args:
            url: A list of urls to use in the header.

        Returns:
            A list of Link header values.
        """

        if urls is None:
            urls = self.push_urls

        host = self.request.host_url

        preload_links = []

        # Justin says: This is specific to the content path json file; it is
        # used by fetch() on the client, but we push the resource early so it
        # doesn't have to wait. Said resource must use as=fetch and have the
        # crossorigin set otherwise it'll dup in the browser
        json_target = '%s%s' % (host, str(self.name))
        preload_links.append(
            '<%s>; rel=preload; as=fetch; crossorigin=anonymous;' % json_target)

        for url, v in urls.items():
            # Construct absolute URLs per spec.
            url = '%s%s' % (host, str(url))
            t = str(v.get('type', ''))
            if len(t):
                # if you don't crossorigin these, they will not work
                preload_links.append(
                    '<%s>; rel=preload; as=%s; crossorigin=anonymous;' % (url, t))
            else:
                preload_links.append('<%s>; rel=preload' % url)

        headers = list(set(preload_links))  # remove duplicates

        # GAE supports single Link header.
        return ','.join(headers)
