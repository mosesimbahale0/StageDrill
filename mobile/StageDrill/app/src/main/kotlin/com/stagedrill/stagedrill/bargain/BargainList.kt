package com.stagedrill.stagedrill.bargain

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.stagedrill.stagedrill.ui.theme.BrandColor

/**
 * Data model representing a bargain deal in the Bagein app.
 */
data class Bargain(
    val id: String,
    val title: String,
    val originalPrice: Double,
    val bargainPrice: Double,
    val discountPercentage: Int,
    val timeLeft: String,
    val sellerName: String,
    val category: String,
    val accentColor: Color
)

/**
 * Provider for sample bargain deals.
 */
class BargainProvider {
    val samples = listOf(
        Bargain(
            id = "B1",
            title = "Premium Coffee Beans - 1kg",
            originalPrice = 45.0,
            bargainPrice = 32.0,
            discountPercentage = 28,
            timeLeft = "2h 15m",
            sellerName = "Green Roasters",
            category = "Groceries",
            accentColor = Color(0xFF795548)
        ),
        Bargain(
            id = "B2",
            title = "Noise Cancelling Headphones",
            originalPrice = 199.99,
            bargainPrice = 145.0,
            discountPercentage = 27,
            timeLeft = "5h 40m",
            sellerName = "Tech Heaven",
            category = "Electronics",
            accentColor = Color(0xFF607D8B)
        ),
        Bargain(
            id = "B3",
            title = "Eco-Friendly Yoga Mat",
            originalPrice = 35.0,
            bargainPrice = 20.0,
            discountPercentage = 42,
            timeLeft = "45m",
            sellerName = "Zen Living",
            category = "Fitness",
            accentColor = Color(0xFF4CAF50)
        ),
        Bargain(
            id = "B4",
            title = "Smart Water Bottle",
            originalPrice = 28.0,
            bargainPrice = 18.5,
            discountPercentage = 34,
            timeLeft = "1h 10m",
            sellerName = "Hydro Tech",
            category = "Lifestyle",
            accentColor = Color(0xFF03A9F4)
        ),
        Bargain(
            id = "B5",
            title = "Handmade Ceramic Mug",
            originalPrice = 15.0,
            bargainPrice = 9.0,
            discountPercentage = 40,
            timeLeft = "8h 20m",
            sellerName = "Artisans Hub",
            category = "Home",
            accentColor = Color(0xFFFF9800)
        )
    )
}

/**
 * A screen displaying a list of active bargains and limited-time offers.
 * This screen is designed to be hosted within a global Scaffold that provides
 * the TopBar and Bottom Navigation.
 */
@Composable
fun BargainListScreen(
    onBargainClick: (Bargain) -> Unit = {}
) {
    val bargains = BargainProvider().samples

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        // Removed 16.dp vertical padding to comply with global navigation bar spacing
        contentPadding = PaddingValues(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        items(bargains) { bargain ->
            BargainCard(bargain = bargain, onClick = { onBargainClick(bargain) })
        }
    }
}

/**
 * A card component that highlights a bargain deal.
 */
@Composable
fun BargainCard(
    bargain: Bargain,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column {
            // Top Section with Image Placeholder and Discount Badge
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(160.dp)
                    .background(bargain.accentColor.copy(alpha = 0.1f))
            ) {
                // Image Placeholder
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(bargain.accentColor)
                        .align(Alignment.Center)
                )

                // Discount Badge
                Surface(
                    modifier = Modifier
                        .padding(12.dp)
                        .align(Alignment.TopEnd),
                    color = BrandColor,
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = "-${bargain.discountPercentage}%",
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold
                    )
                }

                // Time Left Badge
                Surface(
                    modifier = Modifier
                        .padding(12.dp)
                        .align(Alignment.BottomStart),
                    color = Color.Black.copy(alpha = 0.6f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Timer,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = bargain.timeLeft,
                            color = Color.White,
                            style = MaterialTheme.typography.labelSmall
                        )
                    }
                }
            }

            // Info Section
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = bargain.category,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "by ${bargain.sellerName}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = bargain.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    verticalAlignment = Alignment.Bottom
                ) {
                    Text(
                        text = "$${bargain.bargainPrice}",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.ExtraBold,
                        color = BrandColor
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "$${bargain.originalPrice}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textDecoration = TextDecoration.LineThrough
                    )
                }
            }
        }
    }
}
