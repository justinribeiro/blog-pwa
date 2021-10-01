const analyticsId = 'UA-96204-3';

function initAnalytics() {
  let libUrl;
  const analyticsSrc = url => {
    const parsed = new URL(url, 'https://www.google-analytics.com');
    if (parsed.origin === 'https://www.google-analytics.com') {
      return parsed.href;
    }
    throw new TypeError('invalid analytics url');
  };
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    const analyticsPolicy = window.trustedTypes.createPolicy(
      'analyticsPolicy',
      {
        createScriptURL: src => analyticsSrc(src),
      }
    );
    libUrl = analyticsPolicy.createScriptURL('analytics.js');
  } else {
    libUrl = analyticsSrc('analytics.js');
  }

  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    (i[r] =
      i[r] ||
      function () {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', libUrl, 'ga');

  ga('create', analyticsId, 'auto');
  ga('set', 'transport', 'beacon');
  ga('set', 'anonymizeIp', true);
  ga('send', 'pageview');
}

function __trackCwpMetric({ name, delta, id }) {
  ga('send', 'event', {
    eventCategory: 'Web Vitals',
    eventAction: name,
    eventLabel: id,
    eventValue: Math.round(name === 'CLS' ? delta * 1000 : delta),
    nonInteraction: true,
    transport: 'beacon',
  });
}

async function initCwp() {
  const module = await import('web-vitals');
  module.getCLS(__trackCwpMetric);
  module.getFID(__trackCwpMetric);
  module.getLCP(__trackCwpMetric);
  module.getTTFB(__trackCwpMetric);
  module.getFCP(__trackCwpMetric);
}

export { initAnalytics, initCwp };
