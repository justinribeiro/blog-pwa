import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {BlogUtils} from './blog-utils-mixin.js';
import './blog-network-warning.js';
import './shared-styles.js';

class BlogStatic extends BlogUtils(PolymerElement) {
  static get properties() {
    return {
      metadata: Object,
      loaded: Boolean,
      which: String,
      render: Boolean,
    };
  }

  ready() {
    super.ready();
    this.shadowRoot.querySelector('blog-network-warning')
      .addEventListener('try-reconnect', () => this.mount());
  }

  connectedCallback() {
    super.connectedCallback();
    this.mount();
  }

  resetView() {
    this.set('loaded', null);
    this.set('metadata', {});
    this.shadowRoot.querySelector('#main').innerHTML = '';
  }

  mount() {
    window.scroll(0, 0);
    if (this.which && this.render) {
      let targetUrl = '';
      if (this.which == 'index') {
        targetUrl = '/data/index.json';
      } else {
        targetUrl = '/data/' + this.which + '/index.json';
      }
      if (!this.metadata) {
        this._getResource({
          url: targetUrl,
          onLoad: (e) => {
            this._processMetaData(JSON.parse(e.target.responseText));
          },
          onError: (e) => {
            this.set('failure', true);
            if (!this.loaded) {
              this.set('loaded', false);
            }
          },
        }, 3);
      } else {
        // We already have the data for our target static page, so just set the
        // proper metadata
        this._setPageMetaData(this.metadata);
      }
    }
  }

  _processMetaData(data) {
    if (data.article !== undefined && data.article !== '' && this.render) {
      this._setPageMetaData(data);
      this.shadowRoot.querySelector('#main').innerHTML = this._unescapeHtml(
        data.article);

      this.set('metadata', data);
      this.set('loaded', true);
      this.set('failure', false);
    }
  }

  static get template() {
    return html`
      <style include="shared-styles">
        #shoutout {
          margin-bottom: 30px;
        }
        #shoutout p {
          font-size: 28px;
        }

        #posts > h2 {
          margin-bottom: 10px;
        }

        #posts {
          display: flex;
          flex-wrap: wrap;
        }

        @media (max-width: 767px) {
          #shoutout p {
            font-size: 24px;
          }
        }
      </style>

      <section id="skeleton" hidden$="{{_checkViewState(failure, loaded)}}">
        <p><hr><hr><hr><hr class="short"></p>
        <p><hr><hr><hr><hr class="short"></p>
        <p><hr><hr><hr><hr class="short"></p>
      </section>

      <div id="main" hidden$="[[!loaded]]">
        {{article}}
      </div>

      <template is="dom-if" if="{{metadata.posts}}">
        <div id="posts">
          <template is="dom-repeat" items="[[metadata.posts]]" as="post">
            <div class="post-container">
              <a href="[[post.permalink]]">
                <h3 class="date">🗒️ [[post.date]]</h3>
                <h2 class="title">[[post.title]]</h2>
              </a>
            </div>
          </template>
        </div>
      </template>
      <blog-network-warning hidden$="[[!failure]]"></blog-network-warning>
    `;
  }
}

customElements.define('blog-static', BlogStatic);
