import {LitElement, html} from 'lit-element';

class BlogMissing extends LitElement {
  render() {
    return html`
      <style>
        :host {
          display: block;
          padding: 40px 20px;
          text-align: center;
        }

        #main {
          margin: auto;
          max-width: 400px;
          padding-top: 135px;
        }

        svg {
          display: inline-block;
          width: 150px;
          height: 150px;
        }
      </style>
      <div id="main">
        <div>
          <svg viewbox="0 0 24 24">
            <g id="error"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></g>
          </svg>
          <h1>Sorry, I couldn't find that page.</h1>
        </div>
        <a href="/">Go to the home page</a>
      </div>
    `;
  }
}

customElements.define('blog-missing', BlogMissing);
