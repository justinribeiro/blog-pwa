import { LitElement, html, css } from 'lit';
import { installRouter } from 'pwa-helpers/router.js';
import { Workbox } from 'workbox-window';

class BlogPwa extends LitElement {
  static properties = {
    /**
     * check whether we've completed our main app load (crp + lazy resources)
     * @private
     */
    __loaded: {
      type: Boolean,
      state: true,
    },
    /**
     * shadow DOM reference holder
     * @private
     */
    __dom: {
      type: Object,
    },
  };

  constructor() {
    super();
    this.__loaded = false;
    this.__dom = {
      snackBar: null,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      'blog-pwa-show-message',
      this.__listenForSbMessageEvent.bind(this)
    );
    document.addEventListener('keydown', BlogPwa.__listenForEscapeKeyEvent, {
      passive: true,
    });
  }

  disconnectedCallback() {
    window.removeEventListener(
      'blog-pwa-show-message',
      this.__listenForSbMessageEvent.bind(this)
    );
    document.removeEventListener('keydown', BlogPwa.__listenForEscapeKeyEvent, {
      passive: true,
    });
    super.disconnectedCallback();
  }

  firstUpdated() {
    this.__dom.snackBar = this.shadowRoot.querySelector('snack-bar');

    this.__setupRouter();
    this.__initializeNonCrpResources();
    BlogPwa.__setupPrefersColorScheme();
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
      offline: document.createElement('blog-offline'),
      reading: document.createElement('blog-reading'),
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
    let route;
    switch (true) {
      case /(chronicle\/[0-9]*\/[0-9]*\/[0-9]*\/[A-z-]*|about|talks)/.test(
        location.pathname
      ):
        route = 'entry';
        break;
      case /(chronicle|tags|^\/index.html|^\/$)/.test(location.pathname):
        route = 'static';
        break;
      case /(reading)/.test(location.pathname):
        route = 'reading';
        break;
      case /(offline)/.test(location.pathname):
        route = 'offline';
        break;
      default:
        route = 'missing';
        break;
    }
    this.__loadRoute(route);
  }

  /**
   * Verify the state of the router outlet and then inject the or mount as
   * needed
   *
   * @param {string} type The metadata page style to use
   */
  async __loadRoute(type) {
    // future change placeholder
    const eleRoot = 'blog';

    if (type === 'static') {
      await import('./blog-static.js');
    }
    if (type === 'entry') {
      await import('./blog-entry.js');
    }
    if (type === 'offline') {
      await import('./page-offline.js');
    }
    if (type === 'reading') {
      await import('./page-reading.js');
    }
    if (type === 'missing') {
      await import('./page-missing.js');
    }

    try {
      const checkElement = this.__domRefRouter.querySelector(
        `${eleRoot}-${type}`
      );
      if (checkElement) {
        await checkElement.mount();
      } else {
        if (this.__domRefRouter.childNodes.length === 1) {
          this.__domRefRouter.removeChild(this.__domRefRouter.firstChild);
        }
        const node = this.__domEle[type].cloneNode();
        node.mount();
        this.__domRefRouter.appendChild(node);
      }
    } catch (error) {
      // sometimes doesn't inject quickly, and their lifecycle doesn't
      // always fire on swap when the inner component doesn't change, so we put
      // a little fallback trigger in to be safe
      setTimeout(() => this.__loadRoute(type), 100);
    }
  }

  /**
   * Lazy load the non-essentials and startup additional services outside the
   * critical rendering path
   */
  async __initializeNonCrpResources() {
    if (!this.__loaded) {
      import('./blog-lazy-load.js').then(async () => {
        this.__loadServiceWorker();
        BlogPwa.__loadAnalytics();
        this.__loaded = true;
      });
    }
  }

  /**
   * Lazy load analytics and measure the web performance
   * @private
   * @static
   */
  static async __loadAnalytics() {
    const module = await import('./lod-analytics.js');
    module.initAnalytics();
    module.initCwp();
  }

