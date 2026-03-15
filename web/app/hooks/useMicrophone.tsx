// import { useEffect, useRef, useState } from "react";

// interface UseMicrophoneResult {
//   hasMicrophone: boolean;
//   startStreaming: () => void;
//   stopStreaming: () => void;
//   startRecording: () => void;
//   stopRecording: () => Blob | null;
//   isRecording: boolean;
// }

// export function useMicrophone(onAudioData: (data: string) => void): UseMicrophoneResult {
//   const [hasMicrophone, setHasMicrophone] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const micStreamRef = useRef<MediaStream | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
//   const recordedChunksRef = useRef<Blob[]>([]);

//   useEffect(() => {
//     // Request microphone access
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         console.log("[Microphone]: Access granted");
//         setHasMicrophone(true);
//         micStreamRef.current = stream;
//       })
//       .catch((error) => {
//         console.error("[Microphone]: Access denied:", error);
//         setHasMicrophone(false);
//       });

//     // Cleanup function to stop microphone and release resources
//     return () => {
//       stopStreaming();
//     };
//   }, []);

//   const startStreaming = () => {
//     if (!micStreamRef.current) {
//       console.error("[Microphone]: No microphone stream available");
//       return;
//     }

//     // Create an AudioContext if it doesn't already exist
//     if (!audioContextRef.current) {
//       audioContextRef.current = new AudioContext({ sampleRate: 16000 });
//     }

//     const audioContext = audioContextRef.current;
//     const mediaStreamSource = audioContext.createMediaStreamSource(micStreamRef.current);

//     // Create a ScriptProcessorNode if it doesn't already exist
//     if (!processorNodeRef.current) {
//       processorNodeRef.current = audioContext.createScriptProcessor(512, 1, 1);
//     }

//     const processorNode = processorNodeRef.current;

//     // Handle audio processing
//     processorNode.onaudioprocess = (event) => {
//       const audioData = event.inputBuffer.getChannelData(0); // Get audio data from the first channel
//       const int16Buffer = new Int16Array(audioData.length);

//       // Convert float32 audio data to Int16
//       for (let i = 0; i < audioData.length; i++) {
//         int16Buffer[i] = Math.max(-32768, Math.min(32767, audioData[i] * 32767));
//       }

//       // Create a Blob from the Int16Array
//       const audioBlob = new Blob([int16Buffer.buffer], { type: "audio/raw" });
//       const reader = new FileReader();

//       // Convert Blob to base64
//       reader.onloadend = () => {
//         const base64Audio = reader.result?.toString().split(",")[1] || "";
//         if (base64Audio) {
//           onAudioData(base64Audio);

//           // Add chunk to recording if recording is active
//           if (isRecording) {
//             recordedChunksRef.current.push(audioBlob);
//           }
//         }
//       };

//       reader.readAsDataURL(audioBlob);
//     };

//     // Connect audio nodes
//     mediaStreamSource.connect(processorNode);
//     processorNode.connect(audioContext.destination);

//     console.log("[Microphone]: Streaming started");
//   };

//   const stopStreaming = () => {
//     // Stop microphone stream
//     if (micStreamRef.current) {
//       micStreamRef.current.getTracks().forEach((track) => track.stop());
//       micStreamRef.current = null;
//     }

//     // Disconnect and release resources
//     if (processorNodeRef.current) {
//       processorNodeRef.current.disconnect();
//       processorNodeRef.current = null;
//     }

//     if (audioContextRef.current) {
//       audioContextRef.current.close().catch((error) => {
//         console.error("[Microphone]: Error closing AudioContext:", error);
//       });
//       audioContextRef.current = null;
//     }

//     console.log("[Microphone]: Streaming stopped");
//   };

//   const startRecording = () => {
//     if (!micStreamRef.current) {
//       console.error("[Recording]: Cannot start recording without microphone access");
//       return;
//     }

//     recordedChunksRef.current = []; // Reset recorded chunks
//     setIsRecording(true);
//     console.log("[Recording]: Started");
//   };

//   const stopRecording = (): Blob | null => {
//     if (!isRecording) {
//       console.warn("[Recording]: No active recording to stop");
//       return null;
//     }

//     setIsRecording(false);
//     console.log("[Recording]: Stopped");

//     // Combine recorded chunks into a single Blob
//     const recordedBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
//     recordedChunksRef.current = []; // Clear chunks after stopping
//     return recordedBlob;
//   };

//   return {
//     hasMicrophone,
//     startStreaming,
//     stopStreaming,
//     startRecording,
//     stopRecording,
//     isRecording,
//   };
// }



import { useEffect, useRef, useState } from "react";

interface UseMicrophoneResult {
  hasMicrophone: boolean;
  startStreaming: () => void;
  stopStreaming: () => void;
}

export function useMicrophone(onAudioData: (data: string) => void): UseMicrophoneResult {
  const [hasMicrophone, setHasMicrophone] = useState(false);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    // Request microphone access
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log("[Microphone]: Access granted");
        setHasMicrophone(true);
        micStreamRef.current = stream;
      })
      .catch((error) => {
        console.error("[Microphone]: Access denied:", error);
        setHasMicrophone(false);
      });

    // Cleanup function to stop microphone and release resources
    return () => {
      stopStreaming();
    };
  }, []);

  const startStreaming = () => {
    if (!micStreamRef.current) {
      console.error("[Microphone]: No microphone stream available");
      return;
    }

    // Create an AudioContext if it doesn't already exist
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
    }

    const audioContext = audioContextRef.current;
    const mediaStreamSource = audioContext.createMediaStreamSource(micStreamRef.current);

    // Create a ScriptProcessorNode if it doesn't already exist
    if (!processorNodeRef.current) {
      processorNodeRef.current = audioContext.createScriptProcessor(512, 1, 1);
    }

    const processorNode = processorNodeRef.current;

    // Handle audio processing
    processorNode.onaudioprocess = (event) => {
      const audioData = event.inputBuffer.getChannelData(0); // Get audio data from the first channel
      const int16Buffer = new Int16Array(audioData.length);

      // Convert float32 audio data to Int16
      for (let i = 0; i < audioData.length; i++) {
        int16Buffer[i] = Math.max(-32768, Math.min(32767, audioData[i] * 32767));
      }

      // Create a Blob from the Int16Array
      const audioBlob = new Blob([int16Buffer.buffer], { type: "audio/raw" });
      const reader = new FileReader();

      // Convert Blob to base64
      reader.onloadend = () => {
        const base64Audio = reader.result?.toString().split(",")[1] || "";
        if (base64Audio) {
          onAudioData(base64Audio);
        }
      };

      reader.readAsDataURL(audioBlob);
    };

    // Connect audio nodes
    mediaStreamSource.connect(processorNode);
    processorNode.connect(audioContext.destination);

    console.log("[Microphone]: Streaming started");
  };

  const stopStreaming = () => {
    // Stop microphone stream
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    // Disconnect and release resources
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch((error) => {
        console.error("[Microphone]: Error closing AudioContext:", error);
      });
      audioContextRef.current = null;
    }

    console.log("[Microphone]: Streaming stopped");
  };

  return {
    hasMicrophone,
    startStreaming,
    stopStreaming,
  };
}
