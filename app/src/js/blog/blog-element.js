import { LitElement, css, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { setPageMetaData } from '../lib/helpers.js';

import cssSheet from '../../css/element.css' with { type: 'css' };

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
      import('../lod/lod-3d-utils.js');
    }

    const CodeBlockRequired = new RegExp('(</code-block>)', 'g');
    if (CodeBlockRequired.test(data)) {
      import('../lod/lod-code-block.js');
    }

    const YouTubeRequired = new RegExp('(</lite-youtube>)', 'g');
    if (YouTubeRequired.test(data)) {
      import('../lod/lod-lite-youtube.js');
    }

    const TooltipRequired = new RegExp('(</toggle-citation>)', 'g');
    if (TooltipRequired.test(data)) {
      import('../lod/lod-toggle-citation.js');
    }

    const YouTubeListRequired = new RegExp('(</ribeiro-social-photos)', 'g');
    if (YouTubeListRequired.test(data)) {
      import('../lod/lod-youtube-list.js');
    }

    const PhotosRequired = new RegExp('(</youtube-video-list>)', 'g');
    if (PhotosRequired.test(data)) {
      import('../lod/lod-ribeiro-social-photos.js');
    }
  }

  static styles = [cssSheet];
}

export { BlogElement, html, css };
