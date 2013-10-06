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

require_once('php/minifiers/no_minifier.inc.php');
require_once('php/parsers/plain_parser.inc.php');

class Includer {
    private $included = array();
    protected $filePrefix = '';
    protected $fileSuffix = '';
    protected $fileExt = '';
    protected $minifier = null;
    protected $parser = null;

    public function __construct() {
        $this->minifier = new NoMinifier();
        $this->parser = new PlainParser();
    }

    public function useMinifier($minifier) {
        $this->minifier = $minifier;
    }

    public function useParser($parser) {
        $this->parser = $parser;
    }

    public function includeFile($file) {
        if(Config::$mode === PROD) {
            echo $this->genHTML(Config::$productionPath . $file);
        } elseif (Config::$mode === DEV) {
            $content = $this->startIncluding(Config::$developmentPath . $file);

            $parsed = $this->parser->parse($content);
            $minified = $this->minifier->minify($parsed);

            file_put_contents(Config::$productionPath . $file, $minified);
        }
    }

    private function startIncluding($file) {
        if (isset($this->included[$file])) {
            return;
        }

        $this->included[$file] = true;

        $finalMinifiedContents = '';

        $contents = file_get_contents($file);

        $deps = array();
        preg_match_all('/\/*include:([^*]+)\*\//', $contents, $deps);

        foreach ($deps[1] as $dep) {
            $fullDir = Config::$developmentPath . $dep;

            if (is_file($fullDir)) {
                $finalMinifiedContents .= $this->startIncluding($fullDir);
            } else {
                if (!file_exists($fullDir)) {
                    echo '<!--file not found: ' . $fullDir . '-->' . PHP_EOL;
                    return;
                }
                $finalMinifiedContents .= $this->includeAll($fullDir);
            }
        }

        echo $this->genHTML($file);

        return $finalMinifiedContents . $contents;
    }

    private function genHTML($fileName) {
        return $this->filePrefix . $fileName . $this->fileSuffix . PHP_EOL;
    }

    private function includeAll($dir) {
        $finalContents = '';

        if (($handle = opendir($dir))) {
            while ($file = readdir($handle)) {
                clearstatcache();
                if (is_file($dir . '/' . $file)) {
                    if ($this->ext($file) == $this->fileExt) {
                        $finalContents .= PHP_EOL . $this->startIncluding($dir . '/' . $file);
                    }
                } elseif ($file != '..' && $file != '.')
                    $finalContents .= PHP_EOL . $this->includeAll($dir . '/' . $file);
            }
            closedir($handle);
        }

        return $finalContents;
    }

    private function ext($filename) {
        return pathinfo($filename, PATHINFO_EXTENSION);
    }
}

?>
