/* eslint-disable class-methods-use-this */
import { LitElement, css, html } from 'lit';
import { sendToGa } from './analytics.js';

class BlogElement extends LitElement {
  static get properties() {
    return {
      metadata: {
        type: Object,
        attribute: false,
      },
      featureImage: {
        type: Object,
      },
      __domRefs: {
        type: Object,
        attribute: false,
      },
    };
  }

  constructor() {
    super();
    this.resetView();
    this.__domRefs = new Map();
  }

  firstUpdated() {
    this.shadowRoot.addEventListener(
      'load',
      e => {
        if (e.target.tagName !== 'IMG') {
          return;
        }
        e.target.style.backgroundImage = 'none';
      },
      true
    );
  }

  async mount() {
    this.__showSkeleton(true);
    window.scroll(0, 0);
    this.resetView();
    await this._fetchMetaData();
  }

  resetView() {
    this.metadata = {
      posts: [],
      article: '',
      title: '',
      dataModified: '',
      date: '',
      readingtime: '',
      permalink: '',
      description: '',
      filename: '',
      view: '',
      tags: '',
      relatedposts: [],
    };

    this.content = '';
    this.share = [];
  }

  async _fetchMetaData() {
    let getPath = window.location.pathname;
    const checkEnding = new RegExp('index.php|index.html', 'g');
    if (checkEnding.test(window.location.pathname)) {
      getPath = window.location.pathname.replace(/index\.php|index\.html/g, '');
    }
    const targetUrl = `/data${getPath}index.json`;

    try {
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      this.metadata = await response.json();
      this.__processMetaData();
    } catch (error) {
      this.__showSkeleton(false);
      window.location.href = '/offline';
    }
  }

  async __processMetaData() {
    this.__getDomRef('#metadataArticle').innerHTML = this.__unescapeHtml(
      this.metadata.article
    );
    this.__setPageMetaData(this.metadata);
    this.__showSkeleton(false);
    sendToGa({ t: 'pageview' });
  }

  __showSkeleton(bool) {
    this.dispatchEvent(
      new CustomEvent('blog-pwa-toggle-skeleton', {
        bubbles: true,
        composed: true,
        detail: {
          show: bool,
        },
      })
    );
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
    const fallbackImg = this.__getDomRef('fallbackImg', '', 'link[rel=icon]')
      .href;
    document.title = `${title} - Justin Ribeiro`;

    this.__setMetaDom('property', 'og:title', document.title);
    this.__setMetaDom('property', 'twitter:title', document.title);

    this.__setMetaDom('name', 'description', description);
    this.__setMetaDom('property', 'og:description', description);
    this.__setMetaDom('property', 'twitter:description', description);

    this.__setMetaDom(
      'property',
      'twitter:image:src',
      socialimage || fallbackImg
    );
    this.__setMetaDom('property', 'og:image', socialimage || fallbackImg);

    this.__setMetaDom('property', 'og:url', url || document.location.href);
    this.__setMetaDom('property', 'twitter:url', url || document.location.href);
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

  static get styles() {
    return css`
      :host {
        display: block;
      }

      @media (prefers-reduced-motion: no-preference) {
        :focus {
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

      /*
        Design choice: in my components, I always have a #main as a container
        in my web components. Why isn't named container? No idea. LOL.
      */
      #main {
        max-width: var(--page-last);
        padding: 0 calc(var(--space-cs) * 2);
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

      [hidden] {
        display: none !important;
      }
    `;
  }
}

export { BlogElement, html, css };