import { LitElement, html, css } from 'lit';
import './lod-lite-youtube.js';

class YouTubeVideoList extends LitElement {
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
    lite-youtube {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      border-radius: 1rem;
      border: var(--border);
    }

    /** Ugh, Safari */
    @supports not (aspect-ratio: 1 / 1) {
      lite-youtube::before {
        float: left;
        padding-top: 100%;
        content: '';
      }

      lite-youtube::after {
        display: block;
        content: '';
        clear: both;
      }
    }
  `;

  constructor() {
    super();

    this.youtubeEndpoint =
      'https://us-west1-justinribeiro-web.cloudfunctions.net/get-youtube-videos';
    this.data = [];
  }

  async firstUpdated() {
    const response = await fetch(`${this.youtubeEndpoint}`, {
      mode: 'cors',
    });
    this.data = await response.json();
  }

  render() {
    return html`
      ${this.data.map(
        video => html`
          <div>
            <lite-youtube
              videotitle="${video.title}"
              videoid="${video.id}"
            ></lite-youtube>
          </div>
        `,
      )}
    `;
  }
}

window.customElements.define('youtube-video-list', YouTubeVideoList);
