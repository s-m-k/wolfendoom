/*include:js/core/namespace.js*/
/*include:js/core/Pool.js*/
(function () {
    'use strict';
    var Pool = wd.Pool;

    wd.intervals = (function () {
        function Interval() {
            this.reset();
        }

        Interval.prototype = {
            constructor: Interval,
            reset: function () {
                this.delay = 0;
                this.duration = 0;
                this.start = undefined;
                this.step = undefined;
                this.finish = undefined;
                this.progress = 0;
                this.dead = true;
                this.context = this;
            },
            begin: function () {
                this.dead = false;
                return this;
            },
            end: function () {
                this.dead = true;
                return this;
            },
            setContext: function (context) {
                this.context = context;
                return this;
            },
            setDelay: function (delay) {
                this.delay = delay;
                return this;
            },
            setDuration: function (duration) {
                this.duration = duration;
                return this;
            },
            onStart: function (start) {
                this.start = start;
                return this;
            },
            onStep: function (step) {
                this.step = step;
                return this;
            },
            onFinish: function (finish) {
                this.finish = finish;
                return this;
            },
            process: function () {
                if (this.delay > 0) {
                    this.delay -= 1;
                    if (this.start && this.delay === 0) {
                        this.start.call(this.context, 0, 0);
                    }
                } else {
                    this.progress += 1;

                    if (this.step) {
                        this.step.call(this.context, this.progress, this.progress / this.duration);
                    }

                    if (this.progress >= this.duration) {
                        if (this.finish) {
                            this.finish.call(this.context, this.duration, 1);
                        }

                        this.dead = true;
                    }
                }
            }
        };

        return new Pool(Interval);
    }());
}());