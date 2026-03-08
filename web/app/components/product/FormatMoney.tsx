/**
 * Formats large numbers into a human-readable string with suffixes.
 * e.g., 1000 -> 1k, 1500000 -> 1.5M
 * @param {number} num - The number to format.
 * @returns {string} The formatted string.
 */
export function formatMoney(num?: number | null): string {
  if (num === null || num === undefined || isNaN(num)) return "0";

  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
  }
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  // ✅ Safe fallback
  return Number(num).toLocaleString();
}