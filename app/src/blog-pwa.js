import { LitElement, html, css } from 'lit';
import { installRouter } from 'pwa-helpers/router.js';
import { Workbox } from 'workbox-window';

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

    // don't show it on first load, it's already been shown by before our
    // component is ready
    this.__hideSkeleton = true;
  }

  firstUpdated() {
    this.__setupRouter();

    this._ensureLazyLoaded();

    window.addEventListener('online', () => this._notifyNetworkStatus(false));
    window.addEventListener('offline', () => this._notifyNetworkStatus(true));
    window.addEventListener('display-snackbar', event => {
      this._setSnackBarText(event.detail.message, 5000);
    });
    this.addEventListener('blog-pwa-toggle-skeleton', event => {
      this.__hideSkeleton = event.detail.show;
    });

    this.__setupDarkMode();
  }

  /**
   * Setup the base elements for the router and start-up the location helper
   */
  __setupRouter() {
    this.__domRefRouter = this.shadowRoot.querySelector('#outlet');
    this.__domEle = {
      static: document.createElement(`blog-static`),
      entry: document.createElement('blog-entry'),
      missing: document.createElement('blog-missing'),
    };
    installRouter(location => this.__routes(location));
  }

  /**
   * Handles the changing of the navigation on page and loads the proper
   * component(s)
   *
   * @param {object} location
   */
  __routes(location) {
    switch (true) {
      case /(chronicle\/[0-9]*\/[0-9]*\/[0-9]*\/[A-z-]*|about|talks)/.test(
        location.pathname
      ):
        this.__loadRoute('entry');
        break;
      case /(chronicle|tags|^\/index.html|^\/$)/.test(location.pathname):
        this.__loadRoute('static');
        break;
      default:
        this.__loadRoute('missing');
        break;
    }
  }

  async __showDynamicModal(component, elementName) {
    if (!customElements.get(elementName)) {
      await import(component);
    }

    this.dispatchEvent(
      new CustomEvent('modal-open', {
        bubbles: true,
        composed: true,
        detail: {
          componentInject: elementName,
          gcOnClose: true,
        },
      })
    );
  }

  /**
   * Verify the state of the router outlet and then inject the or mount as
   * needed
   *
   * @param {string} type
   */
  async __loadRoute(type) {
    if (type === 'static') {
      await import('./blog-static.js');
    }
    if (type === 'entry') {
      await import('./blog-entry.js');
    }
    try {
      const checkElement = this.__domRefRouter.querySelector(`blog-${type}`);
      if (checkElement) {
        await checkElement.mount();
      } else {
        while (this.__domRefRouter.firstChild) {
          this.__domRefRouter.removeChild(this.__domRefRouter.firstChild);
        }
        this.__domRefRouter.appendChild(this.__domEle[type].cloneNode());
        await this.__domRefRouter.querySelector(`blog-${type}`).mount();
      }
    } catch (error) {
      // sometimes doesn't inject quickly, and their lifecycle doesn't
      // always fire on swap when the inner component doesn't change, so we put
      // a little fallback trigger in to be safe
      setTimeout(() => this.__loadRoute(type), 100);
    }
  }

  /**
   * Load the non-essentials and startup the service worker and analytics
   */
  _ensureLazyLoaded() {
    if (!this.loadComplete) {
      this.__loadFonts();
      import('./blog-lazy-load.js').then(() => {
        this.__loadSw();
        this.__loadAnalytics();
        this._notifyNetworkStatus();
        this.loadComplete = true;
      });
    }
  }

  async __loadSw() {
    if ('serviceWorker' in navigator) {
      let swUrl;
      const srcSw = url => {
        const parsed = new URL(url, document.baseURI);
        if (
          parsed.host === 'justinribeiro.com' ||
          parsed.host === 'www.justinribeiro.com'
        ) {
          return parsed.href;
        }
        throw new TypeError('invalid sw url');
      };
      if (window.trustedTypes && trustedTypes.createPolicy) {
        const swPolicy = trustedTypes.createPolicy('swPolicy', {
          createScriptURL: src => srcSw(src),
        });
        swUrl = swPolicy.createScriptURL('service-worker.js');
      } else {
        swUrl = srcSw('service-worker.js');
      }
      const wb = new Workbox(swUrl);

      wb.addEventListener('activated', event => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(
            () => {
              this.__cacheExistingLoadedUrls(wb);
            },
            {
              timeout: 5000,
            }
          );
        } else {
          this.__cacheExistingLoadedUrls(wb);
        }
      });

      wb.register();
    }
  }

  async __loadFonts() {
    const domRefHead = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';

    const cloneFontOne = link.cloneNode();
    cloneFontOne.href =
      'https://fonts.googleapis.com/css?family=Libre+Franklin:400|Literata:700&display=swap&subset=latin-ext';

    const cloneFontTwo = link.cloneNode();
    cloneFontTwo.href =
      'https://fonts.googleapis.com/css?family=Literata&display=swap&text=JustinRibeiro';

    domRefHead.appendChild(cloneFontOne);
    domRefHead.appendChild(cloneFontTwo);
  }

  async __loadAnalytics() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(
        () => {
          this.__importAnalytics();
        },
        {
          timeout: 5000,
        }
      );
    } else {
      this.__importAnalytics();
    }
  }

  __cacheExistingLoadedUrls(wb) {
    // Get the current page URL + all resources the page loaded.
    const urlsToCache = [
      location.href,
      ...performance.getEntriesByType('resource').map(r => r.name),
    ];
    // Send that list of URLs to your router in the service worker.
    wb.messageSW({
      type: 'CACHE_URLS',
      payload: { urlsToCache },
    });
  }

  async __importAnalytics() {
    const module = await import('./analytics.js');
    module.initAnalytics();
    module.initCwp();
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

  // eslint-disable-next-line class-methods-use-this
  __setupDarkMode() {
    window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
      const darkModeOn = e.matches;
      const cHtml = document.querySelector('html');
      if (darkModeOn) {
        cHtml.setAttribute('darkmode', '');
      } else {
        cHtml.removeAttribute('darkmode');
      }
    });

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.querySelector('html').setAttribute('darkmode', '');
    } else if ('AmbientLightSensor' in window) {
      navigator.permissions
        .query({ name: 'ambient-light-sensor' })
        .then(result => {
          if (result.state === 'denied') {
            return;
          }
          const sensor = new AmbientLightSensor({ frequency: 0.25 });
          sensor.addEventListener('reading', () => {
            const cHtml = document.querySelector('html');
            if (sensor.illuminance < 3) {
              cHtml.setAttribute('darkmode', '');
            } else if (sensor.illuminance > 3) {
              cHtml.removeAttribute('darkmode');
            }
          });
          sensor.start();
        });
    }
  }

  static get styles() {
    return css`
      main {
        display: grid;
        justify-content: center;
      }
    `;
  }

  render() {
    return html`
      <main>
        <div ?hidden=${!this.__hideSkeleton}>
          <slot id="skeleton" name="skeleton"></slot>
        </div>
        <section id="outlet"></section>
      </main>
      <snack-bar hidden></snack-bar>
    `;
  }
}
customElements.define('blog-pwa', BlogPwa);
