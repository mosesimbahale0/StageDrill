package com.stagedrill.stagedrill.listing

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.LocationOn
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
 * Data model representing a user listing for surplus items.
 */
data class Listing(
    val id: String,
    val title: String,
    val description: String,
    val price: Double?, // null if free
    val category: String,
    val location: String,
    val condition: String,
    val imageAccentColor: Color
)

/**
 * Provider for sample listings.
 */
class ListingProvider {
    val samples = listOf(
        Listing(
            id = "L1",
            title = "Vintage Wooden Chair",
            description = "Solid oak chair in great condition. Minimal scratches.",
            price = 25.0,
            category = "Furniture",
            location = "Central Park, NY",
            condition = "Good",
            imageAccentColor = Color(0xFF8D6E63)
        ),
        Listing(
            id = "L2",
            title = "Indoor Succulent Collection",
            description = "A variety of healthy succulents in ceramic pots.",
            price = null,
            category = "Plants",
            location = "Brooklyn, NY",
            condition = "Like New",
            imageAccentColor = Color(0xFF66BB6A)
        ),
        Listing(
            id = "L3",
            title = "Canon EOS 700D",
            description = "Lightly used DSLR with kit lens. Perfect for beginners.",
            price = 350.0,
            category = "Electronics",
            location = "Queens, NY",
            condition = "Excellent",
            imageAccentColor = Color(0xFF424242)
        ),
        Listing(
            id = "L4",
            title = "Mountain Bike - 26 inch",
            description = "Sturdy mountain bike, needs slight brake adjustment.",
            price = 80.0,
            category = "Sports",
            location = "Staten Island, NY",
            condition = "Fair",
            imageAccentColor = Color(0xFFEF5350)
        ),
        Listing(
            id = "L5",
            title = "Eco-friendly Yoga Mat",
            description = "Natural rubber yoga mat, non-slip texture.",
            price = 15.0,
            category = "Fitness",
            location = "Manhattan, NY",
            condition = "New",
            imageAccentColor = Color(0xFF26A69A)
        )
    )
}

/**
 * A screen that displays a list of community listings.
 * Removed internal Scaffold and TopAppBar to integrate with global UI.
 */
@Composable
fun ListingListScreen(
    onListingClick: (Listing) -> Unit = {},
    onAddListingClick: () -> Unit = {}
) {
    val listings = ListingProvider().samples

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            // Removed vertical padding to ensure edge-to-edge behavior with global navigation
            contentPadding = PaddingValues(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(listings) { listing ->
                ListingCard(listing = listing, onClick = { onListingClick(listing) })
            }
        }

        // Floating Action Button remains within the screen container
        ExtendedFloatingActionButton(
            onClick = onAddListingClick,
            containerColor = BrandColor,
            contentColor = Color.White,
            icon = { Icon(Icons.Default.Add, contentDescription = null) },
            text = { Text("List Item") },
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(16.dp)
        )
    }
}

/**
 * A card representing a single listing item.
 */
@Composable
fun ListingCard(
    listing: Listing,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .padding(12.dp)
                .height(IntrinsicSize.Min)
        ) {
            // Placeholder Image
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(listing.imageAccentColor.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(listing.imageAccentColor)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight(),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = listing.category,
                            style = MaterialTheme.typography.labelMedium,
                            color = BrandColor,
                            fontWeight = FontWeight.Bold
                        )
                        
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = MaterialTheme.colorScheme.secondaryContainer,
                            contentColor = MaterialTheme.colorScheme.onSecondaryContainer
                        ) {
                            Text(
                                text = listing.condition,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = listing.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )

                    Text(
                        text = listing.description,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.LocationOn,
                            contentDescription = null,
                            modifier = Modifier.size(14.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = listing.location,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    Text(
                        text = if (listing.price == null) "FREE" else "$${listing.price}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.ExtraBold,
                        color = if (listing.price == null) BrandColor else MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
    }
}
