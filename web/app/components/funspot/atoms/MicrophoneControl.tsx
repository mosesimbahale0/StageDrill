import React, { useState, useEffect, useRef } from "react";

import { MicrophoneIcon, MegaphoneIcon } from "@heroicons/react/24/outline";

export default function MicrophoneControl() {
  const [hasMicrophone, setHasMicrophone] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const micStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    const checkMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setHasMicrophone(true);
        micStreamRef.current = stream;
        setupAudioContext(stream);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setHasMicrophone(false);
      }
    };

    checkMicrophone();

    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const setupAudioContext = (stream) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateMicLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / dataArray.length;
      setMicLevel(average);
      requestAnimationFrame(updateMicLevel);
    };

    updateMicLevel();
  };

  const handleMicToggle = () => {
    if (isMicOn) {
      micStreamRef.current.getAudioTracks()[0].enabled = false;
      setIsMicOn(false);
    } else {
      micStreamRef.current.getAudioTracks()[0].enabled = true;
      setIsMicOn(true);
    }
  };

  // Normalize level (0-255) to [0.5, 1]
  const scale = 0.5 + (micLevel / 255) * 0.5;
  // Opacity for ripple [0.2, 0.6]
  const opacity = 0.2 + (micLevel / 255) * 0.4;
  // Ripple size factor [1, 2]
  const rippleScale = 1 + micLevel / 255;

  return (
    <div className="flex flex-col gap-6 justify-center items-center bg-tertiary  text-text2 rounded-lg h-56 w-full relative ">
      {isMicOn && (
        <div className="absolute top-6 flex items-center justify-center ">
          {hasMicrophone && (
            <div className="relative w-20 h-20 flex justify-center items-center rounded-full bg-tertiary z-1">
              <div className="flex flex-col items-center justify-center p-6">
                <div className="relative" style={{ width: 96, height: 96 }}>
                  {/* Proportionate ripple */}
                  <div
                    className="absolute inset-0 rounded-full bg-warning"
                    style={{
                      transform: `scale(${rippleScale})`,
                      opacity,
                      transition:
                        "transform 0.4s ease-out, opacity 0.4s ease-out",
                    }}
                  />
                  {/* Core mic circle */}
                  <div
                    className="relative flex items-center justify-center rounded-full bg-warning opacity-40"
                    style={{
                      width: "100%",
                      height: "100%",
                      transform: `scale(${scale})`,
                      transition: "transform 0.1s ease-out",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                    >
                      <path
                        fill="currentColor"
                        d="M23 14v3a7 7 0 0 1-14 0v-3H7v3a9 9 0 0 0 8 8.94V28h-4v2h10v-2h-4v-2.06A9 9 0 0 0 25 17v-3Z"
                      />
                      <path
                        fill="currentColor"
                        d="M16 22a5 5 0 0 0 5-5V7a5 5 0 0 0-10 0v10a5 5 0 0 0 5 5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        className={`bg-accent text-buttontext py-4 px-8 mt-24 rounded-full hover:bg-complementary flex flex-row gap-4 justify-center items-center  ${
          isMicOn
            ? "bg-danger hover:bg-danger/80"
            : "bg-accent hover:bg-complementary"
        }`}
        disabled={!hasMicrophone}
        onClick={handleMicToggle}
        type="button"
      >
        {isMicOn ? (
          <div className="flex flex-row gap-2 text-xs justify-center items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="currentColor" stroke-width="1.5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m15.5 20.5l2 2l5-5"
                />
                <rect
                  width="6"
                  height="12"
                  x="5"
                  y="2"
                  fill="currentColor"
                  rx="3"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M1 10v1a7 7 0 0 0 7 7v0a7 7 0 0 0 7-7v-1m-7 8v4m0 0H5m3 0h3"
                />
              </g>
            </svg>
            Mic Access Allowed
          </div>
        ) : (
          <div className="flex flex-row gap-2 text-xs justify-center items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="currentColor">
                <path d="M12 2.25c-2.51 0-4.75 1.767-4.75 4.179v5.142c0 2.412 2.24 4.179 4.75 4.179s4.75-1.767 4.75-4.179V6.43c0-2.412-2.24-4.179-4.75-4.179" />
                <path d="M5.75 11a.75.75 0 0 0-1.5 0a7.75 7.75 0 0 0 7 7.714v1.536H8a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5h-3.25v-1.536a7.75 7.75 0 0 0 7-7.714a.75.75 0 0 0-1.5 0a6.25 6.25 0 1 1-12.5 0" />
              </g>
            </svg>{" "}
            Allow Mic Access
          </div>
        )}
      </button>
    </div>
  );
}
