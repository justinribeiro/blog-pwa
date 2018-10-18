import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {afterNextRender} from '@polymer/polymer/lib/utils/render-status.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import './blog-pages.js';

class BlogPwa extends PolymerElement {
  static get properties() {
    return {
      page: {
        type: String,
        observer: '_pageChanged'
      },
      offline: {
        type: Boolean,
        value: false
      },
      analyticsId: {
        type: String,
        value: 'UA-96204-3'
      }
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  ready() {
    super.ready();

    afterNextRender(this, (_) => {
      window.addEventListener('online', () => this._notifyNetworkStatus(false));
      window.addEventListener('offline', () => this._notifyNetworkStatus(true));
    });
  }

  // PRPL all the things.
  _ensureLazyLoaded() {
    if (!this.loadComplete) {
      afterNextRender(this, () => {
        import('./lazy-resources.js').then((_) => {

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
        }, this._pageNotFound.bind(this));
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
    snackBar.setAttribute('active', true);

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

  _routePageChanged(page) {
    // This is a special case; after a lot of testing app-route can be slow
    // to process the tail, which results in a rendering blip on slower
    // devices. This is hard to duplicate, so to help prevent this, I check
    // app-location route early and process it to point to the right entry
    //
    // This would reasonably be faster if I wanted to change my permalink
    // structure, but I find this case isn't the end of the world.
    var fastCheck = new RegExp('\/chronicle/[0-9]*\/[0-9]*\/[0-9]*\/[\w\-]*', 'g');
    if (fastCheck.test(this.route.path)){
      if (this.shadowRoot.querySelector('blog-entry').constructor !== HTMLElement) {
        try {
          this.shadowRoot.querySelector('blog-entry').resetView();
        } catch(e) {
          // This currently falls through only on Edge (?); no other browser
          // triggers this.
        }
      }
      this.page = 'entry';
      return;
    }

    this.page = page || 'home';
  }

  _pageChanged(page, oldPage) {
    // Certain pages use the static loader and since I'd like them to
    // animate, we have multiple instances.
    if (page === 'about' || page === 'talks' || page === 'home') {
      page = 'static';
    }

    var callback = this._ensureLazyLoaded.bind(this);
    var resolvedPageUrl = './blog-' + page + '.js';
    import(resolvedPageUrl).then(callback, this._pageNotFound.bind(this));
  }

  _pageNotFound(e) {
    this.page = 'missing';
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

  static get template() {
    return html`
      <style>
        blog-pages {
          min-height: 100vh;
        }
      </style>

      <app-location route="{{route}}"></app-location>
      <app-route
          route="{{route}}"
          pattern="/:page"
          data="{{routeData}}"
          tail="{{subRoute}}"></app-route>

      <slot name="header"></slot>

      <blog-pages selected="[[page]]"
          attr-for-selected="name"
          fallback-selection="404"
          selected-class="view"
          selected-attribute="render">

        <blog-chronicle name="chronicle" offline="[[offline]]"></blog-chronicle>

        <blog-entry name="entry" route="[[subRoute]]" offline="[[offline]]"></blog-entry>

        <blog-static name="home" which="index" offline="[[offline]]"></blog-static>

        <blog-static name="about" which="about" offline="[[offline]]"></blog-static>

        <blog-static name="talks" which="talks" offline="[[offline]]"></blog-static>

        <blog-missing name="missing" offline="[[offline]]"></blog-missing>
      </blog-pages>

      <slot name="footer"></slot>

      <snack-bar hidden></snack-bar>
      `;
  }
}
customElements.define('blog-pwa', BlogPwa);