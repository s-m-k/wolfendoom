/*include:js/core/namespace.js*/
/*include:js/game/core/intervals.js*/
/*include:js/game/core/Sprite.js*/
/*include:js/game/core/assets.js*/
/*include:js/game/gameplay/actors/Actor.js*/

(function () {
    'use strict';

    var Sprite = wd.Sprite,
        Actor = wd.actors.Actor,
        intervals = wd.intervals,
        assets = wd.assets;

    wd.actors.Zombie = (function () {
        function Zombie(config) {
            Actor.call(this, config);

            this.angle = Math.random() * Math.PI * 2;
            this.updateAI();
        }

        Zombie.prototype = Object.create(Actor.prototype);
        Zombie.prototype.constructor = Zombie;
        Zombie.prototype.updateAI = function () {
            this.angle = Math.random() * Math.PI * 2;

            intervals.pick()
                .setContext(this)
                .setDuration(120 + Math.floor(60 * Math.random()))
                .onFinish(this.updateAI)
                .begin();
        };
        Zombie.prototype.navigate = function () {
            this.accelerate(0.1);
        };
        Zombie.prototype.setParentMap = function () {
            Actor.prototype.setParentMap.apply(this, arguments);

            this.ownSprite = new Sprite({
                asset: assets.image('zombie'),
                radius: 14,
                parentMap: this.parentMap,
                obstacle: false
            });
        };
        Zombie.prototype.process = function () {
            Actor.prototype.process.call(this);

            if (this.ownSprite) {
                this.ownSprite.updatePosition(this.position.x, this.position.y, 0);
            }
        };

        return Zombie;
    }());
}());