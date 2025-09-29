const fallbackImg =
  'https://storage.googleapis.com/jdr-public-imgs/manifest/me-2022-192.png';

/**
 * Set the pages metadata on data load. Note, Google Search will index this so
 * it's not just for show
 * @param {object} {{title, description, url, socialImage}}
 */
function setPageMetaData({ title, description, url, socialimage, tags }) {
  document.title = `${title} - Dr. Justin Ribeiro, Ph.D.`;

  setMetaDom('property', 'og:title', document.title);
  setMetaDom('name', 'description', description);
  setMetaDom('name', 'keywords', tags);
  setMetaDom('property', 'og:description', description);
  setMetaDom('property', 'og:image', socialimage || fallbackImg);
  setMetaDom('property', 'og:url', url || document.location.href);
}

/**
 * Locate and find document meta tags to update
 * @param {string} attrName
 * @param {string} attrValue
 * @param {string} content
 */
function setMetaDom(attrName, attrValue, content) {
  let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
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
