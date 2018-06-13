/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt


Justin Says:

Style wise, this is spot on the SHOP snackbar; I did change it a bit so that I 
could use it for other future things.
*/
import '@polymer/polymer/polymer-legacy.js';

import './shared-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { flush } from '@polymer/polymer/lib/legacy/polymer.dom.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        display: block;
        position: fixed;
        left: calc(50% - 160px);
        right: calc(50% - 160px);
        bottom: 0;
        background-color: var(--notice-color-bg);
        color: var(--notice-color-text);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        width: 320px;
        padding: 12px;
        visibility: hidden;
        text-align: center;
        will-change: transform;
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0);
        transition-property: visibility, -webkit-transform, opacity;
        transition-property: visibility, transform, opacity;
        transition-duration: 0.2s;
      }
      
      :host(.opened) {
        visibility: visible;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
      }

      #message a {
        color: var(--notice-color-link);
        border-bottom: 1px solid var(--notice-color-link);
      }
      
      @media (max-width: 767px) {
        :host {
          top: auto;
          bottom: 0;
          left: 0;
          right: 0;
          width: auto;
          -webkit-transform: translate3d(0, 100%, 0);
          transform: translate3d(0, 100%, 0);
          z-index: 1;
        }
      }
    </style>

    <span id="message"></span>
`,

  is: 'blog-noticebar',

  setText: function(text, open) {
    this.$.message.innerHTML = text;

    if (open) {
      this.open();
    }
  },

  open: function() {
    flush();
    this.offsetHeight && this.classList.add('opened');
    this.debounce('_close', this.close, 6000);
  },

  close: function() {
    this.classList.remove('opened');
  }
});
