
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
 * @providesModule F8SplitView
 */
'use strict';

var React = require('React');
var SplitViewWindows = require('SplitViewWindows');

class F8SplitView extends React.Component {
  _splitView: ?SplitViewWindows;

  constructor(props: any, context: any) {
    super(props, context);

    this.openPane = this.openPane.bind(this);
    this.closePane = this.closePane.bind(this);
    this.onPaneOpen = this.onPaneOpen.bind(this);
    this.onPaneClose = this.onPaneClose.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  render() {
    const {panePosition, ...props} = this.props;
    const {Right, Left} = SplitViewWindows.positions;
    return (
      <SplitViewWindows
        ref={(splitView) => this._splitView = splitView}
        {...props}
        panePosition={panePosition === 'right' ? Right : Left}
        onPaneOpen={this.onPaneOpen}
        onPaneClose={this.onPaneClose}
      />
    );
  }

  componentWillUnmount() {
    this.context.removeBackButtonListener(this.closePane);
    this._splitView = null;
  }

  handleBackButton(): boolean {
    this.closePane();
    return true;
  }

  onPaneOpen() {
    this.context.addBackButtonListener(this.handleBackButton);
    this.props.onPaneOpen && this.props.onPaneOpen();
  }

  onPaneClose() {
    this.context.removeBackButtonListener(this.handleBackButton);
    this.props.onPaneClose && this.props.onPaneClose();
  }

  closePane() {
    this._splitView && this._splitView.closePane();
  }

  openPane() {
    this._splitView && this._splitView.openPane();
  }
}

F8SplitView.contextTypes = {
  addBackButtonListener: React.PropTypes.func,
  removeBackButtonListener: React.PropTypes.func,
};

module.exports = F8SplitView;
