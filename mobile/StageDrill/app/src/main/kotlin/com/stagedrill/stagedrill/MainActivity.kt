@file:OptIn(ExperimentalMaterial3Api::class)

package com.stagedrill.stagedrill

import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.annotation.RequiresApi
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.stagedrill.stagedrill.auth.AccountScreen
import com.stagedrill.stagedrill.auth.PhoneAuthScreen
import com.stagedrill.stagedrill.bargain.BargainDetailsScreen
import com.stagedrill.stagedrill.bargain.BargainListScreen
import com.stagedrill.stagedrill.common.TopBar
import com.stagedrill.stagedrill.common.BottomNavItem
import com.stagedrill.stagedrill.common.NavigationArguments
import com.stagedrill.stagedrill.common.NavigationDestinations
import com.stagedrill.stagedrill.common.NetworkStatus
import com.stagedrill.stagedrill.common.NetworkStatusTracker
import com.stagedrill.stagedrill.common.NoInternetScreen
import com.stagedrill.stagedrill.favourites.FavouriteListScreen
import com.stagedrill.stagedrill.funspot.FunspotCallScreen
import com.stagedrill.stagedrill.funspot.FunspotListScreen
import com.stagedrill.stagedrill.landing.LandingScreen
import com.stagedrill.stagedrill.listing.ListingDetailsScreen
import com.stagedrill.stagedrill.listing.ListingListScreen
import com.stagedrill.stagedrill.store.ProductDetailsScreen
import com.stagedrill.stagedrill.store.ProductListScreen
import com.stagedrill.stagedrill.ui.theme.Theme
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

// CompositionLocal to provide network status down the UI tree
val LocalNetworkStatus = compositionLocalOf<NetworkStatus> { NetworkStatus.Unavailable }


class MainActivity : ComponentActivity() {
    private val auth: FirebaseAuth by lazy { FirebaseAuth.getInstance() }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Enable Edge-to-Edge to allow content to draw behind system bars
        enableEdgeToEdge()

        setContent {
            Theme {
                var currentUser by remember { mutableStateOf(auth.currentUser) }
                val authStateListener = remember {
                    FirebaseAuth.AuthStateListener { firebaseAuth ->
                        currentUser = firebaseAuth.currentUser
                    }
                }
                DisposableEffect(auth) {
                    auth.addAuthStateListener(authStateListener)
                    onDispose { auth.removeAuthStateListener(authStateListener) }
                }

                val networkStatusTracker = remember { NetworkStatusTracker(applicationContext) }
                val networkStatus by networkStatusTracker.networkStatus.collectAsState(initial = NetworkStatus.Unavailable)

                CompositionLocalProvider(LocalNetworkStatus provides networkStatus) {
                    if (currentUser == null) {
                        AuthNavigation(auth = auth)
                    } else {
                        MainAppContent(auth = auth)
                    }
                }
            }
        }
    }
}

@Composable
private fun AuthNavigation(auth: FirebaseAuth) {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = NavigationDestinations.LANDING) {
        composable(NavigationDestinations.LANDING) {
            LandingScreen(onSignInClick = {
                navController.navigate(NavigationDestinations.PHONE_AUTH)
            })
        }
        composable(NavigationDestinations.PHONE_AUTH) {
            PhoneAuthScreen(auth = auth, onSignInSuccess = {
                // The AuthStateListener in MainActivity will handle recomposition
            })
        }
    }
}

