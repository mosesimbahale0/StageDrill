import React, { useEffect, useRef, useState } from "react";
import { saveToDB, getAllFromDB, deleteReadFromDB } from "~/utils/indexedDB";

// Helper to convert Base64 to Blob
const base64ToBlob = (
  input: { base64?: string } | string | undefined,
  type = "audio/mpeg"
) => {
  try {
    let base64: string | undefined;

    // Handle both { base64 } objects and plain strings
    if (typeof input === "string") {
      base64 = input;
    } else if (input && typeof input.base64 === "string") {
      base64 = input.base64;
    } else {
      throw new Error("Input is not a valid base64 string or object.");
    }

    base64 = base64.trim();

    if (base64.startsWith("data:")) {
      base64 = base64.replace(/^data:audio\/\w+;base64,/, "");
    }

    base64 = base64.replace(/[^A-Za-z0-9+/=]/g, "");

    if (base64 === "") return new Blob([], { type });

    const binary = atob(base64);
    const array = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new Blob([array], { type });
  } catch (error) {
    console.error(
      "Error converting base64 to Blob:",
      error,
      "Input snapshot:",
      JSON.stringify(input).slice(0, 100)
    );
    return null;
  }
};

/**
 * SpeakerLevel
 * @param {{ _character_index: number, character_name: string, character_role: string }[]} characters
 */
