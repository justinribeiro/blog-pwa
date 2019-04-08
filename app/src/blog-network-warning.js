import {LitElement, html} from 'lit-element';

class BlogNetworkWarning extends LitElement {
  _tryReconnect() {
    this.dispatchEvent(new CustomEvent('try-reconnect', {
      bubbles: false,
      composed: true,
    }));
  }

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
          <h1>No internet connection.</h1>
          <p>Argh! Is the wifi lying to you? Are you in a tunnel? Now would be the time to check if your device is still connected to WiFi or your mobile network.</p>
        </div>
        <button @click="${this._tryReconnect}">Try Again</button>
      </div>
    `;
  }

}

customElements.define('blog-network-warning', BlogNetworkWarning);
