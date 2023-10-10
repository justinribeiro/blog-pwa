import ga4mp from '@analytics-debugger/ga4mp';

const analyticsId = 'G-37E9EEEWD9';
const ga4track = ga4mp([analyticsId], {
  user_id: undefined,
  non_personalized_ads: true,
  debug: true,
});

/**
 * This is strip down because GA4 is a heavy nightmare
 */
function initAnalytics() {
  // Meh, lazy Justin
  window.ga4track = ga4track;

  ga4track.trackEvent('page_view', {
    is_session_start: true,
    is_first_visit: true,
  });
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

  ga4track.trackEvent(name, eventParams);
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
