import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {afterNextRender} from '@polymer/polymer/lib/utils/render-status.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-image/iron-image.js';
import './blog-pages.js';
import './blog-entry.js';
import './shared-styles.js';

class BlogPwa extends PolymerElement {

  /**
   * Object describing property-related metadata used by Polymer features
   */
  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      offline: Boolean,
      _a11yLabel: String
    };
  }

  /**
    * Array of strings describing multi-property observer methods and their
    * dependant properties
    */
  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }
  // listeners: {
  //   'announce': '_onAnnounce',
  //   'analytics': '_onAnalytics'
  // },

  /**
   * Use for one-time configuration of your component after local DOM is
   * initialized.
   */
  ready() {
    super.ready();

    this.removeAttribute('unresolved');

    afterNextRender(this, (_) => {
      window.addEventListener('online', () => _notifyNetworkStatus(false));
      window.addEventListener('offline', () => _notifyNetworkStatus(true));
    });
  }

  // PRPL all the things.
  _ensureLazyLoaded() {
    if (!this.loadComplete) {
      afterNextRender(this, () => {

        import('./lazy-resources.js').then((_) => {
          // I have this notion that I'm going to use this for other things
          // so I load it up now after the resource load.
          if (!this._noticeBar) {
            this._noticeBar = document.createElement('blog-noticebar');
            this.shadowRoot.appendChild(this._noticeBar);
          }

          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
              .then((registration) => {
                registration.onupdatefound = () => {
                  const installingWorker = registration.installing;

                  installingWorker.onstatechange = () => {
                    switch (installingWorker.state) {
                      case 'installed':
                        if (navigator.serviceWorker.controller) {
                          this._noticeBar.setText('Hi there! New and updated content is now available. Refresh page to view. <a href="javascript:window.location.reload(true);">Refresh</a>', true);
                        } else {
                          this._noticeBar.setText('Good news: I used some cutting edge web tech to make some content available offline!', true);
                        }
                        break;
                      case 'redundant':
                        // Error! Bad! No!
                        break;
                    }
                  }
                }
              })
              .catch((e) => {
                console.error('SW error on install', e.toString());
              });
          }

          this._notifyNetworkStatus();
          this.loadComplete = true;
        }, this._pageNotFound.bind(this));
      });
    }
  }

  // This is nearly one for one out of the Polymer Shop demo with some minor
  // changes that don't affect it's function.
  _notifyNetworkStatus() {
    const oldOffline = this.offline;
    this.offline =  !navigator.onLine;

    if (this.offline || (!this.offline && oldOffline === true)) {

      // Why do this if _noticeBar is lazy loaded and called after that
      // completes? Because there is a case that the listener is setup first
      // which means if the state changes it may not be done..
      // Mind you, that's a larger issue than it seems, but this suffices in
      // most cases.
      if (!this._noticeBar) {
        this._noticeBar = document.createElement('blog-noticebar');
        this.shadowRoot.appendChild(this._noticeBar);
      }
      var offlineState = this.offline ? 'You are offline.' : 'You are online.';
      this._noticeBar.setText(offlineState, true);
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

      // TODO dangerous assumption for cross-post movement, but since I'm
      // not using related yet, leave for now
      //if (this.page === 'entry') {
      //  return;
      //}

      // TODO Humm skeleton re-create...don't like it.
      if (this.shadowRoot.querySelector('blog-entry').constructor !== HTMLElement) {
        this.shadowRoot.querySelector('blog-entry').resetView();
      }
      this.page = 'entry';
      return;
    }

    this.page = page || 'home';
  }

  _pageChanged(page, oldPage) {
    if (page === 'chronicle') {
      this.shadowRoot.querySelector("footer").hidden = true;
    } else {
      this.shadowRoot.querySelector("footer").hidden = false;
    }

    if (page === 'entry') {
      // According to Analytics, this is my most trafficed start point for
      // users. We load this at the start, lazy load the rest.
      this._ensureLazyLoaded();
    } else {

      // Certain pages use the static loader and since I'd like them to
      // animate, we have multiple instances.
      if (page === 'about' || page === 'talks' || page === 'home') {
        page = 'static';
      }

      var callback = this._ensureLazyLoaded.bind(this);
      var resolvedPageUrl = './blog-' + page + '.js';
      import(resolvedPageUrl).then(callback, this._pageNotFound.bind(this));
    }
  }

  // On the surface this looks simple, but it's not at the moment when it
  // comes to the online/offline connection flicker. See the
  // blog-missing.html and blog-network-warning.html for additional details
  // related to https://github.com/Polymer/polymer/pull/4209
  _pageNotFound(e) {
    this.page = 'missing';
  }

  // Elements in the app can notify a change to be a11y announced.
  _onAnnounce(e) {
    this._announce(e.detail);
  }

  // A11y announce the given message.
  _announce(message) {
    this._a11yLabel = '';
    this.debounce('_a11yAnnouncer', function() {
      this._a11yLabel = message;
    }, 100);
  }

  // Listen for things to send to GA
  _onAnalytics(e) {
    this._analytics(e.detail, 4);
  }

  // blog-implements ga('send'), so send it an object ala
  // {
  //  hitType: 'pageview',
  //  page: window.location.pathname,
  //  location: window.location.href,
  //  title: page.title
  // }
  // See documentation:
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings
  _analytics(payload, attempt) {
    // In the event that blog-analytics isn't yet lazy loaded, we don't push
    // the subject; we just set the retry and wait for it. You can do this a
    // number of ways; 4 attempts spaced at 500ms on 3G is more than
    // workable from what I found testing
    try {
      this.shadowRoot.querySelector('ga-dnt-analytics').send(payload);
    }
    catch (e) {
      this.debounce('_analytics', this._analytics.bind(this, payload, attempt - 1), 500);
    }
  }
  static get template() {
    return html`
      <style include="shared-styles">
        blog-pages {
          min-height: 100vh;
        }

        header {
          @apply(--layout-horizontal);
          @apply(--layout-center-center);
          border-bottom: 1px solid var(--structs-border);
          background-color: var(--structs-bg);
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 100;
          height: 135px;
        }

        header[small-screen] {
          height: 100px;
        }

        /*
          Zone System gradient because I still love Adam's approach.
          That, and I totally apporiated the look from Paul Lewis (his is cooler).
        */
        header:after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          content: '';
          background: linear-gradient(to right,
            #000000 0,   #1a1a1a 10%, #333333 20%, #4d4d4d 30%, #666666 40%, #808080 50%,
            #999999 60%, #b3b3b3 70%, #cccccc 80%, #e6e6e6 90%, #ffffff 100%);
        }

        header div {
          margin-top: 5px;
        }

        header h1 {
          font-weight: 100;
          margin: 0 5px;
          font-size: 32px;
        }

        header[small-screen] h1 {
          margin: 0;
          font-size: 24px;
        }

        header[small-screen] div:first-child {
          display: flex;
        }

        nav {
          margin-top: 10px;
        }

        nav a {
          margin: 0 5px;
          font-size: 16px;
          text-transform: uppercase;
          line-height: 2em;
        }

        header[small-screen] nav a:first-child {
          margin: 0 5px 0 0;
        }

        #me {
          width: 100px;
          height: 100px;
          border-radius: 10%;
          margin: 0 25px;
        }

        #me[small-screen] {
          width: 75px;
          height: 75px;
          margin: 0 15px 0 0;
        }

        footer {
          border-top: 1px solid var(--structs-border);
          background-color: var(--structs-bg);
          display: block;
        }

        footer > div {
          margin: auto;
          padding: 40px 20px 0;
          max-width: 800px;
          @apply(--layout-horizontal);
          @apply(--layout-center-justified);
        }

        /* mobile safari with a column layout won't calc, add min-height */
        footer > div[small-screen] {
          @apply(--layout-vertical);
          min-height: 500px;
        }

        footer > div section {
          @apply(--layout-flex);
        }

        #thanks {
          padding: 0 0 40px;
        }

        #thanks p {
          font-size: 14px;
          text-transform: uppercase;
          color: var(--secondary-text-color);
          font-family: "Lucida Grande","Lucida Sans Unicode","Lucida Sans",Geneva,Arial,sans-serif;
        }

        #thanks p a {
          background-image: none;
          background-repeat: initial;
          background-position: initial;
          color: var(--secondary-text-color);
          border-bottom: 1px dotted;
        }

        .announcer {
          position: fixed;
          height: 0;
          overflow: hidden;
        }

        @media (max-width: 320px) {
          header {
            text-align: center;
          }

          /* No room on smaller screens */
          header > div:first-child {
            display: none !important;
          }
        }

      </style>

      <ga-dnt-analytics key="UA-96204-3"></ga-dnt-analytics>

      <app-location route="{{route}}"></app-location>
      <app-route
          route="{{route}}"
          pattern="/:page"
          data="{{routeData}}"
          tail="{{subRoute}}"></app-route>

      <iron-media-query query="max-width: 767px" query-matches="{{smallScreen}}"></iron-media-query>

      <!-- Why is header not a component? Could be, probably should be. -->
      <header small-screen\$="[[smallScreen]]">
        <div>
          <iron-image id="me" sizing="contain" preload="" fade="" src="/images/manifest/me-2018-150.jpg" small-screen\$="[[smallScreen]]" alt="Justin Ribeiro"></iron-image>
        </div>
        <div>
          <h1>Justin Ribeiro</h1>
          <iron-selector selected="[[page]]" attr-for-selected="name" role="navigation">
            <nav>
              <a href="/">Home</a>
              <a href="/chronicle/">Blog</a>
              <a href="/talks/">Talks</a>
              <a href="/about/">About</a>
            </nav>
          </iron-selector>
        </div>
      </header>

      <blog-pages selected="[[page]]"
          attr-for-selected="name"
          fallback-selection="404"
          selected-class="view"
          selected-attribute="render">

        <blog-chronicle name="chronicle" offline="[[offline]]"></blog-chronicle>

        <blog-entry name="entry" route="[[subRoute]]" offline="[[offline]]"></blog-entry>

        <!-- Why not just swap the which prop? Because then they wouldn't animate -->
        <blog-static name="home" which="index" offline="[[offline]]"></blog-static>

        <blog-static name="about" which="about" offline="[[offline]]"></blog-static>

        <blog-static name="talks" which="talks" offline="[[offline]]"></blog-static>

        <blog-missing name="missing" offline="[[offline]]"></blog-missing>
      </blog-pages>

      <!-- Why is footer not a component? Could be, probably should be. -->
      <footer>
        <div small-screen\$="[[smallScreen]]">
          <section>
            <h2>Hello, nice to meet you.</h2>
            <p>I'm happy to talk. You can reach me via <a href="https://twitter.com/justinribeiro">Twitter</a>, <a href="https://plus.google.com/+JustinRibeiro">Google+</a>, and <a href="https://www.linkedin.com/in/justinribeiro">LinkedIn</a>.</p>

            <p>Looking for some of my code? Check <a href="https://github.com/justinribeiro">Github</a> or <a href="https://hub.docker.com/r/justinribeiro/">DockerHub</a>.</p>
          </section>
          <section>
            <h2>Meta Things</h2>
            <p><a href="https://justinribeiro.com/data/chronicle/index.xml">RSS feed</a>. RIP Reader, give <a href="https://github.com/mjibson/goread">GoRead</a> a spin.</p>
            <p>What, you found a bug on this site? Yikes. Please take a moment and <a href="">file a ticket</a> so I can fix it.</p>
          </section>
        </div>
        <div id="thanks">
          <p>Made with <span class="hotpink">❤️</span> using <a href="https://www.polymer-project.org/">Polymer</a> and <a href="https://gohugo.io/">Hugo</a>.</p>
        </div>
      </footer>

      <!-- a11y announcer, via Polymer SHOP demo -->
      <div class="announcer" aria-live="assertive">[[_a11yLabel]]</div>
      `;
  }
}
customElements.define('blog-pwa', BlogPwa);