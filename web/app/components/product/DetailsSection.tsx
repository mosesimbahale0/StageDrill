import React, { useState, useRef, useEffect } from "react";

export function DetailsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  // --- State to track if the section is expanded or not ---
  const [isExpanded, setIsExpanded] = useState(false);

  // --- State to track if the "Show more" button is necessary ---
  // We only want to show it if the content is actually overflowing
  const [showButton, setShowButton] = useState(false);

  // --- A "ref" to access the content's container element ---
  const contentRef = useRef<HTMLDivElement>(null);

  // --- This effect runs after the component renders ---
  useEffect(() => {
    // Check if the ref is attached to an element
    if (contentRef.current) {
      // Compare the full scrollable height of the content
      // with its visible height (which is clamped by h-40)
      const isOverflowing =
        contentRef.current.scrollHeight > contentRef.current.clientHeight;

      // If it's overflowing, we need to show the button
      setShowButton(isOverflowing);
    }
    // This effect should re-run if the children content changes
  }, [children]);

  // --- Dynamically set the classes for the content ---
  const contentClasses = `
    transition-all duration-300 ease-in-out
    ${isExpanded ? "h-auto" : "h-40 overflow-hidden"}
  `;

  return (
    <section className="">
      {/* Custom styles to hide the scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <h2 className="text-2xl font-bold mb-4 text-text1">{title}</h2>

      {/* Apply the ref and dynamic classes to the content wrapper.
        The `text-text2` class is now here to ensure it's part of the
        container we are measuring.
      */}
      <div ref={contentRef} className={`text-text2 ${contentClasses}`}>
        {children}
      </div>

      {/* --- The "Show more" / "Show less" Button ---
        Only render this button if the `showButton` state is true.
      */}
      {showButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)} // Toggle the state on click
          className="font-semibold text-accent hover:text-complementary mt-2"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </section>
  );
}
