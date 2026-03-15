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

// Function to get the first letter of each name and  concatenate
const getInitials = (name) => {
  const names = name.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase());
  return initials.join("");
};

export default function CharacterCard({ character }) {
  const _avatar_id = character._avatar_id;

  const { loading, error, data } = useQuery(GET_AVATAR_BY_ID, {
    variables: { id: _avatar_id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :({error.message})</p>;

  const avatar = data.getOneAvatar;

  console.log("Avatar: ", avatar);

  return (
    <div className="p-4 ">
      {/* You can add a character avatar here if you have one */}
      {/* <img src={character.avatarUrl} alt={character.character_name} className="h-20 w-20 rounded-full" /> */}

      {/* 
      // <img
      //   src={avatar.photo}
      //   alt={avatar.name}
      //   className="h-20 w-20 rounded-full"
      // /> */}

      {/* initials */}
      <div className="flex flex-col gap-2 items-center justify-center w-32 h-32 rounded-full bg-gray-300  ">
        <p className=" text-xl">{getInitials(character.character_name)}</p>
        <p className="text-xs w-full truncate ... text-center">{character.character_name}</p>
        <p className="text-xs w-full truncate ... text-center  text-gray-500 font-thin ">
          {character.character_role}
        </p>
      </div>
    </div>
  );
}
