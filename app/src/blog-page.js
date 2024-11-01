import { BlogElement, html, css } from './blog-element.js';
import { defaultStrings, stringInterpolate } from './blog-strings.js';

class BlogPage extends BlogElement {
  static properties = {
    strings: {
      type: Object,
    },
  };

  constructor() {
    super();

    // this is not a full accounting of all strings on this page; only the
    // various interaction strings in our EcmaScript
    this.strings = {
      ...defaultStrings,
    };
  }

  firstUpdated() {
    super.firstUpdated();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  static styles = [
    super.styles,
    css`
      :host {
        min-height: 100vh;

        /* these are fancy pages, blow it out  */
        max-width: initial;
        width: 100%;
        padding: initial;

        --blog-page-spacer-x: 3;
      }

      @media (min-width: 769px) {
        :host {
          --blog-page-spacer-x: 7;
        }
      }

      header h1,
      header h2 {
        text-align: center;
      }

      #subHeader h1 {
        font-size: calc(var(--font-h1) / 2.2);
        font-family: var(--font-family-sans-serif);
        line-height: 1.15;
        letter-spacing: 0.01rem;
        text-transform: uppercase;
        margin: calc(var(--space-cs) * 3);
      }

      #subHeader h2 {
        font-size: var(--font-h1);
        font-family: var(--font-family-headers);
        margin: calc(var(--space-cs) * 3);
        line-height: 1.15;
        letter-spacing: var(--header-letter-spacing);
      }

      .pullHook {
        font-size: calc(var(--font-h1) / 1.5);
        margin: calc(var(--space-cs) * 3);
        font-weight: 100;
        text-align: center;
      }

      section,
      header {
        max-width: var(--page-last);
        padding: 0 calc(var(--space-cs) * 2);
        margin: auto;
      }

      #showcaseFive,
      .fourWayBox,
      .explore {
        max-width: 100vw;
      }

      #showcaseFive img {
        width: 100%;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: var();
      }

      .explore {
        padding: 0 calc(var(--space-cs) * var(--blog-page-spacer-x));
      }

      #showcaseFive {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
        grid-gap: calc(var(--space-cs) * 4);
        padding: initial;
      }

      #showcaseFive a,
      .fourWayBox a {
        border-bottom: none;
        color: inherit;
        height: auto;
      }

      .fourWayBox {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
        padding: initial;
      }

      .fourWayBox a {
        display: block;
      }

      #showcaseFive h3,
      .fourWayBox h3,
      .card h3 {
        font-size: 1.5rem;
        font-weight: 100;
      }

      #showcaseFive h4,
      .fourWayBox h4,
      .card h4 {
        font-weight: 100;
        font-family: var(--font-family-sans-serif);
      }

      .fourWayBox a {
        padding: 1rem;
      }

      .card {
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-gap: calc(var(--space-cs) * 2);
        margin-bottom: calc(var(--space-cs) * 4);
      }

      svg {
        width: 20px;
        vertical-align: text-bottom;
      }

      hr {
        width: 100%;
        margin: 2rem auto;
        border: 1px solid #ccc;
      }

      /* pssft never the real one */
      #fakeSig {
        width: 35%;
        rotate: -10deg;
        display: block;
        margin: auto;
        padding: 1rem;
      }

      #fakeSig > path {
        stroke: var(--primary-text-color);
        fill: var(--primary-text-color);
      }

      .timeline {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-column-gap: 1rem;
        grid-row-gap: 1rem;
      }

      .timeline figure {
        margin: 0;
        transition: background 0.3s;
        position: relative;
      }

      .timeline img {
        position: initial;
        margin-left: initial;
        margin-right: initial;
        max-width: 100%;
      }

      .timline figcaption {
        font-size: initial;
        text-align: initial;
      }

      .timeline .author {
        opacity: 0;
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

      @media (max-width: 460px) {
        .timeline {
          grid-template-columns: repeat(1, 1fr);
        }
      }

      @media (prefers-reduced-data: reduce) {
        img,
        video,
        lite-youtube,
        stl-part-viewer {
          display: none;
        }
      }
    `,
  ];

  render() {
    return html`
      <article
        itemprop="blogPost"
        id="main"
        itemscope
        itemtype="http://schema.org/BlogPosting"
      >
        <header class=${this.metadata.pagetype}>
          <div id="subHeader">
            <h1 itemprop="headline">${this.metadata.title}</h1>
            <h2 itemprop="subheadline">${this.metadata.subtitle}</h2>
          </div>
        </header>
        <section itemprop="articleBody" class=${this.metadata.pagetype}>
          ${this.articleBody}
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
              `
            : html``}
        </section>
      </article>
    `;
  }
}
customElements.define('blog-page', BlogPage);
