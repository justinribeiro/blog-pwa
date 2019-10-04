import BlogElement from './blog-element.js';
import {css, html} from 'lit-element';

class BlogChronicle extends BlogElement {
  resetView() {
    this.loaded = null;
    this.metadata = {
      posts: [],
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

  async mount() {
    window.scroll(0, 0);

    this._setPageMetaData({
      title: 'Chronicle Archives',
      description:
        'An archive of blog posts, thoughts, and other musings from Justin Ribeiro. Pulling. It. Off.',
    });

    try {
      let getPath = location.pathname;
      const checkEnding = new RegExp('index.php|index.html', 'g');
      if (checkEnding.test(location.pathname)) {
        getPath = location.pathname.replace(/index\.php|index\.html/g, '');
      }
      const targetUrl = `/data${getPath}index.json`;

      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      this.metadata = await response.json();
      this._processMetaData();

      this.failure = false;
    } catch (error) {
      this.failure = true;
    }
  }

  async _processMetaData() {
    if (this.metadata.article !== undefined && this.metadata.article !== '') {
      const parseHTML = this._unescapeHtml(this.metadata.article);

      this.shadowRoot.querySelector('#metadataArticle').innerHTML = parseHTML;

      this._setPageMetaData(this.metadata);

      this.failure = false;
      this.loaded = true;
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        #posts > h2 {
          margin-bottom: 10px;
        }

        #posts {
          display: flex;
          flex-wrap: wrap;
        }
      `,
    ];
  }

  render() {
    return html`
      <div id="main">
        <div id="metadataArticle"></div>
        <div id="posts">
          ${this.metadata.posts.map(
            post =>
              html`
                <div class="post-container">
                  <a href="${post.permalink}">
                    <h3 class="date">🗒️ ${post.date}</h3>
                    <h2 class="title">${post.title}</h2>
                  </a>
                </div>
              `,
          )}
        </div>
      </div>

      <blog-network-warning ?hidden="${!this.failure}"></blog-network-warning>
    `;
  }
}
customElements.define('blog-chronicle', BlogChronicle);
