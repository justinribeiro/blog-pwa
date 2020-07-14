import BlogElement from './blog-element.js';
import { css, html } from 'lit-element';

class BlogEntry extends BlogElement {
  static get properties() {
    return {
      interactions: {
        type: String,
      },
    };
  }

  _generatedShareLinks() {
    if (!navigator.share) {
      this.share.twitter = `https://twitter.com/intent/tweet?url=${this.metadata.permalink}&text=${this.metadata.title} via @justinribeiro`;
      this.share.facebook = `https://www.facebook.com/sharer.php?u=${this.metadata.permalink}`;
      this.share.linkedin = `https://www.linkedin.com/shareArticle?mini=true&url=${this.metadata.permalink}&title=${this.metadata.title}&source=&summary=${this.metadata.description}`;
      this.share.email = `mailto:?subject=Article: ${this.metadata.title}&body=Article from Justin Ribeiro: ${this.metadata.permalink}`;
    }
  }

  async __webShare() {
    try {
      await navigator.share({
        title: `"${this.metadata.title}" by Justin Ribeiro.`,
        text: this.metadata.description,
        url: this.metadata.permalink,
      });
    } catch (e) {
      // ahh that did not work
    }
  }

  async _processMetaData() {
    if (this.metadata.article !== undefined && this.metadata.article !== '') {
      const parseHTML = this._unescapeHtml(this.metadata.article);

      const ViewerRequired = new RegExp('(</stl-part-viewer>)', 'g');
      if (ViewerRequired.test(parseHTML)) {
        import('./3d-utils.js');
      }

      const CodeBlockRequired = new RegExp('(</code-block>)', 'g');
      if (CodeBlockRequired.test(parseHTML)) {
        import('./code-block.js');
      }

      const YouTubeRequired = new RegExp('(</lite-youtube>)', 'g');
      if (CodeBlockRequired.test(parseHTML)) {
        import('./lite-youtube.js');
      }

      this.shadowRoot.querySelector('#metadataArticle').innerHTML = parseHTML;
      let parseFeatureImage = '';
      if (this.metadata.featureimage) {
        parseFeatureImage = this._unescapeHtml(this.metadata.featureimage);
        this.shadowRoot.querySelector('#featureImage').innerHTML = parseFeatureImage;
      }

      super._processMetaData();

      // This is my purely my personal preference showing; I can't stand full
      // screen images on mobile devices, the UX annoys me no matter how good
      // you think it is
      if (!window.matchMedia('(max-width: 767px)').matches) {
        this.__enableFigureExpansion();
      }

      this._generatedShareLinks();
      this.__contentIndexApiOriginTrial();
      this.__getInteractionCounts();
    }
  }

  __enableFigureExpansion() {
    this.__domRefs.figures = [...this.shadowRoot.querySelectorAll('figure')];
    this.__domRefs.figures.forEach(figure => {
      const event = figure.addEventListener('click', this.__expandFigure, { passive: true });
    });
  }

