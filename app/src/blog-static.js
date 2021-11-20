import { BlogElement, html, css } from './blog-element.js';

class BlogStatic extends BlogElement {
  static styles = [
    super.styles,
    css`
      :host {
        min-height: 100vh;
      }

      #posts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        justify-content: center;
        grid-gap: var(--space-cs);
      }

      #posts > a {
        display: block;
        padding: var(--space-cs);
        border-bottom: none;
        border-radius: var(--space-cs);
        transition-duration: var(--motion-duration);
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
        margin-bottom: var(--space-cs);
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

      #shoutout {
        margin-top: 0.5rem;
      }

      p.more {
        text-align: center;
      }

      a.more {
        border: var(--border-thickness) solid var(--structs-border);
        border-radius: var(--border-radius);
        padding: var(--space-cs);
        background: var(--structs-bg);
        line-height: calc((var(--space-cs) * 2) + var(--font-base));
      }
    `,
  ];

  async __processPageData() {
    super.__processPageData();

    if (this.metadata.enableMastodonPhotos) {
      import('./ribeiro-social-photos.js');
    }
  }

  render() {
    return html`
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
            <br />
            <p class="more">
              <a class="more" href="/chronicle/"
                >More posts and articles &raquo;
              </a>
            </p>
          `
        : html``}
      ${this.metadata.enableMastodonPhotos
        ? html`
            <h2>The Latest Photographs</h2>
            <ribeiro-social-photos> Fetching... </ribeiro-social-photos>
            <br />
            <p class="more">
              <a class="more" href="https://ribeiro.social/@justin"
                >More photographs &raquo;
              </a>
            </p>
          `
        : ``}
    `;
  }
}

customElements.define('blog-static', BlogStatic);
