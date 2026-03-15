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
        title = "Master Your Interviews",
        description = "Practice with AI-driven scenarios tailored for software engineers. From behavioral to system design."
    ),
    OnboardingStep(
        illustrationResId = R.drawable.undraw_list,
        title = "Expert Coaching",
        description = "Get instant feedback on your answers from a virtual Senior Engineering Manager with 15 years of experience."
    ),
    OnboardingStep(
        illustrationResId = R.drawable.undraw_transact,
        title = "Track Your Progress",
        description = "Analyze your performance, refine your logic for Fermi problems, and perfect your 'Tell me about yourself'."
    )
)

@Composable
fun LandingScreen(onSignInClick: () -> Unit) {
    val pagerState = rememberPagerState(pageCount = { onboardingSteps.size })
    val scope = rememberCoroutineScope()

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions(),
        onResult = { _ ->
            onSignInClick()
        }
    )

    Scaffold { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 48.dp, start = 16.dp, end = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Image(
                    painter = painterResource(id = R.drawable.app_logo),
                    contentDescription = "StageDrill App Logo",
                    modifier = Modifier.size(80.dp)
                )
            }

            HorizontalPager(
                state = pagerState,
                modifier = Modifier
                    .weight(1f)
                    .padding(vertical = 16.dp)
            ) { page ->
                OnboardingPage(step = onboardingSteps[page], pagerState = pagerState, page = page)
            }

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
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                                permissionsToRequest.add(Manifest.permission.POST_NOTIFICATIONS)
                            }
                            if (permissionsToRequest.isNotEmpty()) {
                                permissionLauncher.launch(permissionsToRequest.toTypedArray())
                            } else {
                                onSignInClick()
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 32.dp)
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
