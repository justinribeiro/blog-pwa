const fetch = require("node-fetch");

exports.links = async (req, res) => {
  const allowedOrigins = [
    "http://localhost:8081",
    "https://justinribeiro.com",
    "https://www.justinribeiro.com",
  ];
  const regex = new RegExp("https://.*justinribeiro-web.appspot.com", "g");
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

    const count = req.query.count || 40;
    const fetchFromURL = async () =>
      await (
        await fetch(
          `https://feeds.pinboard.in/json/v1/u:justinribeiro/?count=${count}`
        )
      ).json();

    fetchFromURL().then((data) => {
      res.status(200).send(data);
    });
  }
};
