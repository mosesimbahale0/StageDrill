/**
 * PSEUDOCODE FOR MULTI-PERSONA VOICE CHAT
 *
 * 1. ON PAGE LOAD
 *    - Request microphone access.
 *    - IF microphone access granted:
 *      - Start continuous speech recognition.
 *      - Enable mute/unmute functionality.
 *
 * 2. START SPEECH RECOGNITION
 *    - Initialize Speech-to-Text (STT) recognition.
 *    - Set recognition to continuous mode.
 *    - ON recognition result:
 *      - Capture the latest transcript.
 *      - Send recognized text to the server as a message.
 *
 * 3. ENABLE MUTE/UNMUTE FUNCTIONALITY
 *    - Initialize mute state to false.
 *    - ON mute button click:
 *      - Toggle mute state.
 *      - IF muted, stop recognition.
 *      - ELSE, start recognition.
 *
 * 4. ON USER SPEAKING (detected by voice activity)
 *    - Convert speech to text using Speech-to-Text (STT).
 *    - Send recognized text to the server as a message.
 *
 * 5. ON NEW MESSAGE RECEIVED (via subscription)
 *    - IF message is a "Cleanresponse":
 *      - Store the Cleanresponse in local storage.
 *
 * 6. STORE CLEANRESPONSE IN LOCAL STORAGE
 *    - Retrieve existing Cleanresponses from local storage.
 *    - Append new Cleanresponse to the list.
 *    - Save updated list back to local storage.
 *
 * 7. PROCESS CLEANRESPONSES
 *    - Retrieve stored Cleanresponses from local storage.
 *    - WHILE there are unread Cleanresponses:
 *      - Retrieve the next unread Cleanresponse.
 *      - Use Text-to-Speech (TTS) to read out the Cleanresponse text.
 *      - Mark the Cleanresponse as "read" in the database.
 *      - Remove the read Cleanresponse from local storage.
 *    - Save updated list of Cleanresponses back to local storage.
 *
 * 8. READ CLEANRESPONSE USING TEXT-TO-SPEECH (TTS)
 *    - Create a speech utterance with the Cleanresponse text.
 *    - Use the Web Speech API to vocalize the utterance.
 *
 * 9. MARK RESPONSE AS READ IN DATABASE
 *    - Send request to the server to mark the Cleanresponse as read.
 *
 * 10. REPEAT UNTIL ALL STORED CLEANRESPONSES ARE PROCESSED
 *    - Set a repeating interval to process stored Cleanresponses.
 *
 *
 * 11. END CALL CLEARS LOCAL STORAGE AND MUTES THE MIC AND SPEAKER
 *
 *
 *
 */

import { auth } from "../../firebase-service";

import React, { useState, useEffect, useRef } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { CiMicrophoneOff } from "react-icons/ci";
import { useMutation, gql, useSubscription } from "@apollo/client";
import CharacterCard from "./molecules/CharacterCard";
import { MdCallEnd } from "react-icons/md";
//video speaker and end call icons from reacticons

import { FaVideo } from "react-icons/fa";

import { HiSpeakerXMark } from "react-icons/hi2";
import { HiSpeakerWave } from "react-icons/hi2";


// GraphQL Queries and Mutations
const SEND_MESSAGE = gql`
  mutation CreateRequest($input: RequestInput!) {
    createRequest(input: $input) {
      _id
      _account_id
      _funspot_id
      text
      emotion
      createdAt
      updatedAt
    }
  }
`;

const MESSAGE_SENT = gql`
  subscription RequestCreated {
    requestCreated {
      _id
      _account_id
      _funspot_id
      text
      emotion
      createdAt
      updatedAt
    }
  }
`;

const MESSAGE_RECEIVED = gql`
  subscription CleanresponseCreated {
    cleanresponseCreated {
      _id
      _request_id
      _account_id
      _funspot_id
      _character_index
      text
      emotion
      is_read
    }
  }
`;