export default function SpeakerLevel({ characters }) {
  const isReadingRef = useRef(false);
  const audioRefs = useRef([]);
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  // Track currently playing speaker index
  const [currentSpeaker, setCurrentSpeaker] = useState<number | null>(null);

  const readMessages = async () => {
    if (isReadingRef.current) return;
    isReadingRef.current = true;

    try {
      const allMessages = await getAllFromDB();
      const unreadMessages = allMessages.filter((m) => !m.isRead);

      for (const message of unreadMessages) {
        // const blob = base64ToBlob(message.base64);
        console.log(message.audio);
        const blob = base64ToBlob({ base64: message.audio });

        // console.log(audio);
        if (!blob) continue;

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.volume = isMuted ? 0 : 1;

        audioRefs.current.push(audio);
        setCurrentSpeaker(message.character_index);

        await new Promise((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(url);
            saveToDB(message.key, { ...message, isRead: true });
            setMessages((prev) =>
              prev.map((m) =>
                m.key === message.key ? { ...m, isRead: true } : m
              )
            );
            audioRefs.current = audioRefs.current.filter((a) => a !== audio);
            setCurrentSpeaker(null);
            resolve(null);
          };
          audio.onerror = (err) => {
            console.error("Error playing audio:", err);
            reject(err);
          };
          audio.play();
        });
      }
    } catch (error) {
      console.error("Error reading messages:", error);
    } finally {
      isReadingRef.current = false;
    }
  };

  useEffect(() => {
    const interval = setInterval(readMessages, 1000);
    return () => clearInterval(interval);
  }, [isMuted]);

  useEffect(() => {
    const load = async () => {
      const stored = await getAllFromDB();
      setMessages(stored);
    };
    load();
  }, []);

  useEffect(() => {
    audioRefs.current.forEach((audio) => {
      audio.volume = isMuted ? 0 : 1;
    });
  }, [isMuted]);

  const autoDelete = async () => {
    const allMessages = await getAllFromDB();
    const unread = allMessages.filter((m) => !m.isRead);
    if (unread.length > 5) deleteReadFromDB();
  };
  useEffect(() => {
    const interval = setInterval(autoDelete, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper for initials
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

  return (
    <>
      <div className=" flex flex-col justify-center items-center gap-4 absolute top-2 right-2 z-9">
        {isMuted ? (
          <button
            onClick={() => setIsMuted(false)}
            className="bg-danger text-buttontext h-14 w-14  rounded-2xl flex justify-center items-center hover:bg-danger2 shadow-2xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.5"
                d="M1.959 8.577a3.2 3.2 0 0 1 1.381-1.3C3.94 7 4.626 7 6 7c.512 0 .768 0 1.016-.042a3 3 0 0 0 .712-.214c.23-.101.444-.242.871-.524l.22-.144C11.36 4.399 12.632 3.56 13.7 3.925c.205.07.403.17.58.295c.923.648.993 2.157 1.133 5.174A68 68 0 0 1 15.5 12c0 .532-.035 1.488-.087 2.605c-.14 3.018-.21 4.526-1.133 5.175a2.3 2.3 0 0 1-.58.295c-1.067.364-2.339-.474-4.882-2.151L8.6 17.78c-.427-.282-.64-.423-.871-.525a3 3 0 0 0-.712-.213C6.768 17 6.512 17 6 17c-1.374 0-2.06 0-2.66-.277a3.2 3.2 0 0 1-1.381-1.3c-.314-.582-.35-1.186-.424-2.395q-.017-.27-.026-.528M22 10l-4 4m0-4l4 4"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setIsMuted(true)}
            className="bg-tertiary  hover:text-buttontext h-14 w-14 rounded-full flex justify-center items-center hover:bg-accent shadow-2xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.5"
                d="M20 6s1.5 1.8 1.5 6s-1.5 6-1.5 6m-2-9s.5.9.5 3s-.5 3-.5 3M1.959 8.577a3.2 3.2 0 0 1 1.381-1.3C3.94 7 4.626 7 6 7c.512 0 .768 0 1.016-.042a3 3 0 0 0 .712-.214c.23-.101.444-.242.871-.524l.22-.144C11.36 4.399 12.632 3.56 13.7 3.925c.205.07.403.17.58.295c.923.648.993 2.157 1.133 5.174A68 68 0 0 1 15.5 12c0 .532-.035 1.488-.087 2.605c-.14 3.018-.21 4.526-1.133 5.175a2.3 2.3 0 0 1-.58.295c-1.067.364-2.339-.474-4.882-2.151L8.6 17.78c-.427-.282-.64-.423-.871-.525a3 3 0 0 0-.712-.213C6.768 17 6.512 17 6 17c-1.374 0-2.06 0-2.66-.277a3.2 3.2 0 0 1-1.381-1.3c-.314-.582-.35-1.186-.424-2.395q-.017-.27-.026-.528"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-wrap justify-center items-center gap-6 ">
        {characters.map(
          ({ _character_index, character_name, character_role }) => {
            const isActive = currentSpeaker === _character_index;
            return (
              <div key={_character_index} className="relative">
                {/* Pulsing rings for active speaker */}
                {isActive && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-accent opacity-5   max-w-48 max-h-48"></span>
                    <span className="absolute inset-0 rounded-full border-2 border-accent"></span>
                    {/* Include an audio anime icon */}
                    <div className="text-warning animate-pulse absolute bottom-2 right-16">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          fill-rule="evenodd"
                          d="M9.25 21.75c-.41 0-.75-.34-.75-.75V3c0-.41.34-.75.75-.75s.75.34.75.75v18c0 .41-.34.75-.75.75m-3-4c-.41 0-.75-.34-.75-.75V7c0-.41.34-.75.75-.75S7 6.59 7 7v10c0 .41-.34.75-.75.75m5.25.25c0 .41.34.75.75.75s.75-.34.75-.75V6c0-.41-.34-.75-.75-.75s-.75.34-.75.75zm3.75-2.25c-.41 0-.75-.34-.75-.75V9c0-.41.34-.75.75-.75s.75.34.75.75v6c0 .41-.34.75-.75.75M17.5 17c0 .41.34.75.75.75s.75-.34.75-.75V7c0-.41-.34-.75-.75-.75s-.75.34-.75.75zm3.75-3.25c-.41 0-.75-.34-.75-.75v-2c0-.41.34-.75.75-.75s.75.34.75.75v2c0 .41-.34.75-.75.75M2.5 13c0 .41.34.75.75.75S4 13.41 4 13v-2c0-.41-.34-.75-.75-.75s-.75.34-.75.75z"
                          color="currentColor"
                        />
                      </svg>
                    </div>
                  </>
                )}

                <div
                  className={`bg-secondary border border-tertiary rounded-full p-4 shadow-md w-40 h-40 flex flex-col gap-2 justify-center items-center transition-transform ${
                    isActive ? "scale-101  ring-4 ring-accent" : ""
                  }`}
                >
                  <p className="text-xl font-medium text-text">
                    {getInitials(character_name)}
                  </p>
                  <p className="text-sm text-text2 w-full truncate text-center">
                    {character_name}
                  </p>
                  <p className="text-xs text-text2 w-full truncate text-center">
                    {character_role}
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>
    </>
  );
}
