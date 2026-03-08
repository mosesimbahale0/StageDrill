package com.stagedrill.stagedrill

import android.app.Application
import com.google.firebase.FirebaseApp
import com.google.firebase.appcheck.FirebaseAppCheck
import com.google.firebase.appcheck.playintegrity.PlayIntegrityAppCheckProviderFactory

/**
 * Custom Application class to initialize Firebase and App Check.
 * This class runs before any Activity is created.
 */
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        // Initialize Firebase
        // This is crucial for all Firebase services to work
        FirebaseApp.initializeApp(this)

        // Initialize Firebase App Check
        val firebaseAppCheck = FirebaseAppCheck.getInstance()
        firebaseAppCheck.installAppCheckProviderFactory(
            PlayIntegrityAppCheckProviderFactory.getInstance()
        )
    }
}