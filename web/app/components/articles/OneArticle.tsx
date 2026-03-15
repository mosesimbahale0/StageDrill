import React from "react";
import { marked } from "marked";

// Auth
//--------------------------------------------------------------------------
import { useAuth } from "~/authContext";
// -----------------------------------------------------------------------------

interface Comment {
  _id: string;
  articleId: string;
  userId: string;
  name: string;
  email: string;
  comment: string;
  createdAt: string;
}

interface Article {
  _id: string;
  author: string;
  title: string;
  description: string;
  cover: string;
  tags: string[];
  markdown: string;
  createdAt: string;
  updatedAt: string;
  readsCount: number;
  likesCount: number;
  commentsCount: number;
}

interface Props {
  article: Article | null;
  markdown: string;
  likesCount: number;
  userHasLiked: boolean;
  handleLikeToggle: () => void;
  comments: Comment[];
  handleDeleteComment: (commentId: string) => void;
  commentName: string;
  setCommentName: (name: string) => void;
  commentEmail: string;
  setCommentEmail: (email: string) => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  handleSubmitComment: (e: React.FormEvent) => void;
}

interface OneArticleProps extends Props {}

// Base classes for the main container
const containerClasses = `
    bg-secondary
    w-full max-w-4xl 
    mx-auto 
    rounded-2xl 
    shadow-lg 
    border border-tertiary
    p-6 sm:p-8 md:p-12
  `;

// All typography styles are defined here using Tailwind's `prose` plugin.
// This approach keeps the styling consistent for all markdown elements.
const proseClasses = `
    prose prose-lg dark:prose-invert 
    prose-headings:font-semibold prose-headings:text-gray-800 dark:prose-headings:text-gray-100
    prose-p:text-gray-600 dark:prose-p:text-gray-300
    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
    prose-strong:text-gray-700 dark:prose-strong:text-gray-200
    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500 dark:prose-blockquote:text-gray-400
    prose-ul:list-disc prose-ul:pl-5
    prose-ol:list-decimal prose-ol:pl-5
    prose-li:my-1
    prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-red-500 dark:prose-code:text-red-400 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-mono prose-code:text-sm
    prose-pre:bg-gray-800 dark:prose-pre:bg-gray-900 prose-pre:text-gray-200 prose-pre:p-4 prose-pre:rounded-lg prose-pre:shadow-inner
    prose-img:rounded-lg prose-img:shadow-md
    prose-table:w-full prose-table:border-collapse
    prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600
    prose-td:p-3 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700
  `;

// Sulphur Point font style for all titles
const sulphurPoint = { fontFamily: "Sulphur Point, sans-serif" };
const poppins = { fontFamily: "Poppins, sans-serif" };
const outfit = { fontFamily: "Outfit, sans-serif" };

