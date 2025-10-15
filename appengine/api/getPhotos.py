#!/usr/bin/env python

__author__ = "Justin Ribeiro <justin@justinribeiro.com>"

import os
import re
import json
import time
import requests
from lib.baseHandler import BaseHandler

# Allowed CORS origins
ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "https://justinribeiro.com",
    "https://www.justinribeiro.com",
]
REGEX_ORIGIN = re.compile(r"https://.*justinribeiro-web\.appspot\.com")

# Mastodon API setup
MASTODON_API_URL = "https://ribeiro.social/api/v1/accounts/2/statuses"
ACCESS_TOKEN = os.getenv("ribeiroSocialAccessToken")  # from environment

# 2-hour cache
CACHE_TTL = 2 * 60 * 60  # seconds
_cache = {"data": None, "expires": 0}


class GetPhotosHandler(BaseHandler):
    """Handles /api/getPhotos requests (CORS, caching, Mastodon fetch)."""

    def options(self):
        """Handle preflight OPTIONS requests."""
        origin = self.request.headers.get("Origin")
        if origin and (origin in ALLOWED_ORIGINS or REGEX_ORIGIN.match(origin)):
            self.response.headers["Access-Control-Allow-Origin"] = origin

        self.response.headers["Access-Control-Allow-Methods"] = "GET"
        self.response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        self.response.headers["Access-Control-Max-Age"] = "3600"
        self.response.set_status(204)

    def get(self):
        origin = self.request.headers.get("Origin")
        if origin and (origin in ALLOWED_ORIGINS or REGEX_ORIGIN.match(origin)):
            self.response.headers["Access-Control-Allow-Origin"] = origin

        self.response.headers["Content-Type"] = "application/json"
        self.response.headers["Cache-Control"] = "public, max-age=7200"

        now = time.time()

        # ✅ Serve from cache if still valid
        if _cache["data"] and _cache["expires"] > now:
            self.logger.info("Cache hit for /api/getPhotos")
            self.response.write(json.dumps(_cache["data"]))
            return

        self.logger.info("Cache miss — fetching from Mastodon API")

        headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
        params = {
            "only_media": "true",
            "exclude_reblogs": "true",
            "exclude_replies": "true",
            "limit": 40,
        }

        try:
            resp = requests.get(
                MASTODON_API_URL, headers=headers, params=params, timeout=10
            )
            resp.raise_for_status()
            data = resp.json()
        except requests.RequestException as e:
            self.logger.error(f"Error fetching from Mastodon: {e}")
            self.response.set_status(500)
            self.response.write(json.dumps({"error": "Failed to fetch Mastodon data"}))
            return

        # ✅ Simplify response data
        crunched = []
        for item in data:
            media = item.get("media_attachments")
            if not media:
                continue

            crunched.append(
                {
                    "url": item.get("url"),
                    "content": re.sub(r"<[^>]*>", "", item.get("content", "")),
                    "media": media[0].get("preview_url") if media else None,
                }
            )

        crunched = crunched[:12]  # just in case

        # ✅ Cache it
        _cache["data"] = crunched
        _cache["expires"] = now + CACHE_TTL

        self.logger.info(f"Fetched {len(crunched)} items from Mastodon")

        self.response.write(json.dumps(crunched))
