import { BlogElement, html, css } from './blog-element.js';

class BlogStatic extends BlogElement {
  static get styles() {
    return [
      super.styles,
      css`
        #posts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          justify-content: center;
          grid-gap: 0.5rem;
        }

        #posts > a {
          display: block;
          padding: 0.5rem;
          border-bottom: none;
          border-radius: 0.5rem;
          transition-duration: 0.3s;
          will-change: background-color;
        }

        #posts > a h3 {
          color: var(--accent-color-primary);
          font-weight: 400;
          font-family: var(--font-family-serif);
          font-size: 1.5rem;
        }

        #posts > a time {
          font-weight: 400;
          text-transform: uppercase;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
          font-family: var(--font-family-sans-serif);
          color: var(--accent-color-secondary);
        }

        #posts > a:hover {
          text-decoration: none;
          background-color: hotpink;
        }

        #posts > a:hover time,
        #posts > a:hover h3 {
          color: #fff;
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
                    <a href="${post.permalink}">
                      <time
                        .datetime="${post.dataModified}"
                        aria-label="Posted ${post.date}"
                      >
                        🗒️ ${post.date}
                      </time>
                      <h3>${post.title}</h3>
                    </a>
                  `
                )}
              </div>
            `
          : html``}
      </div>

      <blog-network-warning ?hidden="${!this.failure}"></blog-network-warning>
    `;
  }
}

customElements.define('blog-static', BlogStatic);
