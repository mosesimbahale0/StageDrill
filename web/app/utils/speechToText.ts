import * as speech from "@google-cloud/speech";

const client = new speech.SpeechClient({
  credentials: null,
});

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const audioBase64 = audioBuffer.toString("base64"); // Convert Buffer to Base64 string

      const request = {
        audio: {
          content: audioBase64,
        },
        config: {
          encoding: "WEBM_OPUS", // Change encoding to match input format
          sampleRateHertz: 48000, // Match the sample rate with the header
          languageCode: "en-US",
        },
      };

      const [operation] = await client.longRunningRecognize(request);
      const [response] = await operation.promise();

      const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");

      resolve(transcription);
    } catch (error) {
      console.error("Transcription error:", error);
      reject(error);
    }
  });
}
