package com.stagedrill.stagedrill.common

import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.launch

sealed class NetworkStatus {
    object Available : NetworkStatus()
    object Unavailable : NetworkStatus()
}

class NetworkStatusTracker(context: Context) {
    private val connectivityManager =
        context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    val networkStatus: Flow<NetworkStatus> = callbackFlow {
        val networkStatusCallback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                launch { send(NetworkStatus.Available) }
            }

            override fun onUnavailable() {
                launch { send(NetworkStatus.Unavailable) }
            }

            override fun onLost(network: Network) {
                launch { send(NetworkStatus.Unavailable) }
            }
        }

        connectivityManager.registerDefaultNetworkCallback(networkStatusCallback)

        // Send the initial status
        val isConnected = connectivityManager.activeNetwork != null
        launch { send(if (isConnected) NetworkStatus.Available else NetworkStatus.Unavailable) }


        awaitClose {
            connectivityManager.unregisterNetworkCallback(networkStatusCallback)
        }
    }.distinctUntilChanged()
}
