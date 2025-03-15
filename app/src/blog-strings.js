/**
 * A whole bunch of formerly EcmaScript strings I had scattered around
 */
export const defaultStrings = {
  webmentions: {
    start: 'Checking for interactions...',
    none: 'There are currently no interactions with this piece. Be the first!',
    some: 'There are currently {{ count }} interactions with this piece on the open web.',
    invalid: 'The URL you entered does not appear to be valid.',
    error:
      "Oh no, your Webmention didn't seem to make it through. Please try again.",
    shared:
      'Thank you for sharing! Your Webmention has been received and is currently be processed.',
  },
  sharing: {
    title: '{{ title }} by Dr. Justin Ribeiro, Ph.D.',
    services: {
      twitter:
        'https://twitter.com/intent/tweet?url={{ permalink }}&text={{ title }} via @justinribeiro',
      facebook: 'https://www.facebook.com/sharer.php?u={{ permalink }}',
      linkedin:
        'https://www.linkedin.com/shareArticle?mini=true&url={{ permalink }}&title={{ title }}&source=&summary={{ description }}',
      email:
        'mailto:?subject=Article: {{ title }}&body=Article from Dr. Justin Ribeiro, Ph.D.: {{ permalink }}',
    },
  },
  figures: {
    expand: 'Enlarge Image',
    contract: 'Collapse Image',
    button: '⬌',
  },
};

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
export function stringInterpolate(text, values) {
  return Object.entries(stringExtract(values)).reduce(
    // eslint-disable-next-line no-shadow
    (text, [key, value]) =>
      text.replace(new RegExp(`{{[ ]*${key}[ ]*}}`), stringExtract(value)),
    text
  );
}
