/*include:js/core/events.js*/
/*include:js/core/math.js*/
/*include:js/editor/bsp/Map.js*/
/*include:js/editor/bsp/Wall.js*/

window.onload = function () {
    'use strict';

    var math = wd.math,
        renderer = wd.renderer,
        Map = wd.Map,
        Wall = wd.Wall;

    var editor = (function () {
        var body = document.querySelector('#display'),
            json = document.querySelector('#json'),
            spritesJSON = document.querySelector('#sprites-json'),
            bspJSON = document.querySelector('#bsp-json'),
            bsp = document.querySelector('#bsp'),
            spritesPalette = document.querySelector('#sprites-pal'),
            selectedSprite = '',
            doorId = 1;

        function start() {
            var map = new Map(),
                newWall = null;

            function getNextDoorId() {
                return (doorId + 1) % 2000000000;
            }

            function loadMap() {
                map.loadJSON(json.value);
                map.loadSpritesJSON(spritesJSON.value);

                doorId = getNextDoorId();
                render();
            }

            function isMarker(spriteId) {
                return /^m_/.test(spriteId);
            }

            function render(bsp) {
                renderer.clear();

                if (bsp) {
                    bsp.render();

                    renderer.pushState();
                    renderer.translate(1000, 20);
                    bsp.renderTree();
                    renderer.popState();
                } else {
                    map.render();
                }

                if (newWall) {
                    renderer.drawSection(newWall.aX, newWall.aY, newWall.bX, newWall.bY, {
                        color: 'rgba(255, 0, 0, 0.5)',
                        fat: newWall.door,
                        bothSides: newWall.door
                    });
                }
            }

            function updateWallCursor(event) {
                if (newWall.swapped) {
                    newWall.aX = math.grid(event.x);
                    newWall.aY = math.grid(event.y);
                } else {
                    newWall.bX = math.grid(event.x);
                    newWall.bY = math.grid(event.y);
                }
            }

            bsp.addEventListener('click', function (event) {
                var bsp;

                event.preventDefault();

                bsp = map.generateBSP();
                bspJSON.value = bsp.saveJSON();
                render(bsp);
            });

            map.on('change', function (newJSON, newSpritesJSON) {
                json.value = newJSON;
                spritesJSON.value = newSpritesJSON;
            });

            json.addEventListener('change', function (event) {
                map.loadJSON(json.value);
                render();
            }, false);

            body.addEventListener('contextmenu', function (event) {
                event.preventDefault();
            });

            function performWallEdit(event) {
                if (event.shiftKey && event.button === 0) {
                    map.removeWallAt(event.x, event.y);
                    render();
                } else {
                    if (event.button === 0) {
                        if (newWall === null) {
                            newWall = {
                                aX: math.grid(event.x),
                                aY: math.grid(event.y),
                                swapped: false
                            };
                        } else {
                            updateWallCursor(event);
                            map.addWall(new Wall(newWall));

                            newWall = null;
                            render();
                        }
                    } else if (event.button === 2) {
                        newWall = null;
                        render();
                    }
                }
            }

            function performSpriteEdit(event) {
                if (event.shiftKey && event.button === 0) {
                    map.removeSpriteAt(event.x, event.y);
                    render();
                } else {
                    if (isMarker(selectedSprite)) {
                        map.addSprite({
                            x: event.x,
                            y: event.y,
                            id: selectedSprite,
                            marker: true
                        });
                    } else {
                        map.addSprite({
                            x: event.x,
                            y: event.y,
                            z: +(document.querySelector('#sprite-z').value),
                            radius: +(document.querySelector('#sprite-radius').value),
                            obstacle: document.querySelector('#sprite-obstacle').checked,
                            id: selectedSprite
                        });
                    }
                    render();
                }
            }

            body.addEventListener('mousedown', function (event) {
                event.preventDefault();
                if (selectedSprite === '') {
                    performWallEdit(event);
                } else {
                    performSpriteEdit(event);
                }
            }, false);

            spritesPalette.addEventListener('change', function (event) {
                selectedSprite = event.target.value;
            }, false);

            window.addEventListener('keydown', function (event) {
                if (newWall) {
                    if (event.ctrlKey) {
                        math.swapSectionPoints(newWall);
                        newWall.swapped = !newWall.swapped;
                        render();
                    }

                    if (event.altKey) {
                        if (newWall.door) {
                            delete newWall.door;
                        } else {
                            newWall.door = doorId;
                            doorId = getNextDoorId();
                        }
                        render();
                    }
                }

            }, false);

            window.addEventListener('mousemove', function (event) {
                if (newWall) {
                    updateWallCursor(event);
                    render();
                }
            });

            loadMap();
        }

        return {
            start: start
        };
    }());

    editor.start();
};