import { BlogElement, html, css } from './blog-element.js';
import { defaultStrings } from './blog-strings.js';
import { stringInterpolate } from './helpers.js';

class BlogEntry extends BlogElement {
  static properties = {
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

  constructor() {
    super();
    this.share = [];

    // this is not a full accounting of all strings on this page; only the
    // various interaction strings in our EcmaScript
    this.strings = {
      ...defaultStrings,
    };

    this.interactions = this.strings.webmentions.start;

    // I'd like to eventually make this reliant on my own cache / implementation
    this.webmentionApiEndpoint = 'https://webmention.io/api/count?target=';
  }

  firstUpdated() {
    super.firstUpdated();
    if (!window.matchMedia('(max-width: 767px)').matches) {
      this.addEventListener(
        'blog-pwa-escape-pressed',
        this.__figureCloseOnEscape.bind(this),
        {
          passive: true,
        },
      );
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // This is my purely my personal preference showing; I can't stand full
    // screen images on mobile devices, the UX annoys me no matter how good you
    // think it is. In this case, don't remove the listeners if they are on
    // mobile (because they won't be there)
    if (!window.matchMedia('(max-width: 767px)').matches) {
      this.figures.forEach(figure => {
        figure.removeEventListener('click', this.__figureToggleView, {
          passive: true,
        });
      });
      this.removeEventListener(
        'blog-pwa-escape-pressed',
        this.__figureCloseOnEscape,
        {
          passive: true,
        },
      );
    }
  }

  /**
   * This does some additional work for the usual data injection:
   * 1. only adds the figure expand/contract if not mobile
   * 3. gets the interaction counts
   * 3. adds share links if web share api not available
   */
  async __processPageData() {
    await super.__processPageData();
    const featureImageRef = this.shadowRoot.querySelector('#featureImage');
    featureImageRef?.replaceChildren();

    if (this.metadata.featureimage) {
      const template = document
        .createRange()
        .createContextualFragment(
          this.__unescapeHtml(this.metadata.featureimage),
        );
      featureImageRef.appendChild(template);
    }

    // This is my personal preference showing; I can't stand full
    // screen images on mobile devices, the UX annoys me no matter how good
    // you think it is
    if (!window.matchMedia('(max-width: 767px)').matches) {
      this.__figureInteractionSetup();
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(
        async () => {
          this.__shareCreateLinks();
          this.__webmentionGetInteractionCounts();
        },
        {
          timeout: 5000,
        },
      );
    } else {
      this.__shareCreateLinks();
      this.__webmentionGetInteractionCounts();
    }
  }

  /**
   * Use the Web Share API to share this content on user interaction
   */
  async __shareWithWebShareApi() {
    try {
      await navigator.share({
        title: stringInterpolate(this.strings.sharing.title, {
          title: this.metadata.title,
        }),
        text: this.metadata.description,
        url: this.metadata.permalink,
      });
    } catch {
      // ahh that did not work or they bailed out
    }
  }

  /**
   * Generate share links when Web Share API is not available
   */
  __shareCreateLinks() {
    if (!navigator.share) {
      import('./lod-share-to-mastodon.js');

      // make it easier for the interpolate
      const data = {
        permalink: this.metadata.permalink,
        title: this.metadata.title,
        description: this.metadata.description,
        tags: this.metadata.tags,
      };

      this.share.push(
        {
          service: 'BlueSky',
          link: stringInterpolate(this.strings.sharing.services.bluesky, data),
        },
        {
          service: 'LinkedIn',
          link: stringInterpolate(this.strings.sharing.services.linkedin, data),
        },
        {
          service: 'Pocket',
          link: stringInterpolate(this.strings.sharing.services.pocket, data),
        },
        {
          service: 'Reddit',
          link: stringInterpolate(this.strings.sharing.services.reddit, data),
        },
        {
          service: 'Linkhut',
          link: stringInterpolate(this.strings.sharing.services.linkhut, data),
        },
        {
          service: 'E-Mail',
          link: stringInterpolate(this.strings.sharing.services.email, data),
        },
      );
    }
  }

  /**
   * Hunt for figures in the shadowDom and added an interaction for
   * expand/contract of image size
   */
  __figureInteractionSetup() {
    this.figures = [...this.shadowRoot.querySelectorAll('figure')];

    const template = document.createElement('button');
    template.setAttribute('aria-label', this.strings.figures.expand);
    template.textContent = this.strings.figures.button;

    this.figures.forEach(figure => {
      const fragment = document.createDocumentFragment();
      const button = template.cloneNode(true);
      fragment.appendChild(button);

      figure.addEventListener('click', this.__figureToggleView.bind(this), {
        passive: true,
      });
      figure.appendChild(fragment);
    });
  }

  /**
   * Used by interaction event from user to determine expand/contract state and
   * labels
   * @param {Event} event
   */
  __figureToggleView(event) {
    const target = event.currentTarget;
    const button = target.querySelector('button');
    const isExpanded = target.hasAttribute('expand');

    target.toggleAttribute('expand', !isExpanded);
    button.setAttribute(
      'aria-label',
      isExpanded ? this.strings.figures.expand : this.strings.figures.contract,
    );
  }

  /**
   * Hunt down open figures and close them on Escape key
   */
  __figureCloseOnEscape() {
    const figures = this.shadowRoot.querySelectorAll('figure[expand]');
    figures.forEach(figure => {
      figure.removeAttribute('expand');
      figure
        .querySelector('button')
        .setAttribute('aria-label', this.strings.figures.expand);
    });
  }

  /**
   * Get the amount of open web interactions we see from the service
   */
  async __webmentionGetInteractionCounts() {
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
  async __webmentionSubmitToService(event) {
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

  static styles = [
    super.styles,
    css`
      :host {
        min-height: 100vh;
        margin: auto auto;
      }

      .subheadline {
        margin: calc(var(--space-cs) * 2) 0;
        font-family: var(--font-family-san-serif);
        line-height: var(--font-lhr);
        font-weight: 300;
        font-size: var(--font-base);
      }

      figure button {
        position: fixed;
        bottom: var(--figure-button-margin);
        right: calc(var(--figure-button-margin) / 3);
        position: absolute;
        transform: rotate(135deg);
        border-radius: 50%;
        width: calc(var(--font-base) * 2.75);
        font-size: var(--font-base);
        opacity: 0.5;
      }

      figure:hover button,
      figure button:hover,
      figure button:focus {
        opacity: 1;
      }

      figure[expand] button {
        display: block;
        bottom: initial;
        right: var(--figure-button-margin);
        top: var(--figure-button-margin);
      }

      figure[expand] {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        box-sizing: border-box;
        padding: 4rem;
        background-color: var(--bg);
        width: 100vw;
        height: 100vh;
        top: 0;
        margin: 0;
        z-index: 1;
        transform: translateX(calc((var(--page-last) - 100vw) / 2));
      }

      figure[expand] figcaption {
        display: block;
        width: 20%;
        padding: calc(var(--space-cs) * 2);
      }

      figure[expand] img {
        all: unset !important;
        object-fit: contain;
        max-width: 100% !important;
        max-height: 90vh;
        width: 100vw !important;
        height: auto;
        background: transparent;
      }

      #main iframe {
        max-width: 100%;
        width: 100%;
      }

      #main video {
        max-width: 100%;
      }

      time {
        text-transform: uppercase;
      }

      .dotDivider {
        padding: 0 var(--space-cs);
      }

      .dotDivider:after {
        content: '•';
      }

      .reads {
        padding: 0.75rem 0;
      }

      #metaShare {
        display: block;
        background-color: var(--section-color);
        padding: calc(var(--space-cs) * 2);
        border-radius: var(--space-cs);
        margin-bottom: calc(var(--space-cs) * 2);
      }

      #share > a {
        margin-right: var(--space-cs);
      }

      .center {
        text-align: center;
      }

      label {
        display: block;
      }

      input,
      button {
        padding: calc(var(--space-cs) * 2);
        font-size: var(--form-input-fs);
        border: var(--border);
        box-sizing: border-box;
      }

      button {
        background: var(--form-button-color);
      }

      input {
        width: 100%;
      }

      ol,
      ul {
        margin: 0;
        padding: 0 0 0 24px;
      }

      share-to-mastodon {
        --wc-stm-font-family: var(--font-family-serif);
        --wc-stm-link-text-decoration: none;
        --wc-stm-link-color-initial: var(--accent-color-primary);
        --wc-stm-link-color-visited: var(--accent-color-secondary);
        border-bottom: 1px solid var(--accent-color-primary);
        letter-spacing: -0.063px;
        line-height: 33.18px;
        margin: 0;
        margin-right: 10.5px;
      }

      @media (max-width: 1024px) {
        #main iframe,
        #main img,
        #main lite-youtube,
        #main video {
          max-width: initial;
          width: 100vw;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }

        #main img {
          margin: none !important;
        }

        figure button {
          display: none;
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
                    <button @click=${this.__shareWithWebShareApi}>
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
              <button @click="${e => this.__webmentionSubmitToService(e)}">
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
