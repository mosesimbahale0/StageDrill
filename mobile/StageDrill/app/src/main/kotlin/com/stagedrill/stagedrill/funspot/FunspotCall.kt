package com.stagedrill.stagedrill.funspot

import android.Manifest
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.speech.tts.Voice
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import com.stagedrill.stagedrill.BuildConfig
import com.stagedrill.stagedrill.ui.theme.BrandColor
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.*

data class InterviewMessage(
    val text: String,
    val isAi: Boolean,
    val timestamp: Long = System.currentTimeMillis()
)

/**
 * ViewModel handling Gemini interaction and Text-to-Speech state.
 */
class FunspotCallViewModel : ViewModel() {
    private val _status = MutableStateFlow("Initializing...")
    val status: StateFlow<String> = _status.asStateFlow()

    private val _messages = MutableStateFlow<List<InterviewMessage>>(emptyList())
    val messages: StateFlow<List<InterviewMessage>> = _messages.asStateFlow()

    private val _isSpeaking = MutableStateFlow(false)
    val isSpeaking: StateFlow<Boolean> = _isSpeaking.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _selectedVoice = MutableStateFlow<Voice?>(null)
    val selectedVoice: StateFlow<Voice?> = _selectedVoice.asStateFlow()

    private var generativeModel: GenerativeModel? = null
    private var chatHandler: com.google.ai.client.generativeai.Chat? = null
    private var tts: TextToSpeech? = null

    fun initTts(context: Context) {
        if (tts != null) return
        tts = TextToSpeech(context) { status ->
            if (status == TextToSpeech.SUCCESS) {
                tts?.let { t ->
                    t.language = Locale.US
                    val voices = t.voices?.filter { it.locale.language == Locale.US.language } ?: emptyList()
                    
                    // Try to find "vega" voice as default if available
                    val vegaVoice = voices.find { it.name.contains("vega", ignoreCase = true) }
                    if (vegaVoice != null) {
                        t.voice = vegaVoice
                        _selectedVoice.value = vegaVoice
                    } else {
                        val defaultVoice = voices.firstOrNull()
                        if (defaultVoice != null) {
                            t.voice = defaultVoice
                            _selectedVoice.value = defaultVoice
                        }
                    }
                }
            }
        }
    }

    fun startSession(systemPrompt: String) {
        if (chatHandler != null) return
        
        generativeModel = GenerativeModel(
            modelName = "gemini-3-flash-preview", 
            apiKey = BuildConfig.GEMINI_API_KEY,
            systemInstruction = content { text(systemPrompt) }
        )
        chatHandler = generativeModel?.startChat()

        viewModelScope.launch {
            _isLoading.value = true
            _status.value = "Interviewer is joining..."
            try {
                val response = chatHandler?.sendMessage("Start the interview by introducing yourself.")
                handleAiResponse(response?.text ?: "Hello, let's begin.")
            } catch (e: Exception) {
                _status.value = "Error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun handleAiResponse(text: String) {
        _messages.value += InterviewMessage(text, isAi = true)
        _status.value = "Listening..."
        _isSpeaking.value = true
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "ID")
        
        // Simple mock to reset speaking state after estimate (better to use UtteranceProgressListener)
        viewModelScope.launch {
            val words = text.split(" ").size
            kotlinx.coroutines.delay(words * 400L) 
            _isSpeaking.value = false
        }
    }

    fun sendVoiceInput(text: String) {
        if (text.isBlank()) return
        _messages.value += InterviewMessage(text, isAi = false)
        
        viewModelScope.launch {
            _isLoading.value = true
            _status.value = "Interviewer is thinking..."
            try {
                val response = chatHandler?.sendMessage(text)
                handleAiResponse(response?.text ?: "I see. Proceed.")
            } catch (e: Exception) {
                _status.value = "Connection lost. Try again."
            } finally {
                _isLoading.value = false
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        tts?.stop()
        tts?.shutdown()
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FunspotCallScreen(
    prompt: String,
    title: String,
    viewModel: FunspotCallViewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
    onNavigateUp: () -> Unit
) {
    val context = LocalContext.current
    val status by viewModel.status.collectAsState()
    val isSpeaking by viewModel.isSpeaking.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val messages by viewModel.messages.collectAsState()

    var isListening by remember { mutableStateOf(false) }
    var showHistory by remember { mutableStateOf(false) }
    val sheetState = rememberModalBottomSheetState()
    val speechRecognizer = remember { SpeechRecognizer.createSpeechRecognizer(context) }
    
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (!isGranted) onNavigateUp()
    }

    LaunchedEffect(Unit) {
        permissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
        viewModel.initTts(context)
        viewModel.startSession(prompt)
    }

    // Speech Recognizer Logic
    DisposableEffect(Unit) {
        val listener = object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) { isListening = true }
            override fun onBeginningOfSpeech() {}
            override fun onRmsChanged(rmsdB: Float) {}
            override fun onBufferReceived(buffer: ByteArray?) {}
            override fun onEndOfSpeech() { isListening = false }
            override fun onError(error: Int) { isListening = false }
            override fun onResults(results: Bundle?) {
                val data = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                data?.firstOrNull()?.let { viewModel.sendVoiceInput(it) }
            }
            override fun onPartialResults(partialResults: Bundle?) {}
            override fun onEvent(eventType: Int, params: Bundle?) {}
        }
        speechRecognizer.setRecognitionListener(listener)
        onDispose { speechRecognizer.destroy() }
    }

    fun startListening() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
        }
        speechRecognizer.startListening(intent)
    }

