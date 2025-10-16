#!/usr/bin/env python

__author__ = "Justin Ribeiro <justin@justinribeiro.com>"

import os
import re
import json
import time
import requests
from lib.baseHandler import BaseHandler  # ✅ same as other handlers

# YouTube Data API config
YOUTUBE_API_KEY = os.getenv("youtubeAccessToken")
YOUTUBE_CHANNEL_ID = "UCrexR0isiEYwsK2ZWiJ_GIw"
YOUTUBE_API_URL = "https://youtube.googleapis.com/youtube/v3/search"

# 2-hour cache
CACHE_TTL = 2 * 60 * 60  # seconds
_cache = {"data": None, "expires": 0}


class GetVideosHandler(BaseHandler):
    """Handles /api/getVideos requests."""

    def get(self):
        self.response.headers["Content-Type"] = "application/json"
        self.response.headers["Cache-Control"] = "public, max-age=7200"

        now = time.time()

        # ✅ Serve from cache if available
        if _cache["data"] and _cache["expires"] > now:
            self.logger.info("Cache hit for /api/getVideos")
            self.response.write(json.dumps(_cache["data"]))
            return

        self.logger.info("Cache miss — fetching latest YouTube videos")

        params = {
            "part": "snippet,id",
            "channelId": YOUTUBE_CHANNEL_ID,
            "maxResults": 12,
            "order": "date",
            "key": YOUTUBE_API_KEY,
        }

        try:
            resp = requests.get(YOUTUBE_API_URL, params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()
        except requests.RequestException as e:
            self.logger.error(f"Error fetching from YouTube API: {e}")
            self.response.set_status(500)
            self.response.write(json.dumps({"error": "Failed to fetch YouTube data"}))
            return

        # ✅ Map data to lightweight structure
        items = data.get("items", [])
        video_list = []

        for item in items:
            video_id = item.get("id", {}).get("videoId")
            snippet = item.get("snippet", {})
            title = snippet.get("title", "")
            if video_id:
                video_list.append({"id": video_id, "title": title})

        # ✅ Cache result
        _cache["data"] = video_list
        _cache["expires"] = now + CACHE_TTL

        self.logger.info(f"Fetched {len(video_list)} videos from YouTube")

        self.response.write(json.dumps(video_list))
