import { BlogElement, html, css } from './blog-element.js';
import { defaultStrings, stringInterpolate } from './blog-strings.js';

class BlogExplore extends BlogElement {
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

    const YouTubeListRequired = new RegExp('(</ribeiro-social-photos)', 'g');
    if (YouTubeListRequired.test(checkLazyLoadTargets)) {
      import('./lod-youtube-list.js');
    }

    const PhotosRequired = new RegExp('(</youtube-video-list>)', 'g');
    if (PhotosRequired.test(checkLazyLoadTargets)) {
      import('./lod-ribeiro-social-photos.js');
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
        width: 100%;
        padding: initial;
      }

      #featureImage {
        display: grid;
        grid-template: 'container';
        place-items: center;
        place-content: center;
        max-height: clamp(450px, 40vh, 700px);
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

      figure {
        margin: 0px;
      }

      header h1,
      header h2 {
        text-align: center;
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

      header {
        padding: calc(var(--space-cs) * 4);
      }

      section {
        max-width: 100vw;
        padding: 0 calc(var(--space-cs) * 7);
        margin: auto;
      }

      #showcaseFive {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
        grid-gap: 1rem;
        padding: initial;
      }

      #showcaseFive a {
        border-bottom: none;
        color: inherit;
        height: auto;
      }

      .fourWayBox {
        display: grid;
        /* this is the same as grid-template-columns: 1fr 1fr 1fr 1fr; */

        grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
        padding: initial;
      }

      .fourWayBox a {
        display: block;
        border-bottom: none;
        color: inherit;
        height: auto;
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
        grid-gap: 1rem;
        margin-bottom: 1rem;
      }

      section > p {
        font-size: 1rem;
      }

      svg {
        width: 16px;
        vertical-align: text-bottom;
      }

      hr {
        width: 100%;
        margin: 2rem auto;
        border: 1px solid #ccc;
      }

      @media (max-width: 675px) {
        header {
          padding: calc(var(--space-cs) * 2);
        }

        section {
          padding: 0 calc(var(--space-cs) * 2);
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
        <div id="featureImage"></div>
        <header>
          <div id="subHeader">
            <h1 itemprop="headline">${this.metadata.title}</h1>
            <h2 class="subheadline">${this.metadata.subtitle}</h2>
          </div>
        </header>
        <section itemprop="articleBody">${this.articleBody}</section>
      </article>
    `;
  }
}
customElements.define('blog-explore', BlogExplore);
