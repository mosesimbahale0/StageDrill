import React from "react";

export default function Moderator() {
  return (
    <div
      className="bg-secondary border border-tertiary rounded-full p-4 shadow-md w-40 h-40 flex flex-col gap-2 justify-center items-center 
    
    "
    >
      {" "}
      <p className="text-xl font-medium text-text">M</p>
      <p className="text-sm text-text2 w-full truncate ... text-center">
        {" "}
        Moderator
      </p>
      <p className="text-xs text-text2  w-full truncate ... text-pretty text-center">
        Stage Manager
      </p>
    </div>
  );
}
