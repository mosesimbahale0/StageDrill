import React, { useState, useEffect, useMemo } from "react";
// --- ADDED ---
import { Link } from "react-router-dom"; // Or your app's Link component
import { Heart, Gavel, Hand } from "lucide-react";
import { BidHistoryList } from "./BidHistoryList";
import { CountdownDisplay } from "./CountdownDisplay";
import { formatMoney } from "~/components/product/FormatMoney";

export function ProductDetails({
  product,
  merchant,
  onPlaceBidClick,
  onMessageSellerClick,
  // --- ADDED PROPS ---
  currentUser,
  isCurrentlyLiked,
  displayedLikeCount,
  isLiking,
  onLikeClick,
}: {
  product: any;
  merchant: any;
  onPlaceBidClick: () => void;
  onMessageSellerClick: () => void;
  // --- ADDED PROPS ---
  currentUser: any;
  isCurrentlyLiked: boolean;
  displayedLikeCount: number;
  isLiking: boolean;
  onLikeClick: () => void;
}) {
  const currencyFormatter = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  });

  const [activeTab, setActiveTab] = useState<"details" | "history">("details");

  // --- Countdown Logic ---
  const endTime = useMemo(
    () => new Date(product.auction_end).getTime(),
    [product.auction_end]
  );
  // ... (rest of countdown logic is unchanged) ...
  const [auctionEnded, setAuctionEnded] = useState(endTime <= Date.now());
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = Date.now();
      const distance = endTime - now;

      if (distance <= 0) {
        setAuctionEnded(true);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return false;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      const pad = (num: number) => num.toString().padStart(2, "0");
      setTimeLeft({
        days: pad(days),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
      });
      setAuctionEnded(false);
      return true;
    };

    if (!updateTimeLeft()) return;
    const timer = setInterval(() => {
      if (!updateTimeLeft()) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);
  // --- END Countdown Logic ---

  // --- Bidding Info ---
  const bidHistory = product.bidHistory || [];
  const uniqueBidders = new Set(
    bidHistory.map((bid: any) => bid.customer?._id || bid.bidder_id)
  );
  const biddersCount = uniqueBidders.size;
  const bidCount = bidHistory.length;

  // ======================
  // Render
  // ======================
  return (
    <div className="flex flex-col gap-5">
      {/* Product Title */}
      <h1 className="text-3xl font-bold text-text1 w-full truncate ...">
        {product.product_name}
      </h1>

      {/* Countdown */}
      <CountdownDisplay timeLeft={timeLeft} auctionEnded={auctionEnded} />

      {/* Tabs Section */}
      <div className="p-5 bg-secondary rounded-lg shadow-lg border border-tertiary">
        {/* ... (tabs logic is unchanged) ... */}
        {/* Tab Header */}
        <div className="flex border-b border-tertiary">
          {["details", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "details" | "history")}
              className={`py-2 px-4 text-base font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-accent text-accent"
                  : "border-b-2 border-transparent text-text2 hover:text-text1"
              }`}
            >
              {tab === "details" ? "Bid Details" : `Bid History (${bidCount})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "details" ? (
          <div className="space-y-4 text-sm pt-5">
            <div className="flex justify-between items-center">
              <span className="text-text2 text-base">Current Bid:</span>
              <span className="font-bold text-3xl text-accent">
                {/* {currencyFormatter.format(product.current_bid)} */}
                Ksh {formatMoney(product.current_bid ?? 0)}
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-tertiary pt-3">
              <span className="text-text2">Minimum Increment:</span>
              <span className="font-semibold text-text1">
                Ksh {formatMoney(product.min_bid_increment ?? 0)}
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-tertiary pt-3">
              <span className="text-text2">Bidders:</span>
              <span className="font-semibold text-text1">{biddersCount}</span>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <BidHistoryList bidHistory={bidHistory} />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={onPlaceBidClick}
          disabled={auctionEnded}
          className="bg-accent text-sm text-buttontext font-semibold py-4 px-6 rounded-full hover:bg-complementary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Hand size={18} /> Place Bargain
        </button>

        {/* --- DYNAMIC LOGIC BUTTON --- */}
        {currentUser ? (
          <button
            onClick={onLikeClick}
            disabled={isLiking} // <-- Still disabled by isLiking to prevent spam
            className={`flex items-center justify-center gap-1.5 py-4 px-6 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
              isCurrentlyLiked
                ? "bg-secondary text-accent hover:bg-accent hover:text-buttontext border border-transparent" // Unlike style
                : "bg-secondary hover:bg-tertiary border border-tertiary text-text2" // Like style
            }`}
          >
            <Heart
              size={16}
              className={
                isCurrentlyLiked ? "text-danger fill-danger" : "text-accent"
              }
            />
            <span>{displayedLikeCount}</span>

            {/* --- THIS IS THE ONLY CHANGE --- */}
            {/* We no longer show "..." because the UI update is instant */}
            {isCurrentlyLiked ? "Unlike" : "Wishlist"}
            {/* --- END OF CHANGE --- */}
          </button>
        ) : (
          <Link
            to="/auth"
            className="flex items-center gap-1.5 py-4 px-6 rounded-full bg-secondary hover:bg-tertiary border border-tertiary text-text2 text-sm"
          >
            <Heart size={16} className="text-accent" />
            <span>{displayedLikeCount}</span> Wishlist
          </Link>
        )}
        {/* --- END REPLACEMENT --- */}
      </div>
    </div>
  );
}
