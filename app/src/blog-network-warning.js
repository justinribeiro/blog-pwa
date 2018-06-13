/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-icon/iron-icon.js';
import './blog-icons.js';
import './shared-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
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
      <div hidden\$="[[offline]]">
        <iron-icon icon="error"></iron-icon>
        <h1>Couldn't reach the server</h1>
      </div>
      <div hidden\$="[[!offline]]">
        <iron-icon icon="no-internet"></iron-icon>
        <h1>No internet connection.</h1>
        <p>Argh! Is the wifi lying to you? Are you in a tunnel? Now would be the time to check if your device is still connected to WiFi or your mobile network.</p>
      </div>
      <button on-tap="_tryReconnect">Try Again</button>
    </div>
`,

  is: 'blog-network-warning',

  properties: {
    offline: {
      type: Boolean,
      observer: '_offlineChanged'
    }
  },

  _offlineChanged: function() {

    // if you don't do this, the fix for the importHref() cache issue 
    // that's in use with blog-missing won't work        
    var oldOffline = this.oldOffline;
    this.oldOffline = this.offline;

    if (!this.offline && oldOffline !== undefined) {
      this._tryReconnect();
    }
  },

  _tryReconnect: function() {
    this.fire('try-reconnect', null, { bubbles: false });
  }
});
