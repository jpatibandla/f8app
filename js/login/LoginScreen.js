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
 * @flow
 */
'use strict';

var F8Button = require('F8Button');
var F8Colors = require('F8Colors');
var StatusBarIOS = require('StatusBarIOS');
var Image = require('Image');
var View = require('View');
var React = require('React');
var Dimensions = require('Dimensions');
var StyleSheet = require('StyleSheet');
var { Text } = require('F8Text');
var TouchableOpacity = require('TouchableOpacity');
var LoginButton = require('../common/LoginButton');

var { skipLogin } = require('../actions');
var { connect } = require('react-redux');

class LoginScreen extends React.Component {
  render() {
    return (
      <Image
        style={styles.container}
        source={require('./img/login-background.png')}>
        <TouchableOpacity
          style={styles.skip}
          onPress={() => this.props.dispatch(skipLogin())}>
          <Image source={require('./img/x.png')} />
        </TouchableOpacity>
        <View style={styles.section}>
          <Image
            style={styles.devconf}
            source={require('./img/devconf-logo.png')}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.h1}>
            code to connect
          </Text>
          <Text style={styles.h2}>
            April 12 + 13 / Fort Mason Center
          </Text>
          <Text style={styles.h3}>
            SAN FRANCISCO, CALIFORNIA
          </Text>
        </View>
        <View style={[styles.section, styles.last]}>
          <Text style={styles.loginComment}>
            Use Facebook to find your friends at F8.
          </Text>
          <LoginButton />
        </View>
      </Image>
    );
  }

  componentDidMount() {
    StatusBarIOS && StatusBarIOS.setStyle('default');
  }
}

const scale = Dimensions.get('window').width / 375;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 26,
    // Image's source contains explicit size, but we want
    // it to prefer flex: 1
    width: undefined,
    height: undefined,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  last: {
    justifyContent: 'flex-end',
  },
  h1: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: Math.round(74 * scale),
    lineHeight: Math.round(60 * scale),
    color: F8Colors.darkText,
    marginBottom: 20,
  },
  h2: {
    textAlign: 'center',
    fontSize: 17,
    color: F8Colors.darkText,
    marginBottom: 20,
  },
  h3: {
    fontSize: 12,
    textAlign: 'center',
    color: F8Colors.lightText,
    letterSpacing: 1,
  },
  loginComment: {
    marginBottom: 14,
    fontSize: 12,
    color: F8Colors.darkText,
    textAlign: 'center',
  },
  skip: {
    position: 'absolute',
    right: 0,
    top: 20,
    padding: 15,
  },
});

module.exports = connect()(LoginScreen);
