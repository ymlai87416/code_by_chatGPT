// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://localhost:8000/test.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_log
// ==/UserScript==

(function() {
  'use strict';

  // Override the native XHR object
  var _XMLHttpRequest = unsafeWindow.XMLHttpRequest;


  unsafeWindow.XMLHttpRequest = function() {
    var xhr = new _XMLHttpRequest();

    var open = xhr.open;
    xhr.open = function(method, url) {
        GM_log("open")
      xhr._method = method;
      xhr._url = url;

      return open.apply(xhr, arguments);
    };

    var send = xhr.send;
    xhr.send = function() {
      var data = arguments[0];

      // Check if this is a GET request and if we have a cached response
      if (xhr._method === 'GET' && GM_getValue(xhr._url)) {
        // Get the cached response and set it as the response text
          GM_log("I am here")
        xhr.responseText = GM_getValue(xhr._url);

        // Set the ready state to 4 (done) and execute the onreadystatechange callback
        xhr.readyState = 4;
        if (typeof xhr.onreadystatechange === 'function') {
          xhr.onreadystatechange();
        }
      } else {
          GM_log("I am here 2")
        // If this is not a GET request or we don't have a cached response, send the request normally
        return send.apply(xhr, arguments);
      }
    };

    // Override the native onreadystatechange callback
    var onreadystatechange = xhr.onreadystatechange;
    xhr.onreadystatechange = function() {
      // If the request is done (readyState is 4) and it is a GET request
      if (xhr.readyState === 4 && xhr._method === 'GET') {
        // Cache the response
          GM_log("I am here 3")
        GM_setValue(xhr._url, xhr.responseText);
      }

      // Execute the original onreadystatechange callback
      if (typeof onreadystatechange === 'function') {
        onreadystatechange.apply(xhr, arguments);
      }
    };

    return xhr;
  };
})();