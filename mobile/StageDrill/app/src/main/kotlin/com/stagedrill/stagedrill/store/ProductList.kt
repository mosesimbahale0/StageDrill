package com.stagedrill.stagedrill.store

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.stagedrill.stagedrill.ui.theme.*

/**
 * Data model representing a product in the Bagein store.
 */
data class Product(
    val id: String,
    val name: String,
    val price: Double,
    val category: String,
    val description: String,
    val accentColor: Color,
    val isFeatured: Boolean = false,
    val isRecommended: Boolean = false,
    val isNearYou: Boolean = false
)

/**
 * Data provider containing sample products and utility methods for the Bagein store.
 */
class ProductList {
    val samples = listOf(
        Product(
            id = "1",
            name = "Organic Green Tea",
            price = 12.99,
            category = "Beverages",
            description = "Premium hand-picked tea leaves from sustainable farms.",
            accentColor = BrandColor,
            isFeatured = true
        ),
        Product(
            id = "2",
            name = "Bamboo Fiber Shirt",
            price = 45.00,
            category = "Apparel",
            description = "Eco-friendly, breathable fabric in a deep forest green.",
            accentColor = Color(0xFF194F1C),
            isRecommended = true
        ),
        Product(
            id = "3",
            name = "Mint Condition Planner",
            price = 18.50,
            category = "Stationery",
            description = "Keep your schedule organized with our recycled paper planner.",
            accentColor = Color(0xFFA8FFC5),
            isNearYou = true
        ),
        Product(
            id = "4",
            name = "Recycled Glass Vase",
            price = 32.00,
            category = "Home Decor",
            description = "Beautifully crafted vase made from 100% recycled glass.",
            accentColor = Color(0xFF39B54A),
            isFeatured = true
        ),
        Product(
            id = "5",
            name = "Forest Moss Candle",
            price = 22.00,
            category = "Home Decor",
            description = "A refreshing scent that brings the forest into your home.",
            accentColor = Color(0xFF39B545),
            isRecommended = true
        ),
        Product(
            id = "6",
            name = "Reusable Coffee Cup",
            price = 15.99,
            category = "Lifestyle",
            description = "Keep your drinks hot and the planet cool with this glass cup.",
            accentColor = Color(0xFF39B53F),
            isNearYou = true
        ),
        Product(
            id = "7",
            name = "Solar Power Bank",
            price = 59.99,
            category = "Electronics",
            description = "Charge your devices on the go with renewable energy.",
            accentColor = Color(0xFFFFA000),
            isFeatured = true
        ),
        Product(
            id = "8",
            name = "Hemp Backpack",
            price = 75.00,
            category = "Apparel",
            description = "Durable and stylish backpack made from industrial hemp.",
            accentColor = Color(0xFF795548),
            isRecommended = true
        )
    )
}

/**
 * A sample screen displaying a grid of products with search, categories, and horizontal sections.
 */
@Composable
fun ProductListScreen(
    onProductClick: (Product) -> Unit = {}
) {
    val allProducts = ProductList().samples
    val featured = allProducts.filter { it.isFeatured }
    val recommended = allProducts.filter { it.isRecommended }
    val nearYou = allProducts.filter { it.isNearYou }

    val categories = listOf("All", "Accessories", "Services", "Electronics", "Apparel", "Home Decor")
    var selectedCategory by remember { mutableStateOf("All") }
    var searchQuery by remember { mutableStateOf("") }

    LazyVerticalGrid(
        columns = GridCells.Fixed(2),
        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 0.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        // 1. Search Bar
        item(span = { GridItemSpan(maxLineSpan) }) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                placeholder = { Text("Search products, merchants...", style = MaterialTheme.typography.bodyMedium) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, modifier = Modifier.size(20.dp)) },
                shape = RoundedCornerShape(24.dp),
                singleLine = true,
                textStyle = MaterialTheme.typography.bodyMedium
            )
        }

        // 2. Categories Bar
        item(span = { GridItemSpan(maxLineSpan) }) {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                contentPadding = PaddingValues(vertical = 4.dp)
            ) {
                items(categories) { category ->
                    val isSelected = selectedCategory == category
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedCategory = category },
                        label = {
                            Text(
                                text = category,
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                            )
                        },
                        shape = RoundedCornerShape(8.dp),
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = BrandColor.copy(alpha = 0.1f),
                            selectedLabelColor = BrandColor,
                            containerColor = Color.Transparent,
                            labelColor = MaterialTheme.colorScheme.onSurfaceVariant
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            borderColor = if (isSelected) BrandColor else MaterialTheme.colorScheme.outline.copy(alpha = 0.2f),
                            selectedBorderColor = BrandColor,
                            borderWidth = 1.dp,
                            selected = isSelected, // Fix: passed 'selected' parameter
                            enabled = true         // Fix: passed 'enabled' parameter
                        )
                    )
                }
            }
        }

        // 3. Featured Products Section
        item(span = { GridItemSpan(maxLineSpan) }) {
            HorizontalProductSection(
                title = "Featured Products",
                products = featured,
                onProductClick = onProductClick
            )
        }

        // 4. Recommended Section
        item(span = { GridItemSpan(maxLineSpan) }) {
            HorizontalProductSection(
                title = "Recommended For You",
                products = recommended,
                onProductClick = onProductClick
            )
        }

        // 5. Near You Section
        item(span = { GridItemSpan(maxLineSpan) }) {
            HorizontalProductSection(
                title = "Near You",
                products = nearYou,
                onProductClick = onProductClick
            )
        }

        // 6. All Products Header
        item(span = { GridItemSpan(maxLineSpan) }) {
            Text(
                text = "All Products",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(top = 16.dp, bottom = 4.dp)
            )
        }

        // 7. All Products Vertical Grid
        items(allProducts) { product ->
            ProductCard(product = product, onClick = { onProductClick(product) })
        }

        item(span = { GridItemSpan(maxLineSpan) }) {
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun HorizontalProductSection(
    title: String,
    products: List<Product>,
    onProductClick: (Product) -> Unit
) {
    Column {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "See all",
                style = MaterialTheme.typography.labelLarge,
                color = BrandColor,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.clickable { /* See all logic */ }
            )
        }
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(bottom = 4.dp)
        ) {
            items(products) { product ->
                ProductCard(
                    product = product,
                    onClick = { onProductClick(product) },
                    modifier = Modifier.width(140.dp)
                )
            }
        }
    }
}

/**
 * A card component that displays individual product details.
 */
@Composable
fun ProductCard(
    product: Product,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isHorizontal = modifier != Modifier

    Column(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .clickable { onClick() }
    ) {
        // Image Container
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f)
                .clip(RoundedCornerShape(12.dp))
                .background(product.accentColor.copy(alpha = 0.08f)),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(if (isHorizontal) 48.dp else 64.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(product.accentColor)
            )
        }

        // Content
        Column(
            modifier = Modifier.padding(vertical = 8.dp, horizontal = 2.dp)
        ) {
            Text(
                text = product.name,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                color = MaterialTheme.colorScheme.onSurface
            )

            Text(
                text = product.category,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "$${product.price}",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )

                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = BrandColor.copy(alpha = 0.1f),
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = null,
                        tint = BrandColor,
                        modifier = Modifier.padding(4.dp)
                    )
                }
            }
        }
    }
}
