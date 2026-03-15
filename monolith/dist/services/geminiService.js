import { GoogleGenAI } from '@google/genai'; // Keeping your original import
import * as dotenv from 'dotenv';
dotenv.config();
console.log('--- Gemini Service Initializing ---');
console.log('Timestamp:', new Date().toISOString());
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
const MODEL_ID = process.env.MODEL_ID || 'gemini-1.5-flash-latest'; // Using a generally available model as a fallback. Adjust if your original 'gemini-2.0-flash-lite-001' is valid for your setup.
if (!GEMINI_API_KEY) {
    console.error('CRITICAL ERROR: GOOGLE_API_KEY is not defined in .env file. Service might fail.');
}
else {
    console.log('GOOGLE_API_KEY loaded (first 5 chars):', GEMINI_API_KEY.substring(0, 5) + '...');
}
console.log('Using MODEL_ID:', MODEL_ID);
// Using your original SDK instantiation
let ai;
if (GEMINI_API_KEY) {
    try {
        ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); // Using your original instantiation
        console.log('GoogleGenAI SDK initialized successfully (as per original import).');
        // Note: If '@google/genai' is an older or different SDK, its methods might differ from '@google/generative-ai'.
    }
    catch (e) {
        console.error('Failed to initialize GoogleGenAI SDK:', e.message);
        console.error(e.stack);
    }
}
else {
    console.error('GoogleGenAI SDK not initialized due to missing API key.');
}
export async function sendToGemini(userMessage, // Assuming JS, type annotations removed for pure JS
history // Array<{ role: string; parts: string[] }>
) {
    console.log('\n--- Entering sendToGemini Function ---');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Received userMessage:', userMessage);
    console.log('Received history (raw):', JSON.stringify(history, null, 2));
    if (!ai) {
        console.error('Error: GoogleGenAI SDK (ai instance) is not initialized. Cannot send message.');
        throw new Error('Gemini AI SDK not initialized. Check API key and service setup.');
    }
    if (typeof userMessage !== 'string' || userMessage.trim() === '') {
        console.warn('Warning: userMessage is empty or not a string.');
    }
    if (!Array.isArray(history)) {
        console.warn('Warning: history is not an array.');
    }
    // Construct the conversation history (as per your original logic)
    console.log('Constructing prompt from history and userMessage...');
    const parts = history.map((h) => {
        const logPart = `${h.role.charAt(0).toUpperCase() + h.role.slice(1)}: ${h.parts && h.parts.length > 0 ? h.parts[0] : '[empty part]'}`;
        console.log('  Mapping history part:', logPart);
        return logPart;
    });
    parts.push(`User: ${userMessage}`);
    const prompt = parts.join('\n');
    console.log('Constructed prompt for Gemini API:\n', prompt);
    try {
        console.log(`Attempting to generate content with model: ${MODEL_ID} using ai.models.generateContent`);
        // Generate content using the model (as per your original logic)
        // The `contents` here is your string `prompt`.
        const generationRequest = {
            model: MODEL_ID,
            contents: [{ role: "user", parts: [{ text: prompt }] }] // The generateContent method with this SDK structure typically expects `contents` as an array of Content objects.
            // If your SDK version treats a simple string `prompt` for `contents` differently, the API might error or misinterpret.
            // For a single-turn prompt, often the structure is `contents: [{ parts: [{ text: prompt }] }]`
            // Given "do not change code", this structure is a best guess for a string prompt.
            // Your original code had `contents: prompt`. If that worked, it implies the SDK version you are using handles this.
            // Let's stick to your very original `contents: prompt`
        };
        console.log('Generation request payload (contents will be the string prompt):', JSON.stringify({ model: MODEL_ID, contents: "/* string prompt will be here */" }, null, 2));
        const response = await ai.models.generateContent({
            model: MODEL_ID,
            contents: prompt, // Passing the string prompt directly as per your original code
        });
        console.log('Raw response object from Gemini API (ai.models.generateContent):', JSON.stringify(response, null, 2));
        // Assuming `response.text` is how you access the reply, as in your original code.
        // The actual structure might be `response.candidates[0].content.parts[0].text` or similar
        // depending on the specific SDK version and response format.
        // Logging the full `response` above will help clarify this.
        const replyText = response.text || ''; // As per your original extraction
        if (!response.text) {
            console.warn('Warning: response.text was empty or undefined. Checking other common paths for response text.');
            if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0]) {
                console.log('Found text in response.candidates[0].content.parts[0].text:', response.candidates[0].content.parts[0].text);
                // If `response.text` is indeed the correct way for your SDK, this is just for richer logging.
            }
        }
        console.log('Extracted replyText:', replyText);
        const newHistory = [
            ...history,
            { role: 'user', parts: [userMessage] },
            { role: 'model', parts: [replyText] },
        ];
        console.log('Constructed newHistory:', JSON.stringify(newHistory, null, 2));
        console.log('--- Exiting sendToGemini Successfully ---');
        return { reply: replyText, newHistory };
    }
    catch (error) {
        console.error('--- ERROR in sendToGemini API Call ---');
        console.error('Timestamp:', new Date().toISOString());
        console.error('Error message:', error.message);
        console.error('Error name:', error.name);
        // Some errors from the Google AI SDK might have a `status` or `details`
        if (error.status) {
            console.error('Error status:', error.status);
        }
        if (error.details) {
            console.error('Error details:', error.details);
        }
        console.error('Error stack:', error.stack);
        // Attempt to log the full error object, being mindful of circular references
        try {
            console.error('Full error object (stringified):', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        }
        catch (e) {
            console.error('Could not stringify the full error object:', e.message);
            console.error('Error object direct log:', error);
        }
        throw error;
    }
}
