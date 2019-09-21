const analyticsId = 'UA-96204-3';
const performanceConfig = {
  apiKey: 'AIzaSyCL3JHSIHyP9si05JGojes1ovaZGGQLEww',
  authDomain: 'justinribeiro-web.firebaseapp.com',
  databaseURL: 'https://justinribeiro-web.firebaseio.com',
  projectId: 'justinribeiro-web',
  storageBucket: 'justinribeiro-web.appspot.com',
  messagingSenderId: '975113193471',
  appId: '1:975113193471:web:aafc5bbe0db1d350',
};

function initAnalytics() {
  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    (i[r] =
      i[r] ||
      function() {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(
    window,
    document,
    'script',
    'https://www.google-analytics.com/analytics.js',
    'ga',
  );

  ga('create', analyticsId, 'auto');
  ga('set', 'transport', 'beacon');
  ga('set', 'anonymizeIp', true);
  ga('send', 'pageview');

  const loadErrorEvents = (window.__e && window.__e.q) || [];
  const fieldsObj = {eventAction: 'uncaught error'};

  // Replay any stored load error events.
  for (const event of loadErrorEvents) {
    __trackError(event.error, fieldsObj);
  }

  // Add a new listener to track event immediately.
  window.addEventListener('error', event => {
    __trackError(event.error, fieldsObj);
  });
}

function initPerformance() {
  let interval;

  (function(sa) {
    function load(f) {
      const a = document.createElement('script');
      a.async = true;
      a.src = f;
      const s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(a, s);
    }
    load(sa);
  })(
    'https://www.gstatic.com/firebasejs/6.6.1/firebase-performance-standalone.js',
  );

  const start = () => {
    if (window.firebase) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(
          () => {
            window.firebase.initializeApp(performanceConfig).performance();
          },
          {
            timeout: 2000,
          },
        );
      } else {
        window.firebase.initializeApp(performanceConfig).performance();
      }
      if (interval) {
        clearInterval(interval);
      }
    }
  };
  // Firebase wants to live higher on the window.onload, but tracing tells me
  // to load later to gain some perf so let's do this
  if (window.firebase) {
    start();
  } else {
    interval = setInterval(start, 1000);
  }
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

export {initAnalytics, initPerformance};
