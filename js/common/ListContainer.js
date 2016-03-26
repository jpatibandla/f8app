
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
var F8Header = require('F8Header');
var F8SegmentedControl = require('F8SegmentedControl');
var ParallaxBackground = require('ParallaxBackground');
var React = require('React');
var StyleSheet = require('F8StyleSheet');
var View = require('View');
var { Text } = require('F8Text');
var ViewPager = require('./ViewPager');
var Image = require('Image');
var Platform = require('Platform');
var PureListView = require('./PureListView');
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
  selectedSectionColor: string;
  curve: number;
  backgroundImage: number;
  backgroundShift: number;
  backgroundColor: string;
  renderRow?: ?Function;
  renderSectionHeader: ?Function;
  renderSeparator: ?Function;
  renderFloatingStickyHeader?: ?Function;
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
  _refs: Array<any>;

  constructor(props: Props) {
    super(props);

    this.state = {
      idx: 0,
      anim: new Animated.Value(0),
      stickyHeaderHeight: 0,
    };

    this.renderFakeHeader = this.renderFakeHeader.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.handleStickyHeaderLayout = this.handleStickyHeaderLayout.bind(this);
    this.handleShowMenu = this.handleShowMenu.bind(this);
    this._refs = [];
  }

  render() {
    var leftItem = this.props.leftItem;
    if (!leftItem && Platform.OS === 'android') {
      leftItem = {
        title: 'Menu',
        icon: require('./img/hamburger.png'),
        onPress: this.handleShowMenu,
      };
    }


    const segments = [];
    const content = React.Children.map(this.props.children, (child, idx) => {
      segments.push(child.props.title);
      return React.cloneElement(child, {
        ref: (ref) => this._refs[idx] = ref,
        onScroll: (e) => this.handleScroll(idx, e),
        style: styles.listView,
        showsVerticalScrollIndicator: false,
        scrollEventThrottle: 16,
        contentInset: {bottom: 49, top: 0},
        automaticallyAdjustContentInsets: false,
        renderHeader: this.renderFakeHeader,
        scrollsToTop: idx === this.state.idx,
        renderSeparator: (sectionID, rowID) => <View style={styles.separator} key={rowID} />,
      });
    });

    let {stickyHeader} = this.props;
    if (segments.length > 1) {
      // TODO: {/*selectionColor="#51CDDA"*/}
      stickyHeader = (
        <View>
          <F8SegmentedControl
            values={segments}
            selectedIndex={this.state.idx}
            selectionColor={this.props.selectedSectionColor}
            onChange={(idx) => this.setState({idx})}
          />
          {stickyHeader}
        </View>
      );
    }
    // TODO: Bind to ViewPager animation
    const backgroundShift = segments.length === 1
      ? 0
      : this.state.idx / (segments.length - 1);

    return (
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <ParallaxBackground
            minHeight={this.state.stickyHeaderHeight + F8Header.height}
            maxHeight={EMPTY_CELL_HEIGHT + this.state.stickyHeaderHeight + F8Header.height}
            offset={this.state.anim}
            backgroundImage={this.props.backgroundImage}
            backgroundShift={backgroundShift}
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
          {this.renderFixedStickyHeader(stickyHeader)}
        </View>
        <ViewPager
          count={segments.length}
          selectedIndex={this.state.idx}
          onSelectedIndexChange={(idx) => { this.setState({idx}); }}>
          {content}
        </ViewPager>
        {this.renderFloatingStickyHeader(stickyHeader)}
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

  handleScroll(idx: number, e: any) {
    if (idx !== this.state.idx) {
      return;
    }
    if (Platform.OS === 'ios') {
      this.state.anim.setValue(e.nativeEvent.contentOffset.y);
    }
    const height = EMPTY_CELL_HEIGHT - this.state.stickyHeaderHeight;
    const y = Math.min(e.nativeEvent.contentOffset.y, height);
    this._refs.forEach((ref, ii) => {
      if (ii != idx && ref) {
        ref.scrollTo({y, animated: false });
      }
    });

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

  renderFixedStickyHeader(stickyHeader: ?ReactElement) {
    return Platform.OS === 'ios'
      ? <View style={{height: this.state.stickyHeaderHeight}} />
      : stickyHeader;
  }

  renderFloatingStickyHeader(stickyHeader: ?ReactElement) {
    if (!stickyHeader || Platform.OS !== 'ios') {
      return;
    }
    var opacity = this.state.stickyHeaderHeight === 0 ? 0 : 1;
    var distance = EMPTY_CELL_HEIGHT - this.state.stickyHeaderHeight;
    var translateY = this.state.anim.interpolate({
      inputRange: [0, distance],
      outputRange: [distance, 0],
      extrapolateRight: 'clamp',
    });
    return (
      <Animated.View
        onLayout={this.handleStickyHeaderLayout}
        style={[styles.stickyHeader, {opacity}, {transform: [{translateY}]}]}>
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
  selectedSectionColor: 'white',
};

ListContainer.contextTypes = {
  openDrawer: React.PropTypes.func,
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerWrapper: {
    android: {
      elevation: 2,
      backgroundColor: 'transparent',
      // FIXME: elevation doesn't seem to work without setting border
      borderRightWidth: 1,
      marginRight: -1,
      borderRightColor: 'transparent',
    }
  },
  listView: {
    ios: {
      backgroundColor: 'transparent',
    },
    android: {
      backgroundColor: 'white',
    }
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
