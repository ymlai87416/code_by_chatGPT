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

    //uncomment to delete all the key
    let keyHeader = "tomlai:"
    let keys = GM.listValues();
    keys.then(keys => {
        for (let key of keys) {
            if(key.startsWith(keyHeader)) GM.deleteValue(key);
        }
    })
    
    var OriginalXHR = unsafeWindow.XMLHttpRequest;

    var XHRProxy = function() {
        this.xhr = new OriginalXHR();

        function delegate(prop) {
            Object.defineProperty(this, prop, {
                get: function() {
                    return this.xhr[prop];
                },
                set: function(value) {
                    this.xhr.timeout = value;
                }
            });
        }
        delegate.call(this, 'timeout');
        delegate.call(this, 'responseType');
        delegate.call(this, 'withCredentials');
        delegate.call(this, 'onerror');
        delegate.call(this, 'onabort');
        delegate.call(this, 'onloadstart');
        delegate.call(this, 'onloadend');
        delegate.call(this, 'onprogress');
    };
    XHRProxy.prototype.open = function(method, url, async, username, password) {
        var ctx = this;

        function applyInterceptors(src) {
            ctx.responseText = ctx.xhr.responseText;
            for (var i=0; i < XHRProxy.interceptors.length; i++) {
                var applied = XHRProxy.interceptors[i](method, url, ctx.responseText, ctx.xhr.status);
                if (applied !== undefined) {
                    ctx.responseText = applied;
                }
            }
        }
        function setProps() {
            ctx.readyState = ctx.xhr.readyState;
            ctx.responseText = ctx.xhr.responseText;
            ctx.responseURL = ctx.xhr.responseURL;
            ctx.responseXML = ctx.xhr.responseXML;
            ctx.status = ctx.xhr.status;
            ctx.statusText = ctx.xhr.statusText;
        }

        this.method = method;
        this.url = url;

        this.xhr.open(method, url, async, username, password);

        this.xhr.onload = function(evt) {
            if (ctx.onload) {
                setProps();

                if (ctx.xhr.readyState === 4) {
                     applyInterceptors();
                }
                return ctx.onload(evt);
            }
        };
        this.xhr.onreadystatechange = function (evt) {
            if (ctx.onreadystatechange) {
                setProps();

                if (ctx.xhr.readyState === 4) {
                     applyInterceptors();
                }
                return ctx.onreadystatechange(evt);
            }
        };
    };
    XHRProxy.prototype.addEventListener = function(event, fn) {
        return this.xhr.addEventListener(event, fn);
    };
    XHRProxy.prototype.send = function(data) {
        var ctx = this;
        // Check if this is a GET request and if we have a cached response
        let key = keyHeader + ctx.url
        if (ctx.method === 'GET' && GM_getValue(key)) {
            // Get the cached response and set it as the response text
            ctx.responseText = GM_getValue(key);
            ctx.readyState = 4;
            ctx.status = 200;
            ctx.statusText = ""
            if (typeof ctx.onload === 'function') {
                ctx.onload();
            }
        } else {
            // If this is not a GET request or we don't have a cached response, send the request normally
            return this.xhr.send(data);
        }
    };
    XHRProxy.prototype.abort = function() {
        return this.xhr.abort();
    };
    XHRProxy.prototype.getAllResponseHeaders = function() {
        return this.xhr.getAllResponseHeaders();
    };
    XHRProxy.prototype.getResponseHeader = function(header) {
        return this.xhr.getResponseHeader(header);
    };
    XHRProxy.prototype.setRequestHeader = function(header, value) {
        return this.xhr.setRequestHeader(header, value);
    };
    XHRProxy.prototype.overrideMimeType = function(mimetype) {
        return this.xhr.overrideMimeType(mimetype);
    };

    var interceptor01 = function(method, url, responseText, status){
        if(method == 'GET' && status==200)
            GM_setValue(keyHeader+url, responseText);
    }

    XHRProxy.interceptors = [interceptor01];

    unsafeWindow.XMLHttpRequest = XHRProxy;

})();