const READ_MESSAGE = gql`
  mutation UpdateCleanresponse($responseId: ID!, $input: CleanresponseInput!) {
    updateCleanresponse(_response_id: $responseId, input: $input) {
      _id
      _request_id
      _account_id
      _funspot_id
      _character_index
      text
      emotion
      is_read
    }
  }
`;

export default function Voice(propsData) {





  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const isReading = useRef(false); // Ref to track if TTS is currently reading
  const queue = useRef([]); // Ref to keep track of the queue
  const funspot = propsData.propsData;

  // Setup for Speech SDK with VAD and TTS
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    "341950d3810c403ca841b2a3cc788893", // Replace with your actual Azure Speech key
    "eastus" // Replace with your Azure region (e.g., 'eastus')
  );
  const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  // Apollo Client Mutation Hooks
  const [CreateRequest] = useMutation(SEND_MESSAGE);
  const [UpdateCleanresponse] = useMutation(READ_MESSAGE);
  const { data: requestCreatedData } = useSubscription(MESSAGE_SENT);
  const { data: responseCreatedData } = useSubscription(MESSAGE_RECEIVED);

  useEffect(() => {
    if (responseCreatedData) {
      handleNewCleanresponse(responseCreatedData.cleanresponseCreated);
    }
  }, [responseCreatedData]);

  // Start Speech Recognition with VAD control
  const startSpeechRecognition = () => {
    recognizer.recognizing = (s, e) => {
      setIsRecording(true);
      setTranscript(e.result.text);
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        setTranscript(e.result.text);
      } else if (e.result.reason === sdk.ResultReason.NoMatch) {
        console.log("No speech recognized.");
      }
    };

    recognizer.canceled = (s, e) => {
      console.error(`Recognition canceled: ${e.reason}`);
      if (e.errorDetails) {
        console.error(`Error details: ${e.errorDetails}`);
      }
    };

    recognizer.sessionStopped = (s, e) => {
      setIsRecording(false);
    };

    recognizer.startContinuousRecognitionAsync(
      () => {
        console.log("Recognition started successfully.");
      },
      (error) => {
        console.error("Error starting recognition:", error);
      }
    );
  };

  // Stop Speech Recognition and Send Transcript
  const stopSpeechRecognition = () => {
    recognizer.stopContinuousRecognitionAsync(() => {
      setIsRecording(false);
      if (transcript) {
        sendMessage();
      }
    });
  };

  // Send message to server
  const sendMessage = async () => {
    if (!transcript) {
      console.log("No text to send");
      return;
    }

    const request = {
      text: transcript,
      emotion: "happy",
      _account_id: funspot._account_Id,
      _funspot_id: funspot._id,
    };

    try {
      await CreateRequest({ variables: { input: request } });
      console.log("Message sent successfully!");
      setTranscript("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    }
  };

  // Handle new cleanresponse message
  const handleNewCleanresponse = (cleanresponse) => {
    if (cleanresponse) {
      queueResponse(cleanresponse);
    }
  };

  // Queue response to be processed
  const queueResponse = (cleanresponse) => {
    queue.current.push(cleanresponse);
    processQueue();
  };

  // Process and read queued responses one by one
  const processQueue = () => {
    if (isReading.current || queue.current.length === 0) return; // If already reading or queue is empty, do nothing

    const nextResponse = queue.current.shift(); // Get the next response from the queue
    isReading.current = true; // Set reading state to true
    readCleanResponse(nextResponse.text, nextResponse._id)
      .then(() => {
        isReading.current = false; // Reset reading state after reading
        processQueue(); // Process the next response in the queue
      })
      .catch((error) => {
        console.error("Error reading response:", error);
        isReading.current = false; // Reset reading state on error
        processQueue(); // Continue processing the queue
      });
  };

  // Read cleanresponse using TTS and mark as read
  const readCleanResponse = (text, responseId) => {
    return new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        () => {
          // Mark as read after TTS finishes
          markResponseAsRead(responseId).then(resolve).catch(reject);
        },
        (error) => {
          console.error("Error in TTS:", error);
          reject(error);
        }
      );
    });
  };

  // Mark cleanresponse as read
  const markResponseAsRead = async (responseId) => {
    try {
      await UpdateCleanresponse({
        variables: {
          responseId,
          input: { is_read: true },
        },
      });
    } catch (error) {
      console.error("Error marking response as read:", error);
    }
  };

  return (

    <div className="w-full  flex justfy-center items-center ">
      <div className="flex flex-wrap flex-row gap-4  min-h-screen py-20 px-4 overflow-x-hidden justify-center items-center  ">


        {/* User Card */}
        <div className="flex flex-row justify-center items-center  max-w-2xl">
          {/*   // User photo from auth */}
          <img
            src={auth.currentUser?.photoURL}
            alt="You"
            className="w-32 h-32 rounded-full"
          />
        </div>

        {/* Character Cards */}
        <div className="flex flex-wrap justify-center items-center max-w-xl">
          {funspot.characters.map((character) => (
            <CharacterCard
              key={character._character_index}
              character={character}
            />
          ))}
        </div>

        <div className="flex flex-col gap-10 justify-center items-center">
          {isRecording && <p>Recording...</p>}
          <p>{transcript}</p>
        </div>

      </div>




      <section className="flex flex-row justify-center items-center gap-4  fixed bottom-0 right-0 left-0   h-20 ">
        {/* Mic on and off */}
        {isRecording ? (
          <button
            onClick={
              isRecording ? stopSpeechRecognition : startSpeechRecognition
            }
            className="rounded-full bg-danger/20 text-accent hover:bg-accent hover:text-white w-20 h-12 flex justify-center items-center"
          >
            <CiMicrophoneOff className="h-7 w-7" />
          </button>
        ) : (


          <button
            onClick={
              isRecording ? stopSpeechRecognition : startSpeechRecognition
            }
            className="rounded-full bg-accent/20 text-accent hover:bg-accent hover:text-white w-20 h-12 flex justify-center items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="currentColor" d="M23 14v3a7 7 0 0 1-14 0v-3H7v3a9 9 0 0 0 8 8.94V28h-4v2h10v-2h-4v-2.06A9 9 0 0 0 25 17v-3Z" /><path fill="currentColor" d="M16 22a5 5 0 0 0 5-5V7a5 5 0 0 0-10 0v10a5 5 0 0 0 5 5" /></svg>
          </button>
        )}

        {/* Video on and Off,  */}

        <div className="flex flex-row  justify-center items-center w-24 h-12 bg-complementary text-white rounded-full">
          <button className="w-12 h-12 flex justify-center items-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="12" stroke-dashoffset="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8l-7 7M12 8l7 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="12;0" /></path></svg>
          </button>


          <button
            onClick={() => {
              // TODO: Implement video functionality
            }}
            className="rounded-full bg-accent  hover:text-white w-12 h-12 flex justify-center items-center text-white w-20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M2 8.25A3.25 3.25 0 0 1 5.25 5h6.5A3.25 3.25 0 0 1 15 8.25v7.5A3.25 3.25 0 0 1 11.75 19h-6.5A3.25 3.25 0 0 1 2 15.75zm17.257 9.438L16 15.44V8.562l3.257-2.249c1.161-.802 2.745.03 2.745 1.44v8.495c0 1.41-1.584 2.242-2.745 1.44" /></svg>
          </button>
        </div>



        {/* Mute Speaker button,  */}
        {/* <button
          onClick={() => {
            // TODO: Implement mute functionality
          }}
          className="rounded-full bg-accent/20 text-accent hover:bg-accent hover:text-white w-20 h-12 flex justify-center items-center"
        >
          <HiSpeakerXMark className="h-7 w-7" />
        </button> */}


        <div className="flex flex-row  justify-center items-center w-20">
          {/* End Call button - > Mute speaker & Mic clears the local storage */}
          <button
            onClick={() => {
              // TODO: Implement end call functionality
            }}
            className="rounded-full bg-danger text-white w-20 h-12 flex justify-center items-center"
          >
            <MdCallEnd className="h-7 w-7" />
          </button>
        </div>


      </section>



    </div>
  );
}
