import {LitElement, html} from '@polymer/lit-element';

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
            <g id="no-internet"><path fill-opacity=".3" d="M24.24 8l1.35-1.68C25.1 5.96 20.26 2 13 2S.9 5.96.42 6.32l12.57 15.66.01.02.01-.01L20 13.28V8h4.24z"></path><path d="M22 22h2v-2h-2v2zm0-12v8h2v-8h-2z"></path></g>
          </svg>
          <h1>Sorry, I couldn't find that page.</h1>
        </div>
        <a href="/">Go to the home page</a>
      </div>
    `;
  }
}

customElements.define('blog-missing', BlogMissing);
