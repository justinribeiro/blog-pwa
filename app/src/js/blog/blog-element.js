import { LitElement, css, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { setPageMetaData } from '../lib/helpers.js';

import cssSheet from '../../css/element.css' with { type: 'css' };
import { lodDependencies } from '../lod/lod-deps.js';

class BlogElement extends LitElement {
  static properties = {
    metadata: {
      type: Object,
      attribute: false,
    },
    articleBody: {
      type: String,
    },
    /**
     * This is for the pre-render from the server clean-up; doesn't get used in
     * the SW-Shell return or the Static bot generator
     */
    __stripDown: {
      type: Boolean,
    },
  };

  constructor() {
    super();
    this.__stripDown = false;
  }

  /**
   * Fire up and start piecing the data together
   * @async
   */
  async mount() {
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

    // meh
    window.scroll(0, 0);
  }

  /**
   * Fetch the page data json from the remote based on path
   * @return Promise
   */
  async __fetchPageData() {
    let path = window.location.pathname.replace(/(?:index\.(php|html))$/, '');
    if (path.charCodeAt(path.length - 1) !== 47) path += '/';
    const targetUrl = `/data${path}index.json`;

    try {
      const res = await fetch(targetUrl, {
        cache: 'force-cache',
        keepalive: true,
      });
      if (!res.ok) throw new Error(res.statusText);

      // Stream and parse JSON for large files; large files are very rare but
      // hey why not some fun (technically used this back like 6 years ago)
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let jsonText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        jsonText += decoder.decode(value, { stream: true });
      }
      jsonText += decoder.decode();

      // mostly a failsafe
      this.resetView();

      this.metadata = JSON.parse(jsonText);

      // Kick off processing without blocking
      queueMicrotask(() => this.__processPageData());
    } catch {
      window.location.replace(navigator.onLine ? '/missing' : '/offline');
    }
  }

  /**
   * Process the data return and pump it into the main article body
   * @return Promise
   */
  async __processPageData() {
    // Run metadata + HTML unescape in parallel (both async-safe)
    const [noop, htmlData] = await Promise.all([
      setPageMetaData(this.metadata), // batched + cached meta updates
      Promise.resolve(this.__unescapeHtml(this.metadata.article)),
    ]);

    // Assign article content in one shot
    this.articleBody = html`${unsafeHTML(htmlData.toString())}`;

    // Inject lazy dependencies, don’t block
    queueMicrotask(() => this.__lazyLoadInjector(htmlData));

    // Defer non-critical DOM work after render; SW shell will take over on next
    // load, doesn't require this
    requestAnimationFrame(() => {
      if (!this.__stripDown) {
        document.dispatchEvent(
          new CustomEvent('blog-pwa-clean-prerender-slot', {
            bubbles: true,
            composed: true,
          }),
        );
        this.__stripDown = true;
      }

      // Analytics, I don't care about you
      if (window.ga4track) {
        queueMicrotask(() => window.ga4track.trackEvent('page_view'));
      }
    });
  }

  /**
   * Fixes stuff I spit into JSON from Hugo
   * @param {String} data Anything HTML that needs unescaping...
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

  /**
   * Find components and what not to load as needed in a post
   * @param {string} data The article post data
   * @returns Promise
   */
  async __lazyLoadInjector(data) {
    const loadPromises = lodDependencies
      .filter(({ regex }) => regex.test(data))
      .map(({ load }) => load()); // async import

    // Wait for all required modules to load
    return Promise.all(loadPromises);
  }

  static styles = [cssSheet];
}

export { BlogElement, html, css };
