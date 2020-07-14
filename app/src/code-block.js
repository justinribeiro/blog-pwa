import { LitElement, html, css } from 'lit-element';
import 'prismjs/prism.js';

class CodeBlock extends LitElement {
  static get properties() {
    return {
      lang: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.lang = 'clike';
    this.highlight = '';
  }

  async firstUpdated() {
    await this.__loadLanguage();
    const nodes = this.shadowRoot.querySelector('#code').assignedNodes();
    let codeCombined = '';
    for (let index = 0, len = nodes.length; index < len; ++index) {
      codeCombined += nodes[index].nodeValue;
    }

    // strip the lead/end newlines so we don't look horrible
    const codeClean = codeCombined.replace(/^\s+|\s+$/g, '');
    const highlight = Prism.highlight(codeClean, Prism.languages[this.lang], this.lang);

    // Set to our styled block
    this.shadowRoot.querySelector('#output').innerHTML = highlight;
  }

  async __loadLanguage() {
    await __import(`../node_modules/prismjs/components/prism-${this.lang}.min.js`);
  }

  static get styles() {
    return css`
      /**
      * prism.js default theme for JavaScript, CSS and HTML
      * Based on dabblet (http://dabblet.com)
      * @author Lea Verou
      */

      code[class*='language-'],
      pre[class*='language-'] {
        font-family: Consolas, Menlo, Monaco, 'Andale Mono WT', 'Andale Mono', 'Lucida Console',
          'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono',
          'Liberation Mono', 'Nimbus Mono L', 'Courier New', Courier, monospace;
        font-size: 16px;
        line-height: 1.375;
        direction: ltr;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
        tab-size: 4;

        hyphens: none;
        background: #faf8f5;
        color: #222222;
      }

      /* Code blocks */
      pre[class*='language-'] {
        padding: 1em;
        margin: 0.5em 0;
        overflow: auto;
      }

      @media print {
        code[class*='language-'],
        pre[class*='language-'] {
          text-shadow: none;
        }
      }

      :not(pre) > code[class*='language-'],
      pre[class*='language-'] {
        background: #f5f2f0;
      }

      /* Inline code */
      :not(pre) > code[class*='language-'] {
        padding: 0.1em;
        border-radius: 0.3em;
        white-space: normal;
      }

      pre[class*='language-']::-moz-selection,
      pre[class*='language-'] ::-moz-selection,
      code[class*='language-']::-moz-selection,
      code[class*='language-'] ::-moz-selection {
        text-shadow: none;
        background: #b3d4fc;
      }

      pre[class*='language-']::selection,
      pre[class*='language-'] ::selection,
      code[class*='language-']::selection,
      code[class*='language-'] ::selection {
        text-shadow: none;
        background: #b3d4fc;
      }

      .token.comment,
      .token.prolog,
      .token.doctype,
      .token.cdata {
        color: slategray;
      }

      .token.punctuation {
        color: #999;
      }

      .namespace {
        opacity: 0.7;
      }

      .token.property,
      .token.tag,
      .token.boolean,
      .token.number,
      .token.constant,
      .token.symbol,
      .token.deleted {
        color: #905;
      }

      .token.selector,
      .token.attr-name,
      .token.string,
      .token.char,
      .token.builtin,
      .token.inserted {
        color: #690;
      }

      .token.operator,
      .token.entity,
      .token.url,
      .language-css .token.string,
      .style .token.string {
        color: #9a6e3a;
        background: hsla(0, 0%, 100%, 0.5);
      }

      .token.atrule,
      .token.attr-value,
      .token.keyword {
        color: #07a;
      }

      .token.function,
      .token.class-name {
        color: #dd4a68;
      }

      .token.regex,
      .token.important,
      .token.variable {
        color: #e90;
      }

      .token.important,
      .token.bold {
        font-weight: bold;
      }
      .token.italic {
        font-style: italic;
      }

      .token.entity {
        cursor: help;
      }

      pre {
        padding: 0;
        margin: 0;
      }

      #hide {
        display: none !important;
      }
    `;
  }

  render() {
    return html`
      <pre class="language-base"><code id="output"></code></pre>

      <div id="hide">
        <slot id="code"></slot>
      </div>
    `;
  }
}
customElements.define('code-block', CodeBlock);
