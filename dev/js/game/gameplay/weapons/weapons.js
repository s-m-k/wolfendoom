/*include:js/core/namespace.js*/
/*include:js/game/core/renderer.js*/
/*include:js/game/core/timer.js*/
/*include:js/game/gameplay/weapons/Weapon.js*/

(function () {
    var Weapon = wd.Weapon,
        renderer = wd.renderer,
        timer = wd.timer;

    wd.weapons = (function () {
        var weapons = {};

        weapons.Pistol = (function () {
            var assets = {
                pistol: document.querySelector('#hud-pistol')
            };

            function Pistol() {
                Weapon.call(this, {
                    shootDelay: 12,
                    shootingDuration: 10
                });
            }

            Pistol.prototype = Object.create(Weapon.prototype);
            Pistol.prototype.render = function (swing) {
                var scale = 5,
                    weaponSwing = swing * 0.5,
                    weaponSwingX = Math.sin(timer.getTicks() / 24) * weaponSwing,
                    weaponSwingY = weaponSwing - Math.abs(Math.cos(timer.getTicks() / 24) * weaponSwing);

                renderer.renderHUDSprite(assets.pistol,
                    -Math.floor(assets.pistol.height / 2) * scale - weaponSwingX,
                    assets.pistol.height * scale - weaponSwingY - 22, this.shootingDurationTime > 0 ? 1 : 0, scale);
            };

            return Pistol;
        }());

        return weapons;
    }());
}());