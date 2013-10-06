<?php

/* MIT license
 * Copyright © Sebastian Krośkiewicz <sebastian.kroskiewicz@gmail.com>
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

error_reporting(E_ALL);
define('DEV', 0);
define('PROD', 1);

require_once('php/includer.inc.php');
require_once('php/config.inc.php');
require_once('php/minifiers/css_minifier.inc.php');
require_once('php/minifiers/js_minifier.inc.php');
require_once('php/parsers/js_tags_parser.inc.php');

class JSIncluder extends Includer {
    protected $filePrefix = '<script type="text/javascript" src="';
    protected $fileSuffix = '"></script>';
    protected $fileExt = 'js';
}

class CSSIncluder extends Includer {
    protected $filePrefix = '<link rel="stylesheet" href="';
    protected $fileSuffix = '" />';
    protected $fileExt = 'css';
}

class App {
    private static $jsIncluder;
    private static $cssIncluder;

    public static function init() {
        App::$jsIncluder = new JSIncluder();
        App::$cssIncluder = new CSSIncluder();

        App::$jsIncluder->useParser(new JSTagsParser());

        if(Config::$useJSMinifier) {
            App::$jsIncluder->useMinifier(new JSMinifier());
        }

        if(Config::$useCSSMinifier) {
            App::$cssIncluder->useMinifier(new CSSMinifier());
        }
    }

    public static function includeCoreScript($filename) {
        App::$jsIncluder->includeFile($filename);
    }

    public static function includeCoreStyle($filename) {
        App::$cssIncluder->includeFile($filename);
    }
}

?>
