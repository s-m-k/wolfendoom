<?php
    require_once 'php/app.inc.php';
    App::init();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>

        <style>
            html, body {
                margin: 0;
                padding: 0;
                overflow: hidden;
            }

            #sprites {
                width: 100%;
                height: 100%;
                background: rgba(255, 0, 0, 0.4);
            }

            #panel {
                background: grey;
                position: absolute;
                left: 0;
                top: 0;
                width: 256px;
                height: 100%;
                position: fixed;
            }

            #sprites-pal {
                background: #ccc;
                width: 100%;
            }

            .sprite {
                background: white;
                top: 2px;
                margin-left: 16px;
                position: relative;
            }

            #panel textarea {
                background: #ccc;
                width: 100%;
                margin: 0;
                padding: 0;
                border: 0;
            }
        </style>
    </head>
    <body>
        <canvas id="display"></canvas>
        <form id="panel">
            <textarea id="json" rows="8" cols="8">[{"aX":384,"aY":256,"bX":384,"bY":96},{"aX":384,"aY":96,"bX":544,"bY":96},{"aX":544,"aY":256,"bX":384,"bY":256},{"aX":544,"aY":160,"bX":640,"bY":160},{"aX":640,"aY":160,"bX":640,"bY":96},{"aX":640,"aY":256,"bX":640,"bY":192},{"aX":640,"aY":96,"bX":736,"bY":96},{"aX":736,"aY":96,"bX":736,"bY":384},{"aX":576,"aY":320,"bX":640,"bY":256},{"aX":384,"aY":384,"bX":384,"bY":320},{"aX":384,"aY":320,"bX":576,"bY":320},{"aX":544,"aY":96,"bX":544,"bY":160},{"aX":480,"aY":384,"bX":384,"bY":384},{"aX":480,"aY":352,"bX":480,"bY":384},{"aX":576,"aY":352,"bX":480,"bY":352},{"aX":576,"aY":448,"bX":576,"bY":352},{"aX":384,"aY":576,"bX":384,"bY":448},{"aX":448,"aY":576,"bX":384,"bY":576},{"aX":448,"aY":480,"bX":448,"bY":576},{"aX":512,"aY":576,"bX":512,"bY":480},{"aX":576,"aY":576,"bX":512,"bY":576},{"aX":576,"aY":480,"bX":576,"bY":576},{"aX":608,"aY":480,"bX":576,"bY":480},{"aX":608,"aY":576,"bX":608,"bY":480},{"aX":672,"aY":576,"bX":608,"bY":576},{"aX":672,"aY":384,"bX":672,"bY":576},{"aX":704,"aY":384,"bX":672,"bY":384},{"aX":704,"aY":576,"bX":704,"bY":384},{"aX":736,"aY":384,"bX":736,"bY":544},{"aX":672,"aY":288,"bX":608,"bY":352},{"aX":608,"aY":352,"bX":704,"bY":352},{"aX":704,"aY":352,"bX":704,"bY":288},{"aX":704,"aY":288,"bX":672,"bY":288},{"aX":832,"aY":544,"bX":832,"bY":352},{"aX":832,"aY":352,"bX":896,"bY":288},{"aX":896,"aY":480,"bX":896,"bY":576},{"aX":1120,"aY":480,"bX":896,"bY":480},{"aX":1504,"aY":480,"bX":1120,"bY":480},{"aX":1120,"aY":416,"bX":1504,"bY":480},{"aX":1024,"aY":32,"bX":1024,"bY":320},{"aX":896,"aY":32,"bX":1024,"bY":32},{"aX":800,"aY":160,"bX":896,"bY":32},{"aX":800,"aY":224,"bX":800,"bY":160},{"aX":928,"aY":128,"bX":800,"bY":224},{"aX":896,"aY":288,"bX":928,"bY":128},{"aX":1024,"aY":320,"bX":1088,"bY":256},{"aX":1088,"aY":256,"bX":1120,"bY":288},{"aX":1184,"aY":352,"bX":1120,"bY":416},{"aX":1152,"aY":320,"bX":1184,"bY":352},{"aX":1120,"aY":288,"bX":1184,"bY":224},{"aX":1184,"aY":224,"bX":1280,"bY":192},{"aX":1280,"aY":192,"bX":1376,"bY":192},{"aX":1376,"aY":192,"bX":1472,"bY":224},{"aX":1472,"aY":224,"bX":1536,"bY":288},{"aX":1216,"aY":256,"bX":1152,"bY":320},{"aX":1312,"aY":256,"bX":1216,"bY":256},{"aX":1440,"aY":288,"bX":1312,"bY":256},{"aX":1504,"aY":320,"bX":1440,"bY":288},{"aX":1536,"aY":288,"bX":1504,"bY":320},{"aX":928,"aY":352,"bX":896,"bY":384},{"aX":992,"aY":352,"bX":928,"bY":352},{"aX":1024,"aY":416,"bX":992,"bY":352},{"aX":960,"aY":416,"bX":1024,"bY":416},{"aX":896,"aY":384,"bX":960,"bY":416},{"aX":544,"aY":192,"bX":544,"bY":256},{"aX":640,"aY":192,"bX":544,"bY":192},{"aX":544,"aY":160,"bX":544,"bY":192,"door":2},{"aX":1120,"aY":288,"bX":1152,"bY":320,"door":4},{"aX":576,"aY":320,"bX":576,"bY":352,"door":5},{"aX":576,"aY":448,"bX":576,"bY":480,"door":7},{"aX":480,"aY":448,"bX":576,"bY":448},{"aX":384,"aY":448,"bX":480,"bY":448},{"aX":480,"aY":480,"bX":448,"bY":480},{"aX":512,"aY":480,"bX":480,"bY":480},{"aX":480,"aY":448,"bX":480,"bY":480,"door":2},{"aX":736,"aY":544,"bX":768,"bY":544},{"aX":768,"aY":544,"bX":832,"bY":544},{"aX":896,"aY":576,"bX":768,"bY":576},{"aX":768,"aY":576,"bX":704,"bY":576},{"aX":768,"aY":576,"bX":768,"bY":544,"door":3}]</textarea>
            <button id="bsp">generate BSP tree</button>
            <hr>
            <label>
                (lefts - rights) multiplier:
                <input type="number" id="bsp-lefts-rights" value="1"/>
            </label><br>
            <label>
                (intersecting) multiplier:
                <input type="number" id="bsp-intersecting" value="2"/>
            </label><br>
            <label>
                BSP JSON:
                <textarea id="bsp-json" rows="8" cols="8"></textarea>
            </label>
            <hr>
            Sprites:
            <div id="sprites-pal">
                <label>
                    N/A
                    <input type="radio" name="sprite" value="" checked />
                </label>
                <label>
                    <img id="bush" class="sprite" src="assets/bush.png" alt=""/>
                    <input type="radio" name="sprite" value="bush" />
                </label>
                <label>
                    <img id="sta" class="sprite" src="assets/sta.png" alt=""/>
                    <input type="radio" name="sprite" value="sta" />
                </label>
                <label>
                    <img id="stone" class="sprite" src="assets/stone.png" alt=""/>
                    <input type="radio" name="sprite" value="stone" />
                </label>
            </div>
            <label>
                Vertical pos.:
                <input type="number" id="sprite-z" value="72"/>
            </label><br>
            <label>
                Radius:
                <input type="number" id="sprite-radius" value="16"/>
            </label><br>
            <label>
                Obstacle:
                <input type="checkbox" id="sprite-obstacle" checked />
            </label><br>
            <label>
                Sprites JSON:
                <textarea id="sprites-json" rows="8" cols="8">[{"x":476,"y":192,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":516,"y":125,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":447,"y":127,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":708,"y":264,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":679,"y":158,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":615,"y":323,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":629,"y":399,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":651,"y":519,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":518,"y":546,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":557,"y":496,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":412,"y":507,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":422,"y":549,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":417,"y":338,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":534,"y":341,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":865,"y":460,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":914,"y":327,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":975,"y":136,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":905,"y":51,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1077,"y":413,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1086,"y":324,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1252,"y":468,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":931,"y":472,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1354,"y":238,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1442,"y":266,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1430,"y":230,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":1206,"y":244,"z":159,"radius":16,"obstacle":false,"id":"stone"},{"x":468,"y":170,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":511,"y":226,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":695,"y":241,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":720,"y":449,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":618,"y":448,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":419,"y":481,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":541,"y":537,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":1075,"y":462,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":964,"y":264,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":954,"y":70,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":837,"y":155,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":1129,"y":360,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":1320,"y":209,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":834,"y":571,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":447,"y":365,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":715,"y":137,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":603,"y":178,"z":-158,"radius":16,"obstacle":false,"id":"sta"},{"x":486,"y":120,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":559,"y":561,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":592,"y":412,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":847,"y":415,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":1122,"y":466,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":718,"y":182,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":945,"y":138,"z":80,"radius":16,"obstacle":true,"id":"bush"},{"x":1479,"y":249,"z":80,"radius":16,"obstacle":true,"id":"bush"}]</textarea>
            </label>
        </form>
        <?php
            App::includeCoreScript('js/editor/editor.js');
        ?>
    </body>
</html>
