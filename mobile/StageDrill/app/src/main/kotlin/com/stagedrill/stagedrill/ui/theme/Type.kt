package com.stagedrill.stagedrill.ui.theme



import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.stagedrill.stagedrill.R

// Define the custom FontFamily
val Poppins = FontFamily(
    Font(R.font.urbanist_regular, FontWeight.Normal),
    Font(R.font.urbanist_medium, FontWeight.Medium),
    Font(R.font.urbanist_bold, FontWeight.Bold)
)

// Create a helper to apply the font to all styles
private val defaultTextStyle = TextStyle(
    fontFamily = Poppins
)

// Configure Typography to use our custom font for EVERY style
val Typography = Typography(
    displayLarge = defaultTextStyle.copy(fontSize = 57.sp, lineHeight = 64.sp, letterSpacing = (-0.25).sp),
    displayMedium = defaultTextStyle.copy(fontSize = 45.sp, lineHeight = 52.sp, letterSpacing = 0.sp),
    displaySmall = defaultTextStyle.copy(fontSize = 36.sp, lineHeight = 44.sp, letterSpacing = 0.sp),
    headlineLarge = defaultTextStyle.copy(fontSize = 32.sp, lineHeight = 40.sp, letterSpacing = 0.sp),
    headlineMedium = defaultTextStyle.copy(fontSize = 28.sp, lineHeight = 36.sp, letterSpacing = 0.sp),
    headlineSmall = defaultTextStyle.copy(fontSize = 24.sp, lineHeight = 32.sp, letterSpacing = 0.sp),
    titleLarge = defaultTextStyle.copy(fontSize = 22.sp, lineHeight = 28.sp, letterSpacing = 0.sp),
    titleMedium = defaultTextStyle.copy(fontSize = 16.sp, lineHeight = 24.sp, letterSpacing = 0.15.sp),
    titleSmall = defaultTextStyle.copy(fontSize = 14.sp, lineHeight = 20.sp, letterSpacing = 0.1.sp),
    bodyLarge = defaultTextStyle.copy(fontSize = 16.sp, lineHeight = 24.sp, letterSpacing = 0.5.sp),
    bodyMedium = defaultTextStyle.copy(fontSize = 14.sp, lineHeight = 20.sp, letterSpacing = 0.25.sp),
    bodySmall = defaultTextStyle.copy(fontSize = 12.sp, lineHeight = 16.sp, letterSpacing = 0.4.sp),
    labelLarge = defaultTextStyle.copy(fontSize = 14.sp, lineHeight = 20.sp, letterSpacing = 0.1.sp),
    labelMedium = defaultTextStyle.copy(fontSize = 12.sp, lineHeight = 16.sp, letterSpacing = 0.5.sp),
    labelSmall = defaultTextStyle.copy(fontSize = 11.sp, lineHeight = 16.sp, letterSpacing = 0.5.sp)
)