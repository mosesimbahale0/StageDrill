package com.stagedrill.stagedrill.common

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.RowScope
import androidx.compose.material3.Button
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/**
 * A custom-styled, reusable button for primary actions in the app.
 * It features increased vertical padding and accepts composable content.
 *
 * @param onClick The lambda to be invoked when the button is clicked.
 * @param modifier An optional Modifier for this button.
 * @param enabled Controls the enabled state of the button.
 * @param content The composable content to be displayed inside the button.
 */
@Composable
fun PrimaryButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    content: @Composable RowScope.() -> Unit
) {
    Button(
        onClick = onClick,
        modifier = modifier,
        enabled = enabled,
        contentPadding = PaddingValues(
            horizontal = 24.dp,
            vertical = 16.dp // Increased vertical padding
        ),
        content = content
    )
}

