import { LitElement, html, css } from 'lit';

class SnackBar extends LitElement {
  static properties = {
    active: {
      type: Boolean,
    },
    action: {
      type: Boolean,
    },
    trigger: {
      type: Function,
    },
  };

  static get styles() {
    return css`
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
        transition-property: transform;
        transition-duration: 0.2s;
        pointer-events: auto;
        z-index: 1000;
      }
      :host([active]) {
        transform: translate3d(0, 0, 0);
      }

      div button {
        color: var(--notice-color-link);
        border: 0;
        border-bottom: 1px solid var(--notice-color-link);
        background: transparent;
        font-size: 1em;
        padding: 0;
        margin-left: 0.25rem;
        cursor: pointer;
      }

      @media (min-width: 460px) {
        :host {
          width: 320px;
          margin: auto;
        }
      }
    `;
  }

  constructor() {
    super();
    this.active = false;
    this.action = false;
    this.trigger = () => {};
  }

  attributeChangedCallback() {
    this.shadowRoot.querySelector('div[role=status]').focus();
  }

  __reload() {
    this.trigger();
  }

  render() {
    return html`
      <div role="status" tabindex="-1">
        <slot></slot>
        <button @click="${this.__reload}" ?hidden=${!this.action}>
          Refresh
        </button>
      </div>
    `;
  }
}

window.customElements.define('snack-bar', SnackBar);

export { SnackBar };
