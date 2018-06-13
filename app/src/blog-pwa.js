import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {afterNextRender} from '@polymer/polymer/lib/utils/render-status.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-image/iron-image.js';
import './blog-pages.js';
import './blog-entry.js';
import './shared-styles.js';

class BlogPwa extends PolymerElement {
  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      offline: {
        type: Boolean,
        value: false
      },
      showSnackBar: {
        type: Boolean,
        value: false,
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

    this.removeAttribute('unresolved');

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
                          this._setSnackBarText('Hi there! New and updated content is now available. Refresh page to view. <a href="javascript:window.location.reload(true);">Refresh</a>', true);
                        } else {
                          this._setSnackBarText('Good news: I used some cutting edge web tech to make some content available offline!', true);
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

  _setSnackBarText(text, timeout = 6000) {
    this.shadowRoot.querySelector('snack-bar').innerHTML = text;
    this.showSnackBar = true;
    setTimeout(() => {
      this.showSnackBar = false;
    }, timeout)
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


        nav {
          margin-top: 10px;
        }

        nav a {
          margin: 0 5px;
          font-size: 16px;
          text-transform: uppercase;
          line-height: 2em;
        }

        #me {
          width: 100px;
          height: 100px;
          border-radius: 10%;
          margin: 0 25px;
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

        @media (max-width: 767px) {
          header {
            height: 100px;
          }

          header h1 {
            margin: 0;
            font-size: 24px;
          }

          header div:first-child {
            display: flex;
          }

          header nav a:first-child {
            margin: 0 5px 0 0;
          }

          #me {
            width: 75px;
            height: 75px;
            margin: 0 15px 0 0;
          }

          /* mobile safari with a column layout won't calc, add min-height */
          footer > div {
            @apply(--layout-vertical);
            min-height: 500px;
          }
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

      <!-- Why is header not a component? Could be, probably should be. -->
      <header>
        <div>
          <iron-image id="me" sizing="contain" preload fade
              src="/images/manifest/me-2018-150.jpg" alt="Justin Ribeiro">
          </iron-image>
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

      <footer>
        <div>
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

      <snack-bar active$="{{showSnackBar}}"></snack-bar>
      `;
  }
}
customElements.define('blog-pwa', BlogPwa);