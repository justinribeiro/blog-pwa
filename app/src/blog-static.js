import BlogElement from './blog-element.js';
import {css, html} from 'lit-element';

class BlogStatic extends BlogElement {
  /**
   * @param {string} which
   */
  async mount(which) {
    if (which || this.which !== '') {

      if (which !== '') {
        this.which = which;
      }

      window.scroll(0, 0);
      let targetUrl = '';
      if (this.which === 'index' || this.which === '') {
        targetUrl = '/data/index.json';
      } else {
        targetUrl = '/data/' + this.which + '/index.json';
      }
      if (!this.metadata || this.metadata.view !== this.which) {
        try {
          const response = await fetch(targetUrl);
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          const data = await response.json();
          this._processMetaData(data, this.which);
          this.failure = false;
        } catch (error) {
          this.failure = true;
          if (!this.loaded) {
            this.loaded = false;
          }
        }
      } else {
        // We already have the data for our target static page, so just set the
        // proper metadata
        this._setPageMetaData(this.metadata);
      }
    }
  }

  /**
   * @param {{ posts: array; article: string; view: string; }} data
   * @param {string} view
   */
  _processMetaData(data, view) {
    if (data.article !== undefined && data.article !== '') {
      data.view = view;
      this._setPageMetaData(data);
      this.shadowRoot.querySelector('#main').innerHTML = this._unescapeHtml(
        data.article);

      this.metadata = data;
      this.shadowRoot.querySelector('#skeleton').setAttribute('hidden', '');
      this.shadowRoot.querySelector('#main').removeAttribute('hidden');
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
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
      `
    ];
  }

  render() {
    return html`
      <section id="skeleton" ?hidden="${this.__checkViewState(this.failure, this.loaded)}">
        <p><hr><hr><hr><hr class="short"></p>
        <p><hr><hr><hr><hr class="short"></p>
        <p><hr><hr><hr><hr class="short"></p>
      </section>

      <div id="main" hidden></div>

      ${this.metadata.posts?
        html`<div id="posts">
          ${this.metadata.posts.map(post =>
             html`<div class="post-container">
              <a href="${post.permalink}">
                <h3 class="date">🗒️ ${post.date}</h3>
                <h2 class="title">${post.title}</h2>
              </a>
          </div>`)}
        </div>`:
        html``}

      <blog-network-warning ?hidden="${!this.failure}"></blog-network-warning>
    `;
  }
}

customElements.define('blog-static', BlogStatic);
