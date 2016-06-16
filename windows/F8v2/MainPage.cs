using BV.LinearGradient;
using Cl.Json.Share;
using CodePush.ReactNative;
using FacebookSDK;
using ReactNative;
using ReactNative.Bridge;
using ReactNative.Modules.Core;
using ReactNative.Shell;
using ReactNative.UIManager;
using System;
using System.Collections.Generic;
using Windows.Security.Authentication.Web;

namespace F8v2
{
    class MainPage : ReactPage
    {
        private CodePushReactPackage codePush;

        public override string MainComponentName
        {
            get
            {
                return "F8v2";
            }
        }

        private CodePushReactPackage CodePushInstance
        {
            get
            {
                if (codePush == null)
                {
                    codePush = new CodePushReactPackage("deployment-key-here", this);
                }

                return codePush;
            }
        }

#if BUNDLE
        public override string JavaScriptBundleFile
        {
            get
            {
                return CodePushInstance.GetJavaScriptBundleFile();
            }
        }
#endif

        public override List<IReactPackage> Packages
        {
            get
            {
                return new List<IReactPackage>
                {
                    new MainReactPackage(),
                    new F8Package(),
                    new LinearGradientPackage(),
                    new SharePackage(),
                    CodePushInstance,
                };
            }
        }

        public override bool UseDeveloperSupport
        {
            get
            {
                return true;
            }
        }

        private class F8Package : IReactPackage
        {
#if !PRODFBAPP
            private const string F8AppID = "100794426989995";
            private const string WinAppID = "s-1-15-2-1021559226-2231154958-934963822-372647946-3828823154-3101400036-3758457008";
#else
            private const string F8AppID = "619048868222429";
            private const string WinAppID = "s-1-15-2-1021559226-2231154958-934963822-372647946-3828823154-3101400036-3758457008";
#endif

            public IReadOnlyList<Type> CreateJavaScriptModulesConfig()
            {
                return new List<Type>(0);
            }

            public IReadOnlyList<INativeModule> CreateNativeModules(ReactContext reactContext)
            {
                return new List<INativeModule>
                {
                    new FBSDKModule(reactContext, F8AppID, WinAppID),
                };
            }

            public IReadOnlyList<IViewManager> CreateViewManagers(ReactContext reactContext)
            {
                return new List<IViewManager>(0);
            }
        }
    }
}
