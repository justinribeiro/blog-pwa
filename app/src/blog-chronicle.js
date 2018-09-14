import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-list/iron-list.js';
import {BlogUtils} from './blog-utils-mixin.js';
import './blog-network-warning.js';
import './shared-styles.js';

class BlogChronicle extends BlogUtils(PolymerElement) {
  static get properties() {
    return {
      blog: Object,
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

  mount() {
    this._setPageMetaData({
      title: 'Chronicle Archives',
      description: 'An archive of blog posts, thoughts, and other musings from Justin Ribeiro. Pulling. It. Off.',
    });

    // TODO year filter via route target match
    this._getResource({
      url: '/data/chronicle/index.json',
      onLoad: (e) => {
        this.set('blog', JSON.parse(e.target.responseText));

        // failsafe
        setTimeout(() => {
          this.shadowRoot.querySelector('iron-list').notifyResize();
        }, 2000);

        this.set('failure', false);
      },
      onError: (e) => {
        this.set('failure', true);
      },
    }, 3);
  }

  static get template() {
    return html`
      <style include="shared-styles">
        #main {
          margin: initial;
          max-width: initial;
          padding-right: 0;
          padding-left: 0;
          display: block;
          width: 100%;
        }

        #main > div {
          margin: auto;
          padding: 0 20px;
          max-width: 800px;
        }

        #main > iron-list {
          margin: auto;
          padding: 0 20px;
          width: 800px;
        }

        iron-list {
          flex: 1 1 auto;
        }

        @media (max-width: 767px) {
          #main {
            position: absolute;
            padding-top: 80px;
            height: 100vh;
            overflow-y: scroll;
          }
          #main > iron-list {
            width: initial;
            margin: initial;
          }
        }
      </style>

      <div id="main">
        <div>
          <h1>Chronicle Archives</h1>
          <p>The definition of a chronicle, as defined by Merriam-Webster is:</p>
          <blockquote>a usually continuous historical account of events arranged in order of time without analysis or interpretation</blockquote>
          <p>My chronicles aren’t exactly without analysis, but they are listing of events and happenings. The latest events are listed on the home page and the archives are presented below.</p>
        </div>
        <iron-list scroll-target="main" items="[[blog.posts]]" as="post" grid>
          <template>
            <div class="post-container">
              <a href="[[post.permalink]]">
                <h3 class="date">🗒️ [[post.date]]</h3>
                <h2 class="title">[[post.title]]</h2>
              </a>
            </div>
          </template>
        </iron-list>
      </div>

      <blog-network-warning hidden$="[[!failure]]"></blog-network-warning>
    `;
  }
}
customElements.define('blog-chronicle', BlogChronicle);
