import BlogElement from './blog-element.js';
import {css, html} from 'lit-element';

class BlogChronicle extends BlogElement {
  connectedCallback() {
    super.connectedCallback();
    this.mount();
  }

  async mount() {
    this._setPageMetaData({
      title: 'Chronicle Archives',
      description: 'An archive of blog posts, thoughts, and other musings from Justin Ribeiro. Pulling. It. Off.',
    });

    try {
      const response = await fetch('/data/chronicle/index.json');
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      this.metadata = await response.json();
      this.failure = false;
    } catch (error) {
      this.failure = true;
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        #posts > h2 {
          margin-bottom: 10px;
        }

        #posts {
          display: flex;
          flex-wrap: wrap;
        }
      `
    ];
  }

  render() {
    return html`
      <div id="main">
        <div>
          <h1>Chronicle Archives</h1>
          <p>The definition of a chronicle, as defined by Merriam-Webster is:</p>
          <blockquote>a usually continuous historical account of events arranged in order of time without analysis or interpretation</blockquote>
          <p>My chronicles aren’t exactly without analysis, but they are listing of events and happenings. The latest events are listed on the home page and the archives are presented below.</p>
        </div>
        <div id="posts">
          ${this.metadata.posts.map(post =>
             html`<div class="post-container">
              <a href="${post.permalink}">
                <h3 class="date">🗒️ ${post.date}</h3>
                <h2 class="title">${post.title}</h2>
              </a>
            </div>`)}
        </div>
      </div>

      <blog-network-warning ?hidden="${!this.failure}"></blog-network-warning>
    `;
  }
}
customElements.define('blog-chronicle', BlogChronicle);
