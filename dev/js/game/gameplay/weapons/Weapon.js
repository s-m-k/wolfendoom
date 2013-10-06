/*include:js/core/namespace.js*/

(function () {
    wd.Weapon = (function () {
        function Weapon(config) {
            this.shootDelay = config.shootDelay;
            this.shootDelayTime = 0;

            this.shootingDuration = config.shootingDuration;
            this.shootingDurationTime = 0;
        }

        Weapon.prototype = {
            constructor: Weapon,
            pullTrigger: function () {
                if (!this.triggerPulled && this.shootDelayTime === 0) {
                    this.triggerPulled = true;
                    this.shootDelayTime = this.shootDelay;

                    this.shoot();
                }
            },
            releaseTrigger: function () {
                this.triggerPulled = false;
            },
            shoot: function () {
                this.shootingDurationTime = this.shootingDuration;
            },
            process: function () {
                if (this.shootDelayTime > 0) {
                    this.shootDelayTime -= 1;
                }

                if (this.shootingDurationTime > 0) {
                    this.shootingDurationTime -= 1;
                }
            },
            render: function () {

            }
        };

        return Weapon;
    }());
}());