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

  window.ga =
    window.ga ||
    // eslint-disable-next-line func-names
    function (...args) {
      (ga.q = ga.q || []).push(args);
    };
  ga.l = +new Date();
  const gaScriptElement = document.createElement('script');
  gaScriptElement.async = 1;
  gaScriptElement.src = libUrl;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(gaScriptElement, firstScript);

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
