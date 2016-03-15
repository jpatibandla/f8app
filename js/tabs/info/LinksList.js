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

var F8Colors = require('F8Colors');
var Image = require('Image');
var ItemsWithSeparator = require('../../common/ItemsWithSeparator');
var Linking = require('LinkingIOS'); // TODO: Android, upgrade React
var React = require('React');
var Section = require('./Section');
var StyleSheet = require('StyleSheet');
var TouchableHighlight = require('TouchableHighlight');
var { Text } = require('F8Text');
var TouchableOpacity = require('TouchableOpacity');
var View = require('View');

class LinksList extends React.Component {
  props: {
    title: string;
    links: Array<{
      icon: ?string;
      title: string;
      url: string;
    }>;
  };

  render() {
    let content = this.props.links.map(
      (link) => <Row link={link} key={link.url} />
    );
    return (
      <Section title={this.props.title}>
        <ItemsWithSeparator separatorStyle={styles.separator}>
          {content}
        </ItemsWithSeparator>
      </Section>
    );
  }
}

class Row extends React.Component {
  props: {
    link: {
      icon: ?string;
      title: string;
      url: string;
    };
  };

  render() {
    var {icon, title, url} = this.props.link;
    var image = icon && <Image style={styles.picture} source={{uri: icon}} />
    return (
      <TouchableHighlight onPress={() => Linking.openURL(url)}>
        <View style={styles.row}>
          {image}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Image source={require('../../common/img/disclosure.png')} />
        </View>
      </TouchableHighlight>
    );
  }
}

const IMAGE_SIZE = 44;

var styles = StyleSheet.create({
  separator: {
    marginHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: 60,
  },
  picture: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    marginRight: 16,
  },
  title: {
    fontSize: 17,
    color: F8Colors.darkText,
    flex: 1,
  },
  button: {
    padding: 10,
  },
  like: {
    letterSpacing: 1,
    color: F8Colors.actionText,
    fontSize: 12,
  },
});

module.exports = LinksList;
