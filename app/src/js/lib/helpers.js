const fallbackImg =
  'https://storage.googleapis.com/jdr-public-imgs/manifest/me-2022-192.png';

const metaCache = new Map();

/**
 * Set the pages metadata on data load. Note, Google Search will index this so
 * it's not just for show
 * @param {import("../blog/blog-element.js").BlogMetadata} base
 */
async function setPageMetaData({ title, description, url, socialimage, tags }) {
  document.title = `${title} - Justin Ribeiro, Ph.D.`;

  const metaData = [
    { attr: 'property', name: 'og:title', content: document.title },
    { attr: 'name', name: 'description', content: description },
    { attr: 'name', name: 'keywords', content: tags },
    { attr: 'property', name: 'og:description', content: description },
    { attr: 'property', name: 'og:image', content: socialimage || fallbackImg },
    {
      attr: 'property',
      name: 'og:url',
      content: url || document.location.href,
    },
  ];

  // Create a fragment for batch appends
  const fragment = document.createDocumentFragment();

  // Collect all operations
  for (const { attr, name, content } of metaData) {
    setMetaDom(attr, name, content, fragment);
  }

  // Append all new <meta> in one shot
  if (fragment.childNodes.length) {
    document.head.appendChild(fragment);
  }
}

/**
 * Locate and find document meta tags to update
 * @param {string} attrName
 * @param {string} attrValue
 * @param {string} content
 * @param {DocumentFragment} fragment
 */
function setMetaDom(attrName, attrValue, content, fragment) {
  const key = `${attrName}:${attrValue}`;
  let element = metaCache.get(key);

  if (!element) {
    // Try DOM lookup only once
    element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);

    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      fragment.appendChild(element); // batch creation
    }

    metaCache.set(key, element);
  }

  element.setAttribute('content', content ?? '');
}

/**
 * Run the function, otherwise return the value
 * @param {Function | string | number} obj
 * @returns string
 */
function stringExtract(obj) {
  return typeof obj === 'function' ? obj() : obj;
}

/**
 * Interpolate a set of object values into a string
 * @param {string} text
 * @param {object} values
 * @returns string
 */
function stringInterpolate(text, values) {
  return Object.entries(stringExtract(values)).reduce(
    (text, [key, value]) =>
      text.replace(new RegExp(`{{[ ]*${key}[ ]*}}`), stringExtract(value)),
    text,
  );
}

export { setPageMetaData, setMetaDom, stringInterpolate };
