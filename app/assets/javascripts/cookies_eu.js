//= require js.cookie
'use strict';

var windowIsTurbolinked = 'Turbolinks' in window;

var cookiesEu = {
  init: function() {
    var cookiesEuOKButton = document.querySelector('.js-cookies-eu-ok');
    var cookiesEuNOKButton = document.querySelector('.js-cookies-eu-not-ok');

    if (cookiesEuOKButton) {
      this.addListener(cookiesEuOKButton, true);
      // clear turbolinks cache so cookie banner does not reappear
      windowIsTurbolinked && window.Turbolinks.clearCache();
    }

    if (cookiesEuNOKButton) {
      this.addListener(cookiesEuNOKButton, false);
      // clear turbolinks cache so cookie banner does not reappear
      windowIsTurbolinked && window.Turbolinks.clearCache();
    }
  },

  addListener: function(target, is_ok) {
    var setCookieBoundFunction = this.setCookie.bind(this, is_ok);

    // Support for IE < 9
    if (target.attachEvent) {
      target.attachEvent('onclick', setCookieBoundFunction);
    } else {
      target.addEventListener('click',setCookieBoundFunction, false);
    }
  },

  setCookie: function(is_ok) {
    var isSecure = location.protocol === 'https:';
    Cookies.set('cookie_eu_consented', is_ok, { path: '/', expires: 365, secure: isSecure });

    var container = document.querySelector('.js-cookies-eu');
    container.parentNode.removeChild(container);
  }
};

(function() {
  function eventName(fallback) {
    return windowIsTurbolinked ? 'turbolinks:load' : fallback
  }

  var isCalled = false;

  function isReady() {
    // return early when cookiesEu.init has been called AND Turbolinks is NOT included
    // when Turbolinks is included cookiesEu.init has to be called on every page load
    if (isCalled && !windowIsTurbolinked) {
      return
    }
    isCalled = true;

    cookiesEu.init();
  }

  if (document.addEventListener) {
    return document.addEventListener(eventName('DOMContentLoaded'), isReady, false);
  }

  // Old browsers IE < 9
  if (window.addEventListener) {
    window.addEventListener(eventName('load'), isReady, false);
  } else if (window.attachEvent) {
    window.attachEvent(eventName('onload'), isReady);
  }
})();
