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
            #display-wrap {
                position: relative;
                width: 640px;
                height: 480px;
                margin-left: -320px;
                left: 50%;
            }

            #display, #display-scanline {
                position: absolute;
                left: 0;
                top: 0;

                background: #000;
                width: 640px;
                height: 480px;
            }

            #display-scanline {
                background: url(assets/scanline.png);
            }

        </style>
    </head>
    <body>
        <div id="display-wrap">
            <canvas id="display" width="320" height="240">
            </canvas>
            <div id="display-scanline"></div>
        </div>
        <div id="frame-time"></div>
        <div id="fps"></div>
        <div id="log"></div>
        <div id="assets" style="display: none">
            <img id="wall" src="assets/wall.png" alt="" />
            <img id="door" src="assets/door.png" alt="" />
            <img id="bush" src="assets/bush.png" alt="" />
            <img id="stone" src="assets/stone.png" alt=""/>
            <img id="sta" src="assets/sta.png" alt=""/>
            <img id="hud-pistol" src="assets/pistol.png" alt=""/>
        </div>
        <?php
            App::includeCoreScript('js/game/game.js');
        ?>
    </body>
</html>
