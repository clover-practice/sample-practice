package com.testapp.devmode

import android.content.Context
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DeveloperModeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "DeveloperMode"

    @ReactMethod
    fun isDeveloperModeEnabled(promise: Promise) {
        try {
            val context: Context = reactApplicationContext
            val devMode = Settings.Secure.getInt(
                context.contentResolver,
                Settings.Secure.DEVELOPMENT_SETTINGS_ENABLED,
                0
            ) == 1
            promise.resolve(devMode)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}
