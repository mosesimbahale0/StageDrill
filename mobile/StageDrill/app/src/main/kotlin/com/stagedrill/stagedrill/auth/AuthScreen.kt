package com.stagedrill.stagedrill.auth

import android.app.Activity
import android.util.Log
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.ClickableText
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Error
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.stagedrill.stagedrill.LocalNetworkStatus
import com.stagedrill.stagedrill.common.NetworkStatus
import com.stagedrill.stagedrill.common.PrimaryButton
import com.google.firebase.FirebaseException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import kotlinx.coroutines.delay
import java.util.concurrent.TimeUnit
import com.stagedrill.stagedrill.R

// --- UI STATES ---
sealed class UiState {
    object PhoneNumberEntry : UiState()
    object OtpVerification : UiState()
    object VerificationSuccess : UiState()
}

// --- MAIN SCREEN ---
@Composable
fun PhoneAuthScreen(
    auth: FirebaseAuth,
    onSignInSuccess: () -> Unit
) {
    val networkStatus = LocalNetworkStatus.current

    if (networkStatus is NetworkStatus.Unavailable) {
        NoInternetAuthScreen()
    } else {
        AuthFlow(auth = auth, onSignInSuccess = onSignInSuccess)
    }
}

@Composable
private fun NoInternetAuthScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            painter = painterResource(id = R.drawable.ic_placeholder), // Ensure this drawable exists
            contentDescription = "No Internet",
            modifier = Modifier.size(60.dp),
            tint = MaterialTheme.colorScheme.error
        )
        Spacer(modifier = Modifier.height(24.dp))
        Text(
            text = "Internet Connection Required",
            style = MaterialTheme.typography.headlineSmall,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Please connect to the internet to continue.",
            textAlign = TextAlign.Center,
            style = MaterialTheme.typography.bodyMedium
        )
    }
}

@Composable
private fun AuthFlow(
    auth: FirebaseAuth,
    onSignInSuccess: () -> Unit
) {
    var uiState by remember { mutableStateOf<UiState>(UiState.PhoneNumberEntry) }
    var localPhoneNumber by remember { mutableStateOf("") }

    // Initialize selected country (Default to Kenya or first in list)
    // Assumes 'countries' list is defined globally or in the package
    var selectedCountry by remember {
        mutableStateOf(countries.find { it.name == "Kenya" } ?: countries.first())
    }

    var otp by remember { mutableStateOf("") }
    var verificationId by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val context = LocalContext.current
    val activity = context as? Activity

    val callbacks = remember {
        object : PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
            override fun onVerificationCompleted(credential: PhoneAuthCredential) {
                Log.d("Auth", "onVerificationCompleted:$credential")

                val smsCode = credential.smsCode
                if (!smsCode.isNullOrEmpty()) {
                    otp = smsCode
                }

                isLoading = true
                auth.signInWithCredential(credential).addOnCompleteListener { task ->
                    isLoading = false
                    if (task.isSuccessful) {
                        uiState = UiState.VerificationSuccess
                        errorMessage = null
                    } else {
                        errorMessage = task.exception?.message ?: "Automatic sign-in failed."
                    }
                }
            }

            override fun onVerificationFailed(e: FirebaseException) {
                Log.w("Auth", "onVerificationFailed", e)
                isLoading = false
                errorMessage = "Verification failed. ${e.localizedMessage}"
            }

            override fun onCodeSent(
                sentVerificationId: String,
                token: PhoneAuthProvider.ForceResendingToken
            ) {
                Log.d("Auth", "onCodeSent:$sentVerificationId")
                isLoading = false
                verificationId = sentVerificationId
                uiState = UiState.OtpVerification
                errorMessage = null
            }
        }
    }

    Scaffold { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues)) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                when (uiState) {
                    is UiState.PhoneNumberEntry -> {
                        PhoneNumberEntryScreen(
                            localPhoneNumber = localPhoneNumber,
                            onLocalPhoneNumberChange = { localPhoneNumber = it },
                            selectedCountry = selectedCountry,
                            onCountrySelected = { selectedCountry = it },
                            onSendCodeClick = {
                                if (activity != null) {
                                    isLoading = true
                                    errorMessage = null
                                    val fullPhoneNumber = selectedCountry.code + localPhoneNumber
                                    val options = PhoneAuthOptions.newBuilder(auth)
                                        .setPhoneNumber(fullPhoneNumber)
                                        .setTimeout(60L, TimeUnit.SECONDS)
                                        .setActivity(activity)
                                        .setCallbacks(callbacks)
                                        .build()
                                    PhoneAuthProvider.verifyPhoneNumber(options)
                                } else {
                                    errorMessage = "Cannot find activity to start verification."
                                }
                            }
                        )
                    }

                    is UiState.OtpVerification -> {
                        OtpVerificationScreen(
                            otp = otp,
                            phoneNumber = "${selectedCountry.code} $localPhoneNumber",
                            onOtpChange = {
                                otp = it
                                // Optional: Auto-submit when 6 digits reached
                            },
                            onVerifyClick = {
                                verificationId?.let { verId ->
                                    isLoading = true
                                    val credential = PhoneAuthProvider.getCredential(verId, otp)
                                    auth.signInWithCredential(credential)
                                        .addOnCompleteListener { task ->
                                            isLoading = false
                                            if (task.isSuccessful) {
                                                uiState = UiState.VerificationSuccess
                                                errorMessage = null
                                            } else {
                                                errorMessage = "Incorrect OTP. Please try again."
                                            }
                                        }
                                }
                            },
                            onChangeNumber = {
                                uiState = UiState.PhoneNumberEntry
                                otp = ""
                                errorMessage = null
                            }
                        )
                    }

                    is UiState.VerificationSuccess -> {
                        VerificationSuccessScreen(
                            userPhoneNumber = auth.currentUser?.phoneNumber ?: "No phone number",
                            onContinue = onSignInSuccess
                        )
                    }
                }

                // Error Message Display
                errorMessage?.let {
                    Spacer(modifier = Modifier.height(16.dp))
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = it,
                            color = MaterialTheme.colorScheme.onErrorContainer,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.padding(16.dp)
                        )
                    }
                }
            }

            // Loading Overlay
            if (isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(MaterialTheme.colorScheme.background.copy(alpha = 0.7f)),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
        }
    }
}

