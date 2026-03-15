


import { useQuery, gql, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import ResponseItem from "./atoms/ResponseItem"; // Import the ResponseItem component

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






const GET_ALL_RESPONSES = gql`
  query GetAllCleanresponsesByRequestId($requestId: ID!) {
    getAllCleanresponsesByRequestId(requestId: $requestId) {
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



export default function Responses({ propsData, funspotPhoto }) {
  const { data: responseCreatedData } = useSubscription(MESSAGE_RECEIVED);
  const request_id = propsData;

  const { loading, error, data, refetch } = useQuery(GET_ALL_RESPONSES, {
    variables: { requestId: request_id },
  });

  useEffect(() => {
    if (responseCreatedData) {
      if (window.scrollY + window.innerHeight < document.body.scrollHeight) {
        window.scrollTo(0, document.body.scrollHeight);
      }
      const audio = new Audio("/sounds/google_meet_chat_ping.mp3");
      audio.play();
      refetch(); // Make sure to refetch data on new message
    }
  }, [responseCreatedData, refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :({error.message})</p>;

  return (
    <div className="flex flex-col gap-1">
      {data.getAllCleanresponsesByRequestId.map((response) => (
        <ResponseItem key={response._id} response={response} funspotId={response._funspot_id} />
      ))}
    </div>
  );
}
