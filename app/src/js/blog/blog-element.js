import { LitElement, css, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { setPageMetaData } from '../lib/helpers.js';
import { lodDependencies } from '../lod/lod-deps.js';

// @ts-ignore
import cssSheet from '../../css/element.css' with { type: 'css' };

/**
 * Every thing that creates page and post renders from the JSON files; the
 * Python uses the same rendering files as an FYI
 *
 * @typedef {Object} BlogMetadata
 * @property {Array<Post>} posts Array of blog posts
 * @property {string} article Article content
 * @property {string} title Title of the blog post
 * @property {string} subtitle Subtitle of the blog post
 * @property {string} datePublished Date published timestamp
 * @property {string} dateModified Date modified timestamp
 * @property {string} date Publication date
 * @property {string} readingtime Estimated reading time
 * @property {string} permalink Permanent link to the post
 * @property {string} description Post description
 * @property {string} filename Name of the file, allows load mapping
 * @property {string} view View type, deprecated
 * @property {string} tags Post tags
 * @property {string} pagetype Either page or explore typically; used for
 * injector changes
 * @property {string} url Page url
 * @property {string} socialimage Social sharing image url
 * @property {string} featureimage The big figure image, usually DOM code
 * @property {Array<Post>} relatedposts - Array of related posts
 */

/**
 * @typedef {Object} Post
 * @property {string} permalink Post permanent URL
 * @property {string} title Post title
 * @property {string} description Post content description
 * @property {string} dataModified Post modification date
 * @property {string} date Post publication date
 * @property {string} readingtime Post reading time
 */

class BlogElement extends LitElement {
  static properties = {
    metadata: {
      type: Object,
      attribute: false,
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

    /**
     * This is for the pre-render from the server clean-up; doesn't get used in
     * the SW-Shell return or the Static bot generator
     */
    this.__stripDown = false;

    this.resetView();
  }

  /**
   * Fire up and start piecing the data together
   * @async
   */
  async mount() {
    await this.#fetchPageData();
  }

  /**
   * Reset the world view for the page
   */
  resetView() {
    /**
      @type {!BlogMetadata}
     */
    this.metadata = {
      posts: [],
      article: '',
      title: '',
      subtitle: '',
      dateModified: '',
      date: '',
      readingtime: '',
      permalink: '',
      description: '',
      filename: '',
      view: '',
      tags: '',
      pagetype: '',
      url: '',
      socialimage: '',
      featureimage: '',
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
  async #fetchPageData() {
    let path = window.location.pathname.replace(/(?:index\.(php|html))$/, '');
    if (path.charCodeAt(path.length - 1) !== 47) path += '/';
    const targetUrl = `/data${path}index.json`;

    try {
      const res = await fetch(targetUrl, {
        keepalive: true,
      });
      if (!res.ok) throw new Error(res.statusText);

      // Stream and parse JSON for large files; large files are very rare but
      // hey why not some fun (technically used this back like 6 years ago)
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let jsonText = '';
      while (true) {
        // @ts-ignore
        const { done, value } = await reader.read();
        if (done) break;
        jsonText += decoder.decode(value, { stream: true });
      }
      jsonText += decoder.decode();

      // mostly a failsafe
      this.resetView();

      this.metadata = JSON.parse(jsonText);

      // Kick off processing without blocking
      queueMicrotask(() => this.processPageData());
    } catch {
      window.location.replace(navigator.onLine ? '/missing' : '/offline');
    }
  }

  /**
   * Process the data return and pump it into the main article body
   * @return Promise
   */
  async processPageData() {
    // Run metadata + HTML unescape in parallel (both async-safe)
    const [, htmlData] = await Promise.all([
      setPageMetaData(this.metadata), // batched + cached meta updates
      Promise.resolve(this.unescapeHtml(this.metadata.article)),
    ]);

    // Assign article content in one shot
    this.articleBody = html`${unsafeHTML(htmlData.toString())}`;

    // Inject lazy dependencies, don’t block
    queueMicrotask(() => this.#lazyLoadInjector(htmlData));

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
      // @ts-ignore
      if (window.ga4track) {
        // @ts-ignore
        queueMicrotask(() => window.ga4track.trackEvent('page_view'));
      }
    });
  }

  /**
   * Fixes stuff I spit into JSON from Hugo
   * @param {String} data Anything HTML that needs unescaping...
   * @return {String} string
   */
  unescapeHtml(data) {
    const strReplacer = (/** @type {string} */ raw) =>
      raw
        .replace(/(&#34;)/g, '"')
        .replace(/(&lt;)(.+?)(&gt;)/gims, '<$2>')
        .replace(/(&amp;)/gims, '&');

    if (window.trustedTypes && window.trustedTypes.createPolicy) {
      const unEscapeHTMLPolicy = window.trustedTypes.createPolicy(
        'unEscapeHTMLPolicy',
        {
          createHTML: (/** @type {string} */ raw) => strReplacer(raw),
        },
      );
      // @ts-ignore
      return unEscapeHTMLPolicy.createHTML(data);
    }
    return strReplacer(data);
  }

  /**
   * Find components and what not to load as needed in a post
   * @param {string} data The article post data
   * @returns Promise
   */
  async #lazyLoadInjector(data) {
    const loadPromises = lodDependencies
      .filter(({ regex }) => regex.test(data))
      .map(({ load }) => load());

    // Wait for all required modules to load
    return Promise.all(loadPromises);
  }

  static styles = [cssSheet];
}

export { BlogElement, html, css };
