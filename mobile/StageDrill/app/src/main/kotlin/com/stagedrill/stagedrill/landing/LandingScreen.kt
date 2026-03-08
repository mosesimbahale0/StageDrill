@file:OptIn(ExperimentalFoundationApi::class)

package com.stagedrill.stagedrill.landing

import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.DrawableRes
import androidx.compose.animation.AnimatedContent
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.PagerState
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import kotlin.math.absoluteValue
import com.stagedrill.stagedrill.R

private data class OnboardingStep(
    @DrawableRes val illustrationResId: Int,
    val title: String,
    val description: String
)

private val onboardingSteps = listOf(
    OnboardingStep(
        illustrationResId = R.drawable.undraw_deals,
        title = "Discover Great Deals",
        description = "Find unique, per-loved surplus items from your community at unbeatable prices. Your next bargain is just a tap away!"
    ),
    OnboardingStep(
        illustrationResId = R.drawable.undraw_list,
        title = "List Your Surplus Items",
        description = "Easily snap a photo and list your unused assets. Give your items a new life and declutter your space in an eco-friendly way."
    ),
    OnboardingStep(
        illustrationResId = R.drawable.undraw_transact,
        title = "Connect & Transact",
        description = "Chat directly with sellers, negotiate prices, and arrange for a secure pickup or delivery. All within the app."
    )
)

@Composable
fun LandingScreen(onSignInClick: () -> Unit) {
    val pagerState = rememberPagerState(pageCount = { onboardingSteps.size })
    val scope = rememberCoroutineScope()





    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions(),
        onResult = { permissions ->
            onSignInClick()
        }
    )

    Scaffold { paddingValues ->
        // --- UPDATED: Root Column layout ---
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues), // Use scaffold padding for system bars
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            // --- UPDATED: Top section now has its own padding for better spacing ---
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 48.dp, start = 16.dp, end = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Image(
                    painter = painterResource(id = R.drawable.app_logo),
                    contentDescription = "WaterRefil App Logo",
                    modifier = Modifier.size(80.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
//                Text(
//                    text = "WateRefil",
//                    style = MaterialTheme.typography.headlineSmall,
//                    fontWeight = FontWeight.SemiBold
//                )
            }

            // --- UPDATED: Pager now has weight and vertical padding ---
            // This makes it the main flexible component, creating white space.
            HorizontalPager(
                state = pagerState,
                modifier = Modifier
                    .weight(1f)
                    .padding(vertical = 16.dp)
            ) { page ->
                OnboardingPage(step = onboardingSteps[page], pagerState = pagerState, page = page)
            }

            // --- UPDATED: Bottom section has its own padding for balance ---
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 32.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                PagerIndicator(
                    pagerState = pagerState,
                    modifier = Modifier.padding(vertical = 24.dp)
                )
                PrimaryButton(
                    onClick = {
                        if (pagerState.currentPage < onboardingSteps.size - 1) {
                            scope.launch {
                                pagerState.animateScrollToPage(pagerState.currentPage + 1)
                            }
                        } else {
                            val permissionsToRequest = mutableListOf<String>()
                            permissionsToRequest.add(Manifest.permission.ACCESS_FINE_LOCATION)

                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                                permissionsToRequest.add(Manifest.permission.POST_NOTIFICATIONS)
                            }

                            permissionLauncher.launch(permissionsToRequest.toTypedArray())
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 32.dp) // Increased horizontal padding on button
                ) {
                    AnimatedContent(targetState = pagerState.currentPage, label = "Button Text") { page ->
                        Text(
                            text = if (page < onboardingSteps.size - 1) "Next" else "Get Started"
                        )
                    }
                }
            }
        }
    }
}

// ... (The rest of your file remains unchanged)
@Composable
private fun OnboardingPage(step: OnboardingStep, pagerState: PagerState, page: Int) {
    val pageOffset = (pagerState.currentPage - page) + pagerState.currentPageOffsetFraction

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 24.dp)
            .graphicsLayer {
                translationX = pageOffset * size.width / 2
                alpha = 1 - pageOffset.absoluteValue.coerceIn(0f, 1f)
            }
    ) {
        Image(
            painter = painterResource(id = step.illustrationResId),
            contentDescription = null,
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1.25f)
        )
        Spacer(modifier = Modifier.height(32.dp))
        Text(
            text = step.title,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = step.description,
            style = MaterialTheme.typography.bodyLarge,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun PagerIndicator(pagerState: PagerState, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.Center
    ) {
        repeat(pagerState.pageCount) { iteration ->
            val color = if (pagerState.currentPage == iteration) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)
            Box(
                modifier = Modifier
                    .padding(4.dp)
                    .clip(CircleShape)
                    .background(color)
                    .size(10.dp)
            )
        }
    }
}

@Composable
fun PrimaryButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit
) {
    Button(
        onClick = onClick,
        modifier = modifier,
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        content()
    }
}