import React, { useState, useEffect, useRef, Fragment, useMemo } from "react";

// --- Bid History ---
export function BidHistoryList({ bidHistory }: { bidHistory: any[] }) {
  const bidHistoryRef = useRef<HTMLDivElement>(null);
  const currencyFormatter = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  });
  useEffect(() => {
    if (bidHistoryRef.current) {
      bidHistoryRef.current.scrollTop = bidHistoryRef.current.scrollHeight;
    }
  }, [bidHistory]);

  const UNKNOWN_USER = "Unknown Bidder";
  const FALLBACK_IMAGE = "https://placehold.co/24x24/1D1E22/E6EDF3?text=B";

  // ✅ Helper function to safely format the time
  const formatBidTime = (timestamp: any) => {
    // Try to parse the timestamp. It might be a string or number.
    const parsedTimestamp = parseInt(timestamp, 10);

    // Check if it's a valid number (not NaN)
    if (isNaN(parsedTimestamp)) {
      return "--:--"; // Fallback for invalid/missing time
    }

    const date = new Date(parsedTimestamp);

    // Check if the date object itself is valid
    if (isNaN(date.getTime())) {
      return "--:--"; // Fallback for invalid date
    }

    // If all good, format it
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <section className="">
      <div
        ref={bidHistoryRef}
        className="h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-quaternary rounded-lg border border-tertiary bg-secondary shadow-inner"
      >
        {bidHistory.length > 0 ? (
          <ul className="space-y-3">
            {[...bidHistory].reverse().map((bid: any) => {
              // --- Safe Data Access ---
              const customerName = bid.customer?.user_name || UNKNOWN_USER;
              const customerImage =
                bid.customer?.profile_picture || FALLBACK_IMAGE;

              // ✅ FIX for KshNaN: Use ?? to provide a 0 fallback
              const bidAmount = bid.bid_amount ?? 0; // Use fallback

              // ✅ FIX for Invalid Date: Use the safe formatting function
              const bidTime = formatBidTime(bid.bid_time);

              return (
                <li
                  key={bid._id}
                  className="flex justify-between items-center p-2 border-b border-tertiary last:border-b-0"
                >
                  {/* --- THIS IS THE CORRECTED/COMPLETED PART --- */}

                  {/* Left Side: User Info */}
                  <div className="flex items-center gap-2">
                    <img
                      src={customerImage}
                      alt={customerName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    {/* The span for the name should be here */}
                    <span className="font-semibold text-text1 text-sm truncate">
                      {customerName}
                    </span>
                  </div>

                  {/* Right Side: Bid Info */}
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-text1 text-sm">
                      {/* Use the formatter defined in this component */}
                      {currencyFormatter.format(bidAmount)}
                    </span>
                    <span className="text-xs text-text2">{bidTime}</span>
                  </div>
                  {/* --- END OF CORRECTION --- */}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-text2 text-sm">No bids placed yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