export default function OneArticle({
  article,
  markdown,
  likesCount,
  userHasLiked,
  handleLikeToggle,
  comments,
  handleDeleteComment,
  commentName,
  setCommentName,
  commentEmail,
  setCommentEmail,
  newComment,
  setNewComment,
  handleSubmitComment,
}: OneArticleProps) {
  if (!article) return <p>Article not found</p>;

  // Authenticated user info
  const { user } = useAuth();
  const userId = user?.uid;
  const userName = user?.displayName;
  const userEmail = user?.email;

  // log Created @
  // console.log(article);

  const authorInitials = article?.author
    ?.split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
  const userInitials = userName
    ?.split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-primary py-32 p-2 lg:px-0">
      <section className="bg-primary text-text min-h-screen">
        <div className="flex flex-col gap-4 items-center justify-center  container mx-auto">
          {/* ARTICLE DETAILS */}
          <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col lg:flex-row flex-wrap w-full">
              <div className="flex flex-col gap-4 w-full lg:w-1/2 lg:pr-16">
                <h1
                  className="text-4xl font-medium mb-4 text-left w-full "
                  style={outfit}
                >
                  {article.title}
                </h1>

                <div className="flex flex-wrap gap-2 text-text2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="bg-tertiary px-4 py-2.5 rounded-2xl text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-text2 mb-4">{article.description}</p>

                <div className="flex flex-row justify-left items-center gap-6">
                  <div className="flex flex-row gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M19.285 12.645a3.8 3.8 0 0 0-5.416-5.332q-.288.288-.732.707l-.823.775l-.823-.775q-.445-.42-.733-.707a3.8 3.8 0 0 0-5.374 0c-1.468 1.469-1.485 3.844-.054 5.32l6.984 6.984l6.97-6.972z"
                      />
                    </svg>
                    <span className="text-text2">{likesCount}</span>
                  </div>

                  <div className="flex flex-row gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.89 1 4.127L3 21l4.873-1c1.236.639 2.64 1 4.127 1"
                      />
                    </svg>
                    <span className="text-text2">{article.commentsCount}</span>
                  </div>

                  <div className="flex flex-row gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="M11.602 18.636a.75.75 0 0 0 .398.11a.75.75 0 0 0 .398-.11l1.135-.681a8.3 8.3 0 0 1 7.36-.59c.89.356 1.857-.3 1.857-1.257V4.45c0-.578-.352-1.097-.889-1.312a10.7 10.7 0 0 0-9.48.76L12 4.124l-.382-.229a10.7 10.7 0 0 0-9.48-.76A1.41 1.41 0 0 0 1.25 4.45v11.66c0 .957.967 1.612 1.857 1.256a8.3 8.3 0 0 1 7.36.59zM2.75 4.508v11.387a9.8 9.8 0 0 1 8.489.774l.011.006V5.425l-.403-.242a9.2 9.2 0 0 0-8.097-.675m10.011 12.16l-.011.007V5.425l.403-.242a9.2 9.2 0 0 1 8.097-.675v11.387a9.8 9.8 0 0 0-8.489.774"
                        clip-rule="evenodd"
                      />
                      <path
                        fill="currentColor"
                        d="M9.275 19.042a6.5 6.5 0 0 0-6.55 0l-.103.06a.75.75 0 1 0 .756 1.296l.103-.06a5 5 0 0 1 5.038 0l1.088.634a4.75 4.75 0 0 0 4.786 0l1.088-.634a5 5 0 0 1 5.038 0l.103.06a.75.75 0 0 0 .756-1.296l-.103-.06a6.5 6.5 0 0 0-6.55 0l-1.087.634a3.25 3.25 0 0 1-3.276 0z"
                      />
                    </svg>
                    <span className="text-text2">{article.readsCount}</span>
                  </div>
                </div>

                <div className="flex flex-row justify-left items-center gap-4 my-4">
                  <button
                    type="button"
                    onClick={handleLikeToggle}
                    className={`bg-quaternary shadow hover:bg-accent text-text h-12 w-12 rounded-full flex justify-center items-center border-2 border-quaternary hover:border-accent transition-transform transform ${
                      userHasLiked ? "scale-110" : "hover:scale-105 "
                    }`}
                  >
                    {userHasLiked ? (
                      // Liked State SVG with Fade-in
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="transition-opacity duration-3000 opacity-100 text-active"
                      >
                        <path
                          fill="currentColor"
                          d="M4.536 5.778a5 5 0 0 1 7.07 0q.275.274.708.682q.432-.408.707-.682a5 5 0 0 1 7.125 7.016L13.02 19.92a1 1 0 0 1-1.414 0L4.48 12.795a5 5 0 0 1 .055-7.017z"
                        />
                      </svg>
                    ) : (
                      // Unliked State SVG with Fade-out
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="transition-opacity duration-300 opacity-100 "
                      >
                        <path
                          fill="currentColor"
                          fill-rule="evenodd"
                          d="M19.285 12.645a3.8 3.8 0 0 0-5.416-5.332q-.288.288-.732.707l-.823.775l-.823-.775q-.445-.42-.733-.707a3.8 3.8 0 0 0-5.374 0c-1.468 1.469-1.485 3.844-.054 5.32l6.984 6.984l6.97-6.972zm-14.75-6.18a5 5 0 0 1 7.072 0q.273.274.707.682q.432-.408.707-.683a5 5 0 0 1 7.125 7.017l-7.125 7.126a1 1 0 0 1-1.414 0L4.48 13.48a5 5 0 0 1 .055-7.017z"
                        />
                      </svg>
                    )}
                  </button>
                  <span className="text-text2">Like</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full lg:w-1/2">
                <img
                  src={article.cover}
                  alt={article.title}
                  className="w-full h-96 object-cover rounded-2xl mb-4"
                />
              </div>
            </div>

            {/* MARKDOWN CONTENT */}
            <div className={containerClasses}>
              <div
                className={`${proseClasses}`}
                style={outfit}
                dangerouslySetInnerHTML={{ __html: marked(markdown) }}
              />
            </div>
          </div>

          <div className={containerClasses}>
            <h2 className="text-xl font-semibold mb-4 ">Comments</h2>

            {/* COMMENTS SECTION */}
            <div className="flex flex-col w-full gap-4 p-4">
              {/* If the user is not llogged in show link to login page {otherwise show the somment form * */}
              {!userId && (
                <div className=" text-left">
                  <p className="text-text mb-2">
                    Please{" "}
                    <a
                      href="/auth"
                      className="text-accent hover:underline font-semibold"
                    >
                      log in
                    </a>{" "}
                    to post a comment.
                  </p>
                </div>
              )}

              <h2 className="text-xl font-semibold mb-4 ">
                {article.commentsCount} Comment(s)
              </h2>

              {userId && (
                <form
                  onSubmit={handleSubmitComment}
                  className="flex flex-row flex-wrap gap-2 items-center text-text mt-2"
                >
                  <div className="w-20 h-20 bg-tertiary rounded-full flex items-center justify-center shadow-lg text-text">
                    <p className="text-xl">{userInitials}</p>
                  </div>

                  <div className="flex flex-col  ">
                    <textarea
                      placeholder={`Write your comment here..., ${
                        userName ? userName : "Guest"
                      }`}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full  min-h-20 max-h-20 h-20 p-4 rounded-3xl border border-background focus:outline-none focus:ring-2 focus:ring-accent bg-background  text-sm "
                    />
                  </div>

                  <div className="flex flex-row gap-2 items-center">
                    <button
                      type="submit"
                      className="bg-accent text-text px-12 rounded-full hover:bg-complementary h-20   "
                    >
                      Submit Comment
                    </button>
                  </div>
                </form>
              )}

              <div className="flex flex-col gap-4">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex flex-col gap-2 p-4 bg-primary rounded-xl"
                  >
                    <div className="flex flex-row justify-between items-center">
                      <p className="text-text">{comment.name}</p>
                      {comment.userId === userId && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    <p className="text-text2">{comment.comment}</p>

                    <p className="text-xs text-text2">
                      {new Date(Number(comment.createdAt)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
