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
      grid-template-columns: repeat(auto-fit, minmax(256px, 1fr));
      gap: 1rem;
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
      'https://us-west2-justinribeiro-web.cloudfunctions.net/get-mastodon-images';
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
                alt="${photo.content.replace(/<[^>]*>?/gm, '')}"
                loading="lazy"
              />
            </a>
          </div>
        `
      )}
    `;
  }
}

window.customElements.define('ribeiro-social-photos', RibeiroSocialPhotos);
