/*include:js/core/namespace.js*/
/*include:js/core/math.js*/

(function () {
    'use strict';

    var math = wd.math;

    var Frustum = (function () {
        function Frustum(config) {
            this.direction = { x: 0, y: 0};
            this.directionLeft = { x: 0, y: 0};
            this.directionRight = { x: 0, y: 0};
            this.position = { x: 0, y: 0, z: 0 };
            this.screen = { aX: 0, aY: 0, bX: 0, bY: 0 };
            this.absoluteScreen = { aX: 0, aY: 0, bX: 0, bY: 0 };
            this.absoluteScreenMiddle = { x: 0, y: 0};
            this.screenWidth = 0;
            this.fov = config.fov;
            this.near = config.near || 32;
            this.tanHalfFov = Math.tan(config.fov / 2);
        };

        Frustum.prototype = {
            updateAbsoluteScreen: function () {
                this.absoluteScreen.aX = this.screen.aX + this.position.x;
                this.absoluteScreen.aY = this.screen.aY + this.position.y;
                this.absoluteScreen.bX = this.screen.bX + this.position.x;
                this.absoluteScreen.bY = this.screen.bY + this.position.y;

                this.absoluteScreenMiddle.x = (this.absoluteScreen.aX + this.absoluteScreen.bX) * 0.5;
                this.absoluteScreenMiddle.y = (this.absoluteScreen.aY + this.absoluteScreen.bY) * 0.5;
            },
            setAngle: function (angle) {
                this.direction.x = Math.cos(angle);
                this.direction.y = Math.sin(angle);
                this.directionLeft.x = Math.cos(angle - this.fov / 2);
                this.directionLeft.y = Math.sin(angle - this.fov / 2);
                this.directionRight.x = Math.cos(angle + this.fov / 2);
                this.directionRight.y = Math.sin(angle + this.fov / 2);

                this.screen.aX = this.direction.x * this.near - this.direction.y * this.near * this.tanHalfFov;
                this.screen.aY = this.direction.y * this.near + this.direction.x * this.near * this.tanHalfFov;
                this.screen.bX = this.direction.x * this.near + this.direction.y * this.near * this.tanHalfFov;
                this.screen.bY = this.direction.y * this.near - this.direction.x * this.near * this.tanHalfFov;

                this.screenWidth = this.near * this.tanHalfFov * 2;

                this.updateAbsoluteScreen();

                return this;
            },
            setPosition: function (x, y, z) {
                this.position.x = ((x * 20) | 0) / 20;
                this.position.y = ((y * 20) | 0) / 20;
                this.position.z = z;

                this.updateAbsoluteScreen();

                return this;
            },
            isWallVisible: function (wall, pointLeft, pointRight) {
                var factorLeft = math.sectionRayCast(wall, this.position, this.directionLeft, pointLeft).factor,
                    factorRight = math.sectionRayCast(wall, this.position, this.directionRight, pointRight).factor,
                    totallyVisible = (factorRight >= 1 && factorLeft === undefined) || (factorLeft <= 1 && factorRight === undefined) || (factorLeft <= 0 && factorRight >= 0),
                    partiallyVisible = (factorLeft >= 0 && factorLeft <= 1) || (factorRight >= 0 && factorRight <= 1);

                if (partiallyVisible || totallyVisible) {
                    return true;
                } else {
                    return false;
                }
            },
            projectPoint: function (pointX, pointY, result) {
                var screenNormalX = (this.absoluteScreen.bX - this.absoluteScreen.aX) / this.screenWidth,
                    screenNormalY = (this.absoluteScreen.bY - this.absoluteScreen.aY) / this.screenWidth,
                    distanceFromScreen,
                    distanceFromCast,
                    projectedScreenWidth,
                    scale;

                distanceFromScreen = math.directionalDistance(
                    this.absoluteScreen.aX, this.absoluteScreen.aY,
                    -screenNormalY, screenNormalX,
                    pointX, pointY
                );

                distanceFromCast = math.directionalDistance(
                    this.absoluteScreen.aX, this.absoluteScreen.aY,
                    screenNormalX, screenNormalY,
                    pointX, pointY
                );

                projectedScreenWidth = this.tanHalfFov * (this.near + distanceFromScreen) * 2;

                result = result || {};

                scale = this.screenWidth / projectedScreenWidth;
                result.x = (distanceFromCast - this.screenWidth * 0.5) / Math.abs(projectedScreenWidth);
                result.scale = scale;

                return result;
            }
        };

        return Frustum;
    }());

    var Fog = (function () {
        function Fog() {
            this.start = 0.75;
            this.rest = 1 - this.start;
            this.invRest = 1 / this.rest;
        }

        return Fog;
    }());

    wd.renderer = (function () {
        var canvas = document.querySelector('#display'),
            context = canvas.getContext('2d'),
            brightnessLevels = 8,
            halfWidth = canvas.width / 2,
            halfHeight = canvas.height / 2,
            projectCache = { x: 0, scale: 0 },
            rayCastCacheLeft = { x: 0, y: 0, factor: 0 },
            rayCastCacheRight = { x: 0, y: 0, factor: 0 },
            buffer3D = new Uint8Array(canvas.width),
            zBuffer = new Float32Array(canvas.width),
            iteration3D = 1,
            buffer3DFreeSpace = 0,
            fog = new Fog({
                start: 0.6
            }),
            frustum = new Frustum({
                fov: Math.PI / 3
            });

        context.translate(halfWidth, halfHeight);
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;

        function clear() {
            context.clearRect(-halfWidth, -halfHeight, canvas.width, canvas.height);
        }

        function depthToDepthLevel(depth) {
            var invDepth = 1 - depth;
            return invDepth > fog.start ? ((invDepth - fog.start) * fog.invRest * brightnessLevels) | 0 : 0;
        }

        function perspectiveCorrectMapping(textureLeft, textureRight, invDepthLeft, invDepthRight, texCoord, progress) {
            return ((textureLeft * invDepthLeft) * (1 - progress) + (textureRight * invDepthRight) * progress) /
                ((invDepthLeft * (1 - progress) + invDepthRight * progress)) * texCoord;
        }

        function isWallWronglyRendered(leftRightDistance) {
            return leftRightDistance < 0 || leftRightDistance > 512;
        }

        function render3DStrip(asset, partAssetHeight, x, wallHeight, currentTexture, currentDepth) {
            context.drawImage(
                asset,
                ((asset.width * currentTexture) | 0) % asset.width,
                partAssetHeight * depthToDepthLevel(currentDepth),
                1, partAssetHeight,
                x | 0, (currentDepth * (frustum.position.z - wallHeight)),
                1, currentDepth * wallHeight * 2);
        }

        function render3DDoorStrips(asset, texCoord, wallHeight, left, right, depthFrom, depthTo,
                                    invDepthLeft, invDepthRight, leftRightDistance, textureLeft,
                                    textureRight, doorOpenState) {
            var x, progress, currentDepth,
                currentTexture, bufferIndex,
                partAssetHeight = asset.height / brightnessLevels,
                halfDoorOpenState = doorOpenState * 0.5;

            if (isWallWronglyRendered(leftRightDistance)) {
                return;
            }

            for (x = left; x < right; x += 1) {
                bufferIndex = x + halfWidth;

                if (buffer3D[bufferIndex] !== iteration3D) {
                    progress = (x - left) / leftRightDistance;

                    currentTexture = perspectiveCorrectMapping(
                            textureLeft, textureRight,
                            invDepthLeft, invDepthRight,
                            texCoord, progress);

                    if (Math.abs(currentTexture - 0.5) >= halfDoorOpenState) {
                        currentTexture += currentTexture < 0.5 ? halfDoorOpenState : -halfDoorOpenState;
                        buffer3D[bufferIndex] = iteration3D;
                        buffer3DFreeSpace -= 1;

                        currentDepth = depthFrom * (1 - progress) + depthTo * progress;
                        zBuffer[bufferIndex] = currentDepth;
                        render3DStrip(asset, partAssetHeight, x, wallHeight, currentTexture, currentDepth);
                    }
                }
            }
        }

        function render3DWallStrips(asset, texCoord, wallHeight, left, right, depthFrom, depthTo,
                                    invDepthLeft, invDepthRight, leftRightDistance, textureLeft,
                                    textureRight) {
            var x, progress, currentDepth,
                currentTexture, bufferIndex,
                partAssetHeight = asset.height / brightnessLevels;

            if (isWallWronglyRendered(leftRightDistance)) {
                return;
            }

            for (x = left; x < right; x += 1) {
                bufferIndex = x + halfWidth;

                if (buffer3D[bufferIndex] !== iteration3D) {
                    buffer3D[bufferIndex] = iteration3D;
                    buffer3DFreeSpace -= 1;

                    progress = (x - left) / leftRightDistance;
                    currentDepth = depthFrom * (1 - progress) + depthTo * progress;

                    zBuffer[bufferIndex] = currentDepth;

                    currentTexture = perspectiveCorrectMapping(
                            textureLeft, textureRight,
                            invDepthLeft, invDepthRight,
                            texCoord, progress);

                    render3DStrip(asset, partAssetHeight, x, wallHeight, currentTexture, currentDepth);
                }
            }
        }

        function render3DWall(asset, wall, castA, castB, doorType) {
            var from, to,
                positionLeft, positionRight,
                depthFrom, depthTo,
                leftRightDistance,
                invDepthLeft, invDepthRight,
                textureLeft, textureRight;

            if (buffer3DFreeSpace <= 0) {
                return;
            }

            if (!castA.computed || castA.factor < 0 || castA.factor > 1) {
                frustum.projectPoint(wall.aX, wall.aY, projectCache);
                textureLeft = 0;
            } else {
                frustum.projectPoint(castA.x, castA.y, projectCache);
                textureLeft = castA.factor;
            }

            from = projectCache.x;
            depthFrom = projectCache.scale;

            if (!castB.computed || castB.factor < 0 || castB.factor > 1) {
                frustum.projectPoint(wall.bX, wall.bY, projectCache);
                textureRight = 1;
            } else {
                frustum.projectPoint(castB.x, castB.y, projectCache);
                textureRight = castB.factor;
            }

            to = projectCache.x;
            depthTo = projectCache.scale;

            positionLeft = Math.max(-halfWidth, (-from * canvas.width - 0.5) | 0);
            positionRight = Math.min(halfWidth, (-to * canvas.width + 0.5) | 0);

            leftRightDistance = positionRight - positionLeft;
            invDepthLeft = 1 / depthTo;
            invDepthRight = 1 / depthFrom;

            if (doorType) {
                render3DDoorStrips(asset, wall.texCoord, wall.height,
                    positionLeft, positionRight, depthFrom, depthTo,
                    invDepthLeft, invDepthRight, leftRightDistance,
                    textureLeft, textureRight, wall.doorOpenState);
            } else {
                render3DWallStrips(asset, wall.texCoord, wall.height,
                    positionLeft, positionRight, depthFrom, depthTo,
                    invDepthLeft, invDepthRight, leftRightDistance,
                    textureLeft, textureRight);
            }
        }

        function renderWall(asset, wall, doorType) {
            rayCastCacheLeft.computed = false;
            rayCastCacheRight.computed = false;
            if (frustum.isWallVisible(wall, rayCastCacheLeft, rayCastCacheRight)) {
                render3DWall(asset, wall, rayCastCacheLeft, rayCastCacheRight, doorType);
            }
        }

        function renderSprite(asset, x, y, z) {
            var spriteWidth, xIter, startIter,
                halfWidthScaled, halfHeightScaled,
                widthScaled, heightScaled,
                scaleAmount = 10, totalScale,
                positionX, positionXRight, positionY,
                progress;

            frustum.projectPoint(x, y, projectCache);

            if (projectCache.scale > 0 && projectCache.scale < 1.5) {
                positionX = -projectCache.x * canvas.width;
                totalScale = scaleAmount * projectCache.scale;
                spriteWidth = (asset.width * totalScale) | 0;

                halfWidthScaled = ((asset.width / 2) * totalScale) | 0;
                halfHeightScaled = ((asset.height / 2) * totalScale) | 0;
                widthScaled = halfWidthScaled * 2;
                heightScaled = halfHeightScaled * 2;

                startIter = (positionX - halfWidthScaled) | 0;
                positionXRight = (positionX + halfWidthScaled) | 0;

                positionY = ((frustum.position.z + z) * projectCache.scale - halfHeightScaled) | 0;

                for (xIter = startIter; xIter < positionXRight; xIter += 1) {
                    progress = (xIter - startIter) / widthScaled;

                    if (zBuffer[xIter + halfWidth] < projectCache.scale) {
                        context.drawImage(asset,
                            (progress * asset.width) % asset.width, 0,
                            1, asset.height,
                            xIter, positionY,
                            1, heightScaled);
                    }
                }
            }
        }

        function renderHUDSprite(asset, x, y, animationFrame, scale) {
            context.drawImage(asset, asset.height * animationFrame, 0,
                asset.height, asset.height,
                x, y, asset.height * scale, asset.height * scale);
        }

        function getFrustum() {
            return frustum;
        }

        function next3DIteration() {
            buffer3DFreeSpace = canvas.width;
            iteration3D = (iteration3D + 1) & 1;
        }

        function is3DBufferEmpty() {
            return buffer3DFreeSpace <= 0;
        }

        return {
            clear: clear,
            halfWidth: halfWidth,
            halfHeight: halfHeight,
            renderWall: renderWall,
            renderSprite: renderSprite,
            renderHUDSprite: renderHUDSprite,
            getFrustum: getFrustum,
            next3DIteration: next3DIteration,
            is3DBufferEmpty: is3DBufferEmpty
        };
    }());
}());