import React, { useState, useEffect, useRef } from "react";
import {
  VideoCameraIcon,
  VideoCameraSlashIcon,
} from "@heroicons/react/24/outline";

export default function CameraControl() {
  const [hasCamera, setHasCamera] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false); // Initial state is false

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Function to start the camera stream
  const startCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCamera(true);
      setIsCameraOn(true);

      // Save to localStorage
      localStorage.setItem("hasCamera", "true");
      localStorage.setItem("isCameraOn", "true");
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setHasCamera(false);
      localStorage.setItem("hasCamera", "false");
    }
  };

  // Function to stop the camera stream
  const stopCameraStream = () => {
    if (streamRef.current) {
      // Stop all tracks to release the camera
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear the video stream
      }

      streamRef.current = null; // Clear the stream reference

      // Update state and localStorage
      setIsCameraOn(false);
      setHasCamera(false);
      localStorage.setItem("isCameraOn", "false");
      localStorage.setItem("hasCamera", "false");
    }
  };

  // Handle state changes on mount and when toggling
  useEffect(() => {
    const checkCamera = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCamera(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCamera(false);
        localStorage.setItem("hasCamera", "false");
      }
    };
    checkCamera();

    // Start/stop camera based on isCameraOn ONLY after checkCamera
    if (isCameraOn) {
      startCameraStream();
    } else {
      stopCameraStream();
    }

    // Clean up on component unmount
    return () => {
      stopCameraStream(); // Ensure camera is stopped when component unmounts
    };
  }, [isCameraOn]); // Include isCameraOn in the dependency array

  const handleCameraToggle = () => {
    setIsCameraOn(!isCameraOn); // Toggle the isCameraOn state
  };

  return (
    <div className=" flex flex-col items-center text-text2">
      <div className="flex flex-col gap-2 justify-left items-center bg-tertiary p-2  rounded-lg h-56 w-full">
        <div className="bg-primary rounded-xl p-4 h-32 w-40">
          {hasCamera && isCameraOn && (
            <video
              ref={videoRef}
              autoPlay
              muted
              width="160"
              height="70"
              className="rounded-xl overflow-hidden"
            />
          )}
        </div>

        <button
          className={`bg-accent text-text py-4 px-8 rounded-full hover:bg-complementary flex flex-row gap-4 justify-center items-center ${
            isCameraOn
              ? "bg-danger hover:bg-danger/80"
              : "bg-accent hover:bg-complementary"
          }`}
          onClick={handleCameraToggle}
          type="button"
        >
          {isCameraOn ? (
            <VideoCameraSlashIcon className="h-6 w-6" />
          ) : (
            <VideoCameraIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
}
