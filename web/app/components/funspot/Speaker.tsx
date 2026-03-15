
import React, { useEffect, useRef, useState } from "react";
import { saveToDB, getAllFromDB, deleteReadFromDB } from "~/utils/indexedDB";

import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";

// Helper function to convert Base64 to Blob
const base64ToBlob = (base64Obj: { base64: string }, type = "audio/mpeg") => {
  try {
    let base64 = base64Obj.base64; // Extract the base64 string
    base64 = base64.replace(/^data:audio\/\w+;base64,/, ""); // Remove data URL prefix if present
    const binary = atob(base64); // Decode base64
    const array = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new Blob([array], { type });
  } catch (error) {
    console.error("Error converting base64 to Blob:", error);
    return null;
  }
};


const Speaker = () => {
  const isReadingRef = useRef(false); // To track if a message is currently being read
  const audioRefs = useRef([]); // Store references to active audio objects
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false); // Mute toggle

  // Function to fetch unread messages and play them sequentially
  const readMessages = async () => {
    if (isReadingRef.current) return; 
    isReadingRef.current = true;
  
    try {
      const allMessages = await getAllFromDB();
      const unreadMessages = allMessages.filter((message) => !message.isRead);
  
      for (const message of unreadMessages) {
        const blob = base64ToBlob(message.base64); // Ensure this is an object
        if (!blob) continue; // Skip if conversion fails
  
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.volume = isMuted ? 0 : 1;
  
        audioRefs.current.push(audio);
  
        await new Promise((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(url);
            saveToDB(message.key, { ...message, isRead: true });
            setMessages((prev) =>
              prev.map((m) => (m.key === message.key ? { ...m, isRead: true } : m))
            );
            audioRefs.current = audioRefs.current.filter((a) => a !== audio);
            resolve();
          };
          audio.onerror = (error) => {
            console.error("Error playing audio:", error);
            reject(error);
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

  

  
  // Use an effect to start polling for new messages
  useEffect(() => {
    const intervalId = setInterval(readMessages, 1000); // Poll every 2 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [isMuted]);

  // Load messages initially
  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = await getAllFromDB();
      setMessages(storedMessages);
    };
    loadMessages();
  }, []);

  // Update the volume of all active audio objects when mute state changes
  useEffect(() => {
    audioRefs.current.forEach((audio) => {
      audio.volume = isMuted ? 0 : 1;
    });
  }, [isMuted]);


  // AUTO DELETER
  const autoDelete = async () => {
    const allMessages = await getAllFromDB();
    const unreadMessages = allMessages.filter((message) => !message.isRead);
    if (unreadMessages.length > 5) {
      deleteReadFromDB();
    }
  };

  useEffect(() => {
    const intervalId = setInterval(autoDelete, 1000); // Poll every 2 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);



  
  return (
    <div className=" flex flex-col justify-center items-center gap-4 ">
      {isMuted ? (
        <button
          onClick={() => setIsMuted(false)}
          className="bg-danger h-14 w-20  rounded-2xl flex justify-center items-center hover:bg-danger2 shadow-2xl"
        >
          <SpeakerXMarkIcon className="h-5 w-5 text-text" />
        </button>
      ) : (
        <button
          onClick={() => setIsMuted(true)}
          className="bg-secondary h-14 w-20 rounded-full flex justify-center items-center hover:bg-tertiary shadow-2xl"
        >
          <SpeakerWaveIcon className="h-5 w-5 text-text" />
        </button>
      )}
    </div>
  );
};

export default Speaker;




// import React, { useEffect, useRef, useState } from "react";
// import { saveToDB, getAllFromDB } from "~/utils/indexedDB";

// import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";

// // Helper function to convert Base64 to Blob
// const base64ToBlob = (base64: string, type = "audio/mpeg") => {
//   const binary = atob(base64);
//   const array = Uint8Array.from(binary, (char) => char.charCodeAt(0));
//   return new Blob([array], { type });
// };

// const Speaker = () => {
//   const isReadingRef = useRef(false); // To track if a message is currently being read
//   const audioRefs = useRef([]); // Store references to active audio objects
//   const [messages, setMessages] = useState([]);
//   const [isMuted, setIsMuted] = useState(false); // Mute toggle

//   // Function to fetch unread messages and play them sequentially
//   const readMessages = async () => {
//     if (isReadingRef.current) return; // Prevent overlapping executions
//     isReadingRef.current = true;

//     try {
//       const allMessages = await getAllFromDB();
//       const unreadMessages = allMessages.filter((message) => !message.isRead);

//       for (const message of unreadMessages) {
//         const blob = base64ToBlob(message.base64);
//         const url = URL.createObjectURL(blob);
//         const audio = new Audio(url);
//         audio.volume = isMuted ? 0 : 1; // Adjust volume based on mute state

//         audioRefs.current.push(audio); // Store reference for control

//         await new Promise((resolve, reject) => {
//           audio.onended = () => {
//             URL.revokeObjectURL(url); // Cleanup
//             saveToDB(message.key, { ...message, isRead: true }); // Mark as read
//             setMessages((prev) =>
//               prev.map((m) =>
//                 m.key === message.key ? { ...m, isRead: true } : m
//               )
//             ); // Update state
//             audioRefs.current = audioRefs.current.filter((a) => a !== audio); // Remove reference
//             resolve();
//           };
//           audio.onerror = (error) => {
//             console.error("Error playing audio:", error);
//             reject(error);
//           };
//           audio.play();
//         });
//       }
//     } catch (error) {
//       console.error("Error reading messages:", error);
//     } finally {
//       isReadingRef.current = false; // Reset reading state
//     }
//   };

//   // Use an effect to start polling for new messages
//   useEffect(() => {
//     const intervalId = setInterval(readMessages, 2000); // Poll every 2 seconds
//     return () => clearInterval(intervalId); // Cleanup on unmount
//   }, [isMuted]);

//   // Load messages initially
//   useEffect(() => {
//     const loadMessages = async () => {
//       const storedMessages = await getAllFromDB();
//       setMessages(storedMessages);
//     };
//     loadMessages();
//   }, []);

//   // Update the volume of all active audio objects when mute state changes
//   useEffect(() => {
//     audioRefs.current.forEach((audio) => {
//       audio.volume = isMuted ? 0 : 1;
//     });
//   }, [isMuted]);

//   return (
//     <div className=" flex flex-col justify-center items-center gap-4 ">
//       {isMuted ? (
//         <button
//           onClick={() => setIsMuted(false)}
//           className="bg-danger h-14 w-20  rounded-2xl flex justify-center items-center hover:bg-danger2 shadow-2xl"
//         >
//           <SpeakerXMarkIcon className="h-5 w-5 text-text" />
//         </button>
//       ) : (
//         <button
//           onClick={() => setIsMuted(true)}
//           className="bg-secondary h-14 w-20 rounded-full flex justify-center items-center hover:bg-tertiary shadow-2xl"
//         >
//           <SpeakerWaveIcon className="h-5 w-5 text-text" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default Speaker;
