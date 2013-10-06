/*include:js/core/namespace.js*/
/*include:js/game/core/intervals.js*/
/*include:js/game/gameplay/world/Wall.js*/

(function () {
    var Wall = wd.Wall,
        intervals = wd.intervals;

    wd.Door = (function () {
        function Door(config) {
            Wall.call(this, config);

            this.door = config.door;
            this.doorOpenState = 0;
            this.opening = false;
            this.entangled = [];
            this.closeInterval = null;
            this.parentDoor = null;
            this.parentMap = null;

            this.position = {
                x: (this.aX + this.bX) / 2,
                y: (this.aY + this.bY) / 2
            };

            this.texCoord = 1;
        }

        Door.prototype = Object.create(Wall.prototype);
        Door.prototype.constructor = Door;
        Door.prototype.setParentMap = function (map) {
            this.parentMap = map;
        };
        Door.prototype.entangle = function (door) {
            door.parentDoor = this;
            this.entangled.push(door);
        };
        Door.prototype.syncEntangled = function () {
            var i;

            for (i = 0; i < this.entangled.length; i += 1) {
                this.entangled[i].doorOpenState = this.doorOpenState;
                this.entangled[i].opening = this.opening;
            }
        };
        Door.prototype.checkObstacles = function () {
            //TODO: collision with sprites
        };
        Door.prototype.animation = function (frames, progress) {
            this.doorOpenState = this.opening ? progress : 1 - progress;
            this.syncEntangled();
        };
        Door.prototype.delayDoorClose = function () {
            this.closeInterval = intervals.pick()
                .setContext(this)
                .setDelay(120)
                .setDuration(60)
                .onStart(this.checkObstacles)
                .onStep(this.animation)
                .onFinish(this.finishAnimation)
                .begin();
        };
        Door.prototype.finishAnimation = function () {
            this.doorOpenState = this.opening ? 1 : 0;
            this.syncEntangled();

            if (this.opening) {
                this.opening = false;
                this.delayDoorClose();
            }
        };
        Door.prototype.startOpening = function () {
            if (this.parentDoor === null) {
                this.opening = true;
                this.syncEntangled();

                intervals.pick()
                    .setContext(this)
                    .setDuration(60)
                    .onStep(this.animation)
                    .onFinish(this.finishAnimation)
                    .begin();
            } else {
                this.parentDoor.startOpening();
            }
        };
        Door.prototype.isTransparent = function () {
            return this.doorOpenState > 0.5;
        };
        Door.prototype.isOpening = function () {
            return this.opening || this.doorOpenState > 0 && this.doorOpenState < 1;
        };
        Door.prototype.isOpen = function () {
            return this.doorOpenState === 1;
        };

        return Door;
    }());
}());