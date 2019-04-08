import {LitElement, html, css} from 'lit-element';
import {Router} from '@vaadin/router';

class BlogPwa extends LitElement {
  static get properties() {
    return {
      offline: {
        type: Boolean,
        value: false,
        attribute: false
      },
      analyticsId: {
        type: String,
        value: 'UA-96204-3',
        attribute: false
      }
    };
  }

  firstUpdated() {
    this._initRouter();
    this._ensureLazyLoaded();

    window.addEventListener('online', () => this._notifyNetworkStatus(false));
    window.addEventListener('offline', () => this._notifyNetworkStatus(true));
  }

  _initRouter() {
    const outlet = this.shadowRoot.querySelector('main');
    const router = new Router(outlet, null);
    router.setRoutes([{
      path: '/',
      children: [
        {
          path: '',
          component: 'blog-static',
          action: () => {
            __import('blog-static.js').then(() => {
              const check = this.shadowRoot.querySelector('blog-static');
              check.mount('index');
            });

          }
        },
        {
          path: '/chronicle/',
          component: 'blog-chronicle',
          action: () => {
            __import('blog-chronicle.js');
          }
        },
        {
          path: '/chronicle/(.*)',
          component: 'blog-entry',
          action: () => {
            __import('blog-entry.js').then(() => {
              const check = this.shadowRoot.querySelector('blog-entry');
              check.resetView();
              check.mount();
            });
          }
        },
        {
          path: '/about',
          component: 'blog-static',
          action: () => {
            __import('blog-static.js').then(() => {
              const check = this.shadowRoot.querySelector('blog-static');
              check.mount('about');
            });

          }
        },
        {
          path: '/talks',
          component: 'blog-static',
          action: () => {
            __import('blog-static.js').then(() => {
              const check = this.shadowRoot.querySelector('blog-static');
              check.mount('talks');
            });
          }
        },
      ]
    }]);
  }

  // PRPL all the things.
  _ensureLazyLoaded() {
    if (!this.loadComplete) {
      __import('lazy-resources.js').then((_) => {
        this.__initAnalytics();

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('service-worker.js', {
            scope: './'
          })
          .then(registration => {
            registration.addEventListener('updatefound',
              () => this._onUpdateFound(registration));
          });
        }
        this._notifyNetworkStatus();
        this.loadComplete = true;
      });
    }
  }

  _onUpdateFound(registration) {
    const newWorker = registration.installing;

    registration.installing.addEventListener('statechange', async () => {
      if (newWorker.state == 'activated' && !navigator.serviceWorker.controller) {
        this._setSnackBarText('Ready to work offline.');
        return;
      }

      if (newWorker.state == 'activated' && navigator.serviceWorker.controller) {
        this._setSnackBarText('New and updated content is available. <a href="javascript:window.location.reload(true);">Refresh</a>', 0, true);
      }
    });
  }

  _setSnackBarText(text, duration, hold) {
    const timeout = duration || 5000;
    const snackBar = this.shadowRoot.querySelector('snack-bar');

    // Strange bug where the bar blips on some initial loads
    // workaround by hidding at load and then removing as needed one time
    if (snackBar.hasAttribute('hidden')) {
      snackBar.removeAttribute('hidden');
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
    this.offline =  status;

    if (this.offline || (!this.offline && oldOffline === true)) {
      let offlineState = this.offline ? 'You appear to have gone offline.' : 'You appear to now be back online.';
      this._setSnackBarText(offlineState);
    }
  }

  __initAnalytics() {
    window.ga = window.ga || ((...args) => (ga.q = ga.q || []).push(args));

    ga('create', this.analyticsId, 'auto');
    ga('set', 'transport', 'beacon');
    ga('set', 'anonymizeIp', true);
    ga('send', 'pageview');

    const loadErrorEvents = window.__e && window.__e.q || [];
    const fieldsObj = {eventAction: 'uncaught error'};

    // Replay any stored load error events.
    for (let event of loadErrorEvents) {
      this.__trackError(event.error, fieldsObj);
    }

    // Add a new listener to track event immediately.
    window.addEventListener('error', (event) => {
      this.__trackError(event.error, fieldsObj);
    });
  }

  __trackError(error, fieldsObj = {}) {
    ga('send', 'event', Object.assign({
      eventCategory: 'Script',
      eventAction: 'error',
      eventLabel: (error && error.stack) || '(not set)',
      nonInteraction: true,
    }, fieldsObj));
  }

  static get styles() {
    return css`
      main {
        min-height: 100vh;
      }`;
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