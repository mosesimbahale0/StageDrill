import { Link } from "@remix-run/react";
// import { useProfile } from "~/context/ProfileProvider";
import { motion } from "framer-motion";
import { TemplateSchema } from "~/types";

// --- Reusable Icon Components for Clarity ---

const CloneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    >
      <path d="M20.998 10c-.012-2.175-.108-3.353-.877-4.121C19.243 5 17.828 5 15 5h-3c-2.828 0-4.243 0-5.121.879C6 6.757 6 8.172 6 11v5c0 2.828 0 4.243.879 5.121C7.757 22 9.172 22 12 22h3c2.828 0 4.243 0 5.121-.879C21 20.243 21 18.828 21 16v-1" />
      <path d="M3 10v6a3 3 0 0 0 3 3M18 5a3 3 0 0 0-3-3h-4C7.229 2 5.343 2 4.172 3.172C3.518 3.825 3.229 4.7 3.102 6" />
    </g>
  </svg>
);

const VerifiedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="1.5"
    >
      <path stroke-linejoin="round" d="m8.5 12.5l2 2l5-5" />
      <path d="M3.03 13.078a2.5 2.5 0 0 1 0-2.157c.14-.294.38-.576.86-1.14c.192-.225.288-.337.368-.457a2.5 2.5 0 0 0 .376-.907c.028-.142.04-.289.063-.583c.059-.738.088-1.107.197-1.416A2.5 2.5 0 0 1 6.42 4.894c.308-.109.677-.139 1.416-.197c.294-.024.44-.036.582-.064a2.5 2.5 0 0 0 .908-.376c.12-.08.232-.175.456-.367c.564-.48.846-.72 1.14-.861a2.5 2.5 0 0 1 2.157 0c.295.14.577.38 1.14.861c.225.192.337.287.457.367a2.5 2.5 0 0 0 .908.376c.141.028.288.04.582.064c.739.058 1.108.088 1.416.197a2.5 2.5 0 0 1 1.525 1.524M4.894 17.581a2.5 2.5 0 0 0 1.525 1.524c.308.11.677.139 1.416.197c.294.024.44.036.582.064a2.5 2.5 0 0 1 .908.376c.12.08.232.175.456.367c.564.48.846.72 1.14.861a2.5 2.5 0 0 0 2.157 0c.295-.14.577-.38 1.14-.861a5 5 0 0 1 .457-.367a2.5 2.5 0 0 1 .908-.376c.141-.028.288-.04.582-.064c.739-.058 1.108-.088 1.416-.197a2.5 2.5 0 0 0 1.525-1.524c.109-.308.138-.678.197-1.416c.023-.294.035-.441.063-.583c.064-.324.192-.633.376-.907c.08-.12.176-.232.367-.457c.48-.564.721-.846.862-1.14a2.5 2.5 0 0 0 0-2.157" />
    </g>
  </svg>
);

const HeartStatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="m8.962 18.91l.464-.588zM12 5.5l-.54.52a.75.75 0 0 0 1.08 0zm3.038 13.41l.465.59zm-8.037-2.49a.75.75 0 0 0-.954 1.16zm-4.659-3.009a.75.75 0 1 0 1.316-.72zm.408-4.274c0-2.15 1.215-3.954 2.874-4.713c1.612-.737 3.778-.541 5.836 1.597l1.08-1.04C10.1 2.444 7.264 2.025 5 3.06C2.786 4.073 1.25 6.425 1.25 9.137zM8.497 19.5c.513.404 1.063.834 1.62 1.16s1.193.59 1.883.59v-1.5c-.31 0-.674-.12-1.126-.385c-.453-.264-.922-.628-1.448-1.043zm7.006 0c1.426-1.125 3.25-2.413 4.68-4.024c1.457-1.64 2.567-3.673 2.567-6.339h-1.5c0 2.198-.9 3.891-2.188 5.343c-1.315 1.48-2.972 2.647-4.488 3.842zM22.75 9.137c0-2.712-1.535-5.064-3.75-6.077c-2.264-1.035-5.098-.616-7.54 1.92l1.08 1.04c2.058-2.137 4.224-2.333 5.836-1.596c1.659.759 2.874 2.562 2.874 4.713zm-8.176 9.185c-.526.415-.995.779-1.448 1.043s-.816.385-1.126.385v1.5c.69 0 1.326-.265 1.883-.59c.558-.326 1.107-.756 1.62-1.16zm-5.148 0c-.796-.627-1.605-1.226-2.425-1.901l-.954 1.158c.83.683 1.708 1.335 2.45 1.92zm-5.768-5.63a7.25 7.25 0 0 1-.908-3.555h-1.5c0 1.638.42 3.046 1.092 4.275z"
    />
  </svg>
);

const StarStatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
      d="M6.04 7.772c-2.46.557-3.69.835-3.983 1.776c-.292.94.546 1.921 2.223 3.882l.434.507c.476.557.715.836.822 1.18c.107.345.071.717-.001 1.46l-.066.677c-.253 2.617-.38 3.925.386 4.506s1.918.051 4.22-1.009l.597-.274c.654-.302.981-.452 1.328-.452s.674.15 1.329.452l.595.274c2.303 1.06 3.455 1.59 4.22 1.01c.767-.582.64-1.89.387-4.507m1.189-3.824c1.677-1.96 2.515-2.941 2.223-3.882s-1.523-1.22-3.983-1.776l-.636-.144c-.699-.158-1.048-.237-1.329-.45s-.46-.536-.82-1.182l-.328-.588C13.58 3.136 12.947 2 12 2s-1.58 1.136-2.847 3.408"
    />
  </svg>
);

// --- Main Card Component ---

export default function TemplateCard({
  propsData: data,
}: {
  propsData: TemplateSchema;
}) {
  // --- Defensive Checks & Data Preparation ---
  if (!data) {
    return (
      <div className="w-full h-[384px] bg-secondary rounded-3xl animate-pulse"></div>
    );
  }

  // const { profile, profileLoading, profileError } = useProfile();

  // if (profileLoading) {
  //   return (
  //     <div className="w-full h-[384px] bg-secondary rounded-3xl animate-pulse"></div>
  //   );
  // }

  // if (profileError || !profile?._id) {
  //   return (
  //     <div className="w-full h-[384px] flex items-center justify-center bg-danger/10 text-danger rounded-3xl p-4">
  //       Error: Could not load user profile.
  //     </div>
  //   );
  // }

  // const accountId = profile._id;
  const likesCount = data.liking?.length || 0;
  const clonesCount = data.cloners?.length || 0;
  const reviewsCount = data.rating?.length || 0;
  const avgRating =
    reviewsCount > 0
      ? data.rating.reduce((sum, review) => sum + review.stars, 0) /
      reviewsCount
      : 0;

  // --- Style Objects ---
  const sulphurPointFont = { fontFamily: "Sulphur Point, sans-serif" };

  // --- Animation Variants ---
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto font-sans group 
  "
    >
      {/* --- Clone Button --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="absolute top-6 right-6 z-10"
      >
        <Link
          to={`/clone/${data._id}/account`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center w-12 h-12 bg-accent/90 text-buttontext rounded-full shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:bg-accent group-hover:text-buttontext group-hover:scale-110"
          aria-label="Clone template"
          title="Clone this template"
        >
          <CloneIcon />
        </Link>
      </motion.div>

      {/* --- Main Clickable Card Link --- */}
      <Link
        to={`/template/${data._id}/account`}
        className="flex flex-col w-full bg-primary border border-tertiary rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-0 group-hover:border-accent"
        style={{ textDecoration: "none" }}
      >
        {/* --- Image Container --- */}
        <div className="w-full h-56 relative overflow-hidden bg-tertiary rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10 pointer-events-none" />
          <img
            src={
              data.cover ||
              "https://placehold.co/800x600/e2e8f0/slate?text=Template"
            }
            alt={data.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/800x600/e2e8f0/475569?text=Not+Found";
            }}
          />
        </div>

        {/* --- Content Container --- */}
        <div className="flex-grow flex flex-col justify-between p-5 relative z-20 -mt-8 bg-primary mx-3 mb-3 rounded-2xl shadow-md group-hover:shadow-xl border border-secondary group-hover:border-accent/40 transition-all duration-500">
          <div className="flex flex-col gap-2">

            {/* Template Name */}
            <h2
              className="text-lg font-bold text-text line-clamp-2 leading-tight"
              title={data.name}
            >
              {data.name}
            </h2>

            {/* Author Info */}
            <div
              className="flex items-center gap-2 text-sm text-accent mt-1"
              style={sulphurPointFont}
            >
              <VerifiedIcon />
              <span className="font-bold text-sm tracking-wide">StageDrill</span>
            </div>

          </div>

          {/* Stats Footer */}
          <div className="flex items-center justify-between text-xs text-text3 border-t border-tertiary pt-4 mt-6">
            <div
              className="flex items-center gap-1.5  text-text2"
              title={`${likesCount} likes`}
            >
              <HeartStatIcon />
              <span className="font-medium text-text2">{likesCount}</span>
            </div>
            <div
              className="flex items-center gap-1.5  text-text2"
              title={`${clonesCount} clones`}
            >
              <CloneIcon />
              <span className="font-medium text-text2">{clonesCount}</span>
            </div>
            <div
              className="flex items-center gap-1.5  text-text2"
              title={`${reviewsCount} reviews`}
            >
              <StarStatIcon />
              <span className="font-medium text-text2">{reviewsCount}</span>
              {/* avgrating */}
              <span className="text-text2">
                {avgRating > 0 ? `(${avgRating.toFixed(1)})` : ""}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
