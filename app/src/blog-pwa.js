import {LitElement, html, css} from 'lit-element';
import {Router} from '@vaadin/router';
import {Workbox} from 'workbox-window';

class BlogPwa extends LitElement {
  static get properties() {
    return {
      offline: {
        type: Boolean,
        attribute: false,
      },
      __hideSkeleton: {
        type: Boolean,
      },
    };
  }

  constructor() {
    super();
    this.offline = false;
    this.__hideSkeleton = false;
  }

  firstUpdated() {
    this._initRouter();
    this._ensureLazyLoaded();
    window.addEventListener('online', () => this._notifyNetworkStatus(false));
    window.addEventListener('offline', () => this._notifyNetworkStatus(true));
    window.addEventListener('display-snackbar', event => {
      this._setSnackBarText(event.detail.message, 5000);
    });
    this.addEventListener('blog-pwa-toggle-skeleton', event => {
      this.__hideSkeleton = event.detail.show;
    });
  }

  _initRouter() {
    const outlet = this.shadowRoot.querySelector('main');
    const router = new Router(outlet, null);

    // Don't be fooled; we don't set the routes async/await with the inner call
    // because we don't want vaadin-router to wait; let it inject fast so we can
    // stamp and load data
    router.setRoutes([
      {
        path: '/',
        children: [
          {
            path: '',
            component: 'blog-static',
            action: () => {
              this.__loadRoute('static');
            },
          },
          {
            path: '/(talks|about|chronicle|tags)/',
            component: 'blog-static',
            action: () => {
              this.__loadRoute('static');
            },
          },
          {
            path: '/tags/(.*)',
            component: 'blog-static',
            action: () => {
              this.__loadRoute('static');
            },
          },
          {
            path: '/chronicle/(.*)',
            component: 'blog-entry',
            action: () => {
              this.__loadRoute('entry');
            },
          },
          {
            path: '(.*)',
            component: 'blog-missing',
          },
        ],
      },
    ]);
  }

  async __loadRoute(type) {
    if (type === 'static') {
      await import('./blog-static.js');
    }
    if (type === 'entry') {
      await import('./blog-entry.js');
    }
    try {
      const dom = this.shadowRoot.querySelector(`blog-${type}`);
      await dom.mount();
    } catch (error) {
      // sometimes vaadin doesn't inject quickly, and their lifecycle doesn't
      // always fire on swap when the inner component doesn't change, so we put
      // a little fallback trigger in to be safe
      setTimeout(() => this.__loadRoute(type), 100);
    }
  }

  // PRPL all the things.
  _ensureLazyLoaded() {
    if (!this.loadComplete) {
      import('./lazy-resources.js').then(_ => {
        if ('serviceWorker' in navigator) {
          const wb = new Workbox('/service-worker.js');

          wb.addEventListener('activated', event => {
            if (!event.isUpdate) {
              this._setSnackBarText('Ready to work offline.');
            }

            // Get the current page URL + all resources the page loaded.
            const urlsToCache = [
              location.href,
              ...performance.getEntriesByType('resource').map(r => r.name),
            ];
            // Send that list of URLs to your router in the service worker.
            wb.messageSW({
              type: 'CACHE_URLS',
              payload: {urlsToCache},
            });
          });

          wb.addEventListener('waiting', event => {
            this._setSnackBarText(
              'New and updated content is available.',
              0,
              true,
              async () => {
                wb.addEventListener('controlling', event => {
                  window.location.reload();
                });
                wb.messageSW({type: 'SKIP_WAITING'});
              },
            );
          });

          wb.register();
        }
        if ('requestIdleCallback' in window) {
          requestIdleCallback(
            () => {
              this.__importAnalytics();
            },
            {
              timeout: 5000,
            },
          );
        } else {
          this.__importAnalytics();
        }

        this._notifyNetworkStatus();
        this.loadComplete = true;
      });
    }
  }

  async __importAnalytics() {
    const module = await import('./analytics.js');
    module.initAnalytics();
    module.initPerformance();
  }

  _setSnackBarText(text, duration, hold, callback) {
    const timeout = duration || 5000;
    const snackBar = this.shadowRoot.querySelector('snack-bar');

    // Strange bug where the bar blips on some initial loads
    // workaround by hiding at load and then removing as needed one time
    if (snackBar.hasAttribute('hidden')) {
      snackBar.removeAttribute('hidden');
    }

    if (callback) {
      snackBar.trigger = callback;
      snackBar.action = true;
    }

    snackBar.innerHTML = text;
    snackBar.setAttribute('active', '');

    setTimeout(() => {
      if (!hold) {
        snackBar.removeAttribute('active');
      }
    }, timeout);
  }

  _notifyNetworkStatus(status) {
    const oldOffline = this.offline;
    this.offline = status;

    if (this.offline || (!this.offline && oldOffline === true)) {
      const offlineState = this.offline
        ? 'You appear to have gone offline.'
        : 'You appear to now be back online.';
      this._setSnackBarText(offlineState);
    }
  }

  static get styles() {
    return css`
      main {
        min-height: 100vh;
      }
    `;
  }

  render() {
    return html`
      <slot name="header"></slot>
      <main>
        <div ?hidden=${!this.__hideSkeleton}>
          <slot id="skeleton" name="skeleton"></slot>
        </div>
      </main>
      <slot name="footer"></slot>
      <snack-bar hidden></snack-bar>
    `;
  }
}
customElements.define('blog-pwa', BlogPwa);