  __expandFigure(event) {
    const target = event.currentTarget;
    if (target.hasAttribute('expand')) {
      target.removeAttribute('expand');
    } else {
      target.setAttribute('expand', '');
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__domRefs.figures.forEach(figure => {
      figure.removeEventListener('click', this.__expandFigure, { passive: true });
    });
  }

  // see https://web.dev/content-indexing-api/
  async __contentIndexApiOriginTrial() {
    const registration = await navigator.serviceWorker.ready;
    if ('index' in registration) {
      await registration.index.add({
        id: this.metadata.filename.replace(/\//g, '-'),
        launchUrl: new URL(this.metadata.permalink).pathname,
        title: this.metadata.title,
        description: this.metadata.description,
        icons: [
          {
            src: this.metadata.imagetwitter,
            type: 'image/jpg',
          },
        ],
        category: 'article',
      });
    }
  }

  async __getInteractionCounts() {
    const response = await fetch(
      `https://webmention.io/api/count?target=${this.metadata.permalink}`,
      {
        method: 'GET',
        mode: 'cors',
      },
    );

    if (response.ok) {
      const data = await response.json();
      if (data.count > 0) {
        this.interactions = `There are currently ${data.count} interactions with this piece on the open web.`;
      } else {
        this.interactions = `There are currently no interactions with this piece. Be the first!`;
      }
    }
  }

  async __submitWebMention(event) {
    event.preventDefault();
    let message =
      'Thank you for sharing! Your Webmention has been received and is currently be processed.';
    const action = this.shadowRoot.querySelector('#webMentionForm').action;
    const target = this.metadata.permalink;
    const source = this.shadowRoot.querySelector('#webMentionSource').value;

    if (source !== '') {
      // technically, we could get the location header and show them the ticket,
      // but I'm not 100% sold on that as a user experience
      const response = await fetch(action, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `target=${target}&source=${source}`,
      });

      if (!response.ok) {
        message = "Oh no, your Webmention didn't seem to make it through. Please try again.";
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

  static get styles() {
    return [
      super.styles,
      css`
        figure {
          margin: 1em 0;
          transition: background 0.3s;
          cursor: pointer;
        }

        figcaption {
          color: #666;
          font-size: 0.875rem;
          line-height: 1.125rem;
          margin-top: 0.5em;
        }

        figcaption .author {
          display: inline-block;
          color: #888;
          font-family: var(--font-family-serif);
          line-height: 1.125rem;
          letter-spacing: 0.01em;
          font-size: 0.75rem;
        }

        figure[expand] {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          box-sizing: border-box;
          padding: 4rem;
          background-color: #fff;
          width: 100vw;
          height: 100vh;
          top: 0;
          margin: 0;
          z-index: 1;
          /* because the container's max width on desktop is always 800px */
          transform: translateX(calc((800px - 100vw) / 2));
        }

        figure[expand] figcaption {
          display: block;
          width: 20%;
          padding: 2em;
        }

        figure[expand] img {
          object-fit: contain;
          max-width: 100%;
          max-height: 90vh;
          width: 100vw !important;
          height: auto;
        }

        #main iframe,
        #main img {
          max-width: 100%;
          width: 100%;
        }

        #main video {
          max-width: 100%;
        }

        #main img {
          margin: auto;
          display: block;
        }

        time {
          text-transform: uppercase;
        }

        .dotDivider {
          padding-right: 0.45em;
          padding-left: 0.45em;
        }
        .dotDivider:after {
          content: '·';
        }

        .reads {
          margin-top: 10px;
        }

        #metaShare {
          display: block;
          background-color: var(--section-color);
          padding: 1em;
        }

        #share > a {
          margin-right: 0.5em;
        }

        button {
          background: #f5ee00;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1em;
        }

        label {
          display: block;
          margin-bottom: 0.5em;
        }

        input,
        button {
          padding: 0.5em;
        }

        input {
          width: 100%;
          border: 1px solid #b0b0b0;
          box-sizing: border-box;
          margin-bottom: 0.5em;
        }

        .subheadline {
          margin: 1em 0;
          font-size: 21px;
          font-family: 'Libre Franklin', sans-serif;
          line-height: 1.55;
          font-weight: 300;
        }

        @media (max-width: 767px) {
          #main img {
            margin: none;
          }

          #main iframe,
          #main img,
          #main lite-youtube {
            max-width: initial;
            width: 100vw;
            position: relative;
            left: 50%;
            right: 50%;
            margin-left: -50vw;
            margin-right: -50vw;
          }

          .subheadline {
            font-size: 18px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <article
        itemprop="blogPost"
        id="main"
        itemscope
        itemtype="http://schema.org/BlogPosting"
        ?hidden="${!this.loaded}"
      >
        <header>
          <h1 itemprop="headline">${this.metadata.title}</h1>
          <h2 class="subheadline">${this.metadata.description}</h2>
          <div id="featureImage"></div>

          <div class="reads">
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
              .map(tag => html` <a href="/tags/${tag.toLowerCase()}/">${tag}</a>&nbsp; `)}
          </div>

        <div id="metadataArticle" itemprop="articleBody"></div>
        <footer id="metaShare">
          <div>
            <h3>Share this piece</h3>
            ${
              navigator.share
                ? html`
                    <p>
                      Your browser supports the
                      <a href="https://w3c.github.io/web-share/">Web Share API</a>! Whoo hoo! Click
                      the button to use the native share on your device.<br />
                      <button @click=${this.__webShare}>🚀 Share</button>
                    </p>
                  `
                : html`
                    <p id="share">
                      <a href="${this.share.twitter}">Twitter</a>
                      <a href="${this.share.facebook}">Facebook</a>
                      <a href="${this.share.linkedin}">LinkedIn</a>
                      <a href="${this.share.email}">Email</a>
                    </p>
                  `
            }

            <h3>Respond to this piece</h3>
            <p>${this.interactions}</p>
            <form
              id="webMentionForm"
              action="https://webmention.io/justinribeiro.com/webmention"
              method="POST"
            >
              <input
                type="hidden"
                name="target"
                .value="${this.metadata.permalink}"
              />
              <label
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
              />
              <button @click="${e => this.__submitWebMention(e)}">
                🚚 Send Webmention
              </button>
            </form>
            <br />
            <h3>Metadata</h3>
            <p>
              Author Justin Ribeiro wrote ${this.metadata.words} words for this
              piece and hopes you enjoyed it. Find an issue?
              <a href="https://github.com/justinribeiro/blog-pwa/issues"
                >File a ticket</a
              >
              or
              <a
                href="https://github.com/justinribeiro/blog-pwa/tree/master/hugo/content/${
                  this.metadata.filename
                }"
                >edit this on Github.</a
              >
            </p>
          </div>
        </footer>
      </article>

      <blog-network-warning ?hidden="${!this.failure}"></blog-network-warning>
    `;
  }
}
customElements.define('blog-entry', BlogEntry);
