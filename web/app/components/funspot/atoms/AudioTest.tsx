// AudioTest.js
import React, { useState, useRef } from "react";

export default function AudioTest() {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const audioRef = useRef(null);

    const playAudio = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(
                "/sounds/notification2.mp3"
            );
        }
        audioRef.current.play();
        setIsAudioPlaying(true);
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsAudioPlaying(false);
        }
    };

    return (
        <div className=" flex flex-col justify-center items-center bg-tertiary rounded-lg h-56 text-text2  w-full gap-2">
            <p>Test your speakers</p>
            {isAudioPlaying ? (
                <button
                    className="flex flex-col justify-center items-center bg-danger text-text rounded-full h-20 w-20"
                    onClick={stopAudio}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M392 432H120a40 40 0 0 1-40-40V120a40 40 0 0 1 40-40h272a40 40 0 0 1 40 40v272a40 40 0 0 1-40 40" /></svg>
                </button>
            ) : (
                <button
                    className="flex flex-col justify-center items-center bg-accent text-text rounded-full h-20 w-20"
                    onClick={playAudio}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M5.669 4.76a1.47 1.47 0 0 1 2.04-1.177c1.062.454 3.442 1.533 6.462 3.276c3.021 1.744 5.146 3.267 6.069 3.958c.788.591.79 1.763.001 2.356c-.914.687-3.013 2.19-6.07 3.956c-3.06 1.766-5.412 2.832-6.464 3.28c-.906.387-1.92-.2-2.038-1.177c-.138-1.142-.396-3.735-.396-7.237c0-3.5.257-6.092.396-7.235" /></g></svg>
                </button>
            )}
        </div>
    );
}
