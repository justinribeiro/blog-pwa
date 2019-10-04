// Very few things actually require this now
if (
  !('attachShadow' in Element.prototype) ||
  !('getRootNode' in Element.prototype)
) {
  const wcScript = document.createElement('script');
  wcScript.src = '/src/polyfill-webcomponents.js';
  document.head.appendChild(wcScript);
  window.polyfillWebComponents = true;
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

// shim dynamic import() to workaround Firefox throwing parse error for
// dynamic import() in FF65
async function __import(src) {
  const cleanSrc = src.replace(/^\.\//, '');
  if (window.polyfillDynamicImport) {
    return importModule(`./src/${cleanSrc}`);
  } else {
    return new Function('return import("./' + cleanSrc + '")')();
  }
}

// Only load the dynamic import polyfill if we need it
async function __loadDynamicImportCheck(src) {
  window.polyfillDynamicImport = false;
  try {
    await __import(src);
  } catch (e) {
    const s = document.createElement('script');
    s.src = '/src/polyfill-dynamicimport.js';
    s.dataset.main = src;
    document.head.appendChild(s);
    window.polyfillDynamicImport = true;

    s.onload = async () => {
      await __import(src);
    };
  }
}

(async () => {
  if (window.polyfillWebComponents) {
    // This pretty much all deals with Edge loading behavior when it comes to
    // the polyfill
    if (!window.WebComponents || !window.WebComponents.ready) {
      document.addEventListener('WebComponentsReady', async () => {
        await __loadDynamicImportCheck('blog-pwa.js');
      });
    } else {
      await __loadDynamicImportCheck('blog-pwa.js');
    }
  } else {
    await __loadDynamicImportCheck('blog-pwa.js');
  }
})();
