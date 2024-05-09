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

      header h1,
      header h2 {
        text-align: center;
      }

      figure {
        margin: 0;
        transition: background 0.3s;
        position: relative;
      }

      figcaption {
        color: var(--secondary-text-color);
        font-size: var(--figcaption);
        line-height: var(--font-lhr);
        margin-top: 0.5em;
      }

      figcaption .author {
        display: inline-block;
        color: var(--secondary-text-color);
        font-family: var(--font-family-serif);
        font-size: var(--figcaption-author);
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

      header {
        padding: calc(var(--space-cs) * 4);
      }

      section {
        max-width: 100vw;
        padding: 0 calc(var(--space-cs) * 7);
        margin: auto;
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
            <h2 class="subheadline">${this.metadata.description}</h2>
          </div>
        </header>
        <section itemprop="articleBody">${this.articleBody}</section>
      </article>
    `;
  }
}
customElements.define('blog-explore', BlogExplore);
