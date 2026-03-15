import { TemplateSchema } from "~/types";
import TemplateCard from "./TemplateCard";
import React, { useState, useEffect } from "react";

import { useAuth } from "~/authContext";

export default function Suggestions(propsData: { propsData: any }) {
  // store data in a variable
  const templates = propsData.propsData;
  console.log("ALL --------->" + templates);

  // Keyword search state
  const [keyword, setKeyword] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState(templates); // Initialize with all templates

  // Filter templates based on keyword
  useEffect(() => {
    const filtered = templates.filter((template: { name: string }) =>
      template.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredTemplates(filtered);
  }, [keyword]); // Only re-run when keyword changes

  // Handle input change
  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  if (filteredTemplates.length === 0) {
    return (
      <div className="h-screen w-full">
        <div className="h-40 w-full  flex justify-center items-center text-center">
          No suggestions yet
        </div>
      </div>
    );
  }

  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* <div className="w-full flex flex-col justify-center  lg:gap-10 items-center lg:flex-row  p-4 rounded-xl  h-32 bg-white">
        <div className="relative w-96  rounded-full  -mt-4">
          <input
            type="text"
            placeholder="Search Your Suggestions"
            value={keyword}
            onChange={handleInputChange}
            className=" text-black  h-14 p-4 border bg-white  border-tertiary focus:bg-white rounded-full outline-none focus:border-accent focus:border text-sm"
          />
          <button
            title="Search"
            type="submit"
            className="absolute right-1  top-1 bottom-1   rounded-full w-12 h-12 flex items-center justify-center  "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
      </div> */}

      <div className=" w-full flex flex-col gap-2 -mt-10   ">
        {filteredTemplates.length === 0 ? (
          <div className="h-40 w-full  flex justify-center items-center text-center">
            Nothing matched your search
          </div>
        ) : (
          filteredTemplates.map((template: TemplateSchema) => (
            <div className="w-full mt-10 " key={template._id}>
              <TemplateCard propsData={template} userId={user?.uid} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
