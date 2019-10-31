import BlogElement from './blog-element.js';
import {css, html} from 'lit-element';

class BlogStatic extends BlogElement {
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

        #tags {
          margin: 0.5em 0;
        }

        @media (max-width: 767px) {
          #shoutout p {
            font-size: 24px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div id="main" ?hidden=${!this.loaded}>
        <div id="metadataArticle"></div>
        ${this.metadata.posts
          ? html`
              <div id="posts">
                ${this.metadata.posts.map(
                  post => html`
                    <div class="post-container">
                      <a href="${post.permalink}">
                        <h3 class="date">🗒️ ${post.date}</h3>
                        <h2 class="title">${post.title}</h2>
                      </a>
                    </div>
                  `,
                )}
              </div>
            `
          : html``}
        <blog-network-warning ?hidden="${!this.failure}"></blog-network-warning>
      </div>
    `;
  }
}

customElements.define('blog-static', BlogStatic);
