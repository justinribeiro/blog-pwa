import { LitElement, html } from 'lit';

class BlogNetworkWarning extends LitElement {
  static get properties() {
    return {
      availableUrls: {
        type: Array,
      },
      hidden: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  constructor() {
    super();
    this.availableUrls = [];
    this.hidden = true;
  }

  _tryReconnect() {
    this.dispatchEvent(
      new CustomEvent('try-reconnect', {
        bubbles: false,
        composed: true,
      }),
    );
  }

  __getDataCache() {
    caches.open('data-cache').then(cache => {
      cache.keys().then(keys => {
        keys.forEach(async request => {
          const cacheGet = await fetch(request);
          const cacheData = await cacheGet.json();
          if (cacheData.title) {
            this.availableUrls.push(cacheData);

            // ugly hack, I'm tired
            await this.requestUpdate();
          }
        });
      });
    });
  }

  attributeChangedCallback(name, oldval, newval) {
    if (name === 'hidden' && newval === null) {
      this.__getDataCache();
    }
    super.attributeChangedCallback(name, oldval, newval);
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          padding: 40px 20px;
          text-align: center;
        }

        #main {
          margin: auto;
          max-width: 400px;
        }

        svg {
          display: inline-block;
          width: 150px;
          height: 150px;
        }
      </style>

      <div id="main" aria-hidden="${this.hidden}">
        <div>
          <svg viewbox="0 0 24 24">
            <g id="no-internet">
              <path
                fill-opacity=".3"
                d="M24.24 8l1.35-1.68C25.1 5.96 20.26 2 13 2S.9 5.96.42 6.32l12.57 15.66.01.02.01-.01L20 13.28V8h4.24z"
              ></path>
              <path d="M22 22h2v-2h-2v2zm0-12v8h2v-8h-2z"></path>
            </g>
          </svg>
          <h1>No internet connection.</h1>
          <p>Argh! Is the wifi lying to you? Are you in a tunnel?</p>
          <p>
            While you wait for your internet connection to come back online, here are some articles
            and pages you've visited that you can read offline.
          </p>
          ${this.availableUrls.map(post => html` <a href="${post.permalink}"> ${post.title} </a> `)}
        </div>
        <button @click="${this._tryReconnect}">Reload and Try Connection Again</button>
      </div>
    `;
  }
}

customElements.define('blog-network-warning', BlogNetworkWarning);
