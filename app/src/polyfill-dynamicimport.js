// this is a revised version of
// https://github.com/uupaa/dynamic-import-polyfill/blob/master/importModule.js
// to be in the global space

function toAbsoluteURL(url) {
  const a = document.createElement('a');
  a.setAttribute('href', url); // <a href="hoge.html">
  return a.cloneNode(false).href; // -> "http://example.com/hoge.html"
}

// eslint-disable-next-line no-unused-vars
function importModule(url) {
  return new Promise((resolve, reject) => {
    const vector =
      '$importModule$' +
      Math.random()
        .toString(32)
        .slice(2);
    const script = document.createElement('script');
    const destructor = () => {
      delete window[vector];
      script.onerror = null;
      script.onload = null;
      script.remove();
      URL.revokeObjectURL(script.src);
      script.src = '';
    };
    script.defer = 'defer';
    script.type = 'module';
    script.onerror = () => {
      reject(new Error(`Failed to import: ${url}`));
      destructor();
    };
    script.onload = () => {
      resolve(window[vector]);
      destructor();
    };
    const absURL = toAbsoluteURL(url);
    const loader = `import * as m from "${absURL}"; window.${vector} = m;`; // export Module
    const blob = new Blob([loader], {type: 'text/javascript'});
    script.src = URL.createObjectURL(blob);

    document.head.appendChild(script);
  });
}
