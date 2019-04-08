import BlogElement from './blog-element.js';
import {css, html} from 'lit-element';

class BlogEntry extends BlogElement {
  async mount() {
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

    try {
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      this.metadata = await response.json();
      this._processMetaData();
      this.failure = false;
    } catch (error) {
      this.failure = true;
      this.loaded = false;
    }
  }

  resetView() {
    this.loaded = null;
    this.metadata = {
      posts: null,
      article: '',
      title: '',
      dataModified: '',
      date: '',
      readingtime: '',
      permalink: '',
      description: '',
      filename: '',
    };

    const dom = this.shadowRoot.querySelector('#metadataArticle');
    if (dom && dom.innerHTML !== '') {
      dom.innerHTML = '';
    }
  }

  _generatedShareLinks() {
    this.share.twitter = `https://twitter.com/intent/tweet?url=${this.metadata.permalink}&text=${this.metadata.title} via @justinribeiro`;
    this.share.facebook = `https://www.facebook.com/sharer.php?u=${this.metadata.permalink}`;
    this.share.linkedin = `https://www.linkedin.com/shareArticle?mini=true&url=${this.metadata.permalink}&title=${this.metadata.title}&source=&summary=${this.metadata.description}`;
    this.share.email = `mailto:?subject=Article: ${this.metadata.title}&body=Article from Justin Ribeiro: ${this.metadata.permalink}`;
  }

  _processMetaData() {
    if (this.metadata.article !== undefined && this.metadata.article !== '') {
      const parseHTML = this._unescapeHtml(this.metadata.article);

      const ViewerRequired = new RegExp('(<\/stl\-part\-viewer>)', 'g');
      if (ViewerRequired.test(parseHTML)) {
        __import('3d-utils.js');
      }

      const CodeBlockRequired = new RegExp('(<\/code\-block>)', 'g');
      if (CodeBlockRequired.test(parseHTML)) {
        __import('code-block.js');
      }

      this.shadowRoot.querySelector('#metadataArticle').innerHTML = parseHTML;

      this._setPageMetaData(this.metadata);
      this._generatedShareLinks();

      this.failure = false;
      this.loaded = true;
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
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
      `
    ];
  }

  render() {
    return html`
      <section id="skeleton" ?hidden="${this.__checkViewState(this.failure, this.loaded)}">
      <p></p><hr><hr><hr><hr class="short"><p></p>
      <p></p><hr><hr><hr><hr class="short"><p></p>
      <p></p><hr><hr><hr><hr class="short"><p></p>
      </section>

      <article itemprop="blogPost" id="main" itemscope=""
        itemtype="http://schema.org/BlogPosting" ?hidden="${!this.loaded}">
      <header>
        <h1 itemprop="headline">${this.metadata.title}</h1>
        <div class="reads">
          <time datetime="${this.metadata.dataModified}" itemprop="datePublished">
            ${this.metadata.date}
          </time>
          <span class="dotDivider"></span> ${this.metadata.readingtime} min read
        </div>
      </header>
      <div id="metadataArticle" itemprop="articleBody"></div>
      <footer id="metaShare">
        <div>
          <h3>Share this piece</h3>
          <p id="share">
            <a href="${this.share.twitter}">Twitter</a>
            <a href="${this.share.facebook}">Facebook</a>
            <a href="${this.share.linkedin}">LinkedIn</a>
            <a href="${this.share.email}">Email</a>
          </p>
          <p>Author Justin Ribeiro wrote ${this.metadata.words} words for this piece and hopes you enjoyed it. Find an issue? <a href="https://github.com/justinribeiro/blog-pwa/issues">File a ticket</a> or <a href="https://github.com/justinribeiro/blog-pwa/tree/master/hugo/content/${this.metadata.filename}">edit this on Github.</a></p>
        </div>
      </footer>
      </article>

      <blog-network-warning ?hidden="${!this.failure}"></blog-network-warning>
    `;
  }
}
customElements.define('blog-entry', BlogEntry);
