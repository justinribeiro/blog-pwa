/**
 * A whole bunch of formerly EcmaScript strings I had scattered around
 */
export const defaultStrings = {
  webmentions: {
    start: 'Checking for interactions...',
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
      bluesky: 'https://bsky.app/intent/compose?text={{title}}%20{{permalink}}',
      pocket: 'https://getpocket.com/save?url={{permalink}}&title={{text}}',
      reddit: 'https://www.reddit.com/submit?url={{permalink}}&title={{text}}',
      linkhut:
        'https://ln.ht/_/add?url={{permalink}}&title={{title}}&tags={{tags}}',
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
