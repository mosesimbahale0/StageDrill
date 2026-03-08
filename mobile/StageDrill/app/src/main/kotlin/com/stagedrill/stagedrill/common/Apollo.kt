package com.stagedrill.stagedrill.common

import android.util.Log
import com.apollographql.apollo.ApolloClient
import com.apollographql.apollo.network.okHttpClient
import com.google.firebase.auth.FirebaseAuth // Import standard FirebaseAuth
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.tasks.await // Import await()
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response

/**
 * This Interceptor automatically fetches the current Firebase user's
 * ID token (access token) and attaches it to the Authorization header of every request.
 */
private class AuthorizationInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()

        // Get the current user from the standard FirebaseAuth instance
        val user = FirebaseAuth.getInstance().currentUser

        // If no user is logged in, proceed without a token.
        // The backend will handle the 401/400.
        if (user == null) {
            Log.w("ApolloAuth", "No user logged in, proceeding without token.")
            return chain.proceed(request)
        }

        // We MUST use runBlocking here because an interceptor must return
        // a Response synchronously, but getting a token is asynchronous.
        val tokenResult = runBlocking {
            try {
                // Pass 'true' to force-refresh if the token is expired.
                // .await() comes from kotlinx-coroutines-tasks and converts the
                // Firebase Task into a suspending function.
                user.getIdToken(false).await()
            } catch (e: Exception) {
                Log.e("ApolloAuth", "Error getting ID token", e)
                null
            }
        }

        val token = tokenResult?.token

        // If token is null (e.g., error), proceed without it.
        if (token == null) {
            Log.e("ApolloAuth", "Failed to get ID token, proceeding without.")
            return chain.proceed(request)
        }

        // Add the Authorization header AND the X-Auth-Type header
        val authedRequest = request.newBuilder()
            .header("Authorization", "Bearer $token")
            .header("X-Auth-Type", "Token") // Explicitly state this is an ID Token
            .build()

        Log.d("ApolloAuth", "Attaching auth token and type to request.")
        return chain.proceed(authedRequest)
    }
}

// Create the OkHttpClient with your new interceptor
private val okHttpClient = OkHttpClient.Builder()
    .addInterceptor(AuthorizationInterceptor()) // <-- Add the interceptor
    .build()

// Build the ApolloClient using the new OkHttpClient
val apolloClient = ApolloClient.Builder()
    .serverUrl("https://bagein-monolith-979283391442.africa-south1.run.app/graphql")
    .webSocketServerUrl("wss://bagein-monolith-979283391442.africa-south1.run.app/graphql")
    .okHttpClient(okHttpClient) // <-- Use the new client
    .webSocketReopenWhen { throwable, attempt ->
        Log.d("Apollo", "WebSocket got disconnected, reopening after a delay", throwable)
        delay(attempt * 1000)
        true
    }
    .build()