import React, { useState, useEffect, useRef, Fragment } from "react";
import { useFetcher, Link, Fetcher } from "@remix-run/react";
import { Transition, Dialog } from "@headlessui/react";
import {
  Star,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

// ===================================
// 🎨 UTILITY & FORM SUB-COMPONENTS
// (Rewritten with Lucide & new styles)
// ===================================

// --- Star Icon (Using Lucide) ---
const StarIcon = ({
  className,
  solid,
}: {
  className: string;
  solid: boolean;
}) => (
  <Star
    className={className}
    fill={solid ? "currentColor" : "none"}
    strokeWidth={1.5}
  />
);

// --- Star Rating Display (Unchanged, auto-updates) ---
const StarRating = ({
  rating,
  size = "h-5 w-5",
}: {
  rating: number;
  size?: string;
}) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <StarIcon
        key={i}
        className={`${size} text-yellow-400`}
        solid={i <= rating}
      />
    );
  }
  return <div className="flex">{stars}</div>;
};

// --- Review Form (Restyled like BidModal) ---
type ReviewFormProps = {
  merchantId: string;
  reviewFetcher: Fetcher;
};
export function ReviewForm({ merchantId, reviewFetcher }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const isSubmitting = reviewFetcher.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);

  // Clear form state on successful submission
  useEffect(() => {
    if (reviewFetcher.data && reviewFetcher.data.success && !isSubmitting) {
      setRating(0);
      setComment("");
      // We don't reset the formRef here because this is a controlled component.
      // Resetting state is the correct way.
    }
  }, [reviewFetcher.data, isSubmitting]);

  return (
    <reviewFetcher.Form method="post" ref={formRef} className="space-y-6">
      <input type="hidden" name="_action" value="createReview" />
      <input type="hidden" name="merchantId" value={merchantId} />

      {/* Rating Input */}
      <div>
        <label className="block text-sm font-medium text-text2 mb-2">
          Your Rating
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="text-gray-400 hover:text-yellow-400"
            >
              <StarIcon
                className="h-6 w-6"
                solid={star <= (hoverRating || rating)}
              />
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating} />
        {reviewFetcher.data?.error &&
          !reviewFetcher.data?.newReview &&
          reviewFetcher.data.error.toLowerCase().includes("rating") && (
            <p className="text-red-400 text-sm mt-1">
              {reviewFetcher.data.error}
            </p>
          )}
      </div>

      {/* Comment Input */}
      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-text2 mb-2"
        >
          Your Review
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-primary text-text placeholder:text-text2 h-32 w-full px-4 py-3 border border-tertiary rounded-xl outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm transition"
          placeholder="Share your experience with this seller..."
          disabled={isSubmitting}
        />
        {reviewFetcher.data?.error &&
          !reviewFetcher.data?.newReview &&
          reviewFetcher.data.error.toLowerCase().includes("comment") && (
            <p className="text-red-400 text-sm mt-1">
              {reviewFetcher.data.error}
            </p>
          )}
      </div>

      {/* Submission */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || comment.trim() === ""}
          className="px-6 py-3 text-sm rounded-full bg-accent text-buttontext hover:bg-accent/90 disabled:opacity-50 transition hover:bg-complementary"
        >
          {isSubmitting ? "Posting..." : "Post Review"}
        </button>
      </div>
    </reviewFetcher.Form>
  );
}

// ===================================
// 🎨 NEWLY ORGANIZED COMPONENTS
// ===================================

// --- Types (for clarity) ---
type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  reviewed_by: {
    _id: string;
    user_name: string;
    profile_picture?: string;
    average_rating?: number;
  };
};

type CurrentUser = {
  _id: string;
  user_name: string;
  profile_picture?: string;
} | null;

