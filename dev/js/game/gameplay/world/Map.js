/*include:js/core/namespace.js*/
/*include:js/core/math.js*/
/*include:js/game/core/renderer.js*/
/*include:js/game/core/Sprite.js*/
/*include:js/game/gameplay/world/Wall.js*/
/*include:js/game/gameplay/world/Door.js*/

(function () {
    var math = wd.math,
        renderer = wd.renderer,
        Wall = wd.Wall,
        Door = wd.Door,
        Sprite = wd.Sprite;

    wd.Map = (function () {
        var wallImage = document.querySelector('#wall'),
            doorImage = document.querySelector('#door'),
            collisionResultCache = {},
            spritesRendered = [];

        function createBSPNode(doorGroups, jsonNode, parent) {
            var walls = jsonNode.walls, actualWalls = [], i,
                wall, newNode;

            for (i = 0; i < walls.length; i += 1) {
                if (walls[i].door) {
                    wall = new Door(walls[i]);
                    wall.setParentMap(this);

                    if (doorGroups[wall.door]) {
                        doorGroups[wall.door].entangle(wall);
                    } else {
                        doorGroups[wall.door] = wall;
                    }
                } else {
                    wall = new Wall(walls[i]);
                }

                actualWalls.push(wall);
            }

            newNode = {
                parent: parent,
                leaf: jsonNode.leaf || false,
                walls: actualWalls
            };

            newNode.left = jsonNode.left ? createBSPNode(doorGroups, jsonNode.left, newNode) : null;
            newNode.right = jsonNode.right ? createBSPNode(doorGroups, jsonNode.right, newNode) : null;
            newNode.sprites = [];

            newNode.addSprite = function (sprite) {
                this.sprites.push(sprite);
            };

            newNode.removeSprite = function (sprite) {
                var index = this.sprites.indexOf(sprite);

                if (index !== -1) {
                    this.sprites.splice(index, 1);
                }
            };

            return newNode;
        }

        function depthSpriteSorter(sprite1, sprite2) {
            var position = renderer.getFrustum().position,
                sqrDistanceA = math.sqrDistance(
                    position.x, position.y,
                    sprite1.position.x, sprite1.position.y
                ),
                sqrDistanceB = math.sqrDistance(
                    position.x, position.y,
                    sprite2.position.x, sprite2.position.y
                );

            return sqrDistanceA - sqrDistanceB;
        }

        function jsonToBSP(map, json) {
            var jsonNode = JSON.parse(json);

            return createBSPNode(map.doorGroups, jsonNode);
        }

        function addSprites(map, json) {
            var sprites = JSON.parse(json),
                newSprites = [];

            sprites.forEach(function (sprite) {
                newSprites.push(new Sprite({
                    asset: document.querySelector('#' + sprite.id),
                    position: { x: sprite.x, y: sprite.y, z: sprite.z },
                    radius: sprite.radius,
                    obstacle: sprite.obstacle,
                    parentMap: map
                }));
            });

            return newSprites;
        }

        function makeSphereCollisionCheck(config) {
            var getEntities = config.entities,
                comparator = config.comparator,
                collisionFunc;

            function checkCollisionWithEntities(entities, position, radius, callback, result) {
                var i;

                for (i = 0; i < entities.length; i += 1) {
                    if (comparator(entities[i], position, radius, result)) {
                        callback(result.x, result.y, result.normalX, result.normalY, result.length, entities[i]);
                    }
                }
            }

            collisionFunc = function (position, radius, affectRadius, callback, node) {
                var needToCheckLeft,
                    needToCheckRight,
                    divisionWall,
                    distance,
                    result = collisionResultCache,
                    entities;

                node = node || this.bsp;

                if (node.leaf) {
                    entities = getEntities(node);
                    checkCollisionWithEntities(entities, position, radius, callback, result);
                } else {
                    divisionWall = node.walls[0];
                    distance = math.directionalDistance(
                        divisionWall.bX, divisionWall.bY,
                        divisionWall.x, divisionWall.y,
                        position.x, position.y
                    );

                    needToCheckLeft = distance - affectRadius < 0;
                    needToCheckRight = distance + affectRadius >= 0;

                    if (needToCheckLeft && node.left) {
                        collisionFunc.call(this, position, radius, affectRadius, callback, node.left);
                    }

                    entities = getEntities(node);
                    checkCollisionWithEntities(entities, position, radius, callback, result);

                    if (needToCheckRight && node.right) {
                        collisionFunc.call(this, position, radius, affectRadius, callback, node.right);
                    }
                }
            };

            return collisionFunc;
        }

        function Map(config) {
            this.doorGroups = {};
            this.bsp = jsonToBSP(this, config.jsonBSP);
            this.sprites = addSprites(this, config.jsonSprites || []);
        }

        Map.prototype = {
            constructor: Map,
            getCloseLeaf: function (x, y, parentNode) {
                var distance, divisionWall, front, back, leaf;

                parentNode = parentNode || this.bsp;

                if (parentNode.leaf) {
                    return parentNode;
                } else {
                    divisionWall = parentNode.walls[0];
                    distance = math.directionalDistance(
                        divisionWall.bX, divisionWall.bY,
                        divisionWall.x, divisionWall.y,
                        x, y
                    );

                    if (distance < 0) {
                        front = parentNode.left;
                        back = parentNode.right;
                    } else {
                        back = parentNode.left;
                        front = parentNode.right;
                    }

                    if (front) {
                        leaf = this.getCloseLeaf(x, y, front);

                        if (leaf) {
                            return leaf;
                        }
                    }

                    if (back) {
                        leaf = this.getCloseLeaf(x, y, back);

                        if (leaf) {
                            return leaf;
                        }
                    }
                }

                return false;
            },
            renderFromPosition: function (x, y, parentNode) {
                var distance, divisionWall, front, back;

                parentNode = parentNode || this.bsp;

                if (parentNode.leaf) {
                    this.addSpritesToRender(parentNode.sprites);
                    spritesRendered.push();
                }

                if (renderer.is3DBufferEmpty()) {
                    return;
                }

                if (parentNode.leaf) {
                    this.renderWalls(parentNode.walls);
                } else {
                    divisionWall = parentNode.walls[0];
                    distance = math.directionalDistance(
                        divisionWall.bX, divisionWall.bY,
                        divisionWall.x, divisionWall.y,
                        x, y
                    );

                    if (distance < 0) {
                        front = parentNode.left;
                        back = parentNode.right;
                    } else {
                        back = parentNode.left;
                        front = parentNode.right;
                    }

                    if (front) {
                        this.renderFromPosition(x, y, front);
                    }

                    this.renderWalls(parentNode.walls);

                    if (back) {
                        this.renderFromPosition(x, y, back);
                    }
                }
            },
            collideWithLevel: makeSphereCollisionCheck({
                entities: function (node) {
                    return node.walls;
                },
                comparator: function (wall, position, radius, result) {
                    if (wall instanceof Door && wall.isTransparent()) {
                        return false;
                    }

                    return math.isNearSection(wall, position.x, position.y, radius, result);
                }
            }),
            collideWithSprites: makeSphereCollisionCheck({
                entities: function (node) {
                    return node.sprites;
                },
                comparator: function (sprite, position, radius, result) {
                    if (!sprite.obstacle) {
                        return false;
                    }

                    return math.circlesIntersection(position.x, position.y, radius,
                            sprite.position.x, sprite.position.y, sprite.radius,
                            result);
                }
            }),
            openDoor: function (doorId) {
                var door = this.doorGroups[doorId];

                if (door instanceof Wall && !(door.isOpening()) && !(door.isOpen())) {
                    door.startOpening();
                }
            },
            renderWalls: function (walls) {
                var i;

                for (i = 0; i < walls.length; i += 1) {
                    renderer.renderWall(walls[i].door ? doorImage : wallImage, walls[i], walls[i] instanceof Door);
                }
            },
            addSpritesToRender: function (sprites) {
                var i;

                sprites.sort(depthSpriteSorter);

                for (i = 0; i < sprites.length; i += 1) {
                    spritesRendered.push(sprites[i]);
                }
            },
            renderSprites: function () {
                var i;

                for (i = spritesRendered.length - 1; i >= 0 ; i -= 1) {
                    spritesRendered[i].render();
                }

                spritesRendered.length = 0;
            }
        };

        return Map;
    }());
}());