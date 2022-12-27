const analyticsId = 'G-37E9EEEWD9';

function initAnalytics() {
  let libUrl;
  const analyticsSrc = url => {
    const parsed = new URL(url, 'https://www.googletagmanager.com');
    if (parsed.origin === 'https://www.googletagmanager.com') {
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
    libUrl = analyticsPolicy.createScriptURL(`gtag/js?id=${analyticsId}`);
  } else {
    libUrl = analyticsSrc(`gtag/js?id=${analyticsId}`);
  }

  const gaScriptElement = document.createElement('script');
  gaScriptElement.async = 1;
  gaScriptElement.src = libUrl;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(gaScriptElement, firstScript);

  window.dataLayer = window.dataLayer || [];
  // GA4 chokes hard on rest args for some reason...
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', analyticsId);
}

/**
 * This is 1:1 out of the web-vitals documentation except for the default switch
 * case addition
 * @param {*} { name, delta, value, id, attribution }
 */
function __trackCwpMetric({ name, delta, value, id, attribution }) {
  const eventParams = {
    // Built-in params:
    value: delta, // Use `delta` so the value can be summed.
    // Custom params:
    metric_id: id, // Needed to aggregate events.
    metric_value: value, // Optional.
    metric_delta: delta, // Optional.
  };

  switch (name) {
    case 'CLS':
      eventParams.debug_target = attribution.largestShiftTarget;
      break;
    case 'FID':
      eventParams.debug_target = attribution.eventTarget;
      break;
    case 'LCP':
      eventParams.debug_target = attribution.element;
      break;
    default:
      eventParams.debug_target = 'Not Applicable';
  }

  gtag('event', name, eventParams);
}

async function initCwp() {
  const module = await import('web-vitals/attribution');
  module.onCLS(__trackCwpMetric);
  module.onFID(__trackCwpMetric);
  module.onLCP(__trackCwpMetric);
  module.onTTFB(__trackCwpMetric);
  module.onFCP(__trackCwpMetric);
  module.onINP(__trackCwpMetric);
}

export { initAnalytics, initCwp };
