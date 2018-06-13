/**
 * BlogUtilsBehavior - Description for mixin
 * @polymerMixin
 * @mixinFunction
 */
export const BlogUtilsBehavior = (superClass) => class extends superClass {
  /**
   * Get a resource with XHR and account for flaky internet connections. This
   * is one for one from the Polymer Shop demo.
   * @param  {Object} request  XHR request object.
   * @param  {Number} attempts Number of XHR rquests to run for flaky connects.
   * @return {Void}
   */
  _getResource(request, attempts) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', request.onLoad.bind(this));
    xhr.addEventListener('error', function(e) {
      // Flaky connections might fail fetching resources
      if (attempts > 1) {
        this.debounce('_getResource', this._getResource.bind(this, request, attempts - 1), 200);
      } else {
        request.onError.call(this, e);
      }
    }.bind(this));
    xhr.open('GET', request.url);
    xhr.send();
  }

  /**
   * Set HTML document title and meta description for search engines.
   * @param {Object} page Page metadata to set.
   */
  _setPageMetaData(page) {
    // Flip the metadata on load
    // Note, Google Search will index this
    document.title = page.title + ' - Justin Ribeiro';
    document.querySelector('meta[name=\'description\']')
      .setAttribute('content', page.description);

    // this.fire('announce', page.title);
    // this.fire('analytics', {
    //   hitType: 'pageview',
    //   page: window.location.pathname,
    //   location: window.location.href,
    //   title: page.title
    // });
  }

  /**
   * Fixes stuff I spit into JSON from Hugo
   * @param {String} raw Anything HTML that needs unescaping..
   */
  _unescapeHtml(raw) {
    // TODO I switched this to the SHOP way;
    // Have used childNodes[0].nodeValue with a div
    // but need to perf check
    var process = document.createElement('textarea');
    process.innerHTML = raw;
    return process.textContent;
  }

  // Because sometimes you want a skeleton and that doesn't play nice with
  // offline flicker
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

  _arrayToTags(arr) {
    console.log(arr);
    if (arr){
      var test = arr.map(function(item){
        return '#' + item;
      });
      console.log(test, test.toString());
    }
  }

};