@Composable
fun PhoneNumberEntryScreen(
    localPhoneNumber: String,
    onLocalPhoneNumberChange: (String) -> Unit,
    selectedCountry: Country,
    onCountrySelected: (Country) -> Unit,
    onSendCodeClick: () -> Unit
) {
    var confirmPhoneNumber by remember { mutableStateOf("") }
    val uriHandler = LocalUriHandler.current
    val focusManager = LocalFocusManager.current

    // Validation logic
    val isMatch = localPhoneNumber.isNotEmpty() && localPhoneNumber == confirmPhoneNumber
    val isValidLength = localPhoneNumber.length >= 9

    Image(
        painter = painterResource(id = R.drawable.app_logo),
        contentDescription = "App Logo",
        modifier = Modifier.size(80.dp)
    )

    Spacer(modifier = Modifier.height(24.dp))

    Text(
        text = "Verify your number",
        style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold)
    )

    Text(
        text = "We will send you a code to verify your identity.",
        textAlign = TextAlign.Center,
        style = MaterialTheme.typography.bodyMedium,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = Modifier.padding(top = 8.dp, bottom = 32.dp)
    )

    // 1. Country Selector (Full Width)
    CountrySelector(
        selectedCountry = selectedCountry,
        onCountrySelected = onCountrySelected
    )

    Spacer(modifier = Modifier.height(16.dp))

    // 2. Phone Input (Full Width)
    OutlinedTextField(
        value = localPhoneNumber,
        onValueChange = { if (it.all { char -> char.isDigit() }) onLocalPhoneNumberChange(it) },
        label = { Text("Phone Number") },
        // Optional: Show the code as a prefix for better context
        prefix = { Text(selectedCountry.code) },
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Phone,
            imeAction = ImeAction.Next
        ),
        keyboardActions = KeyboardActions(onNext = { focusManager.moveFocus(FocusDirection.Down) }),
        singleLine = true,
        modifier = Modifier.fillMaxWidth()
    )

    Spacer(modifier = Modifier.height(16.dp))

    // --- Double Entry Confirmation Input ---
    OutlinedTextField(
        value = confirmPhoneNumber,
        onValueChange = { if (it.all { char -> char.isDigit() }) confirmPhoneNumber = it },
        label = { Text("Confirm Phone Number") },
        prefix = { Text(selectedCountry.code) },
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Phone,
            imeAction = ImeAction.Done
        ),
        keyboardActions = KeyboardActions(onDone = {
            focusManager.clearFocus()
            if (isMatch && isValidLength) onSendCodeClick()
        }),
        singleLine = true,
        modifier = Modifier.fillMaxWidth(),
        isError = confirmPhoneNumber.isNotEmpty() && !isMatch,
        trailingIcon = {
            if (confirmPhoneNumber.isNotEmpty()) {
                if (isMatch) {
                    Icon(Icons.Default.Check, contentDescription = "Match", tint = MaterialTheme.colorScheme.primary)
                } else {
                    Icon(Icons.Default.Error, contentDescription = "Mismatch", tint = MaterialTheme.colorScheme.error)
                }
            }
        }
    )

    // Error text for mismatch
    if (confirmPhoneNumber.isNotEmpty() && !isMatch) {
        Text(
            text = "Numbers do not match",
            color = MaterialTheme.colorScheme.error,
            style = MaterialTheme.typography.bodySmall,
            textAlign = TextAlign.Start,
            modifier = Modifier.fillMaxWidth().padding(start = 8.dp, top = 4.dp)
        )
    }

    Spacer(modifier = Modifier.height(32.dp))

    PrimaryButton(
        onClick = onSendCodeClick,
        enabled = isMatch && isValidLength,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text("Send Verification Code")
    }

    // --- Consent & Legal Text ---
    Spacer(modifier = Modifier.height(24.dp))

    val annotatedString = buildAnnotatedString {
        append("By tapping \"Send Verification Code\", you consent to receive an SMS for verification. Standard message and data rates may apply. You also agree to our ")
        pushStringAnnotation(tag = "TERMS", annotation = "https://waterefil.com/terms-and-conditions")
        withStyle(style = SpanStyle(color = MaterialTheme.colorScheme.primary, textDecoration = TextDecoration.Underline)) {
            append("Terms of Service")
        }
        pop()
        append(" and ")
        pushStringAnnotation(tag = "PRIVACY", annotation = "https://waterefil.com/privacy-policy")
        withStyle(style = SpanStyle(color = MaterialTheme.colorScheme.primary, textDecoration = TextDecoration.Underline)) {
            append("Privacy Policy")
        }
        pop()
        append(".")
    }

    ClickableText(
        text = annotatedString,
        style = MaterialTheme.typography.bodySmall.copy(
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        ),
        onClick = { offset ->
            annotatedString.getStringAnnotations(start = offset, end = offset).firstOrNull()?.let {
                uriHandler.openUri(it.item)
            }
        }
    )
}