    // UI Layout
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Message History Trigger
        IconButton(
            onClick = { showHistory = true },
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(16.dp)
                .padding(top = 16.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Chat,
                contentDescription = "Show Transcript",
                tint = BrandColor
            )
        }

        // Top Info
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 80.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Surface(
                color = BrandColor.copy(alpha = 0.1f),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text(
                    text = title,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                    style = MaterialTheme.typography.labelLarge,
                    color = BrandColor,
                    fontWeight = FontWeight.Bold
                )
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = status,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Center Visualizer
        Box(
            modifier = Modifier.align(Alignment.Center),
            contentAlignment = Alignment.Center
        ) {
            val infiniteTransition = rememberInfiniteTransition(label = "pulse")
            val scale by infiniteTransition.animateFloat(
                initialValue = 1f,
                targetValue = if (isSpeaking || isListening) 1.2f else 1f,
                animationSpec = infiniteRepeatable(
                    animation = tween(1000, easing = LinearOutSlowInEasing),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "scale"
            )

            // Outer Pulse Rings
            if (isSpeaking || isListening) {
                Box(
                    modifier = Modifier
                        .size(240.dp)
                        .scale(scale)
                        .clip(CircleShape)
                        .background(BrandColor.copy(alpha = 0.1f))
                )
                Box(
                    modifier = Modifier
                        .size(200.dp)
                        .scale(scale * 0.9f)
                        .clip(CircleShape)
                        .background(BrandColor.copy(alpha = 0.2f))
                )
            }

            // Main Icon Circle
            Box(
                modifier = Modifier
                    .size(160.dp)
                    .clip(CircleShape)
                    .background(if (isListening) BrandColor else MaterialTheme.colorScheme.surfaceVariant)
                    .border(4.dp, BrandColor.copy(alpha = 0.5f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (isSpeaking) Icons.Default.VolumeUp else Icons.Default.Mic,
                    contentDescription = null,
                    modifier = Modifier.size(64.dp),
                    tint = if (isListening) Color.White else BrandColor
                )
            }
        }

        // Bottom Controls
        Row(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 64.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // End Call Button
            LargeIconButton(
                onClick = onNavigateUp,
                icon = Icons.Default.CallEnd,
                containerColor = Color(0xFFE53935)
            )

            // Mic Button (Hold to talk or tap)
            LargeIconButton(
                onClick = { 
                    if (isListening) speechRecognizer.stopListening() else startListening()
                },
                icon = if (isListening) Icons.Default.Mic else Icons.Default.MicOff,
                containerColor = if (isListening) BrandColor else MaterialTheme.colorScheme.surfaceVariant,
                iconColor = if (isListening) Color.White else MaterialTheme.colorScheme.onSurface,
                isLoading = isLoading
            )
        }

        // Message History Sheet
        if (showHistory) {
            ModalBottomSheet(
                onDismissRequest = { showHistory = false },
                sheetState = sheetState,
                containerColor = MaterialTheme.colorScheme.surface,
                dragHandle = { BottomSheetDefaults.DragHandle() }
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .fillMaxHeight(0.7f)
                        .padding(horizontal = 16.dp)
                ) {
                    Text(
                        text = "Call Transcript",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(bottom = 16.dp)
                    )
                    
                    LazyColumn(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        contentPadding = PaddingValues(bottom = 24.dp)
                    ) {
                        items(messages) { message ->
                            TranscriptItem(message)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TranscriptItem(message: InterviewMessage) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = if (message.isAi) Alignment.Start else Alignment.End
    ) {
        Surface(
            color = if (message.isAi) MaterialTheme.colorScheme.surfaceVariant else BrandColor,
            shape = RoundedCornerShape(
                topStart = 16.dp,
                topEnd = 16.dp,
                bottomStart = if (message.isAi) 4.dp else 16.dp,
                bottomEnd = if (message.isAi) 16.dp else 4.dp
            )
        ) {
            Text(
                text = message.text,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                style = MaterialTheme.typography.bodyMedium,
                color = if (message.isAi) MaterialTheme.colorScheme.onSurfaceVariant else Color.White
            )
        }
    }
}

@Composable
fun LargeIconButton(
    onClick: () -> Unit,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    containerColor: Color,
    iconColor: Color = Color.White,
    isLoading: Boolean = false
) {
    Box(contentAlignment = Alignment.Center) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(84.dp),
                color = BrandColor,
                strokeWidth = 2.dp
            )
        }
        
        FilledIconButton(
            onClick = onClick,
            modifier = Modifier.size(72.dp),
            colors = IconButtonDefaults.filledIconButtonColors(
                containerColor = containerColor,
                contentColor = iconColor
            )
        ) {
            Icon(icon, contentDescription = null, modifier = Modifier.size(32.dp))
        }
    }
}
