import { defaultStrings } from '../blog/blog-strings.js';

/**
 * Our holders for <figure> tags in a post
 * @type Array<HTMLElement>
 */
let figures = [];

/**
 * @param {import('../blog/blog-element.js').BlogElement} component
 */
function figureInteractionInit(component) {
  figures = [...component.shadowRoot.querySelectorAll('figure')];
  const template = __figureButtonTemplate();

  for (const figure of figures) {
    const fragment = document.createDocumentFragment();
    const button = template.cloneNode(true);
    fragment.appendChild(button);

    figure.addEventListener('click', __figureToggleView.bind(component), {
      passive: true,
    });
    figure.appendChild(fragment);
  }

  __addFigureListeners(component);
}

/**
 * Add an Escape key binder for our full screen images
 * @param {import('../blog/blog-element.js').BlogElement} component
 */
function __addFigureListeners(component) {
  component.addEventListener(
    'blog-pwa-escape-pressed',
    __figureCloseOnEscape.bind(component),
    {
      passive: true,
    },
  );
}

/**
 * Clean up all the listeners; call in disconnectedCallback at very least
 * @param {import('../blog/blog-element.js').BlogElement} component
 */
function removeFigureEventListeners(component) {
  for (const figure of figures) {
    figure.removeEventListener('click', __figureToggleView, {
      passive: true,
    });
  }
  component.removeEventListener(
    'blog-pwa-escape-pressed',
    __figureCloseOnEscape,
    {
      passive: true,
    },
  );
}

/**
 * Generates the basic button for our figures to be applied
 * @returns HTMLElement
 */
function __figureButtonTemplate() {
  const template = document.createElement('button');
  template.setAttribute('aria-label', defaultStrings.figures.expand);
  template.textContent = defaultStrings.figures.button;
  return template;
}

/**
 * Used by interaction event from user to determine expand/contract state and
 * labels
 * @param {Event} event
 */
function __figureToggleView(event) {
  const target = /** @type {HTMLElement} */ (event.currentTarget);
  const button = target.querySelector('button');
  const isExpanded = target.hasAttribute('expand');

  target.toggleAttribute('expand', !isExpanded);
  button?.setAttribute(
    'aria-label',
    isExpanded
      ? defaultStrings.figures.expand
      : defaultStrings.figures.contract,
  );
}

/**
 * Hunt down open figures and close them on Escape key; this is scoped to the
 * bind() within the listener, so this = component
 */
function __figureCloseOnEscape() {
  const figures = this.shadowRoot.querySelectorAll('figure[expand]');
  figures.forEach(figure => {
    figure.removeAttribute('expand');
    figure
      .querySelector('button')
      .setAttribute('aria-label', defaultStrings.figures.expand);
  });
}

export { figureInteractionInit, removeFigureEventListeners };
