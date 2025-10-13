// Things we use in blog posts, but don't use all the time; we don't want to
// load it if we don't have to, so we hunt on injection off the main thread
const lodDependencies = [
  {
    regex: /<\/stl-part-viewer>/g,
    load: () => import('../lod/lod-3d-utils.js'),
  },
  { regex: /<\/code-block>/g, load: () => import('../lod/lod-code-block.js') },
  {
    regex: /<\/lite-youtube>/g,
    load: () => import('../lod/lod-lite-youtube.js'),
  },
  {
    regex: /<\/toggle-citation>/g,
    load: () => import('../lod/lod-toggle-citation.js'),
  },
  {
    regex: /<\/ribeiro-social-photos>/g,
    load: () => import('../lod/lod-youtube-list.js'),
  },
  {
    regex: /<\/youtube-video-list>/g,
    load: () => import('../lod/lod-ribeiro-social-photos.js'),
  },
];

export { lodDependencies };