/**
 * A separate component for the Country Dropdown.
 * This simulates a TextField look but acts as a dropdown trigger.
 */
@Composable
fun CountrySelector(
    selectedCountry: Country,
    onCountrySelected: (Country) -> Unit
) {
    var isDropdownExpanded by remember { mutableStateOf(false) }

    Box {
        // We use an OutlinedTextField with readOnly = true to match the style
        // and height of the adjacent phone input perfectly.
        OutlinedTextField(
            value = "${selectedCountry.flag}  ${selectedCountry.name} (${selectedCountry.code})",
            onValueChange = {},
            readOnly = true,
            enabled = false, // Disable typing, but we handle click on the Box
            modifier = Modifier
                .fillMaxWidth()
                .clickable { isDropdownExpanded = true }, // Make the whole box clickable
            label = { Text("Country") },
            trailingIcon = {
                Icon(
                    imageVector = Icons.Default.ArrowDropDown,
                    contentDescription = "Select Country"
                )
            },
            colors = OutlinedTextFieldDefaults.colors(
                disabledTextColor = MaterialTheme.colorScheme.onSurface,
                disabledBorderColor = MaterialTheme.colorScheme.outline,
                disabledLabelColor = MaterialTheme.colorScheme.onSurfaceVariant,
                disabledTrailingIconColor = MaterialTheme.colorScheme.onSurfaceVariant
            )
        )

        // Transparent surface to capture clicks over the disabled text field
        // This ensures the dropdown opens when tapping anywhere on the box
        Surface(
            modifier = Modifier
                .matchParentSize()
                .clickable { isDropdownExpanded = true },
            color = Color.Transparent
        ) {}

        DropdownMenu(
            expanded = isDropdownExpanded,
            onDismissRequest = { isDropdownExpanded = false },
            modifier = Modifier.heightIn(max = 300.dp)
        ) {
            countries.forEach { country ->
                DropdownMenuItem(
                    text = {
                        Text(
                            text = "${country.flag}  ${country.name} (${country.code})",
                            style = MaterialTheme.typography.bodyLarge
                        )
                    },
                    onClick = {
                        onCountrySelected(country)
                        isDropdownExpanded = false
                    }
                )
            }
        }
    }
}


