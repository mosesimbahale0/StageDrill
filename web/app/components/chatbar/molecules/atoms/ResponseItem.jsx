/**
 * GET FUNSPOT BY ID
 * acess  _avatar_id from funspot.characters.character_index BY INDEX  FROM response._character_index
 * Get avatar by _avatar_id
 */

import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_AVATAR_BY_ID = gql`
  query GetOneAvatar($id: ID!) {
    getOneAvatar(_id: $id) {
      _id
      name
      photo
    }
  }
`;

const GET_ONE_FUNSPOT = gql`
  query GetOneFunspotById($funspotId: ID!) {
    getOneFunspotById(funspotId: $funspotId) {
      _id
      characters {
        _character_index
        character_name
        character_role
        _avatar_id
        _language_id
      }
    }
  }
`;


// Function to get the first letter of each name and  concatenate
const getInitials = (name) => {
  const names = name.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase());
  return initials.join("");
};



const ResponseItem = ({ response, funspotId }) => {
  // Fetch funspot data to access character information
  const {
    data: funspotData,
    loading: funspotLoading,
    error: funspotError,
  } = useQuery(GET_ONE_FUNSPOT, {
    variables: { funspotId },
  });

  if (funspotLoading) return <p>Loading...</p>;
  if (funspotError) return <p>Error: {funspotError.message}</p>;

  // Accessing the specific character using _character_index
  const character = funspotData?.getOneFunspotById?.characters?.find(
    (char) => char._character_index === response._character_index
  );

  const avatarId = character?._avatar_id;

  // Fetch avatar data by _avatar_id
  const {
    data: avatarData,
    loading: avatarLoading,
    error: avatarError,
  } = useQuery(GET_AVATAR_BY_ID, {
    variables: { id: avatarId },
    skip: !avatarId, // Skip the query if no avatarId is available
  });

  if (avatarLoading) return <p>Loading...</p>;
  if (avatarError) return <p>Error: {avatarError.message}</p>;

  const avatarUrl = avatarData?.getOneAvatar?.photo;
  const characterName = character?.character_name || "Unknown";

  return (
    <div className="flex flex-row gap-1 w-full">
      {/* {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" className="h-10 w-10 rounded-full" />
      ) : (
        <div className="h-10 w-10 rounded-full bg-gray-300"></div> // Placeholder if no avatar
      )} */}
      <div className="h-12 w-12 rounded-full bg-gray-300 flex justify-center items-center">
        <p className="font-bold text-xl">{getInitials(characterName)}</p>
      </div>
      <div className="flex flex-col bg-white rounded-lg p-6 border text-xs max-w-xs lg:max-w-xl">
     
        {/* <p>
          <strong>{characterName}:</strong> {response.text} - {response.emotion}
        </p> */}

        <p>{response.text}</p>
      </div>
    </div>
  );
};

export default ResponseItem;
