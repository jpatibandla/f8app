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

const Parse = require('parse/react-native');
const StatusBarIOS = require('StatusBarIOS');
const React = require('react-native');
const F8SessionDetails = require('F8SessionDetails');
const F8PageControl = require('F8PageControl');
const F8Header = require('F8Header');
const Platform = require('Platform');
const Carousel = require('../../common/Carousel');

const {connect} = require('react-redux');
const {loadFriendsSchedules} = require('../../actions');

const {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Navigator,
} = React;

import type {Session} from '../../reducers/sessions';

type Context = {
  rowIndex: number; // TODO: IndexWithinSection
  sectionLength: number;
  sectionTitle: string;
};

type Props = {
  allSessions: {[sectionID: string]: {[sessionID: string]: Session}};
  session: Session;
  navigator: Navigator;
};

class SessionsCarusel extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);

    var flatSessionsList = [];
    var contexts: Array<Context> = [];
    const allSessions = this.props.allSessions;

    // TODO: Add test
    for (let sectionID in allSessions) {
      const sectionLength = Object.keys(allSessions[sectionID]).length;
      let rowIndex = 0;
      for (let sessionID in allSessions[sectionID]) {
        const session = allSessions[sectionID][sessionID];
        flatSessionsList.push(session);
        contexts.push({
          rowIndex,
          sectionLength,
          sectionTitle: sectionID,
        });
        rowIndex++;
      }
    }

    this.state = {
      day: this.props.session.day,
      count: flatSessionsList.length,
      selectedIndex: flatSessionsList.indexOf(this.props.session),
      flatSessionsList,
      contexts,
    };
    this.dismiss = this.dismiss.bind(this);
    this.handleIndexChange = this.handleIndexChange.bind(this);
    this.renderCard = this.renderCard.bind(this);
  }

  render() {
    var {rowIndex, sectionLength, sectionTitle} = this.state.contexts[this.state.selectedIndex];
    return (
      <View style={styles.container}>
        <F8Header
          style={styles.header}
          leftItem={{
            layout: 'icon',
            title: 'Close',
            icon: require('../../common/img/x-white.png'),
            onPress: this.dismiss,
          }}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              <Text style={styles.day}>DAY {this.state.day}</Text>
              {'\n'}
              {sectionTitle}
            </Text>
            <F8PageControl
              count={sectionLength}
              selectedIndex={rowIndex}
            />
          </View>
        </F8Header>
        <Carousel
          count={this.state.count}
          selectedIndex={this.state.selectedIndex}
          onSelectedIndexChange={this.handleIndexChange}
          renderCard={this.renderCard}
        />
      </View>
    );
  }

  renderCard(index: number): ReactElement {
    return (
      <F8SessionDetails
        style={styles.card}
        navigator={this.props.navigator}
        session={this.state.flatSessionsList[index]}
      />
    );
  }

  componentDidMount() {
    this.track(this.state.selectedIndex);
    this.props.dispatch(loadFriendsSchedules())
  }

  dismiss() {
    this.props.navigator.pop();
  }

  handleIndexChange(selectedIndex: number) {
    this.track(selectedIndex);
    this.setState({ selectedIndex });
  }

  track(index: number) {
    Parse.Analytics.track('view', {
      id: this.state.flatSessionsList[index].id,
    });
  }
}

const platformStyles = {
  header: {
    android: {
      backgroundColor: '#5597B8',
    },
    ios: {},
  },
  headerContent: {
    android: {
      flex: 1,
    },
    ios: {
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  card: {
    android: {},
    ios: {
      borderRadius: 2,
    }
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    ...platformStyles.header[Platform.OS],
  },
  headerContent: {
    height: 65,
    ...platformStyles.headerContent[Platform.OS],
  },
  title: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  day: {
    fontWeight: 'bold',
  },
  card: {
    ...platformStyles.card[Platform.OS],
  },
  scrollview: {
    flex: 1,
    margin: 10,
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
});

module.exports = connect()(SessionsCarusel);
