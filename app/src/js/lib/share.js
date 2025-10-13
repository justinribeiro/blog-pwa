import { stringInterpolate } from './helpers.js';

const sharingServices = {
  BlueSky: 'https://bsky.app/intent/compose?text={{title}}%20{{permalink}}',
  Pocket: 'https://getpocket.com/save?url={{permalink}}&title={{text}}',
  Reddit: 'https://www.reddit.com/submit?url={{permalink}}&title={{text}}',
  Linkhut:
    'https://ln.ht/_/add?url={{permalink}}&title={{title}}&tags={{tags}}',
  LinkedIn:
    'https://www.linkedin.com/shareArticle?mini=true&url={{ permalink }}&title={{ title }}&source=&summary={{ description }}',
  Email:
    'mailto:?subject=Article: {{ title }}&body=Article from Dr. Justin Ribeiro, Ph.D.: {{ permalink }}',
};

/**
 * Generate desktop share links for services we support
 * @param {object} metadata
 * @returns array
 */
function desktopShareLinks(metadata) {
  // fire and forget, don't block on import
  import('../lod/lod-share-to-mastodon.js');

  const data = {
    permalink: metadata.permalink,
    title: metadata.title,
    description: metadata.description,
    tags: metadata.tags,
  };

  const sharePaths = Object.entries(sharingServices).map(([key, template]) => ({
    service: key, // capitalize
    link: stringInterpolate(template, data),
  }));

  return sharePaths;
}

export { desktopShareLinks };
