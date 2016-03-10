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
const {
  Text,
  Image,
  View,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  TouchableOpacity,
} = React;
const Header = require('./Header');
const RatingQuestion = require('./RatingQuestion');
const RatingCard = require('./RatingCard');
const F8Button = require('F8Button');
const Carousel = require('../common/Carousel');
const F8PageControl = require('F8PageControl');
const F8CloseIcon = require('F8CloseIcon');
const { connect } = require('react-redux');
const { submitSurveyAnswers } = require('../actions');

import type {Survey} from '../reducers/surveys';
import type {Session} from '../reducers/sessions';
import type {Dispatch} from '../actions/types';

type Props = {
  sessions: Array<Session>;
  surveys: Array<Survey>;
  navigator: any;
  dispatch: Dispatch;
};

class RatingScreen extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };

    this.handleIndexChange = this.handleIndexChange.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.dismiss = this.dismiss.bind(this);
  }

  render() {
    const {surveys} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.close} onPress={this.dismiss}>
            <F8CloseIcon />
          </TouchableOpacity>
          <Text style={styles.title}>
            {surveys.length > 1
              ? 'Review these sessions'
              : 'Review this session'
            }
          </Text>
          <F8PageControl
            count={surveys.length}
            selectedIndex={this.state.selectedIndex}
          />
        </View>
        <Carousel
          count={surveys.length}
          selectedIndex={this.state.selectedIndex}
          onSelectedIndexChange={this.handleIndexChange}
          renderCard={this.renderCard}
        />
      </View>
    );
  }

  renderCard(index: number): ReactElement {
    const survey = this.props.surveys[index];
    const session = this.props.sessions.find((s) => s.id === survey.sessionId);
    return (
      <RatingCard
        session={session}
        questions={survey.questions}
        onSubmit={(answers) => this.submitAnswers(index, answers)}
      />
    );
  }

  submitAnswers(index: number, answers: Array<number>) {
    const survey = this.props.surveys[index];
    this.props.dispatch(submitSurveyAnswers(survey.id, answers)).then(
      () => this.proceedToPage(index + 1)
    );
  }

  proceedToPage(index: number) {
    if (index < this.props.surveys.length) {
      this.setState({selectedIndex: index});
    } else {
      this.props.navigator.pop();
    }
  }

  handleIndexChange(selectedIndex: number) {
    this.setState({ selectedIndex });
  }

  dismiss() {
    this.props.navigator.pop();
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 45,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  close: {
    position: 'absolute',
    padding: 10,
    top: 10,
    left: 0,
  },
});

function select(store) {
  return {
    sessions: store.sessions,
  };
}

module.exports = connect(select)(RatingScreen);
