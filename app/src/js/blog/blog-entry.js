import { BlogElement, html } from './blog-element.js';
import { defaultStrings } from './blog-strings.js';
import { stringInterpolate } from '../lib/helpers.js';

// @ts-ignore
import cssSheet from '../../css/entry.css' with { type: 'css' };

class BlogEntry extends BlogElement {
  static get properties() {
    const superProps = super.properties;
    return {
      ...superProps,
      figures: {
        type: Object,
      },
      interactions: {
        type: String,
      },
      share: {
        type: Array,
      },
      strings: {
        type: Object,
      },
    };
  }

  constructor() {
    super();

    /**
     * Updates the template should we need to (e.g., not mobile)
     * @type {import('../lib/share.js').ShareService[]}
     */
    this.share = [];

    // this is not a full accounting of all strings on this page; only the
    // various interaction strings in our EcmaScript
    this.strings = {
      ...defaultStrings,
    };

    // This gets replaced later if there are a non-zero references out there on
    // the open web
    this.interactions = this.strings.webmentions.start;

    // I'd like to eventually make this reliant on my own cache / implementation
    this.webmentionApiEndpoint = 'https://webmention.io/api/count?target=';
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
    this.#figureTeardown();
  }

  /**
   * This does some additional work for the usual data injection:
   * 1. only adds the figure expand/contract if not mobile
   * 3. gets the interaction counts
   * 3. adds share links if web share api not available
   */
  async processPageData() {
    await super.processPageData();
    this.#featureImageSetup();
    this.#figureSetup();
    this.#socialSetup();
  }

  /**
   * Not all posts have a feature image, which creates a newspaper-esc lede
   * image, but we do a little magic to make it happen since we wrap it in a
   * figure element and some nifty html to make it all nice
   */
  #featureImageSetup() {
    // Check and clear in case we're post-to-post jumping
    const featureImageRef = this.shadowRoot?.querySelector('#featureImage');
    featureImageRef?.replaceChildren();

