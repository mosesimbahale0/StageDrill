import React, { useState, useRef, useEffect, useCallback } from "react";
import { formatMoney } from "~/components/product/FormatMoney";

// Helper component for the left arrow SVG icon, now using theme colors
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-buttontext"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

// Helper component for the right arrow SVG icon, now using theme colors
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-buttontext"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default function Carousel({ products }: { products: any[] }) {
  // A ref to the scrollable container
  const carouselRef = useRef<HTMLDivElement>(null);

  // State to track if the carousel can be scrolled left or right
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Memoized function to check scrollability.
  const checkForScrollability = useCallback(() => {
    const el = carouselRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(
        hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 1
      ); // Added tolerance
    }
  }, []);

  // Function to handle the scroll action
  const scroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (el) {
      // Scroll by 80% of the container's width for a pleasant scroll effect
      const scrollAmount = el.clientWidth * 0.8;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Effect to add and clean up event listeners
  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      checkForScrollability(); // Initial check

      const resizeObserver = new ResizeObserver(checkForScrollability);
      resizeObserver.observe(el);

      const mutationObserver = new MutationObserver(checkForScrollability);
      mutationObserver.observe(el, { childList: true });

      el.addEventListener("scroll", checkForScrollability);

      return () => {
        resizeObserver.unobserve(el);
        mutationObserver.disconnect();
        el.removeEventListener("scroll", checkForScrollability);
      };
    }
  }, [products, checkForScrollability]);

  return (
    <>
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

      <div className="bg-primary w-full py-8 ">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-3xl font-semibold  text-text tracking-tight">
              Recommended For You
            </h2>

            <div className="px-4 sm:px-6 lg:px-8 mt-6"></div>
            <a
              href="/recommended"
              className="text-sm font-semibold text-accent hover:text-complementary transition-colors"
            >
              See all &rarr;
            </a>
          </div>

          <div className="relative group">
            {/* Left Scroll Button */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute top-1/2 -left-5 transform -translate-y-1/2 z-20 bg-accent rounded-full p-2.5 shadow-lg hover:bg-complementary transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none"
                aria-label="Scroll left"
              >
                <ChevronLeftIcon />
              </button>
            )}

            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex overflow-x-auto scroll-smooth py-4 space-x-12 scrollbar-hide"
            >
              {products.map((product: any) => (
                <div className="flex-shrink-0 w-64 md:w-72" key={product._id}>
                  <a
                    href={`/product/${product._id}`}
                    className="overflow-hidden transition-all duration-300 w-full block group/item"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.product_cover}
                        alt={product.product_name}
                        className="w-full h-48 object-cover transform group-hover/item:scale-105 transition-all duration-300 rounded-2xl group-hover/item:rounded-none shadow-xl"
                        // Fallback image in case the original fails to load.
                        onError={(e: any) => {
                          e.currentTarget.src = `https://placehold.co/600x400/e2e8f0/4a5568?text=${encodeURIComponent(
                            product.product_name
                          )}`;
                        }}
                      />
                    </div>

                    <div className="my-4">
                      {/* Product Name */}
                      <h3
                        className="text-lg font-bold text-text mb-3 truncate group-hover/item:text-accent transition-colors"
                        title={product.product_name}
                      >
                        {product.product_name}
                      </h3>

                      {/* Bidding Details - Enhanced with better colors */}
                      <section className="mb-4 bg-gradient-to-br from-tertiary to-secondary rounded-xl group-hover/item:rounded-none p-3 border border-quaternary transition-all duration-300">
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 group-hover/item:text-accent transition-colors">
                              Current Bid
                            </p>
                            <p className="font-bold text-blue-600 dark:text-blue-400 group-hover/item:text-accent transition-colors">
                              {/* Apply formatting here */}
                              Ksh{" "}
                              {formatMoney(product?.current_bid?.toFixed(2))}
                            </p>
                          </div>

                          <div className="border-x border-blue-200 dark:border-gray-600">
                            <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 group-hover/item:text-accent transition-colors">
                              Bidders
                            </p>
                            <p className="font-bold text-purple-600 dark:text-purple-400 group-hover/item:text-accent transition-colors">
                              {/* ✅ DEBUG FIX: Added fallback to 0 */}
                              {product?.bidders_count ?? 0}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 group-hover/item:text-accent transition-colors">
                              Min. Bid
                            </p>
                            <p className="font-bold text-green-600 dark:text-green-400 group-hover/item:text-accent transition-colors">
                              {/* Apply formatting here */}
                              Ksh{" "}
                              {formatMoney(
                                product?.min_bid_increment?.toFixed(2)
                              )}
                            </p>
                          </div>
                        </div>
                      </section>

                      {/* Seller Information */}
                      <section className="flex flex-row justify-between items-center pt-3 border-t border-quaternary px-1">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="relative flex-shrink-0">
                            <img
                              src={
                                product.seller_info?.profile_picture ||
                                `https://placehold.co/100x100/3b82f6/FFF?text=${
                                  product.seller_info?.user_name
                                    ? product.seller_info.user_name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "S"
                                }`
                              }
                              alt={product.seller_info?.user_name || "Seller"}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100 dark:ring-gray-600"
                              onError={(e: any) => {
                                e.currentTarget.src = `https://placehold.co/100x100/3b82f6/FFF?text=${
                                  product.seller_info?.user_name
                                    ? product.seller_info.user_name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "S"
                                }`;
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover/item:text-accent transition-colors">
                              {product.seller_info?.user_name ||
                                "Unknown Seller"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate group-hover/item:text-accent transition-colors">
                              {product.seller_info?.permanent_address ||
                                "Unknown Location"}
                            </p>
                          </div>
                        </div>

                        {/* Rating and Verification */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="text-yellow-500"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover/item:text-accent transition-colors">
                              {product.seller_info?.average_rating?.toFixed(
                                1
                              ) || "N/A"}
                            </span>
                          </div>

                          {product.seller_info?.is_verified && (
                            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full font-medium group-hover/item:text-accent transition-colors">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                              </svg>
                              Verified
                            </span>
                          )}
                        </div>
                      </section>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Right Scroll Button */}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute top-1/2 -right-5 transform -translate-y-1/2 z-20 bg-accent rounded-full p-2.5 shadow-lg hover:bg-complementary transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none"
                aria-label="Scroll right"
              >
                <ChevronRightIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
