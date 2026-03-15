import { BalanceSchema } from "~/types";

interface BalanceProps {
  propsData1: BalanceSchema;
}

// Function to format the tokens
const formatTokens = (tokens: number): string => {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(1)}M`;
  } else if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}K`;
  } else {
    return tokens.toFixed(2);
  }
};

export default function Balance({ propsData1 }: BalanceProps) {
  const balance = propsData1;

  // Ensure that tokens is a string, then convert to number. Fallback to 0 if necessary.
  const displayTokens = typeof balance?.tokens === "string"
    ? parseFloat(balance.tokens) // Convert string to number
    : balance?.tokens || 0; // Fallback to 0 if tokens is not available or invalid

  return (
    <div>
      <div className="flex flex-row gap-2 h-10 justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M15 4a8 8 0 1 1-8 8a8 8 0 0 1 8-8M3 12a6 6 0 0 0 4 5.65v2.09A8 8 0 0 1 7 4.26v2.09A6 6 0 0 0 3 12"
          />
        </svg>
        <div className="relative inline-block">
          <p className="text-xs truncate">
            {formatTokens(displayTokens)} credits
          </p>
        </div>
      </div>
    </div>
  );
}
