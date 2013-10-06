/*include:js/core/namespace.js*/

(function () {
    'use strict';

    wd.events = (function () {
        var trigger, on, off;

        trigger = function (name) {
            var i, listeners = this.eventListeners[name];

            if (!listeners || listeners.length === 0) {
                return;
            }

            for (i = 0; i < listeners.length; i += 1) {
                listeners[i].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        };

        on = function (name, callback) {
            this.eventListeners[name] = this.eventListeners[name] || [];
            this.eventListeners[name].push(callback);
        };

        off = function (name, callback) {
            var listeners = this.eventListeners[name],
                index;

            if (!listeners || listeners.length === 0) {
                return;
            }

            if (callback === undefined) {
                listeners.length = 0;
            } else {
                index = listeners.indesOf(callback);

                if (index !== -1) {
                    listeners.splice(index, 1);
                }
            }
        };

        function attachEventEmitter(object) {
            if (typeof(object.eventListeners) !== 'object') {
                object.eventListeners = {};
                object.trigger = trigger;
                object.on = on;
                object.off = off;
            }

            return object;
        }

        return {
            attachEventEmitter: attachEventEmitter
        };
    }());
}());