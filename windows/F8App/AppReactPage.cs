using BV.LinearGradient;
using Cl.Json.Share;
using FacebookSDK;
using ReactNative;
using ReactNative.Bridge;
using ReactNative.Modules.Core;
using ReactNative.Shell;
using ReactNative.UIManager;
using System;
using System.Collections.Generic;

namespace F8App
{
    class AppReactPage : ReactPage
    {
        public override string MainComponentName
        {
            get
            {
                return "F8v2";
            }
        }

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
                };
            }
        }

        public override bool UseDeveloperSupport
        {
            get
            {
#if DEBUG
                return true;
#else
                return false;
#endif
            }
        }

        private class F8Package : IReactPackage
        {
            public IReadOnlyList<Type> CreateJavaScriptModulesConfig()
            {
                return new List<Type>(0);
            }

            public IReadOnlyList<INativeModule> CreateNativeModules(ReactContext reactContext)
            {
                return new List<INativeModule>
                {
                    new FBSDKModule(
                        reactContext,
                        "619048868222429",
                        "s-1-15-2-635873031-2844751771-797608348-1547790894-192744704-951387951-590373624"),
                };
            }

            public IReadOnlyList<IViewManager> CreateViewManagers(ReactContext reactContext)
            {
                return new List<IViewManager>(0);
            }
        }
    }
}
