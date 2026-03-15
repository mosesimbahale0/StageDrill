import { useState, useEffect, useRef } from "react";

export default function MicLevel() {
  const [micLevel, setMicLevel] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioCtx = new (window.AudioContext ||
          window.webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        dataArrayRef.current = dataArray;

        const updateLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((acc, val) => acc + val, 0);
          const avg = sum / bufferLength;
          setMicLevel(avg);
          animationRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      })
      .catch((err) => console.error("Mic access denied", err));

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // Normalize level (0-255) to [0.5, 1]
  const scale = 0.5 + (micLevel / 255) * 0.5;
  // Opacity for ripple [0.2, 0.6]
  const opacity = 0.2 + (micLevel / 255) * 0.4;
  // Ripple size factor [1, 2]
  const rippleScale = 1 + micLevel / 255;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative" style={{ width: 96, height: 72 }}>
        {/* Proportionate ripple */}
        <div
          className="absolute inset-0 rounded-full bg-warning"
          style={{
            transform: `scale(${rippleScale})`,
            opacity,
            transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
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
        ></div>
      </div>
    </div>
  );
}
