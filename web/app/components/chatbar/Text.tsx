/**
 *
 * @summary Sends messages to a Funspot and displays chat history
 *
 * 1. Send request from a client
 * 2. Wait for response to clear data
 * 3. If the request is not successfully created, throw error and keep data in form
 * 4. Play a sound once we have a successful sent and received message...
 * 5. Scroll to the bottom on successful sent and successful received
 *
 *
 */

import { useRef, useEffect, useState } from "react";
import { PaperAirplaneIcon, SparklesIcon } from "@heroicons/react/20/solid";
import Requests from "../chatbar/molecules/Requests";

import { useMutation, gql, useSubscription } from "@apollo/client";

const SEND_MESSAGE = gql`
  # mutation CreateRequest($input: RequestInput!) {
  #   createRequest(input: $input) {
  #     _id
  #     _account_id
  #     _funspot_id
  #     text
  #     emotion
  #     createdAt
  #     updatedAt
  #   }
  # }
  mutation MediateRequest($input: RequestInput!) {
    mediateRequest(input: $input) {
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
  # subscription ResponseCreated {
  #   responseCreated {
  #     _id
  #     _request_id
  #     _account_id
  #     _funspot_id
  #     _index
  #     text
  #     emotion
  #     is_read
  #   }
  # }
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

export default function Text(propsData) {
  const requestsRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const funspot = propsData.propsData;

  const _account_id = funspot._account_Id;
  const _funspot_id = funspot._id;
  const emotion = "happy"; // Assuming emotion is always "happy" here

  const [CreateRequest, { loading, error, data }] = useMutation(SEND_MESSAGE);

  // console the variables
  console.log("Account ID: " + _account_id);
  console.log("Funspot ID: " + _funspot_id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const textInput = e.target.elements.text;

    if (!textInput) {
      console.error("Input element not found!");
      return;
    }

    const text = textInput.value.trim(); // Trim whitespace

    if (text === "") {
      // Input validation: Check if the text is empty
      alert("Please enter a message.");
      return;
    }

    const request = {
      text,
      emotion,
      _account_id,
      _funspot_id,
    };

    try {
      // Show a loading indicator
      await CreateRequest({ variables: { input: request } });
      console.log("Message sent successfully!", data);
      textInput.value = "";
      // Play sound
      // audioRef.current.play();
      // Scroll to bottom
      // requestsRef.current.scrollIntoView({ behavior: "smooth" });

      if (requestsRef.current) {
        requestsRef.current.scrollTop = requestsRef.current.scrollHeight;
      }
      // const audio = new Audio("/sounds/carbonate.mp3");
      // audio.play();
    } catch (error) {
      console.error("Error sending message:", error);
      alert(
        "Oops! There was an error sending your message. Please try again later."
      );
    }
  };

  const { data: requestCreatedData } = useSubscription(MESSAGE_SENT);
  const { data: responseCreatedData } = useSubscription(MESSAGE_RECEIVED);

  useEffect(() => {
    if (responseCreatedData) {
      window.scrollTo(0, document.body.scrollHeight);
      const audio = new Audio("/sounds/google_meet_chat_ping.mp3");
      audio.play();
    }
  }, [responseCreatedData]);

  // useEffect(() => {
  //   if (requestCreatedData) {
  //     window.scrollTo(0, document.body.scrollHeight);
  //     const audio = new Audio("/sounds/carbonate.mp3");
  //     audio.play();
  //   }
  // }, [requestCreatedData]);

  // Scroll to bottom on visit... and refreshes
  useEffect(() => {
    if (window.scrollY + window.innerHeight < document.body.scrollHeight) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, []);

  return (
    <>
      <div
        className="w-full  flex flex-col gap-4 lg:px-64 py-10"
        ref={requestsRef}
      >
        <Requests propsData={funspot} />
        {loading && (
          <>
            <div className="h-40 rounded-lg w-full  flex flex-col justify-left items-center gap-2 ">
              <div className="w-full h-5 rounded-full bg-gradient-to-br from-white  via-secondary to-white   animate-pulse"></div>
              <div className="w-full h-5 rounded-full bg-gradient-to-br from-white  via-secondary to-white   animate-pulse"></div>
              <div className="w-full h-5 rounded-full bg-gradient-to-br from-white  via-secondary to-white   animate-pulse"></div>
              <div className="w-full h-5 rounded-full bg-gradient-to-br from-white  via-secondary to-white   animate-pulse"></div>
            </div>
          </>
        )}
        {error && (
          <>
            <div className="h-40 rounded-lg w-full  flex flex-col justify-left items-center gap-2 ">
              <p className="text-red-500 text-xs">
                Error sending message. Please try again later.
              </p>
            </div>
          </>
        )}

        <div className="h-24 bg-gradient-to-t from-white via-white to-white/90  fixed left-0 lg:left-16 right-0 bottom-0 rounded-t-3xl flex flex-row justify-center items-center gap-2 lg:gap-4 lg:px-64 p-1 ">
          <form
            onSubmit={handleSubmit}
            className=" w-full rounded-full shadow-2xl border border-gray-300 bg-white h-20 flex flex-row justify-between items-center gap-2 p-2"
          >
            <button
              title="Submit"
              type="submit"
              className=" bg-primary rounded-full w-16 h-16  flex items-center justify-center "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="m17.077 4.217l-14.93 14.93a.5.5 0 0 0 .707.708l14.93-14.93a6.57 6.57 0 1 1 9.292 9.292L13.287 28.006a3.39 3.39 0 1 1-4.793-4.793l11.86-11.86a.5.5 0 0 0-.708-.707L7.787 22.506a4.39 4.39 0 0 0 6.207 6.207l13.79-13.788A7.57 7.57 0 1 0 17.076 4.217"
                />
              </svg>
            </button>

            <div className="flex flex-row gap-2 w-5/6">
              <div className="flex flex-col gap-1 w-full">
                <p className="text-xs font-thin text-gray-400">
                  Start typing suggestions may show up here
                </p>
                <input
                  type="text"
                  placeholder="Start a conversation"
                  className=" text-black h-8  text-sm outline-none  placeholder:text-gray-500 w-full"
                  name="text"
                />
              </div>
            </div>

            {/* <div className="flex flex-row justify-center items-center h-12 gap-2  p-1 bg-tertiary backdrop-blur-lg w-24  rounded-md">
              <div className="  text-text hover:text-accent p-2  ">
                <div className="flex flex-row items-center gap-2 text-xs ">
                  1000 Tks
                </div>
              </div>
            </div> */}

            <button
              title="Submit"
              type="submit"
              className=" bg-primary hover:bg-accent  hover:text-white rounded-full w-16 h-16 flex items-center justify-center "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M18.21 5.19c-.424.076-1.003.268-1.847.55l-6.49 2.163c-.823.274-1.42.473-1.855.643c-.452.176-.65.293-.733.372a1.5 1.5 0 0 0 0 2.164c.083.08.281.196.733.372a45 45 0 0 0 1.893.656c.292.097.494.164.677.261a2.5 2.5 0 0 1 1.04 1.041c.098.183.165.385.262.677l.013.039c.274.822.473 1.42.643 1.854c.176.452.293.65.373.733a1.5 1.5 0 0 0 2.163 0c.08-.083.196-.281.372-.733c.17-.434.37-1.032.643-1.854l2.164-6.491c.281-.844.473-1.424.548-1.847c.076-.428.001-.525-.037-.562c-.037-.038-.134-.113-.562-.037m-.175-.984c.51-.09 1.045-.085 1.445.314c.399.4.404.935.314 1.445c-.09.505-.306 1.154-.57 1.947l-.015.04l-2.163 6.492l-.005.015a45 45 0 0 1-.655 1.887c-.175.446-.35.82-.583 1.062a2.5 2.5 0 0 1-3.606 0c-.232-.243-.408-.616-.583-1.062c-.18-.461-.387-1.083-.655-1.887l-.005-.015c-.115-.345-.156-.463-.21-.564a1.5 1.5 0 0 0-.624-.625c-.1-.053-.219-.094-.564-.21l-.015-.004a46 46 0 0 1-1.887-.655c-.446-.175-.82-.35-1.062-.583a2.5 2.5 0 0 1 0-3.606c.243-.233.616-.408 1.062-.583c.461-.18 1.083-.387 1.887-.655l.015-.005l6.491-2.163l.041-.014c.793-.264 1.442-.48 1.947-.57"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </form>
          {/* <audio ref={audioRef} src={google_notification} /> */}
        </div>
      </div>
    </>
  );
}
