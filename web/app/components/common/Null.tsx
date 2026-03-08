import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { useProfile } from "~/context/ProfileProvider";

export default function Null() {
  

  
  return (
    <div className="p-6 w-full h-full flex flex-col gap-8 justify-center items-center  text-text2">
      <div className="flex flex-row flex-wrap justify-center items-center gap-8 ">
        <CubeTransparentIcon className="w-24 h-24" />
      </div>
      <p className="text-sm ">Quite empty in here</p>


    </div>
  );
}
