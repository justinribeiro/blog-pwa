import { BlogElement, html } from './blog-element.js';

// @ts-ignore
import cssSheet from '../../css/page.css' with { type: 'css' };

class BlogOffline extends BlogElement {
  static get properties() {
    const superProps = super.properties;
    return {
      ...superProps,
      availableUrls: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    /** @type Array<import('./blog-element.js').BlogMetadata> */
    this.availableUrls = [];
  }

  /**
   * We don't all super() here because there is no process target from a URL
   * standpoint; we only pull from the Service Worker cache
   */
  mount() {
    this.__getDataCache();
  }

  /**
   * Pull whatever links we've visited that can be read in an offline state
   */
  __getDataCache() {
    caches.open('data-cache').then(cache => {
      cache.keys().then(keys => {
        keys.forEach(async request => {
          const cacheGet = await fetch(request);
          const cacheData = await cacheGet.json();
          if (cacheData.title) {
            this.availableUrls.push(cacheData);

            // ugly hack, I'm tired
            await this.requestUpdate();
          }
        });
      });
    });
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
        <header class="page">
          <div id="subHeader">
            <h1 itemprop="headline">Oh No, You're Offline!</h1>
            <h2 itemprop="subheadline">The Intertubes Are Having Problems</h2>
          </div>
        </header>
        <section itemprop="articleBody" class="page">
          <p>
            Is your WiFi lying to you? Are you in a tunnel? Did your cat eat
            your ethernet cable?
          </p>
          <p>
            We've all been there. While I can't load the article you want to
            read at the moment, here are some articles and pages you've visited
            that you can read offline in the mean time.
          </p>
          <div id="posts">
            ${this.availableUrls.map(
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
        </section>
      </article>
    `;
  }
}

customElements.define('blog-offline', BlogOffline);
