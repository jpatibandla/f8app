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

const React = require('react-native');
const StaticContainer = require('StaticContainer.react');

const {
  View,
  StyleSheet,
  ScrollView,
  ViewPagerAndroid,
  Platform,
} = React;

type Props = {
  count: number;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  renderCard: (index: number) => ReactElement;
};

class Carousel extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      selectedIndex: this.props.selectedIndex,
      initialSelectedIndex: this.props.selectedIndex,
    };
    this.handleHorizontalScroll = this.handleHorizontalScroll.bind(this);
    this.adjustCardSize = this.adjustCardSize.bind(this);
  }

  render() {
    if (Platform.OS === 'ios') {
      return this.renderIOS();
    } else {
      return this.renderAndroid();
    }
  }

  renderIOS() {
    return (
      <ScrollView
        ref="scrollview"
        contentOffset={{
          x: this.state.width * this.state.initialSelectedIndex,
          y: 0,
        }}
        style={styles.scrollview}
        horizontal={true}
        pagingEnabled={true}
        scrollsToTop={false}
        onScroll={this.handleHorizontalScroll}
        scrollEventThrottle={100}
        removeClippedSubviews={true}
        automaticallyAdjustContentInsets={false}
        directionalLockEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onLayout={this.adjustCardSize}>
        {this.renderCards()}
      </ScrollView>
    );
  }

  renderAndroid() {
    return (
      <ViewPagerAndroid
        ref="scrollview"
        initialPage={this.state.initialSelectedIndex}
        onPageSelected={this.handleHorizontalScroll}
        style={styles.container}>
        {this.renderCards()}
      </ViewPagerAndroid>
    );
  }

  adjustCardSize(e: any) {
    this.setState({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.selectedIndex !== this.state.selectedIndex) {
      if (Platform.OS === 'ios') {
        this.refs.scrollview.scrollTo(0, nextProps.selectedIndex * this.state.width);
      } else {
        this.refs.scrollview.setPage(nextProps.selectedIndex);
      }
    }
  }

  renderCards(): Array<ReactElement> {
    // TODO: Optimization - use absolutely positioned cards instead
    // of rendering placeholder views. Another one is to rotate keys
    // and force React to recycle views
    var {width, height} = this.state;
    var cards = [];
    for (var i = 0; i < this.props.count; i++) {
      var content = null;
      if (Math.abs(i - this.props.selectedIndex) < 2) {
        content = (
          <StaticContainer>
            {this.props.renderCard(i)}
          </StaticContainer>
        );
      }
      var style = Platform.OS === 'ios' && styles.card;
      cards.push(
        <View style={[style, {width, height}]} key={'r_' + i}>
          {content}
        </View>
      );
    }
    return cards;
  }

  handleHorizontalScroll(e: any) {
    var selectedIndex = e.nativeEvent.position;
    if (selectedIndex === undefined) {
      selectedIndex = Math.round(
        e.nativeEvent.contentOffset.x / this.state.width,
      );
    }
    if (this.props.selectedIndex !== selectedIndex) {
      this.setState({selectedIndex});
      this.props.onSelectedIndexChange(selectedIndex)
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  close: {
    position: 'absolute',
    padding: 10,
    top: 10,
    left: 0,
  },
  scrollview: {
    flex: 1,
    margin: 10,
    overflow: 'visible',
    backgroundColor: 'black',
  },
  card: {
    paddingHorizontal: 3,
    backgroundColor: 'transparent',
  }
});

module.exports = Carousel;
