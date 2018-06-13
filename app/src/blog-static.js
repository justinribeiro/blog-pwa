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

  resetView() {
    this.set('loaded', null);
    this.set('metadata', {});
    this.shadowRoot.querySelector('#main').innerHTML = '';
  }

  /**
    * Called every time the element is inserted into the DOM. Useful for
    * running setup code, such as fetching resources or rendering.
    * Generally, you should try to delay work until this time.
    */
  connectedCallback() {
    super.connectedCallback();
    this.mount();
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
      }
    }
  }

  _processMetaData(data) {
    if (data.article !== undefined && data.article !== ''
        && this.render) {
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
        :host {
          display: block;
        }

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

      <div id="main" hidden$="[[!loaded]]">
        {{article}}
      </div>

      <template is="dom-if" if="{{metadata.posts}}">
        <div id="posts">
          <template is="dom-repeat" items="[[metadata.posts]]" as="post">
            <div class="post-container">
              <a href="[[post.permalink]]">
                <h3 class="date">[[post.date]]</h3>
                <h2 class="title">[[post.title]]</h2>
              </a>
            </div>
          </template>
        </div>
      </template>

      <section id="skeleton" hidden$="{{_checkViewState(failure, loaded)}}">
        <p><hr><hr><hr><hr class="short"></p>
        <p><hr><hr><hr><hr class="short"></p>
        <p><hr><hr><hr><hr class="short"></p>
      </section>

      <blog-network-warning hidden$="[[!failure]]"
          on-try-reconnect="mount">
      </blog-network-warning>
    `;
  }
}

customElements.define('blog-static', BlogStatic);
