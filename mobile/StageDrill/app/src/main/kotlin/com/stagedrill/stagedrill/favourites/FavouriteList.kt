package com.stagedrill.stagedrill.favourites

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.stagedrill.stagedrill.ui.theme.BrandColor

/**
 * Data model representing a favourited item.
 * It can be a listing or bargain.
 */
data class FavouriteItem(
    val id: String,
    val title: String,
    val category: String,
    val price: String,
    val type: String, // "Listing" or "Bargain"
    val accentColor: Color
)

/**
 * Provider for sample favourited items.
 */
class FavouriteProvider {
    val samples = listOf(
        FavouriteItem(
            id = "L1",
            title = "Vintage Wooden Chair",
            category = "Furniture",
            price = "$25.0",
            type = "Listing",
            accentColor = Color(0xFF8D6E63)
        ),
        FavouriteItem(
            id = "B1",
            title = "Premium Coffee Beans",
            category = "Groceries",
            price = "$32.0",
            type = "Bargain",
            accentColor = Color(0xFF795548)
        )
    )
}

/**
 * A screen that displays a list of items favourited by the user.
 * 
 * @param onItemClick Callback when an item is selected.
 * @param onRemoveFavourite Callback to remove an item.
 * @param onNavigateUp Callback to go back.
 */
@Composable
fun FavouriteListScreen(
    onItemClick: (FavouriteItem) -> Unit = {},
    onRemoveFavourite: (FavouriteItem) -> Unit = {},
    onNavigateUp: () -> Unit = {}
) {
    val favourites = FavouriteProvider().samples

    Box(modifier = Modifier.fillMaxSize()) {
        if (favourites.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.Favorite,
                        contentDescription = null,
                        modifier = Modifier.size(64.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.3f)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        "No favourites yet",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(favourites) { item ->
                    FavouriteItemCard(
                        item = item, 
                        onClick = { onItemClick(item) },
                        onRemove = { onRemoveFavourite(item) }
                    )
                }
            }
        }
    }
}

/**
 * A card component that displays a favourited item.
 */
@Composable
fun FavouriteItemCard(
    item: FavouriteItem,
    onClick: () -> Unit,
    onRemove: () -> Unit
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
        Row(
            modifier = Modifier
                .padding(12.dp)
                .height(IntrinsicSize.Min),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(item.accentColor.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(item.accentColor)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = item.type,
                    style = MaterialTheme.typography.labelSmall,
                    color = BrandColor,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = item.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = item.category,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = item.price,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            IconButton(onClick = onRemove) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Remove from favourites",
                    tint = MaterialTheme.colorScheme.error.copy(alpha = 0.7f)
                )
            }
        }
    }
}
