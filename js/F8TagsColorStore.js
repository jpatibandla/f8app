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
 * @providesModule F8TagColorStore
 * @flow
 */
'use strict';

var _tagsColors = {
  'Media and Publishers': 'black',
  'Commerce': 'black',
  'Messenger': 'black',
  'Emerging Markets': 'black',
  'Oculus': 'black',
  'Engineering & Open Source': 'black',
  'Ads': 'black',
  'Growth & Monetization': 'black',
  'Facebook Integrations': 'black',
  'WhatsApp': 'black',
  'Design': 'black',
  'Instagram': 'black',
  'Games': 'black',
  'Research': 'black',
};


function colorForTag(tag: string): string {
  var color = _tagsColors[tag];
  if (!color) {
    console.warn('Tag "' + tag + '" has no color');
    color = 'black';
  }
  return color;
}


var F8TagColorStore = { colorForTag };

module.exports = F8TagColorStore;
