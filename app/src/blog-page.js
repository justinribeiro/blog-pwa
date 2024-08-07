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

  /**
   * This does some additional work for the usual data injection:
   * 1. only lazy loading the util components that may be in a post
   * 2. only adds the figure expand/contract if not mobile
   * 3. gets the interaction counts
   * 4. adds share links if web share api not available
   */
  async __processPageData() {
    await super.__processPageData();

    this.__removeAllChildNodes(this.__getDomRef('#featureImage'));

    const checkLazyLoadTargets = this.__unescapeHtml(this.metadata.article);
    const ViewerRequired = new RegExp('(</stl-part-viewer>)', 'g');
    if (ViewerRequired.test(checkLazyLoadTargets)) {
      import('./lod-3d-utils.js');
    }

    const CodeBlockRequired = new RegExp('(</code-block>)', 'g');
    if (CodeBlockRequired.test(checkLazyLoadTargets)) {
      import('./lod-code-block.js');
    }

    const YouTubeRequired = new RegExp('(</lite-youtube>)', 'g');
    if (YouTubeRequired.test(checkLazyLoadTargets)) {
      import('./lod-lite-youtube.js');
    }

    const TooltipRequired = new RegExp('(</toggle-citation>)', 'g');
    if (TooltipRequired.test(checkLazyLoadTargets)) {
      import('./lod-toggle-citation.js');
    }

    if (this.metadata.featureimage) {
      const template = document
        .createRange()
        .createContextualFragment(
          this.__unescapeHtml(this.metadata.featureimage),
        );
      this.__getDomRef('#featureImage').appendChild(template);
    }
  }

  static styles = [
    super.styles,
    css`
      :host {
        min-height: 100vh;

        /* these are fancy pages, blow it out  */
        max-width: initial;
        padding: initial;
      }

      header h1,
      header h2 {
        text-align: center;
      }

      figure {
        margin: 0;
        transition: background 0.3s;
        position: relative;
      }

      #main iframe {
        max-width: 100%;
        width: 100%;
      }

      #main img {
        max-width: 100%;
        height: auto;
      }

      #main video {
        max-width: 100%;
      }

      figure video {
        width: 100%;
      }

      #featureImage {
        display: grid;
        grid-template: 'container';
        /* place-items: center;
        place-content: center;
        max-height: clamp(450px, 40vh, 700px); */
        overflow: hidden;
      }

      #featureImage > * {
        grid-area: container;
        max-width: 100vw;
      }

      #featureImage img {
        width: 100vw;
        height: auto;
        object-fit: cover;
      }

      #subHeader {
        z-index: 1;
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

      figcaption {
        text-align: center;
        font-size: 12px;
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

      .timeline figcaption {
        font-size: initial;
        text-align: initial;
      }
      .timeline .author {
        opacity: 0;
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
        <div id="featureImage"></div>
        <header>
          <div id="subHeader">
            <h1 itemprop="headline">${this.metadata.title}</h1>
            <h2 itemprop="subheadline">${this.metadata.subtitle}</h2>
          </div>
        </header>
        <section itemprop="articleBody">${this.articleBody}</section>
      </article>
    `;
  }
}
customElements.define('blog-page', BlogPage);
