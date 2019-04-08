import {LitElement, css} from 'lit-element';
import './blog-network-warning.js';

/**
 * BlogElement
 */
export default class BlogElement extends LitElement {
  static get properties() {
    return {
      failure: {
        type: Boolean,
        value: false,
        attribute: false,
      },
      metadata: {
        type: Object,
        attribute: false,
      },
      share: {
        type: Object,
        attribute: false,
      },
      loaded: {
        type: Boolean,
        attribute: false,
      },
      which: {
        type: String,
        attribute: false,
      }
    };
  }

  constructor() {
    super();

    this.metadata = {
      posts: null,
      article: '',
      title: '',
      dataModified: '',
      date: '',
      readingtime: '',
      permalink: '',
      description: '',
      filename: '',
      view: '',
    };

    this.share = {
      twitter: '',
      facebook: '',
      linkedin: '',
      email: '',
    }

    this.which = '';

    this.failure = false;
    this.loaded = false;
  }

  firstUpdated() {
    this.shadowRoot.querySelector('blog-network-warning')
      .addEventListener('try-reconnect', () => this.mount());
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .hotpink { color: var(--hotpink); }
      .red { color: var(--red); }

      a {
        color: var(--accent-color-primary);
        text-decoration: none;
        border-bottom: 1px solid var(--accent-color-primary);
      }

      a:hover {
        color: var(--accent-color-secondary);
        text-decoration: none;
        border-bottom: 1px solid var(--accent-color-secondary);
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: Frutiger, "Frutiger Linotype", Univers, Calibri, "Gill Sans", "Gill Sans MT", "Myriad Pro", Myriad, "DejaVu Sans Condensed", "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif;
        margin: 0;
      }

      p, li {
        font-family: Georgia, Palatino, "Palatino Linotype", Cambria, Times, "Times New Roman", serif;
        margin: 0;
        color: var(--primary-text-color);
      }

      h1 {
        font-size: 28px;
        margin-left: -1.75px;
        line-height: 1.15;
        letter-spacing: -.02em;
        font-weight: 700;
        font-style: normal;
        margin-top: 16px;
      }

      h2 {
        font-size: 24px;
        margin-left: -1.75px;
        line-height: 1.15;
        letter-spacing: -.02em;
        font-weight: 700;
        font-style: normal;
      }

      h3 {
        font-size: 20px;
        margin-left: -1.75px;
        line-height: 1.15;
        letter-spacing: -.02em;
        font-weight: 400;
        font-style: normal;
      }

      p, li {
        margin-top: 10px;
        margin-bottom: 29px;
        font-weight: 400;
        font-style: normal;
        font-size: 21px;
        line-height: 1.58;
        letter-spacing: -.003em;
      }

      li {
        margin-bottom: 20px;
      }

      /* Don't like this; special case. TODO extract */
      p code, li code {
        background-color: var(--code-background);
        font-size: 19px;
        color: var(--code-color);
        padding: 5px;
      }

      blockquote {
        border-left: 5px solid var(--accent-color-primary);
        padding-left: 10px;
        margin-left: 10px;
      }

      blockquote, blockquote p {
        font-style: oblique;
        font-weight: 400;
        font-size: 20px;
      }

      [hidden] {
        display: none !important;
      }

      /* Use these to generate skeleton blocks before content loads */
      hr {
        height: 20px;
        background-color: var(--skelaton-background);
        border: 0;
      }
      hr.short {
        width: 65%;
        margin-left: 0;
      }

      /*
        Design choice: in my components, I always have a #main as a container
        in my web components. Why isn't named container? No idea. LOL.
      */
      #main, #skeleton, #posts {
        margin: auto;
        padding: 0 20px;
        max-width: 800px;
      }

      #skeleton {
        min-height: 102vh;
      }

      /*
        This gets used a couple of places (iron-list, simple related dom-repeat)
      */
      .post-container {
        height: 125px;
        width: calc(50% - 1rem);
      }

      .post-container a {
        min-height: 100px;
        color: initial;
        background-image: none;
        background-repeat: initial;
        background-position: initial;
        display: block;
        padding: 1rem;
        border-bottom: none;
        transition-property: background-color;
        transition-duration: 0.3s;
        will-change: background-color;
      }

      .post-container a:hover {
        text-decoration: none;
        background-color: var(--hotpink);
      }

      .post-container a:hover h2,
      .post-container a:hover h3 {
        color: #fff !important;
      }

      .post-container a span {
        font-size: 14px;
        color: var(--accent-color-primary);
      }

      .post-container a h2 {
        color: var(--accent-color-primary);
        font-weight: 400;
        font-family: Georgia, Palatino, "Palatino Linotype", Cambria, Times, "Times New Roman", serif;
      }

      .post-container a h3 {
        font-weight: 200;
        text-transform: uppercase;
        font-size: 14px;
        margin-bottom: 0.5rem;
        color: var(--accent-color-secondary);
      }

      @media (max-width: 767px) {
        #main, #skeleton, #posts {
          margin: auto;
          padding: 0 20px;
          max-width: 800px;
        }

        p, li {
          font-size: 18px;
          line-height: 1.58;
          letter-spacing: -.004em;
        }

        .post-container {
          width: 100%;
        }
      }
    `;
  }

  /**
   *
   * @param {object} {{title, description, url, imagetwitter, imagefb}}
   */
  _setPageMetaData({title, description, url, imagetwitter, imagefb}) {
    // Flip the metadata on load
    // Note, Google Search will index this
    document.title = `${title} - Justin Ribeiro`;
    document.head.querySelector('meta[name=\'description\']')
      .setAttribute('content', description);

    this._setMeta('property', 'og:title', document.title);
    this._setMeta('property', 'twitter:title', document.title);

    if (description) {
      this._setMeta('property', 'og:description', description);
      this._setMeta('property', 'twitter:description', description);
    }

    const fallbackImg = `${document.location}images/manifest/me-2018-192.png`;
    imagetwitter = imagetwitter || fallbackImg;
    imagefb = imagefb || fallbackImg;
    if (imagetwitter) {
      this._setMeta('property', 'twitter:image:src', imagetwitter);
      this._setMeta('property', 'og:image', imagefb);
    }

    url = url || document.location.href;
    this._setMeta('property', 'og:url', url);
    this._setMeta('property', 'twitter:url', url);

    if (window.ga) {
       ga('send', {
        hitType: 'pageview',
        page: window.location.pathname,
        location: url,
        title: title,
      });
    }
  }

  /**
   * Locate and find document meta tags to update
   * @param {string} attrName
   * @param {string} attrValue
   * @param {string} content
   */
  _setMeta(attrName, attrValue, content) {
    let element = document.head
      .querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content || '');
  }

  /**
   * Fixes stuff I spit into JSON from Hugo
   * @param {String} raw Anything HTML that needs unescaping..
   * @return {String} string
   */
  _unescapeHtml(raw) {
    const process = document.createElement('textarea');
    process.innerHTML = raw;
    return process.textContent;
  }

  /**
   * Check the current state of the view so we can get rid of the skelton in
   * weird inbetween states
   * @param {boolean} failed
   * @param {boolean} loaded
   * @return {boolean} state
   */
  __checkViewState(failed, loaded) {
    // In the event a network fail happens and we get not SW load,
    // hide the skeleton
    // In the event the network doesn't fail and we get a load,
    // hide the skeleton
    if (failed && !loaded || !failed && loaded) {
      return true;
    } else {
      return false;
    }
  }
};
