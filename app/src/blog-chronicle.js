import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
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
        #posts > h2 {
          margin-bottom: 10px;
        }

        #posts {
          display: flex;
          flex-wrap: wrap;
        }
      </style>

      <div id="main">
        <div>
          <h1>Chronicle Archives</h1>
          <p>The definition of a chronicle, as defined by Merriam-Webster is:</p>
          <blockquote>a usually continuous historical account of events arranged in order of time without analysis or interpretation</blockquote>
          <p>My chronicles aren’t exactly without analysis, but they are listing of events and happenings. The latest events are listed on the home page and the archives are presented below.</p>
        </div>
        <div id="posts">
          <template is="dom-repeat" items="[[blog.posts]]" as="post">
            <div class="post-container">
              <a href="[[post.permalink]]">
                <h3 class="date">🗒️ [[post.date]]</h3>
                <h2 class="title">[[post.title]]</h2>
              </a>
            </div>
          </template>
        </div>
      </div>

      <blog-network-warning hidden$="[[!failure]]"></blog-network-warning>
    `;
  }
}
customElements.define('blog-chronicle', BlogChronicle);