    if (this.metadata?.featureimage) {
      const template = document
        .createRange()
        .createContextualFragment(
          this.unescapeHtml(this.metadata.featureimage),
        );
      featureImageRef?.appendChild(template);
    }
  }

  /**
   * Batch social/share/webmention into a single idle callback
   */
  async #socialSetup() {
    const socialTasks = () => {
      this.#shareCreateLinks();
      this.#webmentionGetInteractionCounts();
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(socialTasks, { timeout: 5000 });
    } else {
      queueMicrotask(socialTasks);
    }
  }

  /**
   * This is my personal preference showing; I can't stand full screen images on
   * mobile devices, the UX annoys me no matter how good you think it is; this
   * also now lazy loads so we save some weight on mobile
   */
  async #figureSetup() {
    if (!window.matchMedia('(max-width: 767px)').matches) {
      const { figureInteractionInit } = await import('../lib/figures.js');
      const startUpFigures = () => {
        figureInteractionInit(this);
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => startUpFigures(), {
          timeout: 2000,
        });
      } else {
        queueMicrotask(() => startUpFigures());
      }
    }
  }

  /**
   * Removes the figure listeners to not leak memory; the import is redundant
   * since we've by now already imported it as part of the setup
   */
  async #figureTeardown() {
    if (!window.matchMedia('(max-width: 767px)').matches) {
      const { removeFigureEventListeners } = await import('../lib/figures.js');
      removeFigureEventListeners(this);
    }
  }

  /**
   * Use the Web Share API to share this content on user interaction
   */
  async #shareWithWebShareApi() {
    try {
      await navigator.share({
        title: stringInterpolate(this.strings.sharing.title, {
          title: this.metadata?.title,
        }),
        text: this.metadata?.description,
        url: this.metadata?.permalink,
      });
    } catch {
      // ahh that did not work or they bailed out
    }
  }

  /**
   * Generate share links when Web Share API is not available; this lazy loads
   * so we save some weight if not require
   */
  async #shareCreateLinks() {
    if (!navigator.share) {
      // on mobile we don't need this
      const { desktopShareLinks } = await import('../lib/share.js');

      // Generate the share links
      this.share = desktopShareLinks(this.metadata);
    }
  }

  /**
   * Get the amount of open web interactions we see from the service
   */
  async #webmentionGetInteractionCounts() {
    const response = await fetch(
      `${this.webmentionApiEndpoint}${this.metadata.permalink}`,
      {
        method: 'GET',
        mode: 'cors',
      },
    );

    if (!response.ok) return;

    const data = await response.json();
    const count = data?.count ?? 0;
    this.interactions = stringInterpolate(this.strings?.webmentions.some, {
      count,
    });
  }

  /**
   * Send webmention to remote service
   * @param {Event} event
   */
  async _webmentionSubmitToService(event) {
    event.preventDefault();
    let message = this.strings.webmentions.shared;
    const formField = this.shadowRoot.querySelector('#webMentionSource');
    formField.checkValidity();

    if (!formField.validity.valid) {
      formField.setCustomValidity(this.strings.webmentions.invalid);
      formField.reportValidity();
    } else {
      const { action } = this.shadowRoot.querySelector('#webMentionForm');

      // technically, we could get the location header and show them the ticket,
      // but I'm not 100% sold on that as a user experience
      const response = await fetch(action, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `target=${this.metadata.permalink}&source=${formField.value}`,
      });

      if (!response.ok) {
        message = this.strings.webmentions.error;
      }

      this.dispatchEvent(
        new CustomEvent('display-snackbar', {
          bubbles: true,
          composed: true,
          detail: {
            message,
          },
        }),
      );

      this.shadowRoot.querySelector('#webMentionSource').value = '';
    }
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
        <header>
          <h1 itemprop="headline">${this.metadata.title}</h1>
          <h2 class="subheadline">${this.metadata.description}</h2>
          <div id="featureImage"></div>
          <div class="reads" ?hidden=${this.metadata.pagetype === 'page'}>
            <time
              .datetime="${this.metadata.dataModified}"
              itemprop="datePublished"
            >
              ${this.metadata.date}
            </time>
            <span class="dotDivider"></span> ${this.metadata.readingtime} min
            read
            <span class="dotDivider"></span>
            Filed in
            ${this.metadata.tags
              .split(',')
              .map(
                tag => html`
                  <a href="/tags/${tag.toLowerCase()}/">${tag}</a>&nbsp;
                `,
              )}
          </div>
        </header>
        <section itemprop="articleBody">${this.articleBody}</section>
        <footer id="metaShare" ?hidden=${this.metadata.pagetype === 'page'}>
          <div>
            <h3>Share this piece</h3>
            ${navigator.share
              ? html`
                  <p>
                    Your browser supports the
                    <a href="https://w3c.github.io/web-share/">Web Share API</a
                    >! Whoo hoo! Click the button to use the native share on
                    your device.<br />
                    <button @click=${this.#shareWithWebShareApi}>
                      🚀 Share
                    </button>
                  </p>
                `
              : html`
                  <p id="share">
                    <share-to-mastodon
                      message="${this.metadata
                        .title} via @justin@ribeiro.social"
                      url="${this.metadata.permalink}"
                      >Mastodon</share-to-mastodon
                    >
                    ${this.share.map(
                      i => html`<a href="${i.link}">${i.service}</a>`,
                    )}
                  </p>
                `}

            <h3>Respond to this piece</h3>
            <p>${this.interactions}</p>
            <form
              id="webMentionForm"
              action="https://webmention.io/justinribeiro.com/webmention"
              method="post"
            >
              <input
                type="hidden"
                name="target"
                .value="${this.metadata.permalink}"
              />
              <label for="webMentionSource"
                >Written a response or comment to this post? Fantastic! I
                support
                <a href="https://indieweb.org/Webmention">WebMentions</a>. Paste
                and send your URL here:</label
              >
              <input
                type="url"
                name="source"
                placeholder="https://your-amazing-response-url-here/"
                id="webMentionSource"
                required
                pattern="https://.*"
              />
              <button @click="${e => this._webmentionSubmitToService(e)}">
                🚚 Send Webmention
              </button>
            </form>
            <br />
            ${this.metadata.relatedposts.length > 0
              ? html`
                  <h3>You Might Also Enjoy These Related Pieces</h3>
                  ${this.metadata.relatedposts.map(
                    post =>
                      html`<p>
                        <a href="${post.permalink}"> ${post.title}</a>
                      </p>`,
                  )}
                  <br />
                `
              : html``}
            <h3>Metadata</h3>
            <p>
              Author Dr. Justin Ribeiro, Ph.D. wrote ${this.metadata.words}
              words for this piece and hopes you enjoyed it. Find an issue?
              <a href="https://github.com/justinribeiro/blog-pwa/issues"
                >File a ticket</a
              >
              or
              <a
                href="https://github.com/justinribeiro/blog-pwa/tree/master/hugo/content/${this
                  .metadata.filename}"
                >edit this on Github.</a
              >
            </p>
          </div>
        </footer>
      </article>
    `;
  }
}
customElements.define('blog-entry', BlogEntry);
