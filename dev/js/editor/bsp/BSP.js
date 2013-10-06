/*include:js/core/namespace.js*/
/*include:js/core/math.js*/
/*include:js/editor/core/renderer.js*/
/*include:js/editor/bsp/Wall.js*/

(function () {
    var math = wd.math,
        Wall = wd.Wall,
        renderer = wd.renderer;

    wd.BSP = (function () {
        function computeQuality(left, right, intersecting) {
            return Math.abs(left - right) * document.getElementById('bsp-lefts-rights').value
                    + intersecting * document.getElementById('bsp-intersecting').value;
        }

        function cloneDoors(walls) {
            var outWalls = [];

            walls.forEach(function (wall) {
                outWalls.push(wall);
                if (wall.door) {
                    outWalls.push(new Wall({
                        aX: wall.bX,
                        aY: wall.bY,
                        bX: wall.aX,
                        bY: wall.aY,
                        door: wall.door
                    }));
                }
            });

            return outWalls;
        }

        function chooseBestPlane(walls) {
            var i, j, wall,
                newQuality = 0,
                qualityFactor = Infinity,
                selectedWall,
                intersecting, left, right;

            for (i = 0; i < walls.length; i += 1) {
                wall = walls[i];

                intersecting = 0;
                left = 0;
                right = 0;
                for (j = 0; j < walls.length; j += 1) {
                    switch (wall.getRelation(walls[j])) {
                        case Wall.INTERSECTING:
                            intersecting += 1;
                            break;
                        case Wall.LEFT:
                            left += 1;
                            break;
                        case Wall.RIGHT:
                            right += 1;
                            break;
                    }
                }

                newQuality = computeQuality(left, right, intersecting);
                if (newQuality < qualityFactor) {
                    selectedWall = i;
                    qualityFactor = newQuality;
                }
            }

            return selectedWall;
        }

        function divideMap(dividingWall, walls) {
            var i, leftPiecePos,
                left = [],
                right = [];

            function processIntersection(wall) {
                var leftPiece, rightPiece,
                    intersectionPoint = { x: 0, y: 0, factor: 0};

                if (math.sectionRayCastBothSides(
                    wall,
                    {x: dividingWall.aX, y: dividingWall.aY},
                    {x: dividingWall.y, y: -dividingWall.x},
                    intersectionPoint)) {

                    leftPiece = new Wall({
                        aX: wall.aX,
                        aY: wall.aY,
                        bX: intersectionPoint.x,
                        bY: intersectionPoint.y
                    });

                    rightPiece = new Wall({
                        aX: intersectionPoint.x,
                        aY: intersectionPoint.y,
                        bX: wall.bX,
                        bY: wall.bY
                    });

                    leftPiecePos = math.directionalDistance(
                        dividingWall.aX,
                        dividingWall.aY,
                        dividingWall.x,
                        dividingWall.y,
                        leftPiece.aX,
                        leftPiece.aY
                    );

                    if (leftPiecePos < 0) {
                        left.push(leftPiece);
                        right.push(rightPiece);
                    } else {
                        right.push(leftPiece);
                        left.push(rightPiece);
                    }
                }
            }

            for (i = 0; i < walls.length; i += 1) {
                if (dividingWall !== walls[i]) {
                    switch (dividingWall.getRelation(walls[i])) {
                        case Wall.INTERSECTING:
                            processIntersection(walls[i]);
                            break;
                        case Wall.LEFT:
                            left.push(new Wall(walls[i]));
                            break;
                        case Wall.RIGHT:
                            right.push(new Wall(walls[i]));
                            break;
                    }
                }
            }

            return {
                left: left,
                right: right
            };
        }

        function isConvex(walls) {
            var i, j, wallA, wallB;

            for (i = 0; i < walls.length; i += 1) {
                wallA = walls[i];
                for (j = 0; j < walls.length; j += 1) {
                    if (i !== j) {
                        wallB = walls[j];
                        if (!wallA.inFrontOf(wallB)) {
                            return false;
                        }
                    }
                }
            }

            return true;
        }

        function makeNode(walls) {
            var index, wall, division, left, right;

            if (walls.length === 0) {
                return null;
            }

            if (isConvex(walls)) {
                return {
                    leaf: true,
                    color: 'rgb('
                        + ((220 * Math.random()) | 0) + ','
                        + ((220 * Math.random()) | 0) + ','
                        + ((220 * Math.random()) | 0) + ')',
                    walls: walls
                };
            } else {
                index = chooseBestPlane(walls);

                if (index >= 0) {
                    division = divideMap(walls[index], walls);
                    left = division.left;
                    right = division.right;

                    return {
                        color: 'rgb('
                            + ((220 * Math.random()) | 0) + ','
                            + ((220 * Math.random()) | 0) + ','
                            + ((220 * Math.random()) | 0) + ')',
                        walls: [ walls[index] ],
                        left: makeNode(left),
                        right: makeNode(right)
                    };
                }
            }
        }

        function renderNode(node, number) {
            var i, walls = node.walls, wall;

            for (i = 0; i < walls.length; i += 1) {
                wall = walls[i];
                renderer.drawSection(wall.aX, wall.aY, wall.bX, wall.bY, {
                    color: node.color,
                    fat: !node.leaf,
                    bothSides: wall.door
                });

                if (!node.leaf && number >= 0) {
                    renderer.drawText((wall.aX + wall.bX) / 2 + 2.5, (wall.aY + wall.bY) / 2, number);
                }
            }
        }

        function generateSimpleWall(wall) {
            var simpleWall = {
                aX: wall.aX, aY: wall.aY,
                bX: wall.bX, bY: wall.bY
            };

            if (wall.door) {
                simpleWall.door = wall.door;
            }

            return simpleWall;
        }

        function BSP(walls) {
            var bspWalls = cloneDoors(walls);
            this.node = makeNode(bspWalls);
        }

        BSP.prototype = {
            render: function (node, number) {
                node = node || this.node;
                number = number || 0;

                if (node.leaf) {
                    renderNode(node, number);
                } else {
                    if (node.left) {
                        this.render(node.left, number + 1);
                    }

                    renderNode(node, number);

                    if (node.right) {
                        this.render(node.right, number + 1);
                    }
                }
            },
            renderTree: function (node, number) {
                var scale, space = 50;

                node = node || this.node;
                number = number || 0;

                if (node.leaf) {
                    renderer.drawPoint(0, 0, node.color);
                } else {
                    scale = 1 / (1 + number * number);

                    renderer.drawPoint(0, 0, node.color);
                    renderer.drawText(-2.5, -5, number);
                    renderer.drawLine(0, 0, -space * scale * 2, space);
                    renderer.drawLine(0, 0, space * scale * 2, space);

                    if (node.left) {
                        renderer.pushState();
                        renderer.translate(-space * scale * 2, space);
                        this.renderTree(node.left, number + 1);
                        renderer.popState();
                    }

                    if (node.right) {
                        renderer.pushState();
                        renderer.translate(space * scale * 2, space);
                        this.renderTree(node.right, number + 1);
                        renderer.popState();
                    }
                }
            },
            generateSimpleStructure: function (node) {
                var i, outputNode, wall;

                node = node || this.node;

                outputNode = {
                    walls: []
                };

                if (node.leaf) {
                    outputNode.leaf = true;

                    for (i = 0; i < node.walls.length; i += 1) {
                        wall = node.walls[i];
                        outputNode.walls.push(generateSimpleWall(wall));
                    }
                } else {
                    wall = node.walls[0];
                    outputNode.walls.push(generateSimpleWall(wall));

                    if (node.left) {
                        outputNode.left = this.generateSimpleStructure(node.left);
                    }

                    if (node.right) {
                        outputNode.right = this.generateSimpleStructure(node.right);
                    }
                }

                return outputNode;
            },
            saveJSON: function () {
                return JSON.stringify(this.generateSimpleStructure());
            }
        };

        return BSP;
    }());
}());