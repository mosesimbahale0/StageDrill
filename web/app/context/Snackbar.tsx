import { useState } from "react";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
// TYPES
type SnackbarType = "success" | "warning" | "error";

interface SnackbarProps {
  message: string;
  type: SnackbarType;
  show: boolean;
  setShow: (show: boolean) => void;
}

function Snackbar({ message, type, show, setShow }) {
  if (!show) return null;

  return (
    <div
      className={`fixed bottom-2 right-2 py-4 px-8 z-10 text-xs drop-shadow-2xl shadow-2xl  flex flex-row gap-2 items-center    ${
        type === "success"
          ? "bg-success  text-text"
          : type === "warning"
          ? "bg-warning text-text "
          : "bg-danger text-text"
      }  `}
    >
      <InformationCircleIcon className="h-5 w-5" /> {message}
    </div>
  );
}

export default Snackbar;
