const Mastodon = require("mastodon-api");

const allowedOrigins = [
  "http://localhost:8081",
  "https://justinribeiro.com",
  "https://www.justinribeiro.com",
];

const regex = new RegExp("https://.*justinribeiro-web.appspot.com", "g");

const M = new Mastodon({
  access_token: "",
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  api_url: "https://ribeiro.social/api/v1/", // optional, defaults to https://mastodon.social/api/v1/
});

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

    M.get("accounts/2/statuses", {}).then((resp) => {
      // crunch it
      const crunched = resp.data
        .filter((item) => item.media_attachments.length > 0)
        .map((data) => {
          return {
            url: data.url,
            content: data.content,
            date: data.created_at,
            media: data.media_attachments.map((item) => item.url)[0],
          };
        })
        .slice(0, 6);

      res.status(200).send(crunched);
    });
  }
};
