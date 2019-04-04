import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {BlogUtils} from './blog-utils-mixin.js';
import './blog-network-warning.js';
import './shared-styles.js';

class BlogEntry extends BlogUtils(PolymerElement) {
  static get properties() {
    return {
      metadata: {
        type: Object,
        notify: true,
      },
      loaded: Boolean,
      route: Object,
      entryRoute: Object,
    };
  }

  static get observers() {
    return [
      '_routeChanged(entryRoute.title)',
      '_metaDataChanged(metadata.article)',
    ];
  }

  ready() {
    super.ready();
    this.shadowRoot.querySelector('blog-network-warning')
      .addEventListener('try-reconnect', () => this._routeChanged());
  }

  resetView() {
    this.set('loaded', null);
    this.set('metadata', {});
    this.$.metadataArticle.innerHTML = '';
  }

  mount() {
    // Meh.
    window.scroll(0, 0);

    // Technically, I would just build the string which at this point
    // with the chopping off extra things from the path might be more
    // useful in the long haul
    let getPath = location.pathname;
    const checkEnding = new RegExp('index\.php|index\.html', 'g');
    if(checkEnding.test(location.pathname)) {
        getPath = location.pathname.replace(/index\.php|index\.html/g, '');
    }
    const targetUrl = `/data${getPath}index.json`;

    this._getResource({
      url: targetUrl,
      onLoad: (e) => {
        this.set('metadata', JSON.parse(e.target.responseText));
      },
      onError: (e) => {
        this.set('loaded', false);
        this.set('failure', true);
      },
    }, 3);
  }

  _generatedShareLinks() {
      this.set('twitterShare', 'https://twitter.com/intent/tweet?url=' +
      this.metadata.prmalink + '&text=' + this.metadata.title +
      ' via @justinribeiro');

      this.set('facebookShare', 'https://www.facebook.com/sharer.php?u=' +
        this.metadata.permalink);

      this.set('gplusShare', 'https://plus.google.com/share?url=' +
        this.metadata.permalink);

      this.set('linkedinShare',
        'https://www.linkedin.com/shareArticle?mini=true&url=' +
        this.metadata.permalink + '&title=' + this.metadata.title +
        '&source=&summary=' + this.metadata.description);

      this.set('emailShare', 'mailto:?subject=Article: ' + this.metadata.title +
        '&body=Article from Justin Ribeiro: "' + this.metadata.permalink + '"');
  }

  _metaDataChanged() {
    if (this.metadata.article !== undefined && this.metadata.article !== '') {
      const parseHTML = this._unescapeHtml(this.metadata.article);

      const ViewerRequired = new RegExp('(<\/stl\-part\-viewer>)', 'g');
      if(ViewerRequired.test(parseHTML)) {
        import('./3d-utils.js');
      }

      const CodeBlockRequired = new RegExp('(<\/code\-block>)', 'g');
      if(CodeBlockRequired.test(parseHTML)) {
        import('./code-block.js');
      }

      this.$.metadataArticle.innerHTML = parseHTML;

      this._setPageMetaData(this.metadata);
      this._generatedShareLinks();

      this.set('failure', false);
      this.set('loaded', true);
    }
  }

  static get template() {
    return html`
      <style include="shared-styles">
        #main iframe, #main img {
          max-width: 100%;
          width: 100%;
        }

        #main img {
          margin: auto;
          display: block;
        }

        #main video {
          max-width: 100%;
        }

        time {
          text-transform: uppercase;
        }

        .dotDivider {
          padding-right: .45em;
          padding-left: .45em;
        }
        .dotDivider:after {
          content: '·';
        }

        .reads {
          margin-top: 10px;
        }

        #metaShare {
          display: block;
          background-color: var(--section-color);
          padding: 1em;
        }

        #share > a {
          margin-right: 0.5em;
        }

        .hidden {
          display: none !important;
        }
      </style>

      <section id="skeleton" hidden\$="{{_checkViewState(failure, loaded)}}">
      <p></p><hr><hr><hr><hr class="short"><p></p>
      <p></p><hr><hr><hr><hr class="short"><p></p>
      <p></p><hr><hr><hr><hr class="short"><p></p>
      </section>

      <article itemprop="blogPost" id="main" hidden\$="[[!loaded]]" itemscope=""
        itemtype="http://schema.org/BlogPosting">
      <header>
        <h1 itemprop="headline">[[metadata.title]]</h1>
        <div class="reads">
          <time datetime\$="[[metadata.dataModified]]" itemprop="datePublished">
            [[metadata.date]]
          </time>
          <span class="dotDivider"></span> [[metadata.readingtime]] min read
        </div>
      </header>
      <div id="metadataArticle" itemprop="articleBody"></div>
      <footer id="metaShare">
        <div>
          <h3>Share this piece</h3>
          <p id="share"><a href\$="[[twitterShare]]">Twitter</a> <a href\$="[[facebookShare]]">Facebook</a> <a href\$="[[gplusShare]]">G+</a> <a href\$="[[linkedinShare]]">LinkedIn</a> <a href\$="[[emailShare]]">Email</a></p>
          <p>Author Justin Ribeiro wrote [[metadata.words]] words for this piece and hopes you enjoyed it. Find an issue? <a href="https://github.com/justinribeiro/blog-pwa/issues">File a ticket</a> or <a href\$="https://github.com/justinribeiro/blog-pwa/tree/master/hugo/content/[[metadata.filename]]">edit this on Github.</a></p>
        </div>
      </footer>
      </article>

      <blog-network-warning hidden$="[[!failure]]"></blog-network-warning>
    `;
  }

}
customElements.define('blog-entry', BlogEntry);
