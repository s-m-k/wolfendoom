/*include:js/core/namespace.js*/
(function () {
    'use strict';
    
    wd.Container = function () {
        var freeIdStack = [],
            objects = [],
            listLength = 0,
            objectsCount = 0,
            lastId = false,
            firstId = false,
            self = this;

        function assignId() {
            var nextId;

            if (freeIdStack.length === 0) {
                nextId = listLength;
                listLength += 1;
                return nextId;
            } else {
                return freeIdStack.pop();
            }
        }

        function isFree(id) {
            return objects[id] === undefined || objects[id].deleted;
        }

        function freeId(id) {
            if (!isFree(id)) {
                if (lastId === id) {
                    lastId = objects[id].prev;
                }

                objects[id].deleted = true;
                delete objects[id].obj;
                freeIdStack.push(id);
            }
        }

        function createElement(object, id, prevId, nextId) {
            return {
                obj: object,
                id: id,
                prev: prevId,
                next: nextId,
                deleted: false
            };
        }

        function updateElement(source, object, id, prevId, nextId) {
            source.obj = object;
            source.id = id;
            source.prev = prevId;
            source.next = nextId;
            source.deleted = false;
        }

        this.addAfter = function (existingId, object) {
            var id = assignId(),
                nextId = false;

            if (isFree(existingId)) {
                existingId = lastId;
            }

            if (existingId !== false) {
                nextId = objects[existingId].next;

                objects[existingId].next = id;
            }

            if (nextId !== false) {
                objects[nextId].prev = id;
            }

            if (firstId === false) {
                firstId = id;
            }

            if (objects[id] !== undefined) {
                updateElement(objects[id], object, id, existingId, nextId);
            } else {
                objects[id] = createElement(object, id, existingId, nextId);
            }

            if (nextId === false) {
                lastId = id;
            }

            self[id] = object;

            objectsCount += 1;
            this.length = objectsCount;

            return id;
        };

        this.add = function (object) {
            return this.addAfter(lastId, object);
        };

        this.remove = function (id) {
            if (!isFree(id)) {
                var prev = objects[id].prev,
                    next = objects[id].next;

                if (prev !== false) {
                    objects[prev].next = next;
                }

                if (next !== false) {
                    objects[next].prev = prev;
                }

                if (id === firstId) {
                    firstId = next;
                }

                delete self[id];

                objectsCount -= 1;
                this.length = objectsCount;

                freeId(id);
            }
        };

        this.iterate = function (iterator, context) {
            var returnValue;

            if (firstId === false) {
                return;
            }

            var object = objects[firstId],
                nextObject;

            do {
                nextObject = objects[object.next];
                returnValue = iterator.call(context || object.obj, object.id, object.obj);
                object = nextObject;
            } while (object && !object.deleted && returnValue === undefined);

            return returnValue;
        };

        this.next = function (id) {
            if (isFree(id)) {
                return false;
            } else {
                return objects[id].next;
            }
        };

        this.prev = function (id) {
            if (isFree(id)) {
                return false;
            } else {
                return objects[id].prev;
            }
        };

        this.first = function () {
            return firstId;
        };

        this.last = function () {
            return lastId;
        };

        this.size = function () {
            return objectsCount;
        };

        this.length = 0;
    };
}());