const fetch = require("node-fetch");

const allowedOrigins = [
  "http://localhost:8081",
  "https://justinribeiro.com",
  "https://www.justinribeiro.com",
];
const regex = new RegExp("https://.*justinribeiro-web.appspot.com", "g");

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

exports.links = async (req, res) => {
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

    const count = req.query.count || 40;
    const fetchFromURL = async () =>
      await (
        await fetch(
          `https://feeds.pinboard.in/json/v1/u:justinribeiro/?count=${count}`
        )
      ).json();

    fetchFromURL().then((data) => {
      cache.store(data);
      res.status(200).send(data);
    });
  }
};
