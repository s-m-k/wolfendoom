/*include:js/core/namespace.js*/
/*include:js/core/events.js*/
/*include:js/core/Container.js*/
/*include:js/core/Pool.js*/
/*include:js/core/math.js*/
/*include:js/game/core/input.js*/
/*include:js/game/core/renderer.js*/
/*include:js/game/core/Sprite.js*/
/*include:js/game/core/timer.js*/
/*include:js/game/gameplay/weapons/Weapon.js*/
/*include:js/game/gameplay/actors/player.js*/
/*include:js/game/gameplay/world/Map.js*/

window.onload = function () {
    'use strict';

    var intervals = wd.intervals,
        renderer = wd.renderer,
        Player = wd.Player,
        Map = wd.Map,
        timer = wd.timer;

    var game = (function () {
        var frameTimeCounter = document.querySelector('#frame-time'),
            fpsCounter = document.querySelector('#fps');

        function start() {
            var player = new Player({
                    position: { x: 448, y: 192 }
                }),
                map = new Map({
                    jsonBSP: '{"walls":[{"aX":704,"aY":576,"bX":704,"bY":384}],"left":{"walls":[{"aX":544,"aY":96,"bX":544,"bY":160}],"left":{"walls":[{"aX":672,"aY":288,"bX":608,"bY":352}],"left":{"walls":[{"aX":576,"aY":480,"bX":576,"bY":576}],"left":{"walls":[{"aX":704,"aY":384,"bX":672,"bY":384}],"left":{"walls":[{"aX":608,"aY":480,"bX":576,"bY":480}],"left":{"walls":[{"aX":608,"aY":576,"bX":608,"bY":480},{"aX":672,"aY":576,"bX":608,"bY":576},{"aX":672,"aY":480,"bX":672,"bY":576}],"leaf":true},"right":{"walls":[{"aX":672,"aY":384,"bX":672,"bY":480}],"leaf":true}},"right":{"walls":[{"aX":608,"aY":352,"bX":704,"bY":352}],"left":{"walls":[{"aX":704,"aY":288,"bX":672,"bY":288}],"leaf":true}}},"right":{"walls":[{"aX":576,"aY":448,"bX":576,"bY":384}],"left":{"walls":[{"aX":576,"aY":576,"bX":544,"bY":576},{"aX":544,"aY":448,"bX":576,"bY":448}],"leaf":true},"right":{"walls":[{"aX":576,"aY":448,"bX":576,"bY":480,"door":7},{"aX":576,"aY":480,"bX":576,"bY":448,"door":7}],"leaf":true}}},"right":{"walls":[{"aX":576,"aY":320,"bX":640,"bY":256}],"left":{"walls":[{"aX":640,"aY":160,"bX":640,"bY":96}],"left":{"walls":[{"aX":544,"aY":320,"bX":576,"bY":320}],"left":{"walls":[{"aX":544,"aY":160,"bX":640,"bY":160},{"aX":640,"aY":192,"bX":544,"bY":192}],"leaf":true}},"right":{"walls":[{"aX":640,"aY":256,"bX":640,"bY":192},{"aX":640,"aY":96,"bX":704,"bY":96}],"leaf":true}},"right":{"walls":[{"aX":576,"aY":352,"bX":544,"bY":352}],"left":{"walls":[{"aX":576,"aY":384,"bX":576,"bY":352}],"leaf":true},"right":{"walls":[{"aX":576,"aY":320,"bX":576,"bY":352,"door":5},{"aX":576,"aY":352,"bX":576,"bY":320,"door":5}],"leaf":true}}}},"right":{"walls":[{"aX":480,"aY":384,"bX":384,"bY":384}],"left":{"walls":[{"aX":480,"aY":480,"bX":480,"bY":448,"door":2}],"left":{"walls":[{"aX":480,"aY":480,"bX":448,"bY":480}],"left":{"walls":[{"aX":384,"aY":576,"bX":384,"bY":480},{"aX":448,"aY":576,"bX":384,"bY":576},{"aX":448,"aY":480,"bX":448,"bY":576}],"leaf":true},"right":{"walls":[{"aX":384,"aY":480,"bX":384,"bY":448},{"aX":384,"aY":448,"bX":480,"bY":448}],"leaf":true}},"right":{"walls":[{"aX":512,"aY":576,"bX":512,"bY":480}],"left":{"walls":[{"aX":480,"aY":448,"bX":480,"bY":480,"door":2}],"left":{"walls":[{"aX":480,"aY":448,"bX":512,"bY":448},{"aX":512,"aY":480,"bX":480,"bY":480}],"leaf":true}},"right":{"walls":[{"aX":544,"aY":576,"bX":512,"bY":576},{"aX":512,"aY":448,"bX":544,"bY":448}],"leaf":true}}},"right":{"walls":[{"aX":480,"aY":352,"bX":480,"bY":384}],"left":{"walls":[{"aX":544,"aY":192,"bX":544,"bY":160,"door":2}],"left":{"walls":[{"aX":544,"aY":256,"bX":480,"bY":256}],"left":{"walls":[{"aX":480,"aY":320,"bX":544,"bY":320},{"aX":544,"aY":352,"bX":480,"bY":352}],"leaf":true},"right":{"walls":[{"aX":480,"aY":96,"bX":544,"bY":96}],"leaf":true}},"right":{"walls":[{"aX":544,"aY":192,"bX":544,"bY":256},{"aX":544,"aY":160,"bX":544,"bY":192,"door":2}],"leaf":true}},"right":{"walls":[{"aX":480,"aY":256,"bX":384,"bY":256}],"left":{"walls":[{"aX":384,"aY":384,"bX":384,"bY":320},{"aX":384,"aY":320,"bX":480,"bY":320}],"leaf":true},"right":{"walls":[{"aX":384,"aY":256,"bX":384,"bY":96},{"aX":384,"aY":96,"bX":480,"bY":96}],"leaf":true}}}}},"right":{"walls":[{"aX":1024,"aY":416,"bX":992,"bY":352}],"left":{"walls":[{"aX":928,"aY":352,"bX":896,"bY":384}],"left":{"walls":[{"aX":832,"aY":544,"bX":832,"bY":448}],"left":{"walls":[{"aX":768,"aY":576,"bX":768,"bY":544,"door":3}],"left":{"walls":[{"aX":736,"aY":544,"bX":768,"bY":544},{"aX":768,"aY":576,"bX":704,"bY":576}],"leaf":true},"right":{"walls":[{"aX":768,"aY":544,"bX":768,"bY":576,"door":3}],"left":{"walls":[{"aX":768,"aY":544,"bX":832,"bY":544},{"aX":832,"aY":576,"bX":768,"bY":576}],"leaf":true}}},"right":{"walls":[{"aX":896,"aY":480,"bX":896,"bY":576}],"left":{"walls":[{"aX":960,"aY":416,"bX":1024,"bY":416}],"left":{"walls":[{"aX":992,"aY":352,"bX":928,"bY":352}],"left":{"walls":[{"aX":896,"aY":384,"bX":960,"bY":416}],"leaf":true}},"right":{"walls":[{"aX":1056,"aY":480,"bX":896,"bY":480}],"leaf":true}},"right":{"walls":[{"aX":896,"aY":576,"bX":832,"bY":576}],"leaf":true}}},"right":{"walls":[{"aX":893.0909090909091,"aY":154.1818181818182,"bX":800,"bY":224}],"left":{"walls":[{"aX":736,"aY":272,"bX":736,"bY":384}],"left":{"walls":[{"aX":832,"aY":352,"bX":896,"bY":288}],"left":{"walls":[{"aX":896,"aY":288,"bX":914.2857142857143,"bY":196.57142857142858}],"leaf":true},"right":{"walls":[{"aX":832,"aY":448,"bX":832,"bY":352}],"leaf":true}},"right":{"walls":[{"aX":736,"aY":384,"bX":736,"bY":544},{"aX":704,"aY":352,"bX":704,"bY":296}],"leaf":true}},"right":{"walls":[{"aX":736,"aY":96,"bX":736,"bY":272}],"left":{"walls":[{"aX":800,"aY":160,"bX":857.6,"bY":83.2},{"aX":800,"aY":224,"bX":800,"bY":160}],"leaf":true},"right":{"walls":[{"aX":704,"aY":96,"bX":736,"bY":96},{"aX":704,"aY":296,"bX":704,"bY":288}],"leaf":true}}}},"right":{"walls":[{"aX":1216,"aY":256,"bX":1152,"bY":320}],"left":{"walls":[{"aX":1504,"aY":320,"bX":1440,"bY":288}],"left":{"walls":[{"aX":1120,"aY":416,"bX":1504,"bY":480}],"left":{"walls":[{"aX":1152,"aY":320,"bX":1184,"bY":352}],"left":{"walls":[{"aX":1312,"aY":256,"bX":1216,"bY":256}],"left":{"walls":[{"aX":1440,"aY":288,"bX":1312,"bY":256}],"leaf":true}},"right":{"walls":[{"aX":1184,"aY":352,"bX":1120,"bY":416}],"leaf":true}},"right":{"walls":[{"aX":1120,"aY":480,"bX":1056,"bY":480},{"aX":1504,"aY":480,"bX":1120,"bY":480}],"leaf":true}},"right":{"walls":[{"aX":1280,"aY":192,"bX":1376,"bY":192},{"aX":1376,"aY":192,"bX":1472,"bY":224},{"aX":1472,"aY":224,"bX":1536,"bY":288},{"aX":1536,"aY":288,"bX":1504,"bY":320}],"leaf":true}},"right":{"walls":[{"aX":1024,"aY":32,"bX":1024,"bY":320}],"left":{"walls":[{"aX":1088,"aY":256,"bX":1120,"bY":288}],"left":{"walls":[{"aX":1120,"aY":288,"bX":1184,"bY":224},{"aX":1184,"aY":224,"bX":1280,"bY":192}],"leaf":true},"right":{"walls":[{"aX":1152,"aY":320,"bX":1120,"bY":288,"door":4}],"left":{"walls":[{"aX":1024,"aY":320,"bX":1088,"bY":256}],"leaf":true},"right":{"walls":[{"aX":1120,"aY":288,"bX":1152,"bY":320,"door":4}],"leaf":true}}},"right":{"walls":[{"aX":914.2857142857143,"aY":196.57142857142858,"bX":928,"bY":128}],"left":{"walls":[{"aX":896,"aY":32,"bX":947.1999999999999,"bY":32},{"aX":857.6,"aY":83.2,"bX":896,"bY":32},{"aX":928,"aY":128,"bX":893.0909090909091,"bY":154.1818181818182}],"leaf":true},"right":{"walls":[{"aX":947.1999999999999,"aY":32,"bX":1024,"bY":32}],"leaf":true}}}}}}',
                    jsonSprites: '[{"x":476,"y":192,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":516,"y":125,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":447,"y":127,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":708,"y":264,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":679,"y":158,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":615,"y":323,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":629,"y":399,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":651,"y":519,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":518,"y":546,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":557,"y":496,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":412,"y":507,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":422,"y":549,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":417,"y":338,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":534,"y":341,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":865,"y":460,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":914,"y":327,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":975,"y":136,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":905,"y":51,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1077,"y":413,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1086,"y":324,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1252,"y":468,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":931,"y":472,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1354,"y":238,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1442,"y":266,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1430,"y":230,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1206,"y":244,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":468,"y":170,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":511,"y":226,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":695,"y":241,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":720,"y":449,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":618,"y":448,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":419,"y":481,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":541,"y":537,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":1075,"y":462,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":964,"y":264,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":954,"y":70,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":837,"y":155,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":1129,"y":360,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":1320,"y":209,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":834,"y":571,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":447,"y":365,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":715,"y":137,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":603,"y":178,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":486,"y":120,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":559,"y":561,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":592,"y":412,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":847,"y":415,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":1122,"y":466,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":718,"y":182,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":945,"y":138,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":1479,"y":249,"z":80,"radius":16,"obstacle":true,"id":"bush"}]'
                });

            player.setParentMap(map);

            timer.on('step', function (frameRenderTime, fps) {
                frameTimeCounter.innerHTML = frameRenderTime;
                fpsCounter.innerHTML = fps;

                player.process();
                intervals.process();

                renderer.next3DIteration();
                renderer.clear();
                player.render();
                map.renderFromPosition(player.position.x, player.position.y);
                map.renderSprites();

                player.renderHUD();
            });

            timer.start();
        }

        return {
            start: start
        };
    }());

    game.start();
};