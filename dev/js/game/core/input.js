/*include:js/core/namespace.js*/

(function (global) {
    'use strict';
    wd.input = (function () {
        var keys = {};

        global.addEventListener('keydown', function (event) {
            keys[event.keyCode] = true;
        }, false);

        global.addEventListener('keyup', function (event) {
            keys[event.keyCode] = false;
        }, false);

        function key(number) {
            return keys[number];
        }

        return {
            key: key
        };
    }());
}(this));