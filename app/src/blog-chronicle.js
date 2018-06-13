import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {BlogUtilsBehavior} from './blog-utils-behavior.js';
import '@polymer/iron-list/iron-list.js';
import './shared-styles.js';
import './blog-utils-behavior.js';
import './blog-network-warning.js';


class BlogChronicle extends BlogUtilsBehavior(PolymerElement) {
  /**
    * Object describing property-related metadata used by Polymer features
    */
  static get properties() {
    return {
      blog: Object,
      offline: Boolean,
      failure: Boolean,
      showing: Boolean
    };
  }

  /**
    * Array of strings describing multi-property observer methods and their
    * dependant properties
    */
  static get observers() {
    return [
      '_showChanged(showing)'
    ];
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

  _showChanged() {
    if (this.showing) {
      this.mount();
      this._setPageMetaData({
        title: 'Chronicle Archives',
        description: 'An archive of blog posts, thoughts, and other musings from Justin Ribeiro. Pulling. It. Off.'
      });
    }
  }

  mount(target) {
    // TODO year filter via route target match
    this._getResource({
      url: '/data/chronicle/index.json',
      onLoad: function(e) {
        this.set('blog', JSON.parse(e.target.responseText));

        // failsafe
        this.shadowRoot.querySelector('iron-list').notifyResize();
        this.set('failure', false);
      },
      onError: function(e) {
        this.set('failure', true);
      }
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
          overflow-y: scroll;
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
            padding-top: 125px;
            height: 100vh;
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
                <h3 class="date">[[post.date]]</h3>
                <h2 class="title">[[post.title]]</h2>
              </a>
            </div>
          </template>
        </iron-list>
      </div>

      <blog-network-warning hidden$="[[!failure]]" offline="[[offline]]"
        on-try-reconnect="_tryConnect"></blog-network-warning>
    `;
  }
}
customElements.define('blog-chronicle', BlogChronicle);