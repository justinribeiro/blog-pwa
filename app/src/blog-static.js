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
        display: inline;
        border-bottom: 1px solid var(--accent-color-primary);
      }

      #posts > a p {
        font-weight: 400;
        text-transform: uppercase;
        font-size: 0.85rem;
        margin-bottom: var(--space-cs);
        font-family: var(--font-family-sans-serif);
        color: var(--accent-color-secondary);
      }

      #posts > a p {
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

      #posts > a:hover p,
      #posts > a:hover h3 {
        color: #fff;
      }

      #posts > a:hover h3 {
        border-bottom: 1px solid #fff;
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

    if (this.metadata.enableMastodonPhotos) {
      import('./lod-ribeiro-social-photos.js');
      import('./lod-youtube-list.js');
    }

    // because the "more" buttons are outside the render() of the page data
    // which causes a CLS shift of weirdness; this is imperfect at best
    await this.updateComplete;
    this.clsSteady = true;
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
      ${this.metadata.enableMastodonPhotos
        ? html`
            <h2>The Latest Photographs</h2>
            <ribeiro-social-photos> Fetching... </ribeiro-social-photos>
            <br />
            <p class="more" ?hidden=${this.clsSteady === false}>
              More photographs:
              <a class="more" rel="me" href="https://ribeiro.social/@justin">
                Ribeiro.Social
              </a>

              <a
                class="more"
                rel="me"
                href="https://www.instagram.com/justin.d.ribeiro/"
              >
                Instagram
              </a>
            </p>

            <h2>The Latest Videos</h2>
            <youtube-video-list> Fetching... </youtube-video-list>
            <br />
            <p class="more" ?hidden=${this.clsSteady === false}>
              More Videos:
              <a
                class="more"
                rel="me"
                href="https://youtube.com/justinribeiro/videos"
              >
                YouTube
              </a>

              <a
                class="more"
                rel="me"
                href="https://www.instagram.com/justin.d.ribeiro/reels/"
              >
                Instagram Reels
              </a>

              <a
                class="more"
                rel="me"
                href="https://www.tiktok.com/@justin.d.ribeiro"
                >TikTok
              </a>
            </p>
          `
        : ``}
    `;
  }
}

customElements.define('blog-static', BlogStatic);
