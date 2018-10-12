import {Debouncer} from '@polymer/polymer/lib/utils/debounce';
import {timeOut} from '@polymer/polymer/lib/utils/async';

/**
 * BlogUtilsBehavior - Description for mixin
 * @polymerMixin
 * @mixinFunction
 */
export const BlogUtils = (superClass) => class extends superClass {
  static get properties() {
    return {
      failure: {
        type: Boolean,
        value: false,
      },
      offline: Boolean,
    };
  }

  /**
   * Get a resource with XHR and account for flaky internet connections. This
   * is one for one from the Polymer Shop demo.
   * @param  {Object} request  XHR request object.
   * @param  {Number} attempts Number of XHR rquests to run for flaky connects.
   */
  _getResource(request, attempts) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', request.onLoad.bind(this));
    xhr.addEventListener('error', function(e) {
      // Flaky connections might fail fetching resources
      if (attempts > 1) {
        this._debounce = Debouncer.debounce(this._debounce,
          timeOut.after(200),
          this._getResource.bind(this, request, attempts - 1));
      } else {
        request.onError.call(this, e);
      }
    }.bind(this));
    xhr.open('GET', request.url);
    xhr.send();
  }

  /**
   * Set HTML document title and meta description for search engines.
   * @param {Object} {title, description, url, image} Page metadata to set.
   */
  _setPageMetaData({title, description, url, imagetwitter, imagefb}) {
    // Flip the metadata on load
    // Note, Google Search will index this
    document.title = `${title} - Justin Ribeiro`;
    document.head.querySelector('meta[name=\'description\']')
      .setAttribute('content', description);

    this._setMeta('property', 'og:title', document.title);
    this._setMeta('property', 'twitter:title', document.title);

    if (description) {
      this._setMeta('property', 'og:description', description);
      this._setMeta('property', 'twitter:description', description);
    }

    const fallbackImg = `${document.location}images/manifest/me-2018-192.png`;
    imagetwitter = imagetwitter || fallbackImg;
    imagefb = imagefb || fallbackImg;
    if (imagetwitter) {
      this._setMeta('property', 'twitter:image:src', imagetwitter);
      this._setMeta('property', 'og:image', imagefb);
    }

    url = url || document.location.href;
    this._setMeta('property', 'og:url', url);
    this._setMeta('property', 'twitter:url', url);

    ga('send', {
      hitType: 'pageview',
      page: window.location.pathname,
      location: url,
      title: title,
    });
  }

  _setMeta(attrName, attrValue, content) {
    let element = document.head
      .querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content || '');
  }

  /**
   * Fixes stuff I spit into JSON from Hugo
   * @param {String} raw Anything HTML that needs unescaping..
   * @return {String} string
   */
  _unescapeHtml(raw) {
    // TODO I switched this to the SHOP way;
    // Have used childNodes[0].nodeValue with a div
    // but need to perf check
    let process = document.createElement('textarea');
    process.innerHTML = raw;
    return process.textContent;
  }

  /**
   * Check the current state of the view so we can get rid of the skelton in
   * weird inbetween states
   * @param {Boolen} failed
   * @param {Boolean} loaded
   * @return {Boolean} state
   */
  _checkViewState(failed, loaded) {
    // In the event a network fail happens and we get not SW load,
    // hide the skeleton
    // In the event the network doesn't fail and we get a load,
    // hide the skeleton
    if (failed && !loaded || !failed && loaded) {
      return true;
    } else {
      return false;
    }
  }
};
