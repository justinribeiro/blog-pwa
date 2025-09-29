import analytics from '@justinribeiro/tiny-ga4';

const analyticsId = 'G-37E9EEEWD9';
const ga4track = analytics(analyticsId);

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
