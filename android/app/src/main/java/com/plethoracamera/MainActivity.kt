package com.plethoracamera

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

// Orientation Locker
import android.content.Intent
import android.content.res.Configuration

class MainActivity : ReactActivity() {

  // Orientation Locker
  //@Override
  //public void onConfigurationChanged(Configuration newConfig) {
  //  super.onConfigurationChanged(newConfig)
  //  Intent intent = new Intent("onConfigurationChanged")
  //  intent.putExtra("newConfig", newConfig)
  //  this.sendBroadcast(intent)
  //}
  override fun onConfigurationChanged(newConfig: Configuration?) {
    super.onConfigurationChanged(newConfig)
    Intent intent = new Intent("onConfigurationChanged")
    intent.putExtra("newConfig", newConfig)
    this.sendBroadcast(intent)
  }


  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Plethora Camera"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */  
  override fun createReactActivityDelegate(): ReactActivityDelegate = DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
