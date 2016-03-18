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

var ListView = require('ListView');
var Dimensions = require('Dimensions');
var React = require('React');
var View = require('View');
var shallowEqual = require('fbjs/lib/shallowEqual');

type Rows = Array<Object>;
type RowsAndSections = {
  [sectionID: string]: Object;
};

export type Data = Rows | RowsAndSections;
type RenderElement = () => ?ReactElement;

type Props = {
  data: ?Data;
  renderEmptyList?: ?RenderElement;
  minContentHeight: ?number;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

class PureListView extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
    let dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sid, rid) => dataBlob[sid][rid],
      getSectionHeaderData: (dataBlob, sid) => dataBlob[sid],
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource: cloneWithData(dataSource, props.data),
    };

    this.renderFooter = this.renderFooter.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        dataSource: cloneWithData(this.state.dataSource, nextProps.data),
      });
    }
  }

  render() {
    // contentContainerStyle={{minHeight: SCREEN_HEIGHT}}
    return (
      <ListView
        {...this.props}
        ref="listview"
        dataSource={this.state.dataSource}
        renderFooter={this.renderFooter}
      />
    );
  }

  scrollTo(...args) {
    this.refs.listview.scrollTo(...args);
  }

  renderFooter() {
    const footer = this.props.renderFooter && this.props.renderFooter();

    let emptyListView;
    if (this.state.dataSource.getRowCount() === 0) {
      emptyListView = this.props.renderEmptyList && this.props.renderEmptyList();
    }

    return (
      <View>
        {emptyListView}
        {footer}
      </View>
    );
  }
}

function cloneWithData(dataSource: ListView.DataSource, data: ?Data) {
  if (!data) {
    return dataSource.cloneWithRows([]);
  }
  if (Array.isArray(data)) {
    return dataSource.cloneWithRows(data);
  }
  return dataSource.cloneWithRowsAndSections(data);
}

module.exports = PureListView;
