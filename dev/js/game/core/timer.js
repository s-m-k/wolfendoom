/*include:js/core/namespace.js*/
/*include:js/core/events.js*/

(function () {
    var events = wd.events;

    wd.timer = (function () {
        var targetFps = 60,
            oldFrameTime = 0,
            frameTime = 0,
            frame = 0,
            ticks = 0,
            requestAnimFrame;

        requestAnimFrame = window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.requestAnimationFrame ||
            function (frame) {
                setTimeout(frame, 1000 / 60);
            };

        function start() {
            var frameRenderTime, fps;

            oldFrameTime = frameTime;
            frameTime = window.performance.now();

            frameRenderTime = frameTime - oldFrameTime;
            fps = 1000 / frameRenderTime;
            frame += targetFps / fps;

            if (frame >= 1) {
                wd.timer.trigger('step', frameRenderTime, fps);
                frame -= Math.floor(frame);
                ticks += 1;
            }

            requestAnimFrame(start);
        }

        function getTicks() {
            return ticks;
        }

        return events.attachEventEmitter({
            start: start,
            getTicks: getTicks
        });
    }());
}());