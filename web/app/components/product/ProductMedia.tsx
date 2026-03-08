import React, { useState, useEffect, useRef, Fragment, useMemo } from "react";
import { Transition, Dialog } from "@headlessui/react";

export function ProductMedia({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState("gallery");

  // Combine all images
  const allImages = [
    product.product_cover,
    ...(product.product_images || []),
  ].filter(Boolean);

  // Use currentIndex state to manage the active slide
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when product changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [product.product_cover]);

  // Navigation functions
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? allImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === allImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  // NEW: Convert YouTube URL to a valid embed URL
  const videoEmbedUrl = useMemo(() => {
    if (!product.product_video) {
      return null;
    }

    let videoId = null;
    try {
      // Try to parse the URL
      const url = new URL(product.product_video);
      
      // Handle youtu.be/VIDEO_ID
      if (url.hostname === "youtu.be") {
        videoId = url.pathname.substring(1); // Remove leading '/'
      } 
      // Handle youtube.com/watch?v=VIDEO_ID or youtube.com/embed/VIDEO_ID
      else if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
        if (url.pathname === "/watch") {
          videoId = url.searchParams.get("v");
        } else if (url.pathname.startsWith("/embed/")) {
          videoId = url.pathname.split("/")[2];
        }
      }
    } catch (error) {
      console.error("Invalid video URL provided:", product.product_video, error);
      return null;
    }

    // If we found a video ID, construct the embed URL
    if (videoId) {
      // Using the params from your example
      return `https://www.youtube.com/embed/${videoId}?si=TC6V1bPsOg_Udeb4`;
    }
    
    // If no valid YouTube URL was found
    return null;
  }, [product.product_video]);


  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* === Left: Gallery / Video (3/4 width) === */}
      <div className="w-full">
        {/* Tabs */}
        <div className="flex border-b border-tertiary mb-4">
          <button
            className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === "gallery"
                ? "border-b-2 border-accent text-accent"
                : "text-text2 hover:text-text1"
            }`}
            onClick={() => setActiveTab("gallery")}
          >
            Gallery
          </button>
          {/* CHANGED: Check for the processed videoEmbedUrl */}
          {videoEmbedUrl && (
            <button
              className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === "video"
                  ? "border-b-2 border-accent text-accent"
                  : "text-text2 hover:text-text1"
              }`}
              onClick={() => setActiveTab("video")}
            >
              Video
            </button>
          )}
        </div>

        {/* === Gallery === */}
        {activeTab === "gallery" && (
          <div className="flex flex-col gap-3 h-96 relative">
            {/* This is the main container for the carousel. 
              It's 'relative' so the buttons and image transitions can be positioned absolutely.
            */}
            <div
              className="aspect-square rounded-3xl shadow-lg overflow-hidden h-96 relative border-4 border-tertiary bg-secondary"
            >
              {/* This container holds the stacking, transitioning images.
                We map all images and use Headless UI's Transition component.
                The 'show' prop toggles based on 'currentIndex', creating a cross-fade.
              */}
              <div className="relative w-full h-full">
                {allImages.map((img, index) => (
                  <Transition
                    key={index}
                    as="div"
                    className=""
                    show={index === currentIndex}
                    enter="transition-opacity duration-300 ease-in-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300 ease-in-out"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    {/* This div contains the blurred background */}
                    <div 
                      className="absolute inset-0 bg-center bg-cover bg-no-repeat flex items-center justify-center rounded-3xl"
                      style={{ backgroundImage: `url(${img})` }}
                    >
                      {/* This div contains the main, clear image */}
                      <div className="w-full h-full flex items-center justify-center bg-transparent backdrop-blur-3xl ">
                        <img
                          src={img}
                          alt={product.product_name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </Transition>
                ))}
              </div>

              {/* Left/Right Buttons 
                These are siblings to the image container, so they don't fade with the images.
              */}
              {allImages.length > 1 && (
                <>
                  {/* Left Button */}
                  <button
                    onClick={goToPrevious}
                    className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-accent text-buttontext rounded-full p-2 transition-all duration-200 hover:scale-110 hover:bg-accent/80"
                    aria-label="Previous image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>

                  {/* Right Button */}
                  <button
                    onClick={goToNext}
                    className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-accent text-buttontext rounded-full p-2 transition-all duration-200 hover:scale-110 hover:bg-accent/80"
                    aria-label="Next image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Dots */}
            {allImages.length > 1 && (
              <div className="flex justify-center gap-2 pt-2">
                {allImages.map((_, slideIndex) => (
                  <button
                    key={slideIndex}
                    onClick={() => goToSlide(slideIndex)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      currentIndex === slideIndex
                        ? "bg-accent"
                        : "bg-tertiary hover:bg-text2"
                    }`}
                    aria-label={`Go to slide ${slideIndex + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* === Video === */}
        {/* CHANGED: Replaced <video> with <iframe> and use videoEmbedUrl */}
        {activeTab === "video" && videoEmbedUrl && (
          <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg bg-secondary">
            <iframe 
              src={videoEmbedUrl}
              title={product.product_name + " video player"}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}

