// import * as textToSpeech from "@google-cloud/text-to-speech";

// const client = new textToSpeech.TextToSpeechClient();

// export async function convertTextToSpeech(text: string): Promise<Blob> {
//   const request = {
//     input: { text: text },
//     voice: { languageCode: "en-US", ssmlGender: "MALE" },
//     audioConfig: { audioEncoding: "MP3" },
//   };

//   const [response] = await client.synthesizeSpeech(request);
//   return new Blob([response.audioContent!], { type: "audio/mp3" });
// }


export async function convertTextToSpeech(text: string): Promise<Blob> {

    try {
        const response = await fetch('http://localhost:4001/synthesize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });
  
        if (!response.ok) {
            throw new Error('Failed to synthesize text');
        }
  
        const audioBlob = await response.blob();
        return audioBlob;
    } catch (error) {
        console.error('Error during text-to-speech conversion:', error);
        throw error;
    }
  };
  
  
  