  /**
   * Lazy load service worker and workbox-window reload
   * @private
   */
  async __loadServiceWorker() {
    if ('serviceWorker' in navigator) {
      let swUrl;
      const srcSw = url => {
        const parsed = new URL(url, window.location.origin);
        if (url.origin !== window.location.origin) {
          return parsed.href;
        }
        throw new TypeError('invalid sw url');
      };
      if (window.trustedTypes && window.trustedTypes.createPolicy) {
        const swPolicy = window.trustedTypes.createPolicy('swPolicy', {
          createScriptURL: src => srcSw(src),
        });
        swUrl = swPolicy.createScriptURL('service-worker.js');
      } else {
        swUrl = srcSw('service-worker.js');
      }
      const wb = new Workbox(swUrl);

      wb.addEventListener('activated', () => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(
            () => {
              BlogPwa.__cacheExistingLoadedUrls(wb);
            },
            {
              timeout: 5000,
            }
          );
        } else {
          BlogPwa.__cacheExistingLoadedUrls(wb);
        }
      });

      wb.addEventListener('waiting', () => {
        this.showSnackbar({
          text: 'New and updated content is available.',
          requireInteraction: true,
          callback: async () => {
            wb.addEventListener('controlling', () => {
              window.location.reload();
            });
            wb.messageSW({ type: 'SKIP_WAITING' });
          },
        });
      });

      wb.register();
    }
  }

  /**
   * Cache existing loaded urls within the service worker cache
   * @private
   * @static
   */
  static __cacheExistingLoadedUrls(wb) {
    // Get the current page URL + all resources the page loaded.
    const urlsToCache = [
      window.location.href,
      ...performance.getEntriesByType('resource').map(r => r.name),
    ];
    // Send that list of URLs to your router in the service worker.
    wb.messageSW({
      type: 'CACHE_URLS',
      payload: { urlsToCache },
    });
  }

  /**
   * Listen for Escape, dispatch custom event to page components for closing of
   * image full screens and other visual component interactions
   * @param {Event} event
   * @static
   * @event blog-pwa-escape-pressed
   */
  static __listenForEscapeKeyEvent(event) {
    if (event.key === 'Escape') {
      document.dispatchEvent(
        new CustomEvent('blog-pwa-escape-pressed', {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /**
   * listen and show snackbar as needed
   * @param {Event} event
   */
  __listenForSbMessageEvent(event) {
    this.showSnackbar(event.detail);
  }

  /**
   * Setup the color scheme based on user system preference
   * @static
   */
  static async __setupPrefersColorScheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
      const darkModeOn = e.matches;
      const cHtml = document.querySelector(':root');
      if (darkModeOn) {
        cHtml.setAttribute('darkmode', '');
      } else {
        cHtml.removeAttribute('darkmode');
      }
    });

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.querySelector(':root').setAttribute('darkmode', '');
    } else if ('AmbientLightSensor' in window) {
      const module = await import('./lod-experimental-web.js');
      module.setupAmbientLightThemeSwitching();
    }
  }

  /**
   * Open the snackbar and show the user a message
   *
   * @param {Object} options
   * @param {string} options.text The message to add to the slot
   * @param {number} [options.timeout=5000] Milliseconds to show message
   * @param {boolean}[options.requireInteraction=false] Don't set the timeout,
   * require user to interact
   * @param {function} [options.callback=null] Function to call for interaction
   */
  showSnackbar({
    text = '',
    timeout = 5000,
    requireInteraction = false,
    callback = null,
  }) {
    if (text !== '') {
      this.__dom.snackBar.removeAttribute('hidden');
      this.__dom.snackBar.textContent = text;

      if (callback) {
        this.__dom.snackBar.trigger = callback;
        this.__dom.snackBar.action = true;
      }

      this.__dom.snackBar.setAttribute('active', '');
      if (!requireInteraction) {
        setTimeout(() => {
          this.__dom.snackBar.removeAttribute('active');
        }, timeout);
      }
    }
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }

    main {
      display: grid;
      justify-content: center;
      min-height: 100vh;
      position: relative;
    }
  `;

  render() {
    return html`
      <main id="outlet"></main>
      <snack-bar hidden></snack-bar>
    `;
  }
}
customElements.define('blog-pwa', BlogPwa);
