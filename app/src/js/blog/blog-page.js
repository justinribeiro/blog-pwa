import { BlogElement, html } from './blog-element.js';
import { defaultStrings } from './blog-strings.js';

// @ts-ignore
import cssSheet from '../../css/page.css' with { type: 'css' };

class BlogPage extends BlogElement {
  static get properties() {
    const superProps = super.properties;
    return {
      ...superProps,
      strings: {
        type: Object,
      },
    };
  }

  constructor() {
    super();

    // this is not a full accounting of all strings on this page; only the
    // various interaction strings in our EcmaScript
    this.strings = {
      ...defaultStrings,
    };
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
            <hr />
            <h2 itemprop="subheadline">${this.metadata.subtitle}</h2>
            <hr />
          </div>
        </header>
        <section itemprop="articleBody" class=${this.metadata.pagetype}>
          ${this.articleBody}
          ${this.metadata.posts
            ? html`
                <ul id="posts">
                  ${this.metadata.posts.map(
                    post => html`
                      <li itemscope itemtype="https://schema.org/Article">
                        <time
                          itemprop="datePublished"
                          .datetime="${post.dataModified}"
                          aria-label="Posted ${post.date}"
                        >
                          ${post.date}
                        </time>
                        <a href="${post.permalink}" itemprop="name"
                          >${post.title}</a
                        >
                      </li>
                    `,
                  )}
                </ul>
              `
            : html``}
        </section>
      </article>
    `;
  }
}
customElements.define('blog-page', BlogPage);
