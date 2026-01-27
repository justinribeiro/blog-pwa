/**
 * We do this so that we lazy load as needed on first load and still build down
 * to faster with rollup
 * @type {Object.<module, string>} ElementMap
 */
const loadRouteModule = {
  page: () => import('../blog/blog-page.js'),
  entry: () => import('../blog/blog-entry.js'),
  offline: () => import('../blog/page-offline.js'),
  missing: () => import('../blog/page-missing.js'),
};

// These are all the non-blog post pages that I want to make available;
// technically, I don't really have to do this, I could just default them, but
// this gives me more options
const pagePaths = [
  'explore',
  'about',
  'talks',
  'speaking',
  'research',
  'consulting',
  'chronicle',
  'tags',
];

const pagePattern = new RegExp(
  `^/(?:(?:${pagePaths.join('|')})(?:/.*)?|index.html)?/?$`,
);

// How we match things with the page router
const routes = [
  {
    pattern: /^\/chronicle\/\d+\/\d+\/\d+\/[^\/]+\/?(?:\?.*)?(?:#.*)?$/,
    type: 'entry',
  },
  { pattern: pagePattern, type: 'page' },
  { pattern: /^\/offline\/?$/, type: 'offline' },
];

/**
 * Handles the changing of the navigation on page and loads the proper
 * component(s)
 *
 * @param {object} location
 */
function findRoute(location) {
  // Find the first route that matches
  const matchedRoute = routes.find(r => r.pattern.test(location.pathname));

  // Default to 'missing' if no route matches
  return matchedRoute?.type || 'missing';
}

export { findRoute, loadRouteModule };
