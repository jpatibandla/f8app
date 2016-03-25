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

var EmptySchedule = require('./EmptySchedule');
var F8SegmentedControl = require('F8SegmentedControl');
var F8SessionCell = require('F8SessionCell');
var FilterHeader = require('./FilterHeader');
var FilterSessions = require('./filterSessions');
var ListContainer = require('ListContainer');
var Navigator = require('Navigator');
var React = require('React');
var SessionsSectionHeader = require('./SessionsSectionHeader');
var View = require('View');
var Platform = require('Platform');
var F8DrawerLayout = require('F8DrawerLayout');
var PureListView = require('../../common/PureListView');
var FilterScreen = require('../../filter/FilterScreen');
var groupSessions = require('./groupSessions');

var { connect } = require('react-redux');
var {switchDay} = require('../../actions');

import type {Session} from '../../reducers/sessions';
import type {SessionsListData} from './groupSessions';

// TODO: Move from reselect to memoize?
var { createSelector } = require('reselect');

const data = createSelector(
  (store) => store.sessions,
  (store) => store.filter,
  (sessions, filter) => [
    groupSessions(FilterSessions.byDay(FilterSessions.byTopics(sessions, filter), 1)),
    groupSessions(FilterSessions.byDay(FilterSessions.byTopics(sessions, filter), 2)),
  ],
);

type Props = {
  filter: any;
  day: number;
  sessions: Array<Session>;
  navigator: Navigator;
  logOut: () => void;
  switchDay: (day: number) => void;
  data: Array<SessionsListData>;
};

class GeneralScheduleView extends React.Component {
  props: Props;
  _drawer: ?F8DrawerLayout;

  constructor(props) {
    super(props);

    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderEmptyList = this.renderEmptyList.bind(this);
    this.switchDay = this.switchDay.bind(this);
    this.openFilterScreen = this.openFilterScreen.bind(this);
    this.renderNavigationView = this.renderNavigationView.bind(this);
  }

  render() {
    const filterItem = {
      icon: require('../../common/img/filter.png'),
      title: 'Filter',
      onPress: this.openFilterScreen,
    };
    const filterHeader = Object.keys(this.props.filter).length > 0
      ? <FilterHeader />
      : null;
    const content = (
      <ListContainer
        title="Schedule"
        backgroundImage={require('./img/schedule-background.png')}
        backgroundShift={this.props.day - 1}
        backgroundColor={'#5597B8'}
        stickyHeader={filterHeader}
        rightItem={filterItem}>
        <PureListView
          title="Day 1"
          data={this.props.data[0]}
          renderRow={(row) => this.renderRow(row, 1)}
          renderEmptyList={() => this.renderEmptyList(1)}
          renderSectionHeader={this.renderSectionHeader}
        />
        <PureListView
          title="Day 2"
          data={this.props.data[1]}
          renderRow={(row) => this.renderRow(row, 2)}
          renderEmptyList={() => this.renderEmptyList(2)}
          renderSectionHeader={this.renderSectionHeader}
        />
      </ListContainer>
    );
    if (Platform.OS === 'ios') {
      return content;
    }
    return (
      <F8DrawerLayout
        ref={(drawer) => this._drawer = drawer}
        drawerWidth={300}
        drawerPosition="right"
        renderNavigationView={this.renderNavigationView}>
        {content}
      </F8DrawerLayout>
    );
  }

  renderNavigationView() {
    return <FilterScreen onClose={() => this._drawer && this._drawer.closeDrawer()} />;
  }

  renderEmptyList(day: number) {
    return (
      <EmptySchedule
        title={`No sessions on day ${day} match the filter`}
        text="Check the schedule for the other day or remove the filter."
      />
    );
  }

  renderSectionHeader(sectionData, sectionID) {
    return <SessionsSectionHeader title={sectionID} />;
  }

  renderRow(session, day) {
    return (
      <F8SessionCell
        onPress={() => this.props.navigator.push({
          day, session, allSessions: this.props.data[day - 1],
        })}
        session={session}
      />
    );
  }

  openFilterScreen() {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({ filter: 123 });
    } else {
      this._drawer && this._drawer.openDrawer();
    }
  }

  switchDay(page) {
    this.props.switchDay(page + 1);
  }
}

function select(store) {
  return {
    day: store.navigation.day,
    filter: store.filter,
    data: data(store),
  };
}

function actions(dispatch) {
  return {
    switchDay: (day) => dispatch(switchDay(day)),
  }
}

module.exports = connect(select, actions)(GeneralScheduleView);
