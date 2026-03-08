package com.stagedrill.stagedrill.common

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.stagedrill.stagedrill.R

/**
 * Shows a local notification for a successfully placed order.
 *
 * @param context The application context.
 * @param orderId The unique ID of the order to display.
 * @param productName The name of the product that was ordered.
 */
fun showOrderConfirmationNotification(context: Context, orderId: String, productName: String) {
    val channelId = "order_status_channel"
    val notificationId = System.currentTimeMillis().toInt() // Unique ID for each notification

    // Ensure the notification channel is created (for Android 8.0+)
    createNotificationChannel(context, channelId)

    val builder = NotificationCompat.Builder(context, channelId)
        .setSmallIcon(R.drawable.app_logo) // Ensure you have 'app_logo.xml' in your res/drawable
        .setContentTitle("Order Placed Successfully! 🎉")
        .setContentText("Your order for '$productName' (#${orderId.take(6)}...) is confirmed.")
        .setStyle(NotificationCompat.BigTextStyle()
            .bigText("Your order for '$productName' (#${orderId.take(6)}...) has been confirmed and is now being prepared for delivery."))
        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        .setAutoCancel(true) // Dismiss notification when tapped

    with(NotificationManagerCompat.from(context)) {
        // Check for permission before attempting to notify
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            // In a real app, you'd handle the case where permission is denied.
            // For now, we just won't show the notification.
            return
        }
        notify(notificationId, builder.build())
    }
}

/**
 * Creates a NotificationChannel, required for notifications on Android 8.0 (API 26) and higher.
 * This is safe to call multiple times; the system ignores requests to create an existing channel.
 */
private fun createNotificationChannel(context: Context, channelId: String) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val name = "Order Status"
        val descriptionText = "Notifications about your order status"
        val importance = NotificationManager.IMPORTANCE_DEFAULT
        val channel = NotificationChannel(channelId, name, importance).apply {
            description = descriptionText
        }
        // Register the channel with the system
        val notificationManager: NotificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(channel)
    }
}