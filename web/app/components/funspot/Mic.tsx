import React, { useState, useRef, useEffect } from "react";
import {
  saveToMicDB,
  getAllFromMicDB,
  updateMicDB,
} from "~/utils/micIndexedDB";

export default function Mic() {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const transcribingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const processedRecordings = useRef(new Set<number>());

  useEffect(() => {
    const loadRecordings = async () => {
      try {
        const storedRecordings = await getAllFromMicDB();
        setRecordings(storedRecordings);
      } catch (error) {
        console.error("Error loading recordings:", error);
      }
    };
    loadRecordings();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onloadend = async () => {
          const base64String = reader.result as string;
          const timestamp = Date.now().toString();
          const newRecording = {
            audioBase64: base64String.split(",")[1],
            isChecked: false,
            isArchived: false,
            isSent: false,
            isSpeech: "",
            transcription: "",
            timestamp,
          };
          try {
            const id = await saveToMicDB(newRecording);
            setRecordings((prevRecordings) => [
              ...prevRecordings,
              { ...newRecording, id },
            ]);
          } catch (error) {
            console.error("Error saving recording:", error);
          }
        };

        // Clean up media stream
        stream.getTracks().forEach((track) => track.stop());
      };

      chunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    console.log("Recording stopped");
  };

  /**
   *
   * *******************************************
   * TRANSCRIBE
   * ******************************************
   *
   */
  const transcribeRecordings = async () => {
    const uncheckedRecordings = recordings.filter(
      (recording) =>
        !recording.isChecked && !processedRecordings.current.has(recording.id)
    );

    for (const recording of uncheckedRecordings) {
      try {
        const response = await fetch(`http://localhost:8007/vad-transcribe/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64_string: recording.audioBase64 }),
        });

        if (!response.ok) {
          throw new Error(
            `Transcription failed for recording ${recording.id}: ${response.statusText}`
          );
        }

        const data = await response.json();

        // Check if transcription is empty, and mark as archived if so
        if (!data.transcription) {
          await updateMicDB(recording.id, {
            isChecked: true,
            isArchived: true, // Assuming `isArchived` is the field to mark as archived
          });
          console.log(
            `Recording ${recording.id} marked as archived due to empty transcription.`
          );
        } else {
          await updateMicDB(recording.id, {
            isChecked: true,
            transcription: data.transcription,
            isSpeech: data.isSpeech,
          });
          console.log(`Transcription for recording ${recording.id} complete`);
        }

        processedRecordings.current.add(recording.id);
      } catch (error) {
        console.error(`Error transcribing recording ${recording.id}:`, error);
      }
    }
  };

  useEffect(() => {
    transcribingIntervalRef.current = setInterval(() => {
      transcribeRecordings();
    }, 2000);

    return () => {
      if (transcribingIntervalRef.current) {
        clearInterval(transcribingIntervalRef.current);
      }
    };
  }, [recordings]);

  return (
    <div className="flex flex-col items-center gap-4 w-40">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`h-14 w-20 rounded-full flex justify-center items-center shadow-2xl ${
          isRecording
            ? "bg-danger hover:bg-danger2"
            : "bg-secondary hover:bg-tertiary"
        }`}
      >
        {isRecording ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 11c0 1.19-.34 2.3-.9 3.28l-1.23-1.23c.27-.62.43-1.31.43-2.05zm-4 .16L9 5.18V5a3 3 0 0 1 3-3a3 3 0 0 1 3 3zM4.27 3L21 19.73L19.73 21l-4.19-4.19c-.77.46-1.63.77-2.54.91V21h-2v-3.28c-3.28-.49-6-3.31-6-6.72h1.7c0 3 2.54 5.1 5.3 5.1c.81 0 1.6-.19 2.31-.52l-1.66-1.66L12 14a3 3 0 0 1-3-3v-.72L3 4.27z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m7 9c0 3.53-2.61 6.44-6 6.93V21h-2v-3.07c-3.39-.49-6-3.4-6-6.93h2a5 5 0 0 0 5 5a5 5 0 0 0 5-5z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
