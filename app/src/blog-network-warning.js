import {LitElement, html} from '@polymer/lit-element';
import '@polymer/iron-icon/iron-icon.js';
import './blog-icons.js';

class BlogNetworkWarning extends LitElement {

  constructor() {
    super();
  }

  _tryReconnect() {
    this.dispatchEvent(new CustomEvent('try-reconnect', {
      bubbles: false,
      composed: false,
    }));
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
        }

        iron-icon {
          display: inline-block;
          width: 150px;
          height: 150px;
        }
      </style>

      <div id="main">
        <div>
          <iron-icon icon="no-internet"></iron-icon>
          <h1>No internet connection.</h1>
          <p>Argh! Is the wifi lying to you? Are you in a tunnel? Now would be the time to check if your device is still connected to WiFi or your mobile network.</p>
        </div>
        <button on-click="${this._tryReconnect.bind(this)}">Try Again</button>
      </div>
    `;
  }

}

customElements.define('blog-network-warning', BlogNetworkWarning);
