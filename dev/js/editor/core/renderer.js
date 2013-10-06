/*include:js/core/math.js*/
(function () {
    var math = wd.math;

    wd.renderer = (function () {
        var canvas = document.querySelector('#display'),
            context = canvas.getContext('2d');

        function clear() {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

        function drawSection(aX, aY, bX, bY, options) {
            var mX = (aX + bX) / 2,
                mY = (aY + bY) / 2,
                length = math.distance(aX, aY, bX, bY) / 12,
                color = options.color,
                fat = options.fat,
                bothSides = options.bothSides;

            context.fillStyle = color;
            context.strokeStyle = color;
            context.lineWidth = fat ? 2 : 1;

            context.fillRect(aX - 4, aY - 4, 8, 8);
            context.fillRect(bX - 4, bY - 4, 8, 8);

            context.beginPath();
            context.moveTo(aX - 0.5, aY - 0.5);
            context.lineTo(bX - 0.5, bY - 0.5);

            if (!bothSides) {
                context.moveTo(mX - 0.5, mY - 0.5);
                context.lineTo(mX - (bY - aY) / length - 0.5, mY + (bX - aX) / length - 0.5);
            }

            context.stroke();

            context.lineWidth = 1;
        }

        function drawText(x, y, text) {
            context.fillStyle = 'black';
            context.fillText(text, x, y);
        }

        function drawPoint(x, y, color) {
            context.fillStyle = color;
            context.fillRect(x - 4, y - 4, 8, 8);
            context.fillRect(y - 4, y - 4, 8, 8);
        }

        function drawLine(aX, aY, bX, bY) {
            context.strokeStyle = 'black';
            context.beginPath();
            context.moveTo(aX, aY);
            context.lineTo(bX, bY);
            context.stroke();
        }

        function drawSprite(asset, x, y, radius) {
            if (radius) {
                context.strokeStyle = 'rgba(255, 0, 0, 0.3)';
                context.beginPath();
                context.arc(x, y, radius, 0, Math.PI * 2, false);
                context.closePath();
                context.stroke();
            }

            context.drawImage(asset, Math.floor(x - asset.width / 2), Math.floor(y - asset.height / 2));
        }

        function pushState() {
            context.save();
        }

        function popState() {
            context.restore();
        }

        function translate(x, y) {
            context.translate(x, y);
        }

        function resizeCanvas() {
            var saved = context.getImageData(0, 0, canvas.width, canvas.height);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            context.putImageData(saved, 0, 0);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return {
            clear: clear,
            drawSection: drawSection,
            drawText: drawText,
            drawPoint: drawPoint,
            drawLine: drawLine,
            drawSprite: drawSprite,
            pushState: pushState,
            popState: popState,
            translate: translate
        };
    }());
}());