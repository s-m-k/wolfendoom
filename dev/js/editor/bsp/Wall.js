/*include:js/core/namespace.js*/
/*include:js/core/math.js*/
/*include:js/core/events.js*/
/*include:js/editor/core/renderer.js*/

(function () {
    var math = wd.math,
        events = wd.events,
        renderer = wd.renderer;

    wd.Wall = (function () {
        function Wall(config) {
            var normX, normY, length;

            this.aX = config.aX;
            this.aY = config.aY;
            this.bX = config.bX;
            this.bY = config.bY;
            this.door = config.door;

            normX = config.bX - config.aX;
            normY = config.bY - config.aY;
            length = math.length(normX, normY);

            this.x = -normY / length;
            this.y = normX / length;
        }

        Wall.INTERSECTING = 0;
        Wall.RIGHT = 1;
        Wall.LEFT = 2;

        Wall.prototype = {
            constructor: Wall,
            inFrontOf: function (otherWall) {
                var position, distanceA, distanceB;

                distanceA = math.directionalDistance(this.aX, this.aY, this.x, this.y, otherWall.aX, otherWall.aY);
                distanceB = math.directionalDistance(this.aX, this.aY, this.x, this.y, otherWall.bX, otherWall.bY);
                position = (distanceA + distanceB) * 0.5;

                return position >= 0;
            },
            getRelation: function (otherWall) {
                var distanceA, distanceB;

                if (this !== otherWall) {
                    distanceA = math.directionalDistance(this.aX, this.aY, this.x, this.y, otherWall.aX, otherWall.aY);
                    distanceB = math.directionalDistance(this.aX, this.aY, this.x, this.y, otherWall.bX, otherWall.bY);

                    if (distanceA * distanceB < -0.001) {
                        return Wall.INTERSECTING;
                    } else if ((distanceA + distanceB) * 0.5 < -0.001) {
                        return Wall.LEFT;
                    } else {
                        return Wall.RIGHT;
                    }
                } else {
                    return Wall.RIGHT;
                }
            }
        };

        return Wall;
    }());
}());