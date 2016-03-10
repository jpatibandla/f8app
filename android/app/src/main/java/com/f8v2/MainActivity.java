package com.f8v2;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.reactnative.facebooksdk.FBSDKModule;

import android.content.Intent;

import java.util.Collections;
import java.util.Arrays;
import java.util.List;

import com.BV.LinearGradient.LinearGradientPackage;
import com.microsoft.codepush.react.CodePush;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

public class MainActivity extends ReactActivity {
  private CodePush _codePush;
  private ReactNativePushNotificationPackage _pushNotification;

  private class F8Package implements ReactPackage {
      @Override
      public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
          return Collections.<NativeModule>
                  singletonList(new FBSDKModule(MainActivity.this, reactContext));
      }

      @Override
      public List<Class<? extends JavaScriptModule>> createJSModules() {
          return Collections.emptyList();
      }

      @Override
      public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
          return Collections.emptyList();
      }
  }

    @Override
    protected String getJSBundleFile() {
        return this._codePush.getBundleUrl("index.android.bundle");
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "F8v2";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

   /**
   * A list of packages used by the app. If the app uses additional views
   * or modules besides the default ones, add more packages here.
   */
    @Override
    protected List<ReactPackage> getPackages() {
      this._codePush = new CodePush("qwfkzzq7Y8cSrkiuU7aRCkIP7XYLEJ6b-AFoe", this, BuildConfig.DEBUG);
      this._pushNotification = new ReactNativePushNotificationPackage(this);

      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new F8Package(),
        new LinearGradientPackage(),
        this._codePush.getReactPackage(),
        this._pushNotification
      );
    }

    @Override
   protected void onNewIntent (Intent intent) {
     super.onNewIntent(intent);
     _pushNotification.newIntent(intent);
   }
}
