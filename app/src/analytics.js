const analyticsId = 'UA-96204-3';

// don't hold this; let our user be anonymous after a reload
const analyticsUid = Math.floor(Math.random() * 1000 * Date.now());

function sendToGa(data) {
  const payload = {
    v: 1,
    tid: analyticsId,
    uid: analyticsUid,
    aip: 1,
    sd: `${window.screen.colorDepth}-bit`,
    sr: `${window.screen.width}x${window.screen.height}`,
    vp: `${window.innerWidth}x${window.innerHeight}`,
    ul: navigator.language.toLowerCase(),
    de: document.characterSet.toLowerCase(),
    dl: window.location.href,
    dh: window.location.origin,
    dp: window.location.pathname,
    dt: document.title,
    dr: document.referrer,
    us: navigator.userAgent,
    ...data,
  };
  navigator.sendBeacon('https://www.google-analytics.com/collect', new URLSearchParams(payload).toString());
}

function __trackError(error, fieldsObj = {}) {
  sendToGa({
    t: 'event',
    ec: 'Script',
    ea: 'error',
    el: (error && error.stack) || '(not set)',
    ni: 1,
    ...fieldsObj,
  });
}

function __trackCwpMetric({ name, delta, id }) {
  sendToGa({
    t: 'event',
    ec: 'Web Vitals',
    ea: name,
    el: id,
    ev: Math.round(name === 'CLS' ? delta * 1000 : delta),
    ni: 1,
  });
}

function initAnalytics() {
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

async function initCwp() {
  const module = await import('web-vitals');
  module.getCLS(__trackCwpMetric);
  module.getFID(__trackCwpMetric);
  module.getLCP(__trackCwpMetric);
  module.getTTFB(__trackCwpMetric);
  module.getFCP(__trackCwpMetric);
}

export { initAnalytics, initCwp, sendToGa };
