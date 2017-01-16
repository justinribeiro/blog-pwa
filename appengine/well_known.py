# Copyright 2015 Alex K (wtwf.com) All rights reserved.

"""Handler to set and serve .well-known stuff for letsencrypt.

Add this to your app.yaml:
- url: /.well-known/acme-challenge/.*
  script: well_known.app

Then you need to get the password from this url (for admins only):

http://example.com/.well-known/acme-challenge/

POST requests to /.well-known/acme-challenge/ with this json
{"password": "THEPASSWORD", "fact", "SOME_FACT.WITH_A_DOT"}
will establish a fact and return {"status": "success"}

Now GET requests to /.well-known/acme-challenge/SOME_FACT will return
SOME_FACT.WITH_A_DOT
*for a limited period only, memcache may expire, void where prohibited

Use this with https://github.com/arkarkark/letsencrypt-nosudo to automatically get your signed certs.

You can test it with this command:

curl -v -o - -H "Content-Type: application/json" -X POST -d \
  '{"fact":"xyz.abc","password":"THEPASSWORD"}' http://example.com/.well-known/acme-challenge/

open http://example.com/.well-known/acme-challenge/xyz
"""
__author__ = 'wtwf.com (Alex K)'

import json
import uuid

from google.appengine.api import memcache
from google.appengine.ext import ndb
from google.appengine.api import users
from google.appengine.ext import webapp

class WellKnownPassword(ndb.Model):
  password = ndb.StringProperty(required=True)

WELL_KNOWN_MEMCACHE_PREFIX = '/.well-known/acme-challenge/'

class WellKnownHandler(webapp.RequestHandler):

  def get(self, url):
    if url:
      ans = memcache.get(WELL_KNOWN_MEMCACHE_PREFIX + url)
      if ans is not None:
        self.response.out.write(ans)
      else:
        self.error(404)
    else:
      if not users.get_current_user():
        self.redirect(users.create_login_url(self.request.uri))
      else:
        if not users.is_current_user_admin():
          self.error(403)
        else:
          if WellKnownPassword.query().iter().has_next():
            password = WellKnownPassword.query().get().password
          else:
            password = str(uuid.uuid4())
            WellKnownPassword(password=password).put()
          self.response.out.write(password)

  def post(self, url):
    req = json.loads(self.request.body)

    wkp = WellKnownPassword.query().get()

    if not wkp:
      self.error(401)
    else:
      if req.get('password', '') != wkp.password:
        self.error(403)
      else:
        fact = req.get('fact', '')
        if not fact or '.' not in fact or len(fact) > 1000:
          self.error(400)
        else:
          memcache.set(WELL_KNOWN_MEMCACHE_PREFIX + fact.split(".")[0], fact)
          self.response.headers['Content-Type'] = 'text/json'
          self.response.out.write(json.dumps({"status": "success"}))


app = webapp.WSGIApplication([('/.well-known/acme-challenge/(.*)', WellKnownHandler)])