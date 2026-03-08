export default function WhitePapers() {
  return (
    <>
      {/* Download White Papers */}
      <div className="flex flex-row text-text2  flex-wrap gap-2 mt-4">
        {/* Download Glassophobia White Paper */}
        <a
          href="/whitepapers/glossophobia_white_paper.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="  hover:text-accent text-sm mt-2  flex flex-row gap-1 justify-center items-center hover:underline "
        >
          Glossophobia Treatement White Paper
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="m6 18l2.5-2.5M18 6H9m9 0v9m0-9l-6.5 6.5"
            />
          </svg>
        </a>

        <a
          href="/whitepapers/interviews_white_paper.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="  hover:text-accent text-sm mt-2  flex flex-row gap-1 justify-center items-center hover:underline"
        >
          Interviews Preparation White Paper
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="m6 18l2.5-2.5M18 6H9m9 0v9m0-9l-6.5 6.5"
            />
          </svg>
        </a>
      </div>
    </>
  );
}
