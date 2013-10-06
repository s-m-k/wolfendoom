(function () {
    var math = wd.math;

    wd.Wall = (function () {
        function Wall(config) {
            var normX, normY, length,
                height = 160;

            this.aX = config.aX;
            this.aY = config.aY;
            this.bX = config.bX;
            this.bY = config.bY;

            normX = config.bX - config.aX;
            normY = config.bY - config.aY;
            length = math.length(normX, normY);

            this.x = -normY / length;
            this.y = normX / length;

            this.bounds = {
                minX: Math.min(this.aX, this.bX),
                minY: Math.min(this.aY, this.bY),
                maxX: Math.max(this.aX, this.bX),
                maxY: Math.max(this.aY, this.bY)
            };

            this.height = height;
            this.texCoord = math.distance(
                this.aX, this.aY,
                this.bX, this.bY
            ) / height;
        }

        Wall.prototype = {
            constructor: Wall
        };

        return Wall;
    }());
}());