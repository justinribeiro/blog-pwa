import {LitElement, html, css} from 'lit-element';
import {Router} from '@vaadin/router';
import {Workbox} from 'workbox-window';

class BlogPwa extends LitElement {
  static get properties() {
    return {
      offline: {
        type: Boolean,
        value: false,
        attribute: false,
      },
    };
  }

  constructor() {
    super();
  }

  firstUpdated() {
    this._ensureLazyLoaded();
    this._initRouter();

    window.addEventListener('online', () => this._notifyNetworkStatus(false));
    window.addEventListener('offline', () => this._notifyNetworkStatus(true));
  }

  _initRouter() {
    const outlet = this.shadowRoot.querySelector('main');
    const router = new Router(outlet, null);
    router.setRoutes([
      {
        path: '/',
        children: [
          {
            path: '',
            component: 'blog-static',
            action: () => {
              import('./blog-static.js').then(() => {
                const check = this.shadowRoot.querySelector('blog-static');
                check.mount('index');
              });
            },
          },
          {
            path: '/chronicle/',
            component: 'blog-chronicle',
            action: () => {
              import('./blog-chronicle.js');
            },
          },
          {
            path: '/chronicle/(.*)',
            component: 'blog-entry',
            action: () => {
              import('./blog-entry.js').then(() => {
                const check = this.shadowRoot.querySelector('blog-entry');
                check.resetView();
                check.mount();
              });
            },
          },
          {
            path: '/about',
            component: 'blog-static',
            action: () => {
              import('./blog-static.js').then(() => {
                const check = this.shadowRoot.querySelector('blog-static');
                check.mount('about');
              });
            },
          },
          {
            path: '/talks',
            component: 'blog-static',
            action: () => {
              import('./blog-static.js').then(() => {
                const check = this.shadowRoot.querySelector('blog-static');
                check.mount('talks');
              });
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
      <main></main>
      <slot name="footer"></slot>
      <snack-bar hidden></snack-bar>
    `;
  }
}
customElements.define('blog-pwa', BlogPwa);
