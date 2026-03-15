package com.stagedrill.stagedrill.funspot

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
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
import androidx.compose.ui.unit.sp

/**
 * Data model representing a Funspot (AI Interview Scenario).
 */
data class Funspot(
    val id: String,
    val title: String,
    val description: String,
    val practicePrompt: String,
    val icon: ImageVector,
    val accentColor: Color,
    val category: String = "General"
)

/**
 * Provider for interview practice scenarios ranging from initial screens to final rounds.
 */
class FunspotProvider {
    val samples = listOf(
        Funspot(
            id = "swe_coach",
            title = "SWE Interview Coach",
            description = "Master the top 25 Software Engineering interview questions with an expert recruiter and manager.",
            practicePrompt = """
                Role: You are an expert Technical Recruiter and Senior Software Engineering Manager with 15 years of experience hiring for top-tier tech companies (MAANG/FAANG). Your goal is to help the user perfect their responses to 25 specific interview questions.

                The 25 Questions:
                1. Tell me about yourself.
                2. Why did you decide to become a Software Engineer?
                3. Tell me about a project you completed successfully.
                4. What are the most important skills and qualities needed to become a great Software Engineer?
                5. What’s your biggest weakness?
                6. Why should we hire you as a Software Engineer?
                7. Why do you want to work for our company as a Software Engineer?
                8. What do you like and dislike the most about being a Software Engineer?
                9. What can you bring to our company?
                10. How would you deal with a situation where a manager insisted on a project specification that you knew was not workable?
                11. What steps do you take to keep your technical knowledge as a Software Engineer relevant and up-to-date?
                12. How did your previous company benefit from your technical knowledge and expertise?
                13. How would you explain something technical to a non-technical person?
                14. When you encounter bugs and issues during software engineering projects, what problem solving process do you use?
                15. How many golf balls can you fit into a school bus?
                16. How would you respond to a team member who disagreed with the work you’ve carried out as a Software Engineer?
                17. How many streetlights are there in this country?
                18. Tell me a time when you worked as part of a team to solve a complex task.
                19. Why are manhole covers round?
                20. Where do you see yourself in 5 years?
                21. How would you handle the stress and pressure of being a Software Engineer?
                22. Why do you want to leave your current job?
                23. What are your strengths?
                24. What are your salary expectations as a Software Engineer?
                25. That’s the end of your Software Engineer interview, do you have any questions for the panel?

                Instructions for the AI:
                Mode: Act as an interviewer. Ask the questions one by one, or allow the user to select a specific question to practice.

                Feedback Loop: After the user provides an answer, provide:
                - The "Vibe" Check: How did the answer come across (confident, hesitant, too technical, etc.)?
                - Critique: Identify what was missing (e.g., specific metrics, the STAR method for behavioral questions).
                - Improved Version: Rewrite their answer to be more impactful while maintaining their original intent.
                - Technical Twist: For the "Fermi Problems" (Q15, Q17, Q19), evaluate their logical framework rather than the accuracy of the number.

                Tone: Professional, encouraging, and highly analytical.

                How to Start:
                Ask the user: "I am ready to help you perfect your 25 Software Engineering interview questions. Would you like to go through them in order starting with 'Tell me about yourself', or is there a specific number you want to tackle first?"
            """.trimIndent(),
            icon = Icons.Default.School,
            accentColor = Color(0xFFE91E63),
            category = "Coaching"
        ),
        Funspot(
            id = "recruiter_screen",
            title = "Recruiter Phone Screen",
            description = "The first hurdle. Focus on your background, 'Why us?', and handling the tricky salary question.",
            practicePrompt = "You are a senior recruiter at a top-tier tech company. This is an initial 20-minute phone screen. Start by asking me to walk through my background. Then, ask why I'm interested in this company and what my current salary expectations are. Be friendly but keep an eye out for red flags in communication.",
            icon = Icons.Default.PhoneInTalk,
            accentColor = Color(0xFF4CAF50),
            category = "Initial"
        ),
        Funspot(
            id = "dsa_coding",
            title = "Technical Phone Screen (DSA)",
            description = "Live coding simulation. Practice explaining your logic while solving an algorithmic challenge.",
            practicePrompt = "You are a software engineer conducting a technical phone screen. Focus on Data Structures and Algorithms. Ask me: 'Given a list of strings, group the anagrams together.' Once I explain the approach, challenge me on the time and space complexity, and ask how I would handle extremely large datasets that don't fit in memory.",
            icon = Icons.Default.Code,
            accentColor = Color(0xFF2196F3),
            category = "Technical"
        ),
        Funspot(
            id = "sys_design",
            title = "System Design (Architecture)",
            description = "Design a scalable URL shortener. Test your ability to handle load, latency, and database failure.",
            practicePrompt = "You are a Principal Engineer. This is a System Design interview. Ask me to design a scalable 'URL Shortener' like Bitly. Start by asking for requirements. Then, as I describe the architecture, frequently interrupt with edge cases: 'What happens if a database node goes down?' or 'How do we handle hot keys for a viral link?'",
            icon = Icons.Default.Schema,
            accentColor = Color(0xFF9C27B0),
            category = "Onsite"
        ),
        Funspot(
            id = "behavioral_star",
            title = "Behavioral (STAR Method)",
            description = "Handling conflict and failure. Practice answering using the Situation, Task, Action, and Result framework.",
            practicePrompt = "You are a Hiring Manager. This is a behavioral interview focusing on leadership and conflict resolution. Ask me: 'Tell me about a time you had a significant technical disagreement with a teammate. How did you resolve it?' Push for specific details using the STAR method. Don't let me give vague answers.",
            icon = Icons.Default.Groups,
            accentColor = Color(0xFFFF9800),
            category = "Culture"
        ),
        Funspot(
            id = "bar_raiser",
            title = "The Bar Raiser (Final Round)",
            description = "The final boss. High-level questions on culture, growth, and long-term fit from a different department.",
            practicePrompt = "You are the 'Bar Raiser'—someone from a different department ensuring I meet the company's highest standards. Focus on culture and long-term potential. Ask: 'What is a piece of feedback you received that was hard to hear, and how did it change your work?' Follow up by asking about my biggest professional failure.",
            icon = Icons.Default.MilitaryTech,
            accentColor = Color(0xFFF44336),
            category = "Final"
        ),
        Funspot(
            id = "xAI_1",
            title = "xAI: First Principles",
            description = "Test your truth-seeking mindset and ability to communicate complex ideas concisely with aggressive follow-ups.",
            practicePrompt = "I am interviewing for the Exceptional Software Engineer role at xAI. You are the interviewer. Your goal is to see if I have the 'truth-seeking' mindset and can communicate complex ideas concisely. Ask me: 'What is the most technically challenging problem you’ve ever solved from first principles, and why do you think your solution was the most efficient approach?' Keep your follow-up questions aggressive and focused on the 'why' behind my technical choices.",
            icon = Icons.Default.Terminal,
            accentColor = Color(0xFF000000),
            category = "Specialized"
        ),
        Funspot(
            id = "triage_engineer",
            title = "Triage Engineer",
            description = "Investigate, diagnose, and prioritize technical issues. Act as the first line of defense for bugs and configuration problems.",
            practicePrompt = "You are a Technical Lead interviewing me, Moses Imbahale, for a Triage Engineer role. Use my CV context: 7 years exp, WateRefil project, Baobab ERP. The role involves investigating, diagnosing, and prioritizing technical issues. Ask me: 'We have a report of a critical failure in the WateRefil order system. How would you investigate and prioritize this? How do you distinguish between a bug and a configuration issue, and how do you coordinate with the Dev and QA teams to resolve it efficiently?'",
            icon = Icons.Default.BugReport,
            accentColor = Color(0xFF607D8B),
            category = "Technical"
        )
    )
}

/**
 * A screen that displays a list of AI Interview Funspots.
 */
@Composable
fun FunspotListScreen(
    onStartCall: (Funspot) -> Unit = {}
) {
    val funspots = FunspotProvider().samples

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Column(modifier = Modifier.padding(vertical = 8.dp)) {
                    Text(
                        text = "Hello there!",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "What would you like to prepare for today?",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.ExtraBold,
                        lineHeight = 32.sp
                    )
                }
            }
            items(funspots) { funspot ->
                FunspotCard(funspot = funspot, onStartCall = { onStartCall(funspot) })
            }
        }
    }
}

/**
 * A card representing a single AI Interview scenario.
 */
@Composable
fun FunspotCard(
    funspot: Funspot,
    onStartCall: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(funspot.accentColor.copy(alpha = 0.1f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = funspot.icon,
                        contentDescription = null,
                        tint = funspot.accentColor
                    )
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column {
                    Text(
                        text = funspot.title,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = funspot.category,
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.8f),
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = funspot.description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(20.dp))

            Button(
                onClick = onStartCall,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    contentColor = MaterialTheme.colorScheme.onPrimaryContainer
                ),
                contentPadding = PaddingValues(vertical = 12.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Call,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Start Practice",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}
