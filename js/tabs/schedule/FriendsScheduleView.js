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

var F8SegmentedControl = require('F8SegmentedControl');
var F8SessionCell = require('F8SessionCell');
var Image = require('Image');
var Navigator = require('Navigator');
var ProfilePicture = require('../../common/ProfilePicture');
var React = require('React');
var EmptySchedule = require('./EmptySchedule');
var FilterSessions = require('./filterSessions');
var ListContainer = require('ListContainer');
var groupSessions = require('./groupSessions');
var SessionsSectionHeader = require('./SessionsSectionHeader');

var { connect } = require('react-redux');


import type {Session} from '../../reducers/sessions';
import type {FriendsSchedule} from '../../reducers/friendsSchedules';
import type {SessionsListData} from './groupSessions';

var { createSelector } = require('reselect');

const data = createSelector(
  (store) => store.sessions,
  (store, props) => props.friend.schedule,
  (sessions, schedule) => {
    const sessionsInSchedule = FilterSessions.bySchedule(sessions, schedule);
    return [
      groupSessions(FilterSessions.byDay(sessionsInSchedule, 1)),
      groupSessions(FilterSessions.byDay(sessionsInSchedule, 2)),
    ];
  }
);

type Props = {
  sessions: Array<Session>;
  friend: FriendsSchedule;
  navigator: Navigator;
  data: Array<SessionsListData>;
};

class FriendsScheduleView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

    this.state = { page: 0 };

    this.renderStickyHeader = this.renderStickyHeader.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderEmptyList = this.renderEmptyList.bind(this);
    this.openSession = this.openSession.bind(this);
    this.selectDay = this.selectDay.bind(this);
  }

  render() {
    const firstName = this.props.friend.name.split(' ')[0];
    return (
      <ListContainer
        title={`${firstName}'s Schedule`}
        parallaxContent={<ProfilePicture userID={this.props.friend.id} size={100} />}
        backgroundImage={require('./img/schedule-background.png')}
        backgroundShift={this.state.page}
        backgroundColor={'#A8D769'}
        data={this.props.data[this.state.page]}
        renderStickyHeader={this.renderStickyHeader}
        renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderRow}
        renderEmptyList={this.renderEmptyList}
        leftItem={{
          icon: require('../../common/img/back_white.png'),
          onPress: () => this.props.navigator.pop(),
        }}
      />
    );
  }

  renderEmptyList() {
    return (
      <EmptySchedule
        title="Nothing to show."
        text={`${this.props.friend.name} has not added any sessions for day ${this.state.page + 1}`}
      />
    );
  }

  renderStickyHeader() {
    return (
      <F8SegmentedControl
        values={['Day 1', 'Day 2']}
        selectedIndex={this.state.page}
        selectionColor="white"
        onChange={this.selectDay}
      />
    );
  }

  renderSectionHeader(sectionData, sectionID) {
    return <SessionsSectionHeader title={sectionID} />;
  }

  renderRow(session) {
    var route = {
      day: this.state.page + 1,
      session: session,
      allSessions: this.props.data[this.state.page],
    };
    return (
      <F8SessionCell
        onPress={() => this.openSession(route)}
        session={session}
      />
    );
  }

  openSession(route) {
    this.props.navigator.push(route);
  }

  selectDay(page) {
    this.setState({page});
  }
}

function select(store, props) {
  return {
    data: data(store, props),
  };
}

module.exports = connect(select)(FriendsScheduleView);
