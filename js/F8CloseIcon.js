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
 * @providesModule F8CloseIcon
 * @flow
 */

'use strict';

var MatrixMath = require('MatrixMath');
var React = require('React');
var StyleSheet = require('StyleSheet');
var View = require('View');

var F8CloseIcon = React.createClass({
  render: function() {
    return (
      <View style={this.props.style}>
        <View style={styles.button}>
          <View style={styles.verticalLine} />
          <View style={styles.horizontalLine} />
        </View>
      </View>
    );
  }
});


var rotate45 = MatrixMath.createIdentityMatrix();
MatrixMath.reuseRotateZCommand(rotate45, Math.PI / 4);

var BUTTON_SIZE = 20;
var LINE_WIDTH = 2;
var CENTER = (BUTTON_SIZE - LINE_WIDTH) / 2;

var styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    transformMatrix: rotate45,
  },
  verticalLine: {
    backgroundColor: '#9BA7B9',
    position: 'absolute',
    width: LINE_WIDTH,
    height: BUTTON_SIZE,
    left: CENTER,
    top: 0,
  },
  horizontalLine: {
    backgroundColor: '#9BA7B9',
    position: 'absolute',
    width: BUTTON_SIZE,
    height: LINE_WIDTH,
    left: 0,
    top: CENTER,
  }
});

module.exports = F8CloseIcon;
