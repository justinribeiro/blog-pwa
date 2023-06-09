import { BlogElement, html, css } from './blog-element.js';

class BlogReading extends BlogElement {
  static properties = {
    count: {
      type: Number,
    },
    data: {
      type: Array,
    },
  };

  static styles = [
    super.styles,
    css`
      #links div {
        padding: 0.5rem 0;
        border-bottom: 1px dotted #8f8e8e;
      }
      #links p {
        margin: 0;
      }

      .outlink {
        font-family: var(--font-family-serif);
        font-size: var(--font-base);
      }

      .host {
        font-family: var(--font-family-sans-serif);
        font-size: var(--figcaption-author);
        font-style: italic;
      }

      .labels > a {
        text-transform: uppercase;
        color: var(--secondary-text-color);
        font-family: var(--font-family-sans-serif);
        font-size: var(--figcaption-author);
        border-bottom-color: var(--secondary-text-color);
      }
    `,
  ];

  constructor() {
    super();

    // yeah, because the pinboard API does not support CORS at all :-|
    this.pinboardEndpoint =
      'https://us-west2-justinribeiro-web.cloudfunctions.net/get-pinboard-links';
    this.count = 100;
    this.tag = '';
    this.data = [];
  }

  async mount() {
    window.scroll(0, 0);
    this.__setPageMetaData({
      title: "What I'm Reading",
      description:
        'All the links, books, essays, and other bookmarked reading I feel the need to save and share.',
    });
    this.__getLinkRoll();


  }

  async __getLinkRoll() {
    const response = await fetch(
      `${this.pinboardEndpoint}?count=${this.count}&tag=${this.tag}`,
      {
        mode: 'cors',
      }
    );
    this.data = await response.json();
  }

  render() {
    return html`
      <section>
        <h1>What I'm Reading</h1>
        <p>
          I read a lot. I don't log every word, I don't count the pages, I just
          read where the curiosity (and these days, the research) take me.
        </p>
        <p>
          This list is powered by Pinboard (and a tiny web component and a
          wrapper api I wrote).
          <a href="https://pinboard.in/u:justinribeiro"
            >Justin Ribeiro @ Pinboard</a
          >.
        </p>
      </section>
      <section id="links">
        <h2>The Latest Reads and Curiosities</h2>
        ${this.data.map(
          link => html`
            <div>
              <a href="${link.u}" class="outlink">${link.d}</a>
              <p class="labels">
                ${link.t.map(
                  label =>
                    html`<a
                      href="https://pinboard.in/u:justinribeiro/t:${label}"
                      title="Tagged: ${label}"
                      rel="nofollow"
                      >${label}</a
                    > `
                )}
                <span class="host">${new URL(link.u).hostname} </span>
              </p>
            </div>
          `
        )}
      </section>
    `;
  }
}

window.customElements.define('blog-reading', BlogReading);
