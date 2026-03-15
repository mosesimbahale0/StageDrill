package com.stagedrill.stagedrill.common

import androidx.compose.material.icons.Icons
// Import Filled icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Psychology
// Import Outlined icons
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.GridView
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Psychology
import androidx.compose.ui.graphics.vector.ImageVector

/**
 * Defines the navigation routes for the application.
 */
object NavigationDestinations {
    // Logged-out routes
    const val LANDING = "landing"
    const val PHONE_AUTH = "phoneAuth"
    const val ACCOUNT = "account"

    // Logged-in routes
    const val TEMPLATE_LIST = "templateList"
    const val TEMPLATE_DETAILS = "templateDetails"

    const val STATS = "stats"

    const val FAVOURITE_LIST = "favouriteList"

    const val FUNSPOT_LIST = "funspotList"
    const val FUNSPOT_CALL = "funspotCall"
}

/**
 * Defines the arguments passed between navigation destinations.
 */
object NavigationArguments {
    const val TEMPLATE_ID = "templateId"
    const val FUNSPOT_PROMPT = "funspotPrompt"
    const val FUNSPOT_TITLE = "funspotTitle"
}

/**
 * Represents the items in the bottom navigation bar.
 */
sealed class BottomNavItem(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {

    object Home : BottomNavItem(
        route = NavigationDestinations.FUNSPOT_LIST,
        title = "Home",
        selectedIcon = Icons.Filled.Home,
        unselectedIcon = Icons.Outlined.Home
    )

    object Templates : BottomNavItem(
        route = NavigationDestinations.TEMPLATE_LIST,
        title = "Templates",
        selectedIcon = Icons.Filled.GridView,
        unselectedIcon = Icons.Outlined.GridView
    )

    object Stats : BottomNavItem(
        route = NavigationDestinations.STATS,
        title = "Stats",
        selectedIcon = Icons.Filled.BarChart,
        unselectedIcon = Icons.Outlined.BarChart
    )

    object Favourites : BottomNavItem(
        route = NavigationDestinations.FAVOURITE_LIST,
        title = "Favourites",
        selectedIcon = Icons.Filled.Favorite,
        unselectedIcon = Icons.Outlined.FavoriteBorder
    )

    object Account : BottomNavItem(
        route = NavigationDestinations.ACCOUNT,
        title = "Account",
        selectedIcon = Icons.Filled.AccountCircle,
        unselectedIcon = Icons.Outlined.AccountCircle
    )
}
