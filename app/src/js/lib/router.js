/**
  Basic router that calls a callback whenever the location is updated; based off
  the abandoned https://github.com/Polymer/pwa-helpers/blob/master/src/router.ts

  Example: installRouter((location) => handleNavigation(location));

  If you need to force a navigation to a new location programmatically, you can
  do so by pushing a new state using the History API, and then manually calling
  the callback with the new location:

      window.history.pushState({}, '', '/new-route');
      handleNavigation(window.location);

  Optionally, you can use the second argument to read the event that caused the
  navigation. For example, you may want to scroll to top only after a link
  click.

      installRouter((location, event) => {
        // Only scroll to top on link clicks, not popstate events.
        if (event && event.type === 'click') {
          window.scrollTo(0, 0);
        }
        handleNavigation(location);
      });
*/
export const installRouter = locationUpdatedCallback => {
  document.body.addEventListener('click', e => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }

    const anchor = e.composedPath().find(n => n?.tagName === 'A');
    if (
      !anchor ||
      anchor.target ||
      anchor.hasAttribute('download') ||
      anchor.getAttribute('rel') === 'external'
    ) {
      return;
    }

    const { href } = anchor;
    if (!href || href.startsWith('mailto:')) {
      return;
    }

    const { location } = window;
    const origin = location.origin || `${location.protocol}//${location.host}`;
    if (!href.startsWith(origin)) {
      return;
    }

    e.preventDefault();
    if (href !== location.href) {
      history.pushState({}, '', href);
      locationUpdatedCallback(location, e);
    }
  });

  addEventListener('popstate', e => locationUpdatedCallback(location, e));
  locationUpdatedCallback(location, null);
};