@Composable
fun OtpVerificationScreen(
    otp: String,
    phoneNumber: String,
    onOtpChange: (String) -> Unit,
    onVerifyClick: () -> Unit,
    onChangeNumber: () -> Unit
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Image(
            painter = painterResource(id = R.drawable.app_logo),
            contentDescription = "App Logo",
            modifier = Modifier.size(60.dp)
        )
        Spacer(modifier = Modifier.height(24.dp))

        Text("Enter OTP", style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold))

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Enter the 6-digit code sent to",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = phoneNumber,
                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.SemiBold)
            )
            Spacer(modifier = Modifier.width(8.dp))
            TextButton(onClick = onChangeNumber) {
                Text("Edit")
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // --- CUSTOM OTP BOX UI ---
        OtpInputField(
            otpValue = otp,
            onOtpValueChange = onOtpChange
        )

        Spacer(modifier = Modifier.height(32.dp))

        PrimaryButton(
            onClick = onVerifyClick,
            enabled = otp.length == 6,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Verify & Sign In")
        }
    }
}

/**
 * Custom Composable for a 6-digit OTP input styled as separate boxes.
 */
@Composable
fun OtpInputField(
    otpValue: String,
    onOtpValueChange: (String) -> Unit
) {
    BasicTextField(
        value = otpValue,
        onValueChange = {
            if (it.length <= 6 && it.all { char -> char.isDigit() }) {
                onOtpValueChange(it)
            }
        },
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.NumberPassword,
            imeAction = ImeAction.Done
        ),
        decorationBox = {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                repeat(6) { index ->
                    val char = when {
                        index >= otpValue.length -> ""
                        else -> otpValue[index].toString()
                    }

                    val isFocused = otpValue.length == index

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .aspectRatio(0.8f) // Makes boxes slightly taller than wide
                            .border(
                                width = if (isFocused) 2.dp else 1.dp,
                                color = if (isFocused) MaterialTheme.colorScheme.primary
                                else MaterialTheme.colorScheme.outline,
                                shape = RoundedCornerShape(8.dp)
                            )
                            .background(MaterialTheme.colorScheme.surface),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = char,
                            style = MaterialTheme.typography.titleLarge,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }
    )
}

@Composable
fun VerificationSuccessScreen(userPhoneNumber: String, onContinue: () -> Unit) {
    LaunchedEffect(Unit) {
        delay(1500)
        onContinue()
    }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Default.Check,
            contentDescription = "Success",
            modifier = Modifier
                .size(80.dp)
                .background(MaterialTheme.colorScheme.primaryContainer, shape = RoundedCornerShape(50))
                .padding(16.dp),
            tint = MaterialTheme.colorScheme.onPrimaryContainer
        )
        Spacer(modifier = Modifier.height(24.dp))
        Text("Verified Successfully!", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Welcome back",
            style = MaterialTheme.typography.bodyLarge
        )
        Spacer(modifier = Modifier.height(32.dp))
        CircularProgressIndicator()
    }
}