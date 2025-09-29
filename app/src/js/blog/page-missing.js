import { BlogElement, html, css } from './blog-element.js';

class BlogMissing extends BlogElement {
  async mount() {
    window.scroll(0, 0);
    this.__setPageMetaData({
      title: 'Page Not Found',
      description: 'No dice finding that.',
    });
  }

  static styles = [
    super.styles,
    css`
      #giphy {
        display: flex;
        justify-content: center;
        text-align: center;
      }
    `,
  ];

  render() {
    return html`
      <section>
        <h1>Sorry, I can't find that page.</h1>
        <h2 class="subheadline">
          404 NOT FOUND!?!?! Who's running this circus?
        </h2>
        <p>
          I'm sorry for the inconvenience but be assured I have been alerted and
          will look into finding the aforementioned missing page. In the mean
          time, head back the <a href="/">home page</a> or to the
          <a href="/chronicle/">archive</a> for other posts you may find
          interesting.
        </p>
        <div id="giphy">
          <iframe
            src="https://giphy.com/embed/xTiTngQ7Gpakdpm4nu"
            width="480"
            height="363"
            frameborder="0"
            allowfullscreen
            title="Mulder from the show The X-Files typing on a computer."
          ></iframe>
          <p>
            <a href="https://giphy.com/gifs/the-x-files-xTiTngQ7Gpakdpm4nu"
              >via GIPHY</a
            >
          </p>
        </div>
      </section>
    `;
  }
}

customElements.define('blog-missing', BlogMissing);
