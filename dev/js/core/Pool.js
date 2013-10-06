/*include:js/core/namespace.js*/
/*include:js/core/Container.js*/
(function () {
    'use strict';

    var Container = wd.Container;

    wd.Pool = (function () {
        function Pool(Type) {
            this.Type = Type;
            this.unused = [];
            this.active = new Container();
        }

        Pool.prototype = {
            constructor: Pool,
            pick: function () {
                var entity;

                if (this.unused.length > 0) {
                    entity = this.unused.pop();
                } else {
                    entity = new this.Type();
                }

                if (entity.reset) {
                    entity.reset();
                }

                this.active.add(entity);
                return entity;
            },
            entityProcessIterator: function (id, entity) {
                if (entity.dead) {
                    this.unused.push(entity);
                    this.active.remove(id);
                } else {
                    entity.process();
                }
            },
            entityRenderIterator: function (id, entity) {
                entity.render();
            },
            process: function () {
                this.active.iterate(this.entityProcessIterator, this);
            },
            render: function () {
                this.active.iterate(this.entityRenderIterator, this);
            }
        };

        return Pool;
    }());
}());