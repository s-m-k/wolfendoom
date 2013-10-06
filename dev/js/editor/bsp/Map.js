/*include:js/core/namespace.js*/
/*include:js/core/math.js*/
/*include:js/core/events.js*/
/*include:js/editor/core/renderer.js*/
/*include:js/editor/bsp/Wall.js*/
/*include:js/editor/bsp/BSP.js*/

(function () {
    var math = wd.math,
        events = wd.events,
        renderer = wd.renderer,
        Wall = wd.Wall,
        BSP = wd.BSP;

    wd.Map = (function () {
        function genDoorColor(door) {
            return 'rgb(' + ((door * 719) % 255) + ','
                + ((door * 2311) % 255) + ','
                + ((door * 1597) % 255)
                + ')';
        }

        function Map() {
            this.walls = [];
            this.sprites = [];
            this.wallDefs = [];
            this.bsp = null;
            this.doorAmount = 0;
            events.attachEventEmitter(this);
        }

        Map.prototype = {
            constructor: Map,
            loadJSON: function (json) {
                var objects, i, maxDoor = 0;

                try {
                    objects = JSON.parse(json);
                    this.walls.length = 0;
                    this.wallDefs.length = 0;

                    for (i = 0; i < objects.length; i += 1) {
                        if (objects[i].door > maxDoor) {
                            maxDoor = objects[i].door;
                        }

                        this.addWallSilently(new Wall(objects[i]));
                    }

                    this.doorAmount = maxDoor;
                } catch (e) {
                    console.log('Wrong JSON');
                }
            },
            saveJSON: function () {
                return JSON.stringify(this.wallDefs);
            },
            loadSpritesJSON: function (json) {
                try {
                    this.sprites = JSON.parse(json);
                } catch (e) {
                    console.log('Wrong JSON');
                }
            },
            saveSpritesJSON: function () {
                return JSON.stringify(this.sprites);
            },
            saveBSP: function () {
                return JSON.stringify(this.generateBSP());
            },
            generateBSP: function () {
                this.bsp = new BSP(this.walls);
                return this.bsp;
            },
            addWallSilently: function (wall) {
                var simpleDef = { aX: wall.aX, aY: wall.aY, bX: wall.bX, bY: wall.bY };
                this.walls.push(wall);

                if (wall.door) {
                    simpleDef.door = wall.door;
                }

                this.wallDefs.push(simpleDef);
            },
            addWall: function (wall) {
                this.addWallSilently(wall);
                this.trigger('change', this.saveJSON(), this.saveSpritesJSON());
            },
            removeEntityAt: function (config) {
                var i, entity, changed = false,
                    entities = config.entities,
                    comparator = config.comparator,
                    eraser = config.eraser || function (i) { entities.splice(i, 1); };

                for (i = 0; i < entities.length;) {
                    entity = entities[i];
                    if (comparator.call(this, entity)) {
                        eraser.call(this, i);
                        changed = true;
                    } else {
                        i += 1;
                    }
                }

                if (changed) {
                    this.trigger('change', this.saveJSON(), this.saveSpritesJSON());
                }
            },
            removeWallAt: function (x, y) {
                this.removeEntityAt({
                    entities: this.walls,
                    comparator: function (wall) {
                        return math.distanceFromSection(wall, x, y).length < 16;
                    },
                    eraser: function (index) {
                        this.walls.splice(index, 1);
                        this.wallDefs.splice(index, 1);
                    }
                });
            },
            addSprite: function (sprite) {
                this.sprites.push(sprite);
                this.trigger('change', this.saveJSON(), this.saveSpritesJSON());
            },
            removeSpriteAt: function (x, y) {
                this.removeEntityAt({
                    entities: this.sprites,
                    comparator: function (sprite) {
                        return math.distance(x, y, sprite.x, sprite.y) < 16;
                    }
                });
            },
            render: function () {
                var i, walls = this.walls, wall,
                    sprites = this.sprites, sprite;

                for (i = 0; i < walls.length; i += 1) {
                    wall = walls[i];
                    renderer.drawSection(wall.aX, wall.aY, wall.bX, wall.bY, {
                        color: wall.door ? genDoorColor(wall.door) : 'black',
                        fat: wall.door,
                        bothSides: wall.door
                    });
                }

                for (i = 0; i < sprites.length; i += 1) {
                    sprite = sprites[i];
                    renderer.drawSprite(document.querySelector('#' + sprite.id),
                        sprite.x, sprite.y,
                        sprite.obstacle === undefined || sprite.obstacle ? (sprite.radius || 16) : 0);
                }
            }
        };

        return Map;
    }());
}());