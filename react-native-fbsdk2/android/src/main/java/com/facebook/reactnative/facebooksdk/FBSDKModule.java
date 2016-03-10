package com.facebook.reactnative.facebooksdk;

import android.app.Activity;
import android.app.Fragment;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookRequestError;
import com.facebook.FacebookSdk;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.HttpMethod;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class FBSDKModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static class ReactNativeFacebookCallback implements FacebookCallback<LoginResult> {
        private Promise mPromise;

        public ReactNativeFacebookCallback(Promise promise) {
            mPromise = promise;
        }

        @Override
        public void onSuccess(LoginResult loginResult) {
            if (mPromise != null) {
                mPromise.resolve(accessTokenToReactMap(loginResult.getAccessToken()));
                consume();
            }
        }

        @Override
        public void onCancel() {
            if (mPromise != null) {
                mPromise.resolve(null);
                consume();
            }
        }

        @Override
        public void onError(FacebookException error) {
            Log.e("FBSDKModule", "Error while logging in", error);
            if (mPromise != null) {
                mPromise.reject(error.getMessage());
                consume();
            }
        }

        private void consume() {
            mPromise = null;
        }
    }

    private final CallbackManager mCallbackManager = CallbackManager.Factory.create();

    private Activity mActivity;
    private Fragment mFragment;

    public FBSDKModule(Activity activity, ReactApplicationContext reactContext) {
        super(reactContext);
        mActivity = activity;
        init();
    }

    public FBSDKModule(Fragment fragment, ReactApplicationContext reactContext) {
        super(reactContext);
        mFragment = fragment;
        init();
    }

    private void init() {
        final ReactApplicationContext reactContext = getReactApplicationContext();
        reactContext.addActivityEventListener(this);
        FacebookSdk.sdkInitialize(reactContext.getApplicationContext());
    }

    @Override
    public String getName() {
        return "FBSDK";
    }

    @ReactMethod
    public void loginWithReadPermissions(ReadableArray permissions, Promise promise) {
        final LoginManager loginManager = LoginManager.getInstance();
        loginManager.registerCallback(mCallbackManager, new ReactNativeFacebookCallback(promise));
        if (mActivity != null) {
            loginManager.logInWithReadPermissions(mActivity, reactArrayToJavaStringCollection(permissions));
        } else if (mFragment != null) {
            loginManager.logInWithReadPermissions(mFragment, reactArrayToJavaStringCollection(permissions));
        }
    }

    @ReactMethod
    public void loginWithPublishPermissions(ReadableArray permissions, Promise promise) {
        final LoginManager loginManager = LoginManager.getInstance();
        loginManager.registerCallback(mCallbackManager, new ReactNativeFacebookCallback(promise));
        if (mActivity != null) {
            loginManager.logInWithPublishPermissions(mActivity, reactArrayToJavaStringCollection(permissions));
        } else if (mFragment != null) {
            loginManager.logInWithPublishPermissions(mFragment, reactArrayToJavaStringCollection(permissions));
        }
    }

    @ReactMethod
    public void makeGraphRequest(
            String path,
            ReadableMap params,
            String version,
            String method,
            final Promise promise) {
        final GraphRequest request = GraphRequest
                .newGraphPathRequest(AccessToken.getCurrentAccessToken(), path, new GraphRequest.Callback() {
                    @Override
                    public void onCompleted(GraphResponse response) {
                        final FacebookRequestError error = response.getError();
                        if (error != null) {
                            promise.reject(error.getErrorMessage());
                        } else {
                            promise.resolve(response.getRawResponse());
                        }
                    }
                });
        if (params != null) {
            request.setParameters(reactMapToBundle(params));
        }
        if (version != null) {
            request.setVersion(version);
        }
        if (method != null) {
            request.setHttpMethod(HttpMethod.valueOf(method));
        }
        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                request.executeAsync();
            }
        });
    }

    @ReactMethod
    public void logOut() {
        LoginManager.getInstance().logOut();
    }

    private static Collection<String> reactArrayToJavaStringCollection(ReadableArray array) {
        final Set<String> result = new HashSet<>();
        for (int i = 0; i < array.size(); i++) {
            result.add(array.getString(i));
        }
        return Collections.unmodifiableCollection(result);
    }

    private static WritableArray javaStringCollectionToReactArray(Collection<String> collection) {
        final WritableArray result = Arguments.createArray();
        for (String s: collection) {
            result.pushString(s);
        }
        return result;
    }

    private static WritableMap accessTokenToReactMap(AccessToken token) {
        WritableMap result = Arguments.createMap();
        result.putString("tokenString", token.getToken());
        result.putArray(
                "permissions",
                javaStringCollectionToReactArray(token.getPermissions()));
        result.putArray(
                "declinedPermissions",
                javaStringCollectionToReactArray(token.getDeclinedPermissions()));
        result.putString("appID", token.getApplicationId());
        result.putString("userID", token.getUserId());
        result.putDouble("expires", token.getExpires().getTime());
        result.putDouble("lastRefresh", token.getLastRefresh().getTime());
        return result;
    }

    private static Bundle reactMapToBundle(ReadableMap map) {
        final Bundle result = new Bundle();
        final ReadableMapKeySetIterator keyIterator = map.keySetIterator();
        while (keyIterator.hasNextKey()) {
            String key = keyIterator.nextKey();
            switch(map.getType(key)) {
                case String:
                    result.putString(key, map.getString(key));
                    break;
                case Number:
                    result.putDouble(key, map.getDouble(key));
                    break;
                case Boolean:
                    result.putBoolean(key, map.getBoolean(key));
                    break;
                default:
                    Log.w("FBSDKModule", "Cannot convert type " + map.getType(key));
                    break;
            }
        }
        return result;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }
}
