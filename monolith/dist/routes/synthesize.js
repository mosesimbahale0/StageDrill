import express from 'express';
import { SpeechConfig, SpeechSynthesizer, AudioConfig, SpeechSynthesisOutputFormat, ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
const router = express.Router();
router.post('/', async (req, res) => {
    const { text, voice_name = 'en-US-JennyNeural', output_format = 'audio-16khz-128kbitrate-mono-mp3' } = req.body;
    try {
        const speechConfig = SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY, process.env.AZURE_SPEECH_REGION);
        speechConfig.speechSynthesisVoiceName = voice_name;
        const formatMap = {
            'audio-16khz-128kbitrate-mono-mp3': SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3,
            'audio-24khz-160kbitrate-mono-mp3': SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3,
            'riff-16khz-16bit-mono-pcm': SpeechSynthesisOutputFormat.Riff16Khz16BitMonoPcm,
        };
        if (!formatMap[output_format]) {
            return res.status(400).json({ detail: 'Unsupported output format' });
        }
        speechConfig.speechSynthesisOutputFormat = formatMap[output_format];
        const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
        const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
        synthesizer.speakTextAsync(text, result => {
            if (result.reason === ResultReason.SynthesizingAudioCompleted) {
                const audioBase64 = Buffer.from(result.audioData).toString('base64');
                res.json({ audio_base64: audioBase64 });
            }
            else {
                res.status(400).json({ detail: 'Speech synthesis failed' });
            }
        });
    }
    catch (error) {
        res.status(500).json({ detail: error.message });
    }
});
export default router;
