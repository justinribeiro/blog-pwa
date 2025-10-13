import { BlogElement, html } from './blog-element.js';
import { defaultStrings } from './blog-strings.js';
import cssSheet from '../../css/page.css' with { type: 'css' };

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

  static styles = [super.styles, cssSheet];

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
                        <h4>${post.description}</h4>
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
