import express from 'express';
import { SpeechConfig, AudioConfig, SpeechRecognizer, ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
const router = express.Router();
router.post('/', async (req, res) => {
    const { audio_base64 } = req.body;
    try {
        const audioBuffer = Buffer.from(audio_base64, 'base64');
        const tempFilePath = join(tmpdir(), `audio-${Date.now()}.wav`);
        fs.writeFileSync(tempFilePath, audioBuffer);
        const speechConfig = SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY, process.env.AZURE_SPEECH_REGION);
        const audioConfig = AudioConfig.fromWavFileInput(fs.readFileSync(tempFilePath));
        const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
        recognizer.recognizeOnceAsync(result => {
            fs.unlinkSync(tempFilePath);
            if (result.reason === ResultReason.RecognizedSpeech) {
                res.json({ text: result.text });
            }
            else {
                res.status(400).json({ detail: 'Speech not recognized' });
            }
        });
    }
    catch (error) {
        res.status(500).json({ detail: error.message });
    }
});
export default router;
