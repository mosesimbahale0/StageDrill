package com.stagedrill.stagedrill.common

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.stagedrill.stagedrill.R

/**
 * A reusable Top Bar component for the Bagein app, featuring the brand logo,
 * the brand name "Bagein", and quick access to Favourites and Account settings.
 *
 * @param onFavouritesClick Callback for when the Favourites icon is tapped.
 * @param onAccountClick Callback for when the Account icon is tapped.
 * @param scrollBehavior Optional scroll behavior for dynamic top bar transitions.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopBar(
    onFavouritesClick: () -> Unit,
    onAccountClick: () -> Unit,
    scrollBehavior: TopAppBarScrollBehavior? = null
) {
    TopAppBar(
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxHeight()
            ) {
                Image(
                    painter = painterResource(id = R.drawable.app_logo),
                    contentDescription = "Bagein Logo",
                    modifier = Modifier.size(112.dp)
                )
            }
        },
        actions = {
            IconButton(onClick = onFavouritesClick) {
                Icon(
                    imageVector = Icons.Outlined.FavoriteBorder,
                    contentDescription = "Favourites",
                    tint = MaterialTheme.colorScheme.onSurface
                )
            }
            IconButton(onClick = onAccountClick) {
                Icon(
                    imageVector = Icons.Outlined.AccountCircle,
                    contentDescription = "Account",
                    tint = MaterialTheme.colorScheme.onSurface
                )
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.background,
            scrolledContainerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
        ),
        scrollBehavior = scrollBehavior,
        // Ensure standard window insets are handled for edge-to-edge
        windowInsets = WindowInsets.statusBars
    )
}
