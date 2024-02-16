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

export { initAnalytics };
