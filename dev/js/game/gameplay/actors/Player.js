/*include:js/core/namespace.js*/
/*include:js/core/math.js*/
/*include:js/game/core/input.js*/
/*include:js/game/core/renderer.js*/
/*include:js/game/core/timer.js*/
/*include:js/game/gameplay/weapons/weapons.js*/
/*include:js/game/gameplay/common/collisionDetection.js*/
/*include:js/game/gameplay/actors/Actor.js*/
/*include:js/game/settings.js*/

(function () {
    'use strict';

    var input = wd.input,
        weapons = wd.weapons,
        math = wd.math,
        renderer = wd.renderer,
        timer = wd.timer,
        common = wd.common,
        controls = wd.settings.controls,
        Actor = wd.actors.Actor;

    wd.actors.Player = (function () {
        function Player(config) {
            Actor.call(this, config);
        }

        Player.prototype = Object.create(Actor.prototype);
        Player.prototype.constructor = Player;
        Player.prototype.navigate = function () {
            if (input.key(controls.forward)) {
                this.accelerate(0.2);
            }

            if (input.key(controls.backward)) {
                this.accelerate(-0.2);
            }


            if (input.key(controls.strafe)) {
                if (input.key(controls.left)) {
                    this.strafe(0.2);
                }

                if (input.key(controls.right)) {
                    this.strafe(-0.2);
                }
            } else {
                if (input.key(controls.left)) {
                    this.rotate(0.04);
                }

                if (input.key(controls.right)) {
                    this.rotate(-0.04);
                }
            }

            if (input.key(controls.fire)) {
                this.weapon.pullTrigger();
            } else {
                this.weapon.releaseTrigger();
            }

            if (input.key(controls.open)) {
                this.openDoor();
            }
        };
        Player.prototype.render = function () {
            renderer.getFrustum()
                .setAngle(this.angle)
                .setPosition(
                    this.position.x,
                    this.position.y,
                    Math.sin(timer.getTicks() / 6) * this.swing
                );
        };
        Player.prototype.renderHUD = function () {
            this.weapon.render(this.swing);
        };

        return Player;
    }());
}());