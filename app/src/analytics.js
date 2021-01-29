const analyticsId = 'UA-96204-3';

function initAnalytics() {
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
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

  ga('create', analyticsId, 'auto');
  ga('set', 'transport', 'beacon');
  ga('set', 'anonymizeIp', true);
  ga('send', 'pageview');

  const loadErrorEvents = (window.__e && window.__e.q) || [];
  const fieldsObj = { eventAction: 'uncaught error' };

  // Replay any stored load error events.
  for (const event of loadErrorEvents) {
    __trackError(event.error, fieldsObj);
  }

  // Add a new listener to track event immediately.
  window.addEventListener('error', event => {
    __trackError(event.error, fieldsObj);
  });
}

function __trackError(error, fieldsObj = {}) {
  ga(
    'send',
    'event',
    Object.assign(
      {
        eventCategory: 'Script',
        eventAction: 'error',
        eventLabel: (error && error.stack) || '(not set)',
        nonInteraction: true,
      },
      fieldsObj,
    ),
  );
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
