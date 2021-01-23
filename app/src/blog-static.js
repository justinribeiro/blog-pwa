import BlogElement from './blog-element.js';
import { css, html } from 'lit-element';

class BlogStatic extends BlogElement {
  static get styles() {
    return [
      super.styles,
      css`
        #shoutout p {
          font-size: 28px;
        }

        .talk {
          margin-top: 1rem;
        }

        #posts {
          display: flex;
          flex-wrap: wrap;
          margin: auto;
          max-width: 800px;
        }

        .post-container {
          min-height: 125px;
          width: calc(50% - 1rem);
        }

        .post-container a {
          min-height: 100px;
          display: block;
          padding: 20px;
          border-bottom: none;
          border-radius: 0.5rem;
          transition-property: background-color;
          transition-duration: 0.3s;
          will-change: background-color;
        }

        .post-container a h2 {
          color: var(--accent-color-primary);
          font-weight: 400;
          font-family: var(--font-family-serif);
        }

        .post-container a h3 {
          font-weight: 400;
          text-transform: uppercase;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
          font-family: var(--font-family-sans-serif);
          color: var(--accent-color-secondary);
        }

        .post-container a:hover {
          text-decoration: none;
          background-color: hotpink;
        }

        .post-container a:hover h2,
        .post-container a:hover h3 {
          color: #fff !important;
        }

        .post-container a span {
          font-size: 14px;
          color: var(--accent-color-primary);
        }

        #posts > h2 {
          margin-bottom: 10px;
        }

        #tags {
          margin: 0.5em 0;
        }

        @media (max-width: 767px) {
          #posts {
            margin: auto;
            max-width: 800px;
          }
          .post-container {
            width: 100%;
          }

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
      </div>
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
    `;
  }
}

customElements.define('blog-static', BlogStatic);
