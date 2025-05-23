import { LitElement, css, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { setPageMetaData } from './helpers.js';

class BlogElement extends LitElement {
  static properties = {
    metadata: {
      type: Object,
      attribute: false,
    },
    featureImage: {
      type: Object,
    },
    articleBody: {
      type: String,
    },
    __stripDown: {
      type: Boolean,
    },
  };

  constructor() {
    super();
    this.resetView();
    this.__stripDown = false;
  }

  /**
   * Fire up and start piecing the data together
   * @async
   */
  async mount() {
    window.scroll(0, 0);
    this.resetView();
    await this.__fetchPageData();
  }

  /**
   * Reset the world view for the page
   */
  resetView() {
    this.metadata = {
      posts: [],
      article: '',
      title: '',
      subtitle: '',
      dataModified: '',
      date: '',
      readingtime: '',
      permalink: '',
      description: '',
      filename: '',
      view: '',
      tags: '',
      pagetype: '',
      relatedposts: [],
    };
    this.articleBody = '';
    this.content = '';
    this.share = [];
  }

  /**
   * Fetch the page data json from the remote based on path
   */
  async __fetchPageData() {
    let getPath = window.location.pathname;

    // Remove index.php or index.html from the end
    getPath = getPath.replace(/(?:index\.php|index\.html)$/, '');

    // strange case someone found...odd
    if (!getPath.endsWith('/')) {
      getPath = `${getPath}/`;
    }

    const targetUrl = `/data${getPath}index.json`;

    try {
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      this.metadata = await response.json();
      this.__processPageData();
    } catch {
      // not ideal, but generally works
      window.location.href = navigator.onLine ? '/missing' : '/offline';
    }
  }

  /**
   * Process the data return and pump it into the main article body
   */
  async __processPageData() {
    const htmlData = this.__unescapeHtml(this.metadata.article);
    this.articleBody = html`${unsafeHTML(htmlData.toString())}`;

    setPageMetaData(this.metadata);

    this.__lazyLoadInjector(htmlData);

    await this.updateComplete;

    if (!this.__stripDown) {
      document.dispatchEvent(
        new CustomEvent('blog-pwa-clean-prerender-slot', {
          bubbles: true,
          composed: true,
        }),
      );
      this.__stripDown = true;
    }

    // I kindaaaaa don't care about the analytics anymore; this should be the
    // post-shell trigger, but if it accidental double counts it's not going to
    // skew my stats enough that'll I'll care (I look at them like once a year
    // LOL)
    if (window.ga4track) {
      window.ga4track.trackEvent('page_view');
    }
  }

  /**
   * Fixes stuff I spit into JSON from Hugo
   * @param {String} data Anything HTML that needs unescaping..
   * @return {String} string
   */
  __unescapeHtml(data) {
    const strReplacer = raw =>
      raw
        .replace(/(&#34;)/g, '"')
        .replace(/(&lt;)(.+?)(&gt;)/gims, '<$2>')
        .replace(/(&amp;)/gims, '&');

    if (window.trustedTypes && window.trustedTypes.createPolicy) {
      const unEscapeHTMLPolicy = window.trustedTypes.createPolicy(
        'unEscapeHTMLPolicy',
        {
          createHTML: raw => strReplacer(raw),
        },
      );
      return unEscapeHTMLPolicy.createHTML(data);
    }
    return strReplacer(data);
  }

  __lazyLoadInjector(data) {
    const ViewerRequired = new RegExp('(</stl-part-viewer>)', 'g');
    if (ViewerRequired.test(data)) {
      import('./lod-3d-utils.js');
    }

    const CodeBlockRequired = new RegExp('(</code-block>)', 'g');
    if (CodeBlockRequired.test(data)) {
      import('./lod-code-block.js');
    }

    const YouTubeRequired = new RegExp('(</lite-youtube>)', 'g');
    if (YouTubeRequired.test(data)) {
      import('./lod-lite-youtube.js');
    }

    const TooltipRequired = new RegExp('(</toggle-citation>)', 'g');
    if (TooltipRequired.test(data)) {
      import('./lod-toggle-citation.js');
    }

    const YouTubeListRequired = new RegExp('(</ribeiro-social-photos)', 'g');
    if (YouTubeListRequired.test(data)) {
      import('./lod-youtube-list.js');
    }

    const PhotosRequired = new RegExp('(</youtube-video-list>)', 'g');
    if (PhotosRequired.test(data)) {
      import('./lod-ribeiro-social-photos.js');
    }
  }

  static styles = css`
    :host {
      display: block;
      max-width: var(--page-last);
      padding: 0 calc(var(--space-cs) * 2);
      min-height: 100vh;
    }

    @media (prefers-reduced-motion: no-preference) {
      a:focus {
        transition: outline-offset 0.25s ease;
        outline-offset: var(--outline-thickness);
        outline: var(--outline);
      }
    }

    a {
      color: var(--accent-color-primary);
      text-decoration: none;
      border-bottom: var(--border-thickness) solid var(--accent-color-primary);
    }

    a:hover {
      color: var(--accent-color-secondary);
      border-color: var(--accent-color-secondary);
    }

    del {
      background: var(--diff-del-color);
    }

    ins {
      background: var(--diff-ins-color);
      text-decoration: none;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-family: var(--font-family-headers);
      margin: 0 0 var(--space-cs) var(--header-font-offset-left);
      line-height: 1.15;
      letter-spacing: var(--header-letter-spacing);
    }

    h1 {
      font-size: var(--font-h1);
      margin-top: var(--space-cs);
    }

    p,
    li,
    label {
      font-family: var(--font-family-serif);
      margin: 0 0 calc(var(--space-cs) * 2) 0;
      color: var(--primary-text-color);
      font-size: var(--font-base);
      line-height: calc(var(--font-base) * var(--font-lhr));
    }

    /* Don't like this; special case. TODO extract */
    p code,
    li code {
      background-color: var(--code-background);
      color: var(--code-color);
      font-size: 85%;
    }

    blockquote {
      border-left: var(--outline-thickness) solid var(--accent-color-primary);
      padding-left: var(--space-cs);
      font-style: oblique;
    }

    table {
      width: 100%;
      border-spacing: 0;
      margin-bottom: calc(var(--space-cs) * 2);
    }

    thead {
      background-color: var(--section-color);
    }

    tr,
    th,
    td {
      padding: var(--space-cs);
      border: 1px solid #eee;
    }

    tbody tr:nth-child(even) {
      background-color: var(--structs-bg);
    }

    img {
      filter: var(--image-filter, initial);
      border-radius: 0.5rem;
      background: radial-gradient(rgb(101, 112, 100), rgb(166 175 170))
        no-repeat;
    }

    figure {
      margin: 1em 0;
      transition: background 0.3s;
      cursor: pointer;
      position: relative;
    }

    figure img {
      max-width: initial;
      width: 80vw;
      position: relative;
      left: 50%;
      right: 50%;
      margin-left: -40vw;
      margin-right: -40vw;
      height: auto;
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

    [hidden] {
      display: none !important;
    }

    @media (max-width: 1024px) {
      img {
        border-radius: revert;
      }

      figure img {
        max-width: initial;
        width: 100vw;
        position: relative;
        left: 50%;
        right: 50%;
        margin-left: -50vw;
        margin-right: -50vw;
      }
    }
  `;
}

export { BlogElement, html, css };
