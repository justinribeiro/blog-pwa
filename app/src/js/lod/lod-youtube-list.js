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

    lite-youtube {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      border-radius: var(--space-cs);
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

    this.youtubeEndpoint = '/api/getVideos';
    this.data = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.data.length === 0) {
      this.#fetchData();
    }
  }

  async #fetchData() {
    try {
      const response = await fetch(this.youtubeEndpoint);
      this.data = await response.json();
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    }
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
