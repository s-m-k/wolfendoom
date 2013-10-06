/*include:js/core/namespace.js*/

(function (global) {
    'use strict';
    wd.assets = (function () {

        function image(id) {
            return document.getElementById(id);
        }

        return {
            image: image
        };
    }());
}(this));