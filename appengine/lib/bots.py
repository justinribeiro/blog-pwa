__author__ = "Justin Ribeiro <justin@justinribeiro.com>"

import re

# derived from
# https://github.com/ai-robots-txt/ai.robots.txt/blob/main/haproxy-block-ai-bots.txt
def aiBots():
    pattern = "(?:%s)" % "|".join(
        [
            "AddSearchBot",
            "AI2Bot",
            "Ai2Bot-Dolma",
            "aiHitBot",
            "Amazonbot",
            "Andibot",
            "anthropic-ai",
            "Applebot",
            "Applebot-Extended",
            "Awario",
            "bedrockbot",
            "bigsur.ai",
            "Brightbot\ 1.0",
            "Bytespider",
            "CCBot",
            "ChatGPT\ Agent",
            "ChatGPT-User",
            "Claude-SearchBot",
            "Claude-User",
            "Claude-Web",
            "ClaudeBot",
            "CloudVertexBot",
            "cohere-ai",
            "cohere-training-data-crawler",
            "Cotoyogi",
            "Crawlspace",
            "Datenbank\ Crawler",
            "DeepSeekBot",
            "Devin",
            "Diffbot",
            "DuckAssistBot",
            "Echobot\ Bot",
            "EchoboxBot",
            "FacebookBot",
            "facebookexternalhit",
            "Factset_spyderbot",
            "FirecrawlAgent",
            "FriendlyCrawler",
            "Gemini-Deep-Research",
            "Google-CloudVertexBot",
            "Google-Extended",
            "Google-Firebase",
            "GoogleAgent-Mariner",
            "GoogleOther",
            "GoogleOther-Image",
            "GoogleOther-Video",
            "GPTBot",
            "iaskspider/2.0",
            "ICC-Crawler",
            "ImagesiftBot",
            "img2dataset",
            "ISSCyberRiskCrawler",
            "Kangaroo\ Bot",
            "LinerBot",
            "meta-externalagent",
            "Meta-ExternalAgent",
            "meta-externalfetcher",
            "Meta-ExternalFetcher",
            "meta-webindexer",
            "MistralAI-User",
            "MistralAI-User/1.0",
            "MyCentralAIScraperBot",
            "netEstate Imprint Crawler",
            "NovaAct",
            "OAI-SearchBot",
            "omgili",
            "omgilibot",
            "OpenAI",
            "Operator",
            "PanguBot",
            "Panscient",
            "panscient.com",
            "Perplexity-User",
            "PerplexityBot",
            "PetalBot",
            "PhindBot",
            "Poseidon\ Research\ Crawler",
            "QualifiedBot",
            "QuillBot",
            "quillbot.com",
            "SBIntuitionsBot",
            "Scrapy",
            "SemrushBot-OCOB",
            "SemrushBot-SWA",
            "ShapBot",
            "Sidetrade\ indexer\ bot",
            "TerraCotta",
            "Thinkbot",
            "TikTokSpider",
            "Timpibot",
            "VelenPublicWebCrawler",
            "WARDBot",
            "Webzio-Extended",
            "wpbot",
            "YaK",
            "YandexAdditional",
            "YandexAdditionalBot",
            "YouBot",
        ]
    )
    return re.compile(pattern, re.IGNORECASE)


# this list is a little of a cross-mix of bots and a few browsers that
# can just skip the progressive checks (ala lynx). I've done this to
# just make the experience a little nicer
def socialBots():
    pattern = "(?:%s)" % "|".join(
        [
            "archive.org_bot",
            "W3C_Validator",
            "baiduspider",
            "bingbot",
            "embedly",
            "facebookexternalhit",
            "linkedinbot",
            "outbrain",
            "pinterest",
            "quora\ link\ preview",
            "rogerbot",
            "showyoubot",
            "slackbot",
            "twitterbot",
            "vkShare",
            "bingbot",
            "linkedinbot",
            "mediapartners-google",
            "mastodon",
            "ahrefsbot",
            "yandexbot",
            "msnbot",
            # why googlebot? Because the static representation is 1-to-1 and
            # easier for even new M70+ GoogleBot to parse
            "googlebot",
            "google-structured-data-testing-tool",
            # just because it's cool
            "lynx",
            # web mentions handlers
            "webmention",
            "node-fetch",
            "guzzle",
            "bridgy",
            "go-http-client",
            "ruby",
            "appengine-google",
            "xray",
        ]
    )
    return re.compile(pattern, re.IGNORECASE)


# Compile once at import time, some save cycles
aiBots = aiBots()
socialBots = socialBots()
