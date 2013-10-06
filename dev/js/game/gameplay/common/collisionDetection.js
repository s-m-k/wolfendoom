/*include:js/core/namespace.js*/
/*include:js/core/math.js*/

(function () {
    'use strict';

    var math = wd.math;

    wd('common').collisionDetection = {
        collisionPhysics: function (x, y, normalX, normalY, length, object) {
            var correction;

            if (object === this.ownSprite) {
                return;
            }

            correction = Math.max(1, 4 * (1 - length / this.actorSize));

            this.velocityCompensation = math.dot(normalX, normalY, this.velocity.x, this.velocity.y);

            if (this.velocityCompensation < 0) {
                this.position.x += (x + normalX * this.actorSize - this.position.x) * 0.25;
                this.position.y += (y + normalY * this.actorSize - this.position.y) * 0.25;

                this.velocity.x -= normalX * this.velocityCompensation * correction;
                this.velocity.y -= normalY * this.velocityCompensation * correction;
            }
        },
        processCollision: function () {
            if (this.parentMap) {
                this.parentMap.collideWithLevel(this.position, this.actorSize, this.actorSize, this.collisionPhysics);
                this.parentMap.collideWithSprites(this.position, this.actorSize, this.actorSize + 16, this.collisionPhysics);
            }
        }
    };
}());