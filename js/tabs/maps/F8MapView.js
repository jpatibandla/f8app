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
 * @providesModule F8MapView
 * @flow
 */
'use strict';

var ActionSheetIOS = require('ActionSheetIOS');
var F8Button = require('F8Button');
var F8SegmentedControl = require('F8SegmentedControl');
var Linking = require('Linking');
var Platform = require('Platform');
var ListContainer = require('ListContainer');
var MapView = require('../../common/MapView');
var React = require('React');
var StyleSheet = require('F8StyleSheet');
var View = require('View');
var { connect } = require('react-redux');

var VENUE_ADDRESS = '2 Marina Blvd, San Francisco, CA 94123';

function select(store) {
  return {
    store,
    maps: {
      'Overview': {},
      'Developer Garage': {},
    }
  };
}

class F8MapView extends React.Component {
  constructor() {
    super();

    this.state = { page: 0 };

    this.handleGetDirections = this.handleGetDirections.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.renderStickyHeader = this.renderStickyHeader.bind(this);
    this.openMaps = this.openMaps.bind(this);
    this.renderEmptyList = this.renderEmptyList.bind(this);
  }

  render() {
    const directionsButton = this.state.page === 0 && (
      <F8Button
        type="secondary"
        icon={require('./img/directions.png')}
        caption="Directions to Fort Mason Center"
        onPress={this.handleGetDirections}
        style={styles.directionsButton}
      />
    );
    return (
      <View style={styles.container}>
        <ListContainer
          title="Maps"
          backgroundImage={require('./img/maps-background.png')}
          backgroundShift={this.state.page / 2}
          backgroundColor={'#9176D2'}
          data={this.props.maps}
          renderEmptyList={this.renderEmptyList}>
        </ListContainer>
        {directionsButton}
      </View>
    );
  }

  renderEmptyList(segment) {
    const map = this.props.store.maps.find((map) => map.name === segment);
    LOG('RENDER ' + segment, map);
    return <MapView map={map} />;
  }

  renderStickyHeader() {
    return (
      <F8SegmentedControl
        values={['Overview', 'Developer Garage']}
        selectedIndex={this.state.page}
        selectionColor="white"
        onChange={this.handlePageChange}
      />
    );
  }

  handlePageChange(page) {
    this.setState({page});
  }

  handleGetDirections() {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: VENUE_ADDRESS,
          options: ['Open in Apple Maps', 'Open in Google Maps', 'Cancel'],
          destructiveButtonIndex: -1,
          cancelButtonIndex: 2,
        },
        this.openMaps
      );
    } else if (Platform.OS === 'android') {
      var address = encodeURIComponent(VENUE_ADDRESS);
      Linking.openURL('http://maps.google.com/maps?&q=' + address);
    }
  }

  openMaps(option) {
    var address = encodeURIComponent(VENUE_ADDRESS);
    switch (option) {
      case 0:
        Linking.openURL('http://maps.apple.com/?q=' + address);
        break;

      case 1:
        var nativeGoogleUrl = 'comgooglemaps-x-callback://?q=' +
          address + '&x-success=f8://&x-source=F8';
        Linking.canOpenURL(
          nativeGoogleUrl,
          (supported) => {
            var url = supported ? nativeGoogleUrl : 'http://maps.google.com/?q=' + address;
            Linking.openURL(url);
          }
        );
        break;
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  directionsButton: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    ios: {
      bottom: 49,
    },
    android: {
      bottom: 0,
    },
  },
});

module.exports = connect(select)(F8MapView);
