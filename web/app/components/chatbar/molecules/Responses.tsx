import { useQuery, gql, useSubscription } from "@apollo/client";
import { useRef, useEffect, useState } from "react";

const MESSAGE_RECEIVED = gql`
  subscription ResponseCreated {
    responseCreated {
      _id
      _request_id
      _account_id
      _funspot_id
      text
      emotion
      is_read
    }
  }
`;

const GET_ALL_RESPONSES = gql`
  query GetAllResponsesByRequestId($requestId: ID!) {
    getAllResponsesByRequestId(requestId: $requestId) {
      _id
      _request_id
      _account_id
      _funspot_id
      text
      emotion
      is_read
    }
  }
`;



export default function Responses({ propsData, funspotPhoto, characters }) {
  const { data: responseCreatedData } = useSubscription(MESSAGE_RECEIVED);

  useEffect(() => {
    if (responseCreatedData) {
      // Scroll to bottom only if not already at the bottom
      if (window.scrollY + window.innerHeight < document.body.scrollHeight) {
        window.scrollTo(0, document.body.scrollHeight);
      }
      const audio = new Audio("/sounds/google_meet_chat_ping.mp3");
      audio.play();
    }
  }, [responseCreatedData]);

  const request_id = propsData; // Assuming propsData is the request ID
  const funspotPic = funspotPhoto; // Assuming funspotPhoto is the image URL
  const character = characters;

  console.log(character);

  const { loading, error, data, refetch } = useQuery(GET_ALL_RESPONSES, {
    variables: { requestId: request_id },
  });

  // Refetch data when a new response is received
  useEffect(() => {
    if (responseCreatedData) {
      refetch(); // Refetches the data from the server
    }
  }, [responseCreatedData, refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :({error.message})</p>;

  return (
    <div className="flex flex-row gap-1">
      <img
        src="/assets/logo.png"
        alt="logo"
        className="h-10 w-10 rounded-full object-contain"
      />
      <ul className="flex flex-col gap-1 bg-white rounded-lg p-4 border text-xs">
        {data.getAllResponsesByRequestId.map((response) => (
          <li key={response._id}>
            {response.text} - {response.emotion}
          </li>
        ))}
      </ul>
    </div>
  );
}
