import { BlogElement, html, css } from './blog-element.js';

class BlogStatic extends BlogElement {
  static styles = [
    super.styles,
    css`
      :host {
        min-height: 100vh;
        margin: auto auto;
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
        margin-right: var(--space-cs);
      }
    `,
  ];

  async __processPageData() {
    super.__processPageData();

    // because the "more" buttons are outside the render() of the page data
    // which causes a CLS shift of weirdness; this is imperfect at best
    await this.updateComplete;
  }

  render() {
    return html`
      <h1 itemprop="headline">${this.metadata.title}</h1>
      <h2 class="subheadline">${this.metadata.description}</h2>
      <section>${this.articleBody}</section>
      ${this.metadata.posts
        ? html`
            <div id="posts">
              ${this.metadata.posts.map(
                post => html`
                  <a href="${post.permalink}">
                    <h3>${post.title}</h3>
                    <p>
                      <time
                        .datetime="${post.dataModified}"
                        aria-label="Posted ${post.date}"
                      >
                        🗒️ ${post.date}
                      </time>
                      • ${post.readingtime} min read
                    </p>
                  </a>
                `,
              )}
            </div>
            <br />
            <p class="more" ?hidden=${this.clsSteady === false}>
              <a class="more" href="/chronicle/"
                >More posts and articles &raquo;
              </a>
            </p>
          `
        : html``}
    `;
  }
}

customElements.define('blog-static', BlogStatic);
