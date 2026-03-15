package com.stagedrill.stagedrill.template

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.stagedrill.stagedrill.ui.theme.BrandColor

/**
 * Data model representing an interview preparation template.
 */
data class Template(
    val id: String,
    val title: String,
    val description: String,
    val difficulty: String,
    val category: String,
    val icon: ImageVector,
    val accentColor: Color
)

/**
 * Provider for sample templates.
 */
class TemplateProvider {
    val samples = listOf(
        Template(
            id = "T1",
            title = "STAR Method Guide",
            description = "Master behavioral questions using the Situation, Task, Action, and Result framework.",
            difficulty = "Beginner",
            category = "Behavioral",
            icon = Icons.Default.Star,
            accentColor = Color(0xFFFFC107)
        ),
        Template(
            id = "T2",
            title = "System Design Checklist",
            description = "A comprehensive checklist for scaling applications and microservices.",
            difficulty = "Advanced",
            category = "Architecture",
            icon = Icons.Default.Description,
            accentColor = Color(0xFF2196F3)
        ),
        Template(
            id = "T3",
            title = "DSA Problem Solving",
            description = "Step-by-step approach to tackle coding challenges under pressure.",
            difficulty = "Intermediate",
            category = "Technical",
            icon = Icons.Default.Description,
            accentColor = Color(0xFF4CAF50)
        ),
        Template(
            id = "T4",
            title = "Salary Negotiation",
            description = "Templates and scripts for handling the compensation conversation.",
            difficulty = "Intermediate",
            category = "HR",
            icon = Icons.Default.Description,
            accentColor = Color(0xFF9C27B0)
        ),
        Template(
            id = "T5",
            title = "First Principles Thinking",
            description = "Framework for breaking down complex problems into basic truths.",
            difficulty = "Expert",
            category = "Logic",
            icon = Icons.Default.Description,
            accentColor = Color(0xFFF44336)
        )
    )
}

/**
 * A screen that displays a list of interview preparation templates.
 */
@Composable
fun TemplateListScreen(
    onTemplateClick: (Template) -> Unit = {}
) {
    val templates = TemplateProvider().samples

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Text(
                    text = "Preparation Templates",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
            }
            items(templates) { template ->
                TemplateCard(template = template, onClick = { onTemplateClick(template) })
            }
        }
    }
}

/**
 * A card representing a single template.
 */
@Composable
fun TemplateCard(
    template: Template,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .height(IntrinsicSize.Min),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(template.accentColor.copy(alpha = 0.1f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = template.icon,
                    contentDescription = null,
                    tint = template.accentColor,
                    modifier = Modifier.size(28.dp)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = template.category,
                        style = MaterialTheme.typography.labelSmall,
                        color = BrandColor,
                        fontWeight = FontWeight.Bold
                    )
                    
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = MaterialTheme.colorScheme.secondaryContainer,
                        contentColor = MaterialTheme.colorScheme.onSecondaryContainer
                    ) {
                        Text(
                            text = template.difficulty,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = template.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Text(
                    text = template.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}
