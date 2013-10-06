/*include:js/core/namespace.js*/
(function () {
    'use strict';

    wd.math = (function () {
        var gridSize = 32;

        function addVectors2d(vec1, vec2) {
            vec1.x += vec2.x;
            vec1.y += vec2.y;

            return vec1;
        }

        function subVectors2d(vec1, vec2) {
            vec1.x -= vec2.x;
            vec1.y -= vec2.y;

            return vec1;
        }

        function mulVec2dScalar(vec1, scalar) {
            vec1.x *= scalar;
            vec1.y *= scalar;

            return vec1;
        }

        function getVec2dLength(vec) {
            return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
        }

        function dot(vec1X, vec1Y, vec2X, vec2Y) {
            return vec1X * vec2X + vec1Y * vec2Y;
        }

        function cross(vec1X, vec1Y, vec2X, vec2Y) {
            return vec1X * vec2Y - vec1Y * vec2X;
        }

        function sectionRayCastBothSides(section, start, direction, result) {
            var vertex1X = section.bX - section.aX,
                vertex1Y = section.bY - section.aY,
                parallel = cross(vertex1X, vertex1Y, direction.x, direction.y),
                factor, lineFactor;

            if (parallel === 0) {
                return false;
            }

            factor = (direction.x * (section.aY - start.y)
                    + direction.y * (start.x - section.aX)) / parallel;

            result = result || {};

            result.x = section.aX + vertex1X * factor;
            result.y = section.aY + vertex1Y * factor;
            result.factor = factor;
            result.computed = true;

            result.lineFactor = direction.y === 0 ?
                (result.x - start.x) / direction.x :
                (result.y - start.y) / direction.y;

            return result;
        }

        function sectionRayCast(section, start, direction, result) {
            var vertex1X = section.bX - section.aX,
                vertex1Y = section.bY - section.aY;

            if (dot(-direction.y, direction.x, vertex1X, vertex1Y) < 0) {
                return false;
            }

            sectionRayCastBothSides(section, start, direction, result);

            if (result.lineFactor < 0) {
                return false;
            }

            return result;
        }

        function sqrDistance(aX, aY, bX, bY) {
            var x = bX - aX,
                y = bY - aY;

            return x * x + y * y;
        }

        function distance(aX, aY, bX, bY) {
            return Math.sqrt(sqrDistance(aX, aY, bX, bY));
        }

        function length(x, y) {
            return Math.sqrt(x * x + y * y);
        }

        function directionalDistance(lineX, lineY, normX, normY, pointX, pointY) {
            var shadowLength = dot(normX, normY, pointX - lineX, pointY - lineY);

            return shadowLength;
        }

        function grid(x) {
            return Math.round(x / gridSize) * gridSize;
        }

        function distanceFromSection(sectionWithNormal, x, y, result) {
            var directionalDist, shadowX, shadowY,
                positionOnSection, length;

            result = result || {};
            directionalDist = directionalDistance(
                sectionWithNormal.aX, sectionWithNormal.aY,
                sectionWithNormal.x, sectionWithNormal.y,
                x, y);

            length = distance(sectionWithNormal.aX, sectionWithNormal.aY,
                sectionWithNormal.bX, sectionWithNormal.bY);

            shadowX = x + sectionWithNormal.x * directionalDist;
            shadowY = y + sectionWithNormal.y * directionalDist;

            positionOnSection = dot(sectionWithNormal.y, -sectionWithNormal.x,
                shadowX - sectionWithNormal.aX, shadowY - sectionWithNormal.aY);

            if (positionOnSection >= 0 && positionOnSection <= length) {
                result.x = sectionWithNormal.aX + sectionWithNormal.y * positionOnSection;
                result.y = sectionWithNormal.aY - sectionWithNormal.x * positionOnSection;
            } else if (positionOnSection < 0) {
                result.x = sectionWithNormal.aX;
                result.y = sectionWithNormal.aY;
            } else if (positionOnSection > length) {
                result.x = sectionWithNormal.bX;
                result.y = sectionWithNormal.bY;
            }

            result.length = distance(x, y, result.x, result.y);
            result.normalX = (x - result.x) / result.length;
            result.normalY = (y - result.y) / result.length;

            return result;
        }

        function circlesIntersection(x1, y1, radius1, x2, y2, radius2, result) {
            var dist = distance(x1, y1, x2, y2);

            result = result || {};

            if (dist <= radius1 + radius2) {
                result.normalX = (x1 - x2) / dist;
                result.normalY = (y1 - y2) / dist;
                result.x = x2 + result.normalX * radius2;
                result.y = y2 + result.normalY * radius2;
                result.length = dist;
                return true;
            } else {
                return false;
            }
        }

        function isNearSection(section, x, y, radius, result) {
            if (x < section.bounds.minX - radius || x > section.bounds.maxX + radius ||
                y < section.bounds.minY - radius || y > section.bounds.maxY + radius) {
                return false;
            }

            return distanceFromSection(section, x, y, result).length < radius;
        }

        function swapSectionPoints(section) {
            var tmpX, tmpY;

            tmpX = section.aX;
            tmpY = section.aY;
            section.aX = section.bX;
            section.aY = section.bY;
            section.bX = tmpX;
            section.bY = tmpY;
        }

        function addAngles(x1, y1, x2, y2, result) {
            result.x = x1 * x2 - y1 * y2;
            result.y = x1 * y2 + x2 * y1;
        }

        return {
            PIx2: Math.PI * 2,
            addVectors2d: addVectors2d,
            subVectors2d: subVectors2d,
            mulVec2dScalar: mulVec2dScalar,
            getVec2dLength: getVec2dLength,
            cross: cross,
            dot: dot,
            length: length,
            sqrDistance: sqrDistance,
            distance: distance,
            directionalDistance: directionalDistance,
            distanceFromSection: distanceFromSection,
            isNearSection: isNearSection,
            sectionRayCastBothSides: sectionRayCastBothSides,
            sectionRayCast: sectionRayCast,
            circlesIntersection: circlesIntersection,
            grid: grid,
            swapSectionPoints: swapSectionPoints
        };
    }());
}());