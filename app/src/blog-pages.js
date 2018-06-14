import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {IronResizableBehavior} from
  '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import {IronSelectableBehavior} from
  '@polymer/iron-selector/iron-selectable.js';
import '@polymer/iron-pages/iron-pages.js';

/**
 * Mini neon-pages
 * @customElement
 * @polymer
 * @extends {Polymer.Element}
 */

const legacyMixinSupport = mixinBehaviors(
    [IronResizableBehavior, IronSelectableBehavior],
    PolymerElement);

class BlogPages extends legacyMixinSupport {
  static get properties() {
    return {
      // as the selected page is the only one visible, activateEvent
      // is both non-sensical and problematic; e.g. in cases where a user
      // handler attempts to change the page and the activateEvent
      // handler immediately changes it back
      activateEvent: {
        type: String,
        value: null,
      },
      selected: {
        observer: '_selectedPageChanged',
      },
      animationKeyFramesIn: {
        type: Array,
        value: function() {
          return [
            {opacity: '0', offset: 0},
            {opacity: '1', offset: 1},
          ];
        },
      },
      animationKeyFramesOut: {
        type: Array,
        value: function() {
          return [
            {opacity: '1', offset: 0},
            {opacity: '0', offset: 1},
          ];
        },
      },
      animationTiming: {
        type: Object,
        value: function() {
          return {
            duration: 300,
            iterations: 1,
            fill: 'forwards',
            easing: 'ease-out',
          };
        },
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('iron-select', (e) => this._onIronSelect(e));
  }

  _selectedPageChanged(selected, old) {
    this.async(this.notifyResize);
  }

  _onIronSelect(event) {
    this.triggerMount();

    let selectedPage = event.detail.item;
    let oldPage = this._valueToItem(this._prevSelected) || null;
    this._prevSelected = this.selected;
    // On page change, we don't want to be at the bottom if the last page
    // was scrolled to the bottom. This may flicker but we need to keep body
    // scroll for accessibility purposes.
    window.scrollTo(0, 0);
    if (oldPage) {
      oldPage.classList.add('animating');
      selectedPage.classList.add('animating');
      // Animate the blocks in and out. The previous page gets an animation
      // for a move out while the new page gets a move in animation.
      oldPage.animate(this.animationKeyFramesOut, this.animationTiming);
      let inPageAnimation = selectedPage.animate(
        this.animationKeyFramesIn,
        this.animationTiming);
      // Remove the animating classes once animation is complete so the pages
      // are static and scroll with body scroll again. User scroll control is
      // also restored at this time.
      //
      // TODO: Should use Promise.all.
      inPageAnimation.finished.then(() => {
        if (oldPage) {
          oldPage.classList.remove('animating');
        }
        selectedPage.classList.remove('animating');
      });
    } else {
      let inPageAnimation = selectedPage.animate(
        this.animationKeyFramesIn,
        this.animationTiming);
      inPageAnimation.finished.then(() => {
        //
      });
    }
  }

  triggerMount() {
    const element = this.querySelector('[render]');
    if (element && typeof element.mount === 'function') {
      element.mount();
    }
  }

  /**
   * Fail safe for when Service Worker doesn't want to show the SSR because
   * of a path mismatch
   * @param {HTMLElement} page The gr-page element to transition into view
   */
  forceTransition(page) {
    let inPageAnimation = page.animate(
      this.animationKeyFramesIn,
      this.animationTiming);
    inPageAnimation.finished.then(() => {
      // nada
    });
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          position: relative;
          contain: content;
        }
        :host > ::slotted(*) {
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }
        :host > ::slotted(*) {
          will-change: opacity, transform;
          opacity: 0;
        }
        :host > ::slotted(.animating) {
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          height: 100vh;
        }
        :host > ::slotted(:not(.view):not(.animating)) {
          display: none !important;
        }
      </style>

      <slot></slot>
    `;
  }
}
customElements.define('blog-pages', BlogPages);
