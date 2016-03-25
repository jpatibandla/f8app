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
 * @providesModule F8InfoView
 * @flow
 */
'use strict';

var CommonQuestions = require('./CommonQuestions');
var LinksList = require('./LinksList');
var React = require('React');
var ListContainer = require('ListContainer');
var WiFiDetails = require('./WiFiDetails');

var { connect } = require('react-redux');

const POLICIES_LINKS = [{
  title: 'Terms of Service',
  url: 'https://m.facebook.com/terms?_rdr',
}, {
  title: 'Data Policy',
  url: 'https://m.facebook.com/policies?_rdr',
}, {
  title: 'Code of Conduct',
  url: 'https://www.fbf8.com/code-of-conduct',
}]

class F8InfoView extends React.Component {
  render() {
    var pages = this.props.pages.map(({title, logo, alias}) => ({
      icon: logo || `https://graph.facebook.com/${alias}/picture?type=large`,
      title: title,
      url: `https://www.facebook.com/${alias}`,
    }));
    return (
      <ListContainer
        title="Information"
        data={{}}
        backgroundImage={require('./img/info-background.png')}
        backgroundColor={'#47BFBF'}>
        <WiFiDetails
          network={this.props.config.wifiNetwork}
          password={this.props.config.wifiPassword}
        />
        <CommonQuestions faqs={this.props.faqs} />
        <LinksList title="Facebook pages" links={pages} />
        <LinksList title="Facebook policies" links={POLICIES_LINKS} />
      </ListContainer>
    );
  }
}

function select(store) {
  return {
    config: store.config,
    faqs: store.faqs,
    pages: store.pages,
  };
}

module.exports = connect(select)(F8InfoView);
