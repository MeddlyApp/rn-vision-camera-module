package com.plethoracamera

// Required by react-native-orientation-locker
import android.content.Intent
import android.content.res.Configuration

// Main
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Plethora Camera"

  // Required by react-native-orientation-locker - FROM RN 0.72.7
  //public void onConfigurationChanged(Configuration newConfig) {
  //  super.onConfigurationChanged(newConfig)
  //  Intent intent = new Intent("onConfigurationChanged")
  //  intent.putExtra("newConfig", newConfig)
  //  this.sendBroadcast(intent)
  //}

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    val intent = Intent("onConfigurationChanged")
    intent.putExtra("newConfig", newConfig)
    sendBroadcast(intent)
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
