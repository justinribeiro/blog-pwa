import { LitElement, html, css } from 'lit';

class RibeiroSocialPhotos extends LitElement {
  static properties = {
    data: {
      type: Array,
    },
  };

  static styles = css`
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
      gap: 1rem;
    }

    @media (max-width: 768px) {
      :host {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }

    @media (max-width: 376px) {
      :host {
        grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
      }
    }

    img {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      border-radius: 1rem;
      border: var(--border);
    }

    /** Ugh, Safari */
    @supports not (aspect-ratio: 1 / 1) {
      img::before {
        float: left;
        padding-top: 100%;
        content: '';
      }

      img::after {
        display: block;
        content: '';
        clear: both;
      }
    }
  `;

  constructor() {
    super();

    this.mastodonEndpoint =
      'https://us-west1-justinribeiro-web.cloudfunctions.net/get-ribeirosocial-photos';
    this.data = [];
  }

  async firstUpdated() {
    const response = await fetch(`${this.mastodonEndpoint}`, {
      mode: 'cors',
    });
    this.data = await response.json();
  }

  render() {
    return html`
      ${this.data.map(
        photo => html`
          <div>
            <a href="${photo.url}">
              <img
                src="${photo.media}"
                alt="${photo.content}"
                title="${photo.content}"
                loading="lazy"
              />
            </a>
          </div>
        `,
      )}
    `;
  }
}

window.customElements.define('ribeiro-social-photos', RibeiroSocialPhotos);
