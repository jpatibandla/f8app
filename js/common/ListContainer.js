
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
 * @providesModule ListContainer
 */
'use strict';

var Animated = require('Animated');
var Dimensions = require('Dimensions');
var F8BigHeader = require('F8BigHeader');
var ParallaxBackground = require('ParallaxBackground');
var F8Header = require('F8Header');
var React = require('React');
var StyleSheet = require('StyleSheet');
var View = require('View');
var { Text } = require('F8Text');
var Platform = require('Platform');
var PureListView = require('./PureListView');
var Image = require('Image');
var TouchableOpacity = require('TouchableOpacity');
var shallowEqual = require('fbjs/lib/shallowEqual');

import type {Data} from './PureListView';
import type {Props as HeaderProps, Item as HeaderItem} from 'F8Header';

type Props = {
  title: string;
  leftItem?: HeaderItem;
  rightItem?: HeaderItem;
  extraItems?: Array<HeaderItem>;
  image: ?ReactElement;
  colors: Array<string>;
  curve: number;
  backgroundImage: number;
  backgroundShift: number;
  backgroundColor: string;
  renderRow?: ?Function;
  renderSectionHeader: ?Function;
  renderSeparator: ?Function;
  renderStickyHeader?: ?Function;
  renderEmptyList?: ?Function;
  leftItem: ?ReactElement;
  onLeftItemPress: ?() => void;
  rightItem: string | ReactElement;
  onRightItemPress: ?() => void;
  parallaxContent: ?ReactElement;
  data: Data;
  children: any;
};

const EMPTY_CELL_HEIGHT = Dimensions.get('window').height > 600 ? 200 : 150;

class ListContainer extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = {
      anim: new Animated.Value(0),
      stickyHeaderHeight: 0,
    };

    this.renderFakeHeader = this.renderFakeHeader.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleStickyHeaderLayout = this.handleStickyHeaderLayout.bind(this);
    this.handleShowMenu = this.handleShowMenu.bind(this);
  }

  render() {
    var stickyHeader = this.props.renderStickyHeader
      && this.props.renderStickyHeader();
    var leftItem = this.props.leftItem;
    if (!leftItem && Platform.OS === 'android') {
      leftItem = {
        title: 'Menu',
        icon: require('./img/hamburger.png'),
        onPress: this.handleShowMenu,
      };
    }
    return (
      <View style={styles.container}>
        <ParallaxBackground
          minHeight={this.state.stickyHeaderHeight + F8Header.height}
          maxHeight={EMPTY_CELL_HEIGHT + this.state.stickyHeaderHeight + F8Header.height}
          offset={this.state.anim}
          backgroundImage={this.props.backgroundImage}
          backgroundShift={this.props.backgroundShift}
          backgroundColor={this.props.backgroundColor}>
          {this.renderParallaxContent()}
        </ParallaxBackground>
        <F8Header
          title={this.props.title}
          leftItem={leftItem}
          rightItem={this.props.rightItem}
          extraItems={this.props.extraItems}>
          {this.renderHeaderTitle()}
        </F8Header>
        {
          Platform.OS === 'ios'
          ? <View style={{height: this.state.stickyHeaderHeight}} />
          : stickyHeader
        }
        <PureListView
          data={this.props.data}
          renderEmptyList={this.props.renderEmptyList}
          style={styles.listView}
          onScroll={this.handleScroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentInset={{bottom: 49, top: 0}}
          automaticallyAdjustContentInsets={false}
          renderRow={this.props.renderRow}
          renderSectionHeader={this.props.renderSectionHeader}
          renderSeparator={this.props.renderSeparator}
          renderHeader={this.renderFakeHeader}
          renderFooter={this.renderFooter}
        />
        {Platform.OS === 'ios' && this.renderStickyHeader(stickyHeader)}
      </View>
    );
  }

  renderParallaxContent() {
    if (Platform.OS === 'android') {
      return <View />;
    }
    if (this.props.parallaxContent) {
      return this.props.parallaxContent;
    }
    return (
      <Text style={styles.parallaxText}>
        {this.props.title}
      </Text>
    );
  }

  renderHeaderTitle() {
    if (Platform.OS === 'android') {
      return null;
    }
    var transform;
    if (!this.props.parallaxContent) {
      var distance = EMPTY_CELL_HEIGHT - this.state.stickyHeaderHeight;
      transform = {
        opacity: this.state.anim.interpolate({
          inputRange: [distance - 20, distance],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      };
    }
    return (
      <Animated.Text style={[styles.headerTitle, transform]}>
        {this.props.title}
      </Animated.Text>
    );
  }

  handleScroll(e: any) {
    if (Platform.OS === 'ios') {
      this.state.anim.setValue(e.nativeEvent.contentOffset.y);
    }
  }

  renderFakeHeader() {
    if (Platform.OS === 'ios') {
      const height = EMPTY_CELL_HEIGHT - this.state.stickyHeaderHeight;
      return (
        <View style={{height}} />
      );
    }
  }

  renderFooter(): ?ReactElement {
    if (React.Children.count(this.props.children) > 0) {
      return this.props.children;
    }
  }

  renderStickyHeader(stickyHeader: ?ReactElement) {
    if (!stickyHeader) {
      return;
    }
    // Potential scrolling perf optimization - put the sticky header into
    // the scrollview
    var distance = EMPTY_CELL_HEIGHT - this.state.stickyHeaderHeight;
    var translateY = this.state.anim.interpolate({
      inputRange: [0, distance],
      outputRange: [distance, 0],
      extrapolateRight: 'clamp',
    });
    return (
      <Animated.View
        onLayout={this.handleStickyHeaderLayout}
        style={[styles.stickyHeader, {transform: [{translateY}]}]}>
        {stickyHeader}
      </Animated.View>
    );
  }

  handleStickyHeaderLayout({nativeEvent: { layout }}: any) {
    this.setState({stickyHeaderHeight: layout.height});
  }

  handleShowMenu() {
    this.context.openDrawer();
  }
}

ListContainer.defaultProps = {
  renderRow: () => null,
  renderSeparator: (sectionID, rowID) => <View style={styles.separator} key={rowID} />,
};

ListContainer.contextTypes = {
  openDrawer: React.PropTypes.func,
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listView: {
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  parallaxText: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  stickyHeader: {
    position: 'absolute',
    top: F8Header.height,
    left: 0,
    right: 0,
  },
  separator: {
    backgroundColor: '#eeeeee',
    height: 1,
  },
});

module.exports = ListContainer;
