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
var F8Colors = require('F8Colors');
var F8Button = require('F8Button');
var F8SegmentedControl = require('F8SegmentedControl');
var F8SessionCell = require('F8SessionCell');
var FilterSessions = require('./filterSessions');
var FriendCell = require('./FriendCell');
var Image = require('Image');
var ListContainer = require('ListContainer');
var LoginButton = require('../../common/LoginButton');
var Navigator = require('Navigator');
var Platform = require('Platform');
var ProfilePicture = require('../../common/ProfilePicture');
var React = require('React');
var SessionsSectionHeader = require('./SessionsSectionHeader');
var StyleSheet = require('StyleSheet');
var { Text } = require('F8Text');
var TouchableHighlight = require('TouchableHighlight');
var View = require('View');
var InviteFriendsButton = require('./InviteFriendsButton');
var groupSessions = require('./groupSessions');

var { connect } = require('react-redux');

var {
  logOutWithPrompt,
  switchTab,
  switchDay,
  loadFriendsSchedules,
} = require('../../actions');

import type {Session} from '../../reducers/sessions';
import type {State as User} from '../../reducers/user';
import type {State as Schedule} from '../../reducers/schedule';
import type {SessionsListData} from './groupSessions';

const PAGE_FRIENDS = 2;

var { createSelector } = require('reselect');

const data = createSelector(
  (store) => store.sessions,
  (store) => store.schedule,
  (store) => store.friendsSchedules,
  (sessions, schedule, friends) => {
    const sessionsInSchedule = FilterSessions.bySchedule(sessions, schedule);
    return {
      'Day 1': groupSessions(FilterSessions.byDay(sessionsInSchedule, 1)),
      'Day 2': groupSessions(FilterSessions.byDay(sessionsInSchedule, 2)),
      'Friends': groupFriends(friends),
    };
  }
);

type Props = {
  user: User;
  sessions: Array<Session>;
  schedule: Schedule;
  navigator: Navigator;
  logOut: () => void;
  jumpToSchedule: (day: number) => void;
  loadFriendsSchedules: () => void;
  data: SessionsListData;
};

// TODO: Rename to MyF8View
class MyScheduleView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

    this.state = { page: 0 };

    // this.renderStickyHeader = this.renderStickyHeader.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderEmptyList = this.renderEmptyList.bind(this);
    this.openSession = this.openSession.bind(this);
    this.openSharingSettings = this.openSharingSettings.bind(this);
    this.selectDay = this.selectDay.bind(this);
  }

  render() {
    var rightItem;
    if (this.props.user.isLoggedIn) {
      rightItem = {
        title: 'Settings',
        icon: require('./img/settings.png'),
        onPress: this.openSharingSettings,
      };
    }

    const profilePicture = this.props.user.isLoggedIn &&
      <ProfilePicture userID={this.props.user.id} size={100} />;

    return (
      <ListContainer
        title="My F8"
        parallaxContent={profilePicture}
        backgroundImage={require('./img/my-f8-background.png')}
        backgroundShift={this.state.page / 2}
        backgroundColor={'#A8D769'}
        data={this.props.data}
        renderStickyHeader={this.renderStickyHeader}
        renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderRow}
        renderEmptyList={this.renderEmptyList}
        rightItem={rightItem}
      />
    );
  }

  renderEmptyList() {
    if (!this.props.user.isLoggedIn) {
      return (
        <EmptySchedule
          key="login"
          title="Log in to make a schedule."
          text="You’ll be able to save sessions to your schedule to view or share later.">
          <LoginButton source="My F8" />
        </EmptySchedule>
      );
    }

    if (this.state.page === PAGE_FRIENDS) {
      return (
        <EmptySchedule
          key="friends"
          image={require('./img/no-friends-found.png')}
          text={'Friends using the F8 app\nwill appear here.'}>
          <InviteFriendsButton />
        </EmptySchedule>
      );
    }

    var day = this.state.page + 1;
    return (
      <EmptySchedule
        key="schedule"
        image={require('./img/no-sessions-added.png')}
        text={'Sessions you save will\nappear here.'}>
        <F8Button
          caption={`See the day ${day} schedule`}
          onPress={() => this.props.jumpToSchedule(day)}
        />
      </EmptySchedule>
    );
  }

  // renderStickyHeader() {
  //   if (!this.props.user.isLoggedIn) {
  //     return null;
  //   }
  //   return (
  //     <F8SegmentedControl
  //       values={['Day 1', 'Day 2', 'Friends']}
  //       selectedIndex={this.state.page}
  //       selectionColor="white"
  //       onChange={this.selectDay}
  //     />
  //   );
  // }

  renderSectionHeader(sectionData, sectionID) {
    return <SessionsSectionHeader title={sectionID} />;
  }

  renderRow(all, row) {
    if (row === 'invite') {
      return <InviteFriendsButton style={styles.inviteFriendsButton} />;
    }
    if (row.schedule) {
      return (
        <FriendCell
          friend={row}
          onPress={() => this.props.navigator.push({friend: row})}
        />
      );
    }
    return (
      <F8SessionCell
        onPress={() => this.openSession(row, all)}
        session={row}
      />
    );
  }

  openSession(session, allSessions) {
    this.props.navigator.push({
      session,
      day: this.state.page + 1,
      allSessions,
    });
  }

  openSharingSettings() {
    this.props.navigator.push({shareSettings: 1});
  }

  selectDay(page) {
    if (this.state.page === page) {
      return;
    }
    this.setState({page});
    if (page === PAGE_FRIENDS) {
      this.props.loadFriendsSchedules();
    }
  }
}

function select(store) {
  return {
    user: store.user,
    data: data(store),
    sessions: store.sessions,
    schedule: store.schedule,
    friends: store.friendsSchedules,
  };
}

function actions(dispatch) {
  return {
    logOut: () => dispatch(logOutWithPrompt()),
    jumpToSchedule: (day) => dispatch([
      switchTab('schedule'),
      switchDay(day),
    ]),
    loadFriendsSchedules: () => dispatch(loadFriendsSchedules()),
  };
}

function groupFriends(friends) {
  const data = {};
  friends.forEach((friend) => {
    if (Object.keys(friend.schedule).length > 0) {
      data[friend.id] = friend;
    }
  });
  if (friends.length > 0) {
    data['invite'] = 'invite';
  }
  return {
    "See a friend's schedule": data,
  };
}

var styles = StyleSheet.create({
  inviteFriendsButton: {
    margin: 10,
    alignSelf: 'center',
  }
});

module.exports = connect(select, actions)(MyScheduleView);
