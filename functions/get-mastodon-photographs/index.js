const Mastodon = require("mastodon-api");

const allowedOrigins = [
  "http://localhost:8081",
  "https://justinribeiro.com",
  "https://www.justinribeiro.com",
];
const regex = new RegExp("https://.*justinribeiro-web.appspot.com", "g");

const M = new Mastodon({
  // set a runtime env var in GCP to hide the token
  // https://cloud.google.com/functions/docs/configuring/env-var
  // secret is probably better, but this is just quicker/cheaper
  access_token: process.env.accessToken,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  api_url: "https://ribeiro.social/api/v1/", // optional, defaults to https://mastodon.social/api/v1/
});

// a simple data cache with no path matching (because I'm not param'ing this
// function for anything special). This is an old trick; the GCP docs allude to
// global variables in recycled envs, which is what this lives on:
// https://cloud.google.com/functions/docs/bestpractices/tips If it hits, great,
// if not, well, life goes on. 2 hours is good enough given my post frequency
const cache = {
  data: null,
  ttl: new Date(),
  store: function (data) {
    this.data = data;
    this.ttl = this.createTtl();
  },
  createTtl: function () {
    const newTtl = new Date();
    newTtl.setHours(newTtl.getHours() + 2);
    return newTtl;
  },
};

exports.photographs = async (req, res) => {
  const origin = req.get("origin");

  if (allowedOrigins.includes(origin) || regex.test(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    res.type("json");

    // 2 hours is good enough given my post frequency
    res.set("Cache-Control", "public, max-age=7200");

    if (cache.data && cache.ttl > new Date()) {
      return res.status(200).send(cache.data);
    }

    M.get("accounts/2/statuses", {
      only_media: true,
      exclude_reblogs: true,
      exclude_replies: true,
      limit: 9,
    }).then((resp) => {
      // crunch the big json to really only the things we're going to render in
      // the browser
      const crunched = resp.data
        .filter((item) => item.media_attachments.length > 0)
        .map((data) => {
          return {
            url: data.url,
            // strip the html out, since we're only going to use this as alt
            // text for the images
            content: data.content.replace(/<[^>]*>?/gm, ""),
            media: data.media_attachments.map((item) => item.url)[0],
          };
        })
        .slice(0, 9);

      cache.store(crunched);

      res.status(200).send(crunched);
    });
  }
};