@RequiresApi(Build.VERSION_CODES.O)
@Composable
private fun MainAppContent(auth: FirebaseAuth) {
    val navController = rememberNavController()
    val mainViewModel: MainViewModel = viewModel()
    val hasNewOrders by mainViewModel.hasNewOrders.collectAsState()

    val bottomNavItems = listOf(
        BottomNavItem.Store,
        BottomNavItem.Funspots,
        BottomNavItem.Listings,
        BottomNavItem.Bargains
    )
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    // Maintain TopBar and BottomBar across the main logged-in area
    val isAuthRoute = currentRoute in listOf(NavigationDestinations.LANDING, NavigationDestinations.PHONE_AUTH)
    // Check if current route starts with funspotCall to handle cases with arguments
    val isCallRoute = currentRoute?.startsWith(NavigationDestinations.FUNSPOT_CALL) == true
    val showBars = !isAuthRoute && !isCallRoute

    val borderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)

    Scaffold(
        topBar = {
            if (showBars) {
                TopBar(
                    onFavouritesClick = { navController.navigate(NavigationDestinations.FAVOURITE_LIST) },
                    onAccountClick = { navController.navigate(NavigationDestinations.ACCOUNT) }
                )
            }
        },
        bottomBar = {
            if (showBars) {
                NavigationBar(
                    modifier = Modifier
                        .drawBehind {
                            val strokeWidth = 1.dp.toPx()
                            drawLine(
                                color = borderColor,
                                start = Offset(0f, 0f),
                                end = Offset(size.width, 0f),
                                strokeWidth = strokeWidth
                            )
                        },
                    containerColor = MaterialTheme.colorScheme.background,
                    windowInsets = WindowInsets.navigationBars // Edge-to-edge support
                ) {
                    val currentDestination = navBackStackEntry?.destination
                    bottomNavItems.forEach { screen ->
                        val selected =
                            currentDestination?.hierarchy?.any { it.route == screen.route } == true

                        val animatedScale by animateFloatAsState(
                            targetValue = if (selected) 1.1f else 1.0f,
                            animationSpec = spring(),
                            label = "icon_scale"
                        )

                        NavigationBarItem(
                            modifier = Modifier.padding(top = 8.dp),
                            icon = {
                                BadgedBox(badge = {
                                    if (screen is BottomNavItem.Bargains && hasNewOrders) {
                                        Badge()
                                    }
                                }) {
                                    Icon(
                                        modifier = Modifier.scale(animatedScale),
                                        imageVector = if (selected) screen.selectedIcon else screen.unselectedIcon,
                                        contentDescription = screen.title
                                    )
                                }
                            },
                            label = {
                                Text(
                                    text = screen.title,
                                    fontWeight = if (selected) FontWeight.SemiBold else FontWeight.Normal,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            },
                            selected = selected,
                            onClick = {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = MaterialTheme.colorScheme.primary,
                                selectedTextColor = MaterialTheme.colorScheme.primary,
                                unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                                unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
                                indicatorColor = MaterialTheme.colorScheme.secondaryContainer
                            )
                        )
                    }
                }
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier.padding(
                top = if (isCallRoute) 0.dp else paddingValues.calculateTopPadding(),
                bottom = if (isCallRoute) 0.dp else paddingValues.calculateBottomPadding()
            )
        ) {
            AppNavHost(
                navController = navController,
                auth = auth,
                mainViewModel = mainViewModel
            )
        }
    }
}

class MainViewModel : ViewModel() {
    private val _hasNewOrders = MutableStateFlow(false)
    val hasNewOrders = _hasNewOrders.asStateFlow()

    init {
        wakeUpBackend()
    }

    private fun wakeUpBackend() {
        viewModelScope.launch(Dispatchers.IO) {
            val maxRetries = 3
            var currentAttempt = 0

            while (currentAttempt < maxRetries) {
                try {
                    val url = java.net.URL("https://bagein-monolith-979283391442.africa-south1.run.app/graphql")
                    val connection = url.openConnection() as java.net.HttpURLConnection

                    connection.requestMethod = "POST"
                    connection.connectTimeout = 10000
                    connection.readTimeout = 10000
                    connection.doOutput = true
                    connection.setRequestProperty("Content-Type", "application/json")

                    val payload = "{\"query\":\"{__typename}\"}"

                    connection.outputStream.use { os ->
                        val input = payload.toByteArray(java.nio.charset.StandardCharsets.UTF_8)
                        os.write(input, 0, input.size)
                    }

                    connection.disconnect()
                    break
                } catch (e: Exception) {
                    currentAttempt++
                    delay(1000L * currentAttempt)
                }
            }
        }
    }

    fun notifyNewOrder() {
        _hasNewOrders.value = true
    }

    fun clearNewOrderNotification() {
        _hasNewOrders.value = false
    }
}


@RequiresApi(Build.VERSION_CODES.O)
@Composable
private fun AppNavHost(
    navController: NavHostController,
    auth: FirebaseAuth,
    mainViewModel: MainViewModel
) {
    val networkStatus = LocalNetworkStatus.current
    val currentBackStackEntry = navController.currentBackStackEntryAsState().value
    val currentRoute = currentBackStackEntry?.destination?.route

    if (networkStatus is NetworkStatus.Unavailable && currentRoute != NavigationDestinations.ACCOUNT) {
        NoInternetScreen()
    } else {
        NavHost(navController, startDestination = NavigationDestinations.FUNSPOT_LIST) {
            composable(route = NavigationDestinations.STORE) {
                ProductListScreen(
                    onProductClick = { product ->
                        navController.navigate("${NavigationDestinations.PRODUCT_DETAILS}/${product.id}")
                    }
                )
            }

            composable(
                route = "${NavigationDestinations.PRODUCT_DETAILS}/{${NavigationArguments.PRODUCT_ID}}",
                arguments = listOf(navArgument(NavigationArguments.PRODUCT_ID) {
                    type = NavType.StringType
                })
            ) { backStackEntry ->
                ProductDetailsScreen(
                    productId = backStackEntry.arguments?.getString(NavigationArguments.PRODUCT_ID)!!,
                    onNavigateUp = { navController.navigateUp() }
                )
            }

            composable(route = NavigationDestinations.FUNSPOT_LIST) {
                FunspotListScreen(
                    onStartCall = { funspot ->
                        val encodedPrompt = URLEncoder.encode(funspot.practicePrompt, StandardCharsets.UTF_8.toString())
                        val encodedTitle = URLEncoder.encode(funspot.title, StandardCharsets.UTF_8.toString())
                        navController.navigate("${NavigationDestinations.FUNSPOT_CALL}/$encodedPrompt/$encodedTitle")
                    }
                )
            }

            composable(
                route = "${NavigationDestinations.FUNSPOT_CALL}/{${NavigationArguments.FUNSPOT_PROMPT}}/{${NavigationArguments.FUNSPOT_TITLE}}",
                arguments = listOf(
                    navArgument(NavigationArguments.FUNSPOT_PROMPT) { type = NavType.StringType },
                    navArgument(NavigationArguments.FUNSPOT_TITLE) { type = NavType.StringType }
                )
            ) { backStackEntry ->
                FunspotCallScreen(
                    prompt = backStackEntry.arguments?.getString(NavigationArguments.FUNSPOT_PROMPT)!!,
                    title = backStackEntry.arguments?.getString(NavigationArguments.FUNSPOT_TITLE)!!,
                    onNavigateUp = { navController.navigateUp() }
                )
            }

            composable(route = NavigationDestinations.LISTING_LIST) {
                ListingListScreen(
                    onListingClick = { listing ->
                        navController.navigate("${NavigationDestinations.LISTING_DETAILS}/${listing.id}")
                    }
                )
            }

            composable(
                route = "${NavigationDestinations.LISTING_DETAILS}/{${NavigationArguments.LISTING_ID}}",
                arguments = listOf(navArgument(NavigationArguments.LISTING_ID) {
                    type = NavType.StringType
                })
            ) { backStackEntry ->
                ListingDetailsScreen(
                    listingId = backStackEntry.arguments?.getString(NavigationArguments.LISTING_ID)!!,
                    onNavigateUp = { navController.navigateUp() }
                )
            }

            composable(route = NavigationDestinations.BARGAIN_LIST) {
                BargainListScreen(
                    onBargainClick = { bargain ->
                        navController.navigate("${NavigationDestinations.BARGAIN_DETAILS}/${bargain.id}")
                    }
                )
            }

            composable(
                route = "${NavigationDestinations.BARGAIN_DETAILS}/{${NavigationArguments.BARGAIN_ID}}",
                arguments = listOf(navArgument(NavigationArguments.BARGAIN_ID) {
                    type = NavType.StringType
                })
            ) { backStackEntry ->
                BargainDetailsScreen(
                    bargainId = backStackEntry.arguments?.getString(NavigationArguments.BARGAIN_ID)!!,
                    onNavigateUp = { navController.navigateUp() }
                )
            }

            composable(route = NavigationDestinations.FAVOURITE_LIST) {
                FavouriteListScreen(
                    onItemClick = { item ->
                        val destination = when (item.type) {
                            "Product" -> NavigationDestinations.PRODUCT_DETAILS
                            "Listing" -> NavigationDestinations.LISTING_DETAILS
                            "Bargain" -> NavigationDestinations.BARGAIN_DETAILS
                            else -> null
                        }
                        destination?.let {
                            navController.navigate("$it/${item.id}")
                        }
                    },
                    onNavigateUp = { navController.navigateUp() }
                )
            }

            composable(route = NavigationDestinations.ACCOUNT) {
                AccountScreen(
                    auth = auth,
                    onLogout = {},
                    onNavigateUp = { navController.navigateUp() }
                )
            }
        }
    }
}