// --- Review Modal (Rebuilt with Headless UI) ---
type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
function ReviewModal({ isOpen, onClose, children }: ReviewModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-transparent backdrop-blur-md" />
        </Transition.Child>

        {/* Modal Content */}
        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-6 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-6 scale-95"
          >
            <Dialog.Panel className="relative w-full max-w-md rounded-3xl bg-secondary p-8 md:p-12 text-left shadow-2xl transition-all">
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-text2 hover:text-accent transition"
              >
                <XCircle className="w-6 h-6" />
              </button>

              {/* Title */}
              <Dialog.Title
                as="h3"
                className="flex items-center gap-2 text-2xl font-semibold text-text mb-6 border-b border-tertiary pb-4"
              >
                <Star className="w-6 h-6 text-accent" />
                Write a Review
              </Dialog.Title>

              {/* Form goes here */}
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

// --- Review Card (Restyled) ---
function ReviewCard({ review }: { review: Review }) {
  return (
    <div
      key={review._id}
      className="flex-shrink-0 w-80 h-full flex flex-col justify-between rounded-2xl bg-secondary border border-tertiary shadow-sm p-4"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <img
            src={
              review.reviewed_by.profile_picture ||
              "https://placehold.co/32x32/1D1E22/E6EDF3?text=U"
            }
            alt={review.reviewed_by.user_name}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <span className="text-sm font-medium text-text1">
              {review.reviewed_by.user_name}
            </span>
            <StarRating rating={review.rating} size="h-4 w-4" />
          </div>
        </div>
        <p className="text-sm text-text1_medium mt-2">{review.comment}</p>
      </div>
      <p className="text-xs text-text2 text-right mt-3">
        {review.createdAt
          ? new Date(review.createdAt).toLocaleDateString()
          : ""}
      </p>
    </div>
  );
}

// ===================================
// 🎨 REFACTORED MAIN COMPONENT
// ===================================

type MerchantReviewSectionProps = {
  merchantId: string;
  initialReviews: Review[];
  currentCustomerId: string | null;
  currentUser: CurrentUser;
  reviewFetcher: Fetcher;
};

export function MerchantReviewSection({
  merchantId,
  initialReviews,
  currentCustomerId,
  currentUser,
  reviewFetcher,
}: MerchantReviewSectionProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Effect to add new review to UI and close modal
  useEffect(() => {
    if (reviewFetcher.data?.newReview && currentUser) {
      const newReviewData = reviewFetcher.data.newReview;
      const fullNewReview: Review = {
        ...newReviewData,
        reviewed_by: {
          _id: currentUser._id,
          user_name: currentUser.user_name,
          profile_picture: currentUser.profile_picture,
        },
      };

      if (!reviews.find((r) => r._id === fullNewReview._id)) {
        setReviews((prevReviews) => [fullNewReview, ...prevReviews]);
      }
      setIsModalOpen(false);
    }
  }, [reviewFetcher.data, reviews, currentUser]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  // --- Scroll Functions ---
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 336; // w-80 (320px) + space-x-4 (16px)
      if (direction === "left") {
        scrollContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      } else {
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="mt-4 border-t border-tertiary pt-4">
      <h4 className="font-semibold text-text1 mb-2">Seller Reviews</h4>
      {reviews.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={averageRating} />
          <span className="text-sm text-text2">
            {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
          </span>
        </div>
      )}

      {/* --- Review Form Trigger (Styled like your page) --- */}
      {currentCustomerId && (
        <div className="mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-tertiary text-sm text-text py-4 px-6 max-w-72 rounded-full hover:bg-complementary hover:text-buttontext transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <MessageSquare className="w-4 h-4" />
            Leave a review
          </button>
        </div>
      )}

      {/* --- Review Modal (Using new Headless UI component) --- */}
      <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ReviewForm merchantId={merchantId} reviewFetcher={reviewFetcher} />
      </ReviewModal>

      {/* --- Review List with Navigation --- */}
      {reviews.length === 0 ? (
        <p className="text-sm text-text2">No reviews for this seller yet.</p>
      ) : (
        <div className="relative">
          {/* Left Scroll Button (Using Lucide) */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 -ml-4 top-1/2 -translate-y-1/2 bg-accent text-buttontext hover:bg-complementary shadow-2xl border border-tertiary hover:bg-accent text-text1 p-1 rounded-full z-10 hidden md:block"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 py-4 -mx-5 px-5 overflow-x-auto scrollbar-hide"
          >
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>

          {/* Right Scroll Button (Using Lucide) */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-accent text-buttontext hover:bg-complementary shadow-2xl hover:bg-accent text-text1 p-1 rounded-full z-10 hidden md:block"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
