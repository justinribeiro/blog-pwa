import {LitElement, html} from '@polymer/lit-element';
import '@polymer/iron-icon/iron-icon.js';
import './blog-icons.js';

class BlogMissing extends LitElement {

  constructor() {
    super();
  }

  _render() {
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

        iron-icon {
          display: inline-block;
          width: 150px;
          height: 150px;
        }
      </style>

      <!-- So, since we don't load everything -->
      <div id="main">
        <div>
          <iron-icon icon="error"></iron-icon>
          <h1>Sorry, I couldn't find that page.</h1>
        </div>
        <a href="/">Go to the home page</a>
      </div>
    `;
  }
}

customElements.define('blog-missing', BlogMissing);
