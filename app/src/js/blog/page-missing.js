import { setPageMetaData } from '../lib/helpers.js';
import { BlogElement, html } from './blog-element.js';

// @ts-ignore
import cssSheet from '../../css/page.css' with { type: 'css' };

class BlogMissing extends BlogElement {
  async mount() {
    window.scroll(0, 0);
    // @ts-ignore
    setPageMetaData({
      title: '404: Page Not Found',
      description: 'Sorry, I cannot find the page your seek.',
    });
  }

  static styles = [super.styles, cssSheet];

  render() {
    return html`
      <article
        itemprop="blogPost"
        id="main"
        itemscope
        itemtype="http://schema.org/BlogPosting"
      >
        <header class="page">
          <div id="subHeader">
            <h1 itemprop="headline">The Truth Is Out There, Somewhere</h1>
            <h2 itemprop="subheadline">
              Unfortunately Not Here: 404 PAGE NOT FOUND
            </h2>
          </div>
        </header>
        <section itemprop="articleBody" class="page">
          <p>
            I'm sorry for the inconvenience but be assured I have been alerted
            and will look into finding the aforementioned missing page. In the
            mean time, head back the <a href="/">home page</a> or to the
            <a href="/chronicle/">blog post archive</a> for other information
            you may find interesting.
          </p>
          <figure>
            <img
              src="https://storage.googleapis.com/jdr-public-imgs/pages/explore/xfiles-internet.webp"
              alt="The X-Files: The Internet is not Good for You"
            />
          </figure>
        </section>
      </article>
    `;
  }
}

customElements.define('blog-missing', BlogMissing);
