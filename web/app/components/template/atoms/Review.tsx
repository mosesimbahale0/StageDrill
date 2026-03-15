import React, { useState, useContext } from "react";
import { useProfile } from "~/context/ProfileProvider";
import { SnackbarContext } from "~/context/SnackbarContext";

interface ReviewProps {
  propsData4: {
    name: string;
    _id: string;
  };
  closeModal: () => void;
  handleReviewSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  fetcher: any;
}

export default function Review({ propsData4, closeModal, handleReviewSubmit, fetcher }: ReviewProps) {
  const { profile } = useProfile();
  const userProfile = profile || {};
  const { showSnackbar } = useContext(SnackbarContext);

  const templateName = propsData4.name;
  const _template_id = propsData4._id;
  const _account_id = userProfile._id;

  const [review, setReview] = useState("");
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(event.target.value);
  };

  const handleStarClick = (selectedStars: number) => {
    setStars(selectedStars);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (stars !== null && review.trim() !== "") {
      setLoading(true);
      try {
        await fetcher.submit(
          {
            actionType: "review",
            stars: stars.toString(),
            text: review,
          },
          { method: "post" }
        );

        setReview("");
        setStars(null);
        showSnackbar("Review submitted successfully", "success");
        closeModal();
      } catch (error) {
        console.error(error);
        showSnackbar("Operation failed", "error");
      } finally {
        setLoading(false);
      }
    } else {
      alert(stars === null ? "Please rate your experience." : "Please enter your review.");
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
      <button key={i} className="text-2xl cursor-pointer" onClick={() => handleStarClick(i)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i <= (stars ?? 0) ? "currentColor" : "none"}
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      </button>
    ));
  };

  return (
    <form className="p-4 flex flex-col gap-6" onSubmit={handleSubmit}>
      <p className="text-xl font-semibold">{templateName}</p>

      <div className="flex flex-row gap-2 text-warning">{renderStars()}</div>

      <textarea
        id="review"
        value={review}
        onChange={handleReviewChange}
        placeholder="Write your review here..."
        className="min-h-24 h-24 text-sm leading-none text-text rounded-lg placeholder:text-text2 bg-secondary py-4 px-5 w-full border focus:border-accent focus:outline-none border-tertiary"
      />

      <button
        type="submit"
        className={`bg-accent/20 text-accent px-4 lg:px-14 py-3 rounded-full ${
          loading ? "cursor-not-allowed opacity-50" : "hover:bg-accent hover:text-white"
        }`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
