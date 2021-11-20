import { BlogElement, html, css } from './blog-element.js';

class BlogOffline extends BlogElement {
  static properties = {
    availableUrls: {
      type: Array,
    },
  };

  constructor() {
    super();
    this.availableUrls = [];
  }

  mount() {
    this.__getDataCache();
    this.__showSkeleton(false);
  }

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

  static styles = [
    super.styles,
    css`
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
    `,
  ];

  render() {
    return html`
      <div id="metadataArticle">
        <h1>Welcome to the Offline World</h1>
        <p>
          Is your WiFi lying to you? Are you in a tunnel? Did your cat eat your
          ethernet cable?
        </p>
        <p>
          We've all been there. While I can't load the article you want to read
          at the moment, here are some articles and pages you've visited that
          you can read offline.
        </p>
      </div>
      <div id="posts">
        ${this.availableUrls.map(
          post => html` <a href="${post.permalink}">
            <h3>${post.title}</h3>
          </a>`
        )}
      </div>
    `;
  }
}

customElements.define('blog-offline', BlogOffline);
