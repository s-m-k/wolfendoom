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


class JSTagsParser {
    private function genContentTagRule($tagName) {
        return '/\\/\\*\\{' . $tagName . '\\}(.*)\\{\\/' . $tagName . '\\}\\*\\//Us';
    }

    private function genTagRule($tagName) {
        return '/\\/\\*\\{' . $tagName . '\\}\\*\\//Us';
    }

    public function parse($input) {
        $input = preg_replace($this->genContentTagRule('dev'), '', $input);
        $input = preg_replace($this->genContentTagRule('prod'), '$1', $input);

        $input = preg_replace_callback('/\/\*(.*)\*\//s', function ($matches) {
            return '/*' . preg_replace('/(\{[a-zA-Z0-9]+\})/s', '/*$1*/', $matches[1]) . '*/';
        }, $input);

        $input = preg_replace($this->genTagRule('time'), time(), $input);

        return $input;
    }
}
?>
