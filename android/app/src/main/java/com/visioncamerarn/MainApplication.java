package com.plethoracamera;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;
import java.util.List;

// Reanimated
import com.facebook.react.bridge.JSIModulePackage; // <- add
import com.swmansion.reanimated.ReanimatedJSIModulePackage; // <- add

// Orientation Locker
import org.wonday.orientation.OrientationActivityLifecycle;

// Camera Roll
import com.reactnativecommunity.cameraroll.CameraRollPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for
      // example:
      // packages.add(new MyReactNativePackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }    

    @Override
    protected boolean isNewArchEnabled() {
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
    @Override
    protected Boolean isHermesEnabled() {
      return BuildConfig.IS_HERMES_ENABLED;
    }

    // Reanimated
    @Override
    protected JSIModulePackage getJSIModulePackage() {
      return new ReanimatedJSIModulePackage(); // <- add
    }
  };


  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    SoLoader.init(this, /* native exopackage */ false);
    
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

    // Orientation Locker
    registerActivityLifecycleCallbacks(OrientationActivityLifecycle.getInstance());
  }
}
