/* @flow */

'use strict';

const NativeSDK = require('react-native').NativeModules.FBSDK;

export type GraphMethod = 'GET' | 'POST' | 'DELETE';

class FBSDK {
  static async loginWithReadPermissions(permissions: Array<string>) {
    return NativeSDK.loginWithReadPermissions(permissions);
  }
  static async loginWithPublishPermissions(permissions: Array<string>) {
    return NativeSDK.loginWithPublishPermissions(permissions);
  }
  static async makeGraphRequest(path: string, params: ?object, version: ?string, method: ?GraphMethod) {
    return NativeSDK.makeGraphRequest(path, params, version, method);
  }
  static logOut() {
    NativeSDK.logOut();
  }
}

module.exports = FBSDK;