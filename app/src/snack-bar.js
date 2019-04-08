import {LitElement, html} from 'lit-element';

class SnackBar extends LitElement {
  render(props) {
    return html`
      <style>
      :host {
        display: block;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 24px;
        background-color: var(--notice-color-bg);
        color: white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        text-align: center;
        will-change: transform;
        transform: translate3d(0, 100%, 0);
        transition-property: visibility, transform;
        transition-duration: 0.2s;
        visibility: hidden;
      }
      :host([active]) {
        visibility: visible;
        transform: translate3d(0, 0, 0);
      }

      div ::slotted(a) {
        color: var(--notice-color-link) !important;
        border-bottom: 1px solid var(--notice-color-link) !important;
        text-decoration: none;
      }

      @media (min-width: 460px) {
        :host {
          width: 320px;
          margin: auto;
        }
      }
    </style>
    <div>
      <slot></slot>
    </div>
    `;
  }

  static get properties() {
    return {
      active: Boolean,
    };
  }
}

window.customElements.define('snack-bar', SnackBar);
