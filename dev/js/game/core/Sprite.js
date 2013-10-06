/*include:js/core/namespace.js*/
/*include:js/game/core/renderer.js*/
(function () {
    'use strict';

    var renderer = wd.renderer;
    
    wd.Sprite = (function () {
        function Sprite(config) {
            this.position = config.position || { x: 0, y: 0, z: 0 };
            this.radius = config.radius || 16;
            this.obstacle = config.obstacle === undefined ? true : config.obstacle;
            this.parentMap = config.parentMap || null;
            this.bspLeaf = null;
            this.asset = config.asset || null;

            this.updateBSPLeaf();
        }

        Sprite.prototype = {
            constructor: Sprite,
            updateBSPLeaf: function () {
                var newBSPLeaf;

                if (this.parentMap) {
                    newBSPLeaf = this.parentMap.getCloseLeaf(this.position.x, this.position.y);

                    if (newBSPLeaf !== this.bspLeaf) {
                        if (this.bspLeaf !== null) {
                            this.bspLeaf.removeSprite(this);
                        }

                        newBSPLeaf.addSprite(this);
                        this.bspLeaf = newBSPLeaf;
                    }
                }
            },
            updatePosition: function (x, y, z) {
                this.position.x = x;
                this.position.y = y;
                this.position.z = z;

                this.updateBSPLeaf();
            },
            removeFromBSP: function () {
                if (this.parentMap && this.bspLeaf) {
                    this.bspLeaf.removeSprite(this);
                }
            },
            render: function () {
                renderer.renderSprite(this.asset, this.position.x, this.position.y, this.position.z);
            }
        };

        return Sprite;
    }());
}());