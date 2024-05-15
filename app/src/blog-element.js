/* eslint-disable class-methods-use-this */
import { LitElement, css, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

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
    __domRefs: {
      type: Object,
      attribute: false,
    },
    __stripDown: {
      type: Boolean,
    },
  };

  constructor() {
    super();
    this.resetView();
    this.__domRefs = new Map();
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
      enableMastodonPhotos: false,
      pagetype: 'page',
      relatedposts: [],
    };
    this.articleBody = '';
    this.content = '';
    this.share = [];
    this.clsSteady = false;
  }

  /**
   * Fetch the page data json from the remote based on path
   */
  async __fetchPageData() {
    let getPath = window.location.pathname;
    const checkEnding = new RegExp('index.php|index.html', 'g');
    if (checkEnding.test(window.location.pathname)) {
      getPath = window.location.pathname.replace(/index\.php|index\.html/g, '');
    }

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
    } catch (error) {
      // not ideal, but generally works
      if (navigator.onLine) {
        window.location.href = '/missing';
      } else {
        window.location.href = '/offline';
      }
    }
  }

  /**
   * Process the data return and pump it into the main article body
   */
  async __processPageData() {
    const htmlData = this.__unescapeHtml(this.metadata.article);
    this.articleBody = html`${unsafeHTML(htmlData.toString())}`;

    this.__setPageMetaData(this.metadata);

    await this.updateComplete;

    if (!this.__stripDown) {
      document.dispatchEvent(
        new CustomEvent('blog-pwa-clean-prerender-slot', {
          bubbles: true,
          composed: true,
        })
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
   * Stop being lazy, clean up nodes and events better
   * @param {Node} parent
   */
  __removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  /**
   * Grabs a DOM ref from the in place map if available. Temporary spot for
   * this; I think we'll make this a better WM+sym
   * @param {string} name
   * @param {string} selector DOM selector ref
   * @returns {HTMLElement}
   * @private
   */
  __getDomRef(name, selector = '', documentPath = '') {
    let ref;
    if (documentPath) {
      ref = document.querySelector(documentPath);
      this.__domRefs.set(name, ref);
    } else if (!this.__domRefs.has(name)) {
      ref = this.shadowRoot.querySelector(selector || name);
      this.__domRefs.set(name, ref);
    } else {
      ref = this.__domRefs.get(name);
    }
    return ref;
  }

  /**
   * Set the pages metadata on data load. Note, Google Search will index this so
   * it's not just for show
   * @param {object} {{title, description, url, socialImage}}
   */
  __setPageMetaData({ title, description, url, socialimage }) {
    const fallbackImg = this.__getDomRef(
      'fallbackImg',
      '',
      'link[rel=icon]'
    ).href;
    document.title = `${title} - Justin Ribeiro`;

    this.__setMetaDom('property', 'og:title', document.title);
    this.__setMetaDom('name', 'description', description);
    this.__setMetaDom('property', 'og:description', description);
    this.__setMetaDom('property', 'og:image', socialimage || fallbackImg);
    this.__setMetaDom('property', 'og:url', url || document.location.href);
  }

  /**
   * Locate and find document meta tags to update
   * @param {string} attrName
   * @param {string} attrValue
   * @param {string} content
   */
  __setMetaDom(attrName, attrValue, content) {
    let element = document.head.querySelector(
      `meta[${attrName}="${attrValue}"]`
    );
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content || '');
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
        }
      );
      return unEscapeHTMLPolicy.createHTML(data);
    }
    return strReplacer(data);
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

    img {
      filter: var(--image-filter, initial);
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

    #tags a {
      /* display: inline-block; */
      border: var(--border-thickness) solid var(--structs-border);
      border-radius: var(--border-radius);
      padding: calc(var(--space-cs) / 2);
      background: var(--structs-bg);
      line-height: calc((var(--space-cs) * 2) + var(--font-base));
    }

    .subheadline {
      margin: calc(var(--space-cs) * 2) 0;
      font-family: var(--font-family-san-serif);
      line-height: var(--font-lhr);
      font-weight: 300;
      font-size: var(--font-base);
    }

    img {
      background: radial-gradient(rgb(101, 112, 100), rgb(166 175 170))
        no-repeat;
    }

    [hidden] {
      display: none !important;
    }
  `;
}

export { BlogElement, html, css };