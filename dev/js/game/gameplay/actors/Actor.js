/*include:js/core/namespace.js*/
/*include:js/core/math.js*/
/*include:js/game/gameplay/weapons/weapons.js*/
/*include:js/game/gameplay/common/collisionDetection.js*/

(function () {
    'use strict';

    var weapons = wd.weapons,
        math = wd.math,
        common = wd.common;

    wd('actors').Actor = (function () {
        function Actor(config) {
            config = config || {};
            this.position = config.position || { x: 0, y: 0 };
            this.velocity = { x: 0, y: 0 };
            this.angle = 0;
            this.swing = 0;
            this.velocityCompensation = 0;
            this.actorSize = 14;
            this.ownSprite = null;

            this.weapon = new weapons.Pistol();

            if (config.parentMap) {
                this.setParentMap(config.parentMap);
            }

            this.collisionPhysics = this.collisionPhysics.bind(this);
            this.processCollision = this.processCollision.bind(this);
            this.openSelectedDoor = this.openSelectedDoor.bind(this);
        }

        Actor.prototype = {
            constructor: Actor,
            accelerate: function (acceleration) {
                this.velocity.x += Math.cos(this.angle) * acceleration;
                this.velocity.y += Math.sin(this.angle) * acceleration;

                this.swing += 4;
            },
            strafe: function (acceleration) {
                this.velocity.x -= Math.sin(this.angle) * acceleration;
                this.velocity.y += Math.cos(this.angle) * acceleration;

                this.swing += 4;
            },
            rotate: function (omega) {
                this.angle += omega;

                if (this.angle > Math.PI * 2) {
                    this.angle -= Math.PI * 2;
                }

                if (this.angle < 0) {
                    this.angle += Math.PI * 2;
                }
            },
            openSelectedDoor: function (x, y, normalX, normalY, length, wall) {
                if (wall.door) {
                    this.parentMap.openDoor(wall.door);
                }
            },
            openDoor: function () {
                if (this.parentMap) {
                    this.parentMap.collideWithLevel(this.position, this.actorSize + 4,
                        this.actorSize + 4, this.openSelectedDoor);
                }
            },
            navigate: function () {
            },
            setParentMap: function (map) {
                this.parentMap = map;
            },
            collisionPhysics: common.collisionDetection.collisionPhysics,
            processCollision: common.collisionDetection.processCollision,
            process: function () {
                this.processCollision();
                this.navigate();

                math.addVectors2d(this.position, this.velocity);
                math.mulVec2dScalar(this.velocity, 0.94);
                this.swing *= 0.9;

                this.weapon.process();
            }
        };

        return Actor;
    }());
}());