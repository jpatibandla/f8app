/**
 * Copyright 2014 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @providesModule F8BackButton
 * @flow
 */
'use strict';

var MatrixMath = require('MatrixMath');
var React = require('React');
var StyleSheet = require('StyleSheet');
var View = require('View');

var F8BackButton = React.createClass({
  render: function() {
    var color = this.props.color || '#ffffff';
    var bordersStyle = {borderTopColor: color, borderLeftColor: color};
    return (
      <View style={styles.container}>
        <View style={[styles.arrow, bordersStyle]} />
      </View>
    );
  }
});

var ARROW_SIZE = 14;
var CONTAINER_SIZE = 14;

var ROTATE45ANDSHIFT = MatrixMath.createRotateZ(-Math.PI / 4);
MatrixMath.reuseTranslate2dCommand(ROTATE45ANDSHIFT, 7, 0);

var styles = StyleSheet.create({
  container: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    transformMatrix: ROTATE45ANDSHIFT,
  },
  arrow: {
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    borderTopWidth: 2,
    borderTopColor: 'white',
    borderLeftWidth: 2,
    borderLeftColor: 'white',
  }
});

module.exports = F8BackButton;
