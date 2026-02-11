const metaCache = new Map();

/**
 * Set the pages metadata on data load. Note, Google Search will index this so
 * it's not just for show
 * @param {import("../blog/blog-element.js").BlogMetadata} base
 */
async function setPageMetaData({
  title,
  description,
  permalink,
  socialimage,
  tags,
  datePublished,
  dateModified,
}) {
  document.title = `${title} - Justin Ribeiro, Ph.D.`;
  try {
    document.head.querySelector('link[rel="canonical"]').href =
      permalink || document.location.href;
  } catch (error) {
    console.log(error);
  }

  const metaData = [
    { attr: 'property', name: 'og:title', content: document.title },
    { attr: 'property', name: 'og:headline', content: title },
    { attr: 'property', name: 'og:description', content: description },
    {
      attr: 'property',
      name: 'og:url',
      content: permalink || document.location.href,
    },
    { attr: 'property', name: 'og:image', content: socialimage },
    {
      attr: 'property',
      name: 'article:published_time',
      content: datePublished,
    },
    { attr: 'property', name: 'article:modified_time', content: dateModified },
    { attr: 'name', name: 'description', content: description },
    { attr: 'name', name: 'keywords', content: tags },
    { attr: 'itemprop', name: 'description', content: description },
    { attr: 'itemprop', name: 'headline', content: title },
    { attr: 'itemprop', name: 'name', content: document.title },
    { attr: 'itemprop', name: 'image', content: socialimage },
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
