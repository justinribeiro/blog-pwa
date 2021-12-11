import { html, css, LitElement } from 'lit';
/**
 * A modified fork of my @justinribeiro/toggle-tooltip for reference citations
 */
export class ToggleCitation extends LitElement {
  static properties = {
    label: {
      type: String,
    },
    show: {
      type: Boolean,
    },
    __tooltipActive: {
      type: Boolean,
    },
    __tooltipDom: {
      type: Object,
    },
    __tooltipButton: {
      type: Object,
    },
  };

  constructor() {
    super();
    /**
     * Define the internal button aria-label when an svg icon or other non-text
     * is used
     * @default 'citation'
     * @attr
     */
    this.label = 'citation';
    /**
     * Define the internal button aria-label when an svg icon or other non-text
     * is used
     * @default 'more info'
     * @attr
     */
    this.show = false;
    /**
     * Hold the current active state of the tooltip
     * @state
     * @protected
     */
    this.__tooltipActive = false;
    this.KEYCODE = Object.freeze({
      ESC: 'Escape',
      ENTER: 'Enter',
      SPACE: 'Space',
      TAB: 'Tab',
    });
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keyup', this.__keyboardIsEscape.bind(this));
  }

  firstUpdated() {
    this.__tooltipDom = this.shadowRoot.querySelector('div[role=status]');
    this.__tooltipButton = this.shadowRoot.querySelector('button');
  }

  disconnectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
    window.removeEventListener('keydown', this.__keyboardIsEscape.bind(this));
  }

  /**
   * Close the tooltip
   * @param {boolean} oReFocus Don't refocus to the button (probably because we
   * tabbed off and are moving through the document)
   */
  close(noReFocus = false) {
    this.__tooltipDom.blur();
    this.__tooltipActive = false;
    this.removeAttribute('show');
    if (!noReFocus) {
      this.__tooltipButton.focus();
    }
    this.style.setProperty('--int-tooltip-transform', `0`);
  }

  /**
   * Open the tooltip and focus to it
   */
  open() {
    if (!this.__tooltipActive) {
      this.__tooltipActive = true;
      this.__transformPositionCalculation();
      this.setAttribute('show', '');
      this.__tooltipDom.focus();
    }
  }

  /**
   * Handle keyboard events to handle display state of the component to handle
   * WCAG SC 1.4.13 (Dismissible)
   * @private
   * @param {KeyboardEvent} event
   */
  __keyboardIsEscape(event) {
    // We always check to see if the tooltip was active before running the close
    // because otherwise we're likely to set the return focus to the wrong
    // target (which may still happen because other handlers from other
    // non-tooltips could take over focus on the esc key as well), which is to
    // say, this is a best effort
    if (this.__tooltipActive && event.code === this.KEYCODE.ESC) {
      this.close();
    }
    if (this.__tooltipActive && event.code === this.KEYCODE.TAB) {
      // Look within the composedPath() to determine whether or not we're still
      // in the component focus (particularly in cases where there is
      // interactive content within the <slot>)
      // eslint-disable-next-line array-callback-return
      const found = event.composedPath().find(i => {
        if (i === this) {
          return true;
        }
        return false;
      });
      if (!found) {
        // pass true because a tab action is moving forward in the document and
        // we don't want to bounce the user
        this.close(true);
      }
    }
  }

  /**
   * Toggle the state of the tooltip when the user operates the button via
   * click, tap, or keyboard interaction
   */
  __toggleCitation() {
    if (this.__tooltipActive) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Calculate and set the css transform for the tooltip open() based on the
   * web component position within the DOM.
   *
   * Note: this function will set the CSS custom property
   * `--int-tooltip-transform` and does not directly modify the style
   */
  __transformPositionCalculation() {
    let translateY;
    // Not a cheap set of operations, but we don't have a lot of choice
    const tooltipRect = this.__tooltipDom.getBoundingClientRect();
    const buttonRect = this.__tooltipButton.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const isButtonTopWeighted = buttonRect.y - tooltipRect.height < 0;
    const translateX = `translateX(${
      windowWidth / 2 - tooltipRect.width / 2 - buttonRect.left
    }px)`;

    // }
    // Second, check if we have enough space to open to the top (preferred) or
    // if we have to shift to the bottom
    if (isButtonTopWeighted) {
      // go low
      translateY = `translateY(${
        buttonRect.y - tooltipRect.y + buttonRect.height
      }px)`;
    } else {
      translateY = `translateY(${-(
        buttonRect.y -
        tooltipRect.y +
        tooltipRect.height
      )}px)`;
    }
    // This sets the CSS custom prop against the _local_ instance of the
    // component; this won't bleed the scope, and don't set this to :root
    // otherwise you'll have stuff scattered all over
    this.style.setProperty(
      '--int-tooltip-transform',
      `${translateX} ${translateY}`
    );
  }

  static styles = css`
    :host {
      display: inline-flex;
      position: relative;
      pointer-events: auto;

      --toggle-tooltip-status-border: 1px solid #ccc;
      --toggle-tooltip-status-background-color: #fafafa;
      --toggle-tooltip-status-padding: 1rem;
      --toggle-tooltip-status-border-radius: 0.5rem;
      --toggle-tooltip-status-box-shadow: none;

      --toggle-tooltip-button-border: none;
      --toggle-tooltip-button-background-color: transparent;
      --toggle-tooltip-button-padding: 0;
    }

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border: var(--toggle-tooltip-button-border);
      background-color: var(--toggle-tooltip-button-background-color);
      padding: var(--toggle-tooltip-button-padding);
      cursor: pointer;
      font-size: inherit;
      font-family: inherit;
      color: inherit;
    }

    div[role='status'] {
      position: absolute;
      z-index: 2;
      border: var(--toggle-tooltip-status-border);
      background: var(--toggle-tooltip-status-background-color);
      padding: var(--toggle-tooltip-status-padding);
      border-radius: var(--toggle-tooltip-status-border-radius);
      box-shadow: var(--toggle-tooltip-status-box-shadow);

      /*
        This is a bit specific to making the case respectively
        accessible for as many users as possible and is purely my opinion
      */
      width: calc(100vw - var(--toggle-tooltip-status-padding) * 2);
      max-width: calc(700px - var(--toggle-tooltip-status-padding) * 2);

      transform: translateX(-1000%);
      transition: opacity 300ms;
      will-change: opacity;
      opacity: 0;
    }

    /*
      This is a cheeky workaround so that we can focus the div but *not* use
      the focus outline since the element is not interactive.

      The reason for this is so that we can throw focus for screen readers so
      that readout is correct (particularly for JAWS 2020+, which has issues
      reading the role=status when brought back to the viewport)
    */
    div[role='status']:focus {
      outline: none;
    }

    :host([show]) div[role='status'] {
      opacity: 1;
      transform: var(--int-tooltip-transform);
    }

    @media (prefers-reduced-motion) {
      div[role='status'] {
        transition: none;
      }
    }
  `;

  render() {
    return html`
      <button @click="${this.__toggleCitation}" aria-label="${this.label}">
        <slot></slot>
      </button>
      <div role="status" tabindex="-1"><slot name="citation"></slot></div>
    `;
  }
}
window.customElements.define('toggle-citation', ToggleCitation);
