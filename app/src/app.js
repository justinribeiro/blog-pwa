// Very few things actually require this now
if (
  !('attachShadow' in Element.prototype) ||
  !('getRootNode' in Element.prototype)
) {
  const wcScript = document.createElement('script');
  wcScript.src =
    '/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js';
  document.head.appendChild(wcScript);
}

// Only load IO if we don't have it
if (
  !('IntersectionObserver' in window) &&
  !('IntersectionObserverEntry' in window)
) {
  const ioScript = document.createElement('script');
  ioScript.async = true;
  ioScript.src = '/node_modules/intersection-observer/intersection-observer.js';
  document.head.appendChild(ioScript);
}
// Only load the dynamic import polyfill if we need it
function __loadDynamicImportCheck(src) {
  window.polyfillDynamicImport = false;
  try {
    new Function('import("./' + src + '")')();
  } catch (e) {
    const s = document.createElement('script');
    s.src = '/src/polyfill-dynamicimport.js';
    s.dataset.main = src;
    document.head.appendChild(s);
    window.polyfillDynamicImport = true;

    s.onload = () => {
      __import(src);
    };
  }
}
__loadDynamicImportCheck('blog-pwa.js');

// shim dynamic import() to workaround Firefox throwing parse error for
// dynamic import() in FF65
function __import(src) {
  if (window.polyfillDynamicImport) {
    return importModule(`./src/${src}`);
  } else {
    return new Function('return import("./' + src + '")')();
  }
}
