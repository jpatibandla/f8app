#!/bin/bash

mkdir -p release/ios
rm -rf release/ios/*

# Increment value of version
awk '/version/ { $2++; print "  "$0","; next; } { print $0; }' \
  js/version.js > js/version.next.js
mv js/version.next.js js/version.js

react-native bundle \
--platform ios \
--entry-file index.ios.js \
--bundle-output ./release/ios/main.jsbundle \
--assets-dest ./release/ios \
--dev false

# code-push release F8-iOS release/ios 1.2.0
