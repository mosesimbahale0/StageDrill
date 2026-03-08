const GRAPHQL_URL = process.env.GRAPHQL_URL || "http://localhost:4000/graphql";

// Make sure these imports point to the file containing your query strings
import { WATERS_QUERY, WATER_DETAILS_QUERY } from "../graphql/waterQueries";

interface FetchWatersParams {
  cursor?: string | null;
  limit?: number;
}

interface FetchWaterDetailsParams {
  id: string;
}

/**
 * A generic function to handle all GraphQL fetch requests.
 */
async function fetchGraphQL(query: string, variables: object) {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("GraphQL Error Response:", errorBody);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error("Error fetching GraphQL data.");
  }

  return json.data;
}

/**
 * Fetches a list of all water items.
 */
export async function fetchWaters({ cursor, limit }: FetchWatersParams) {
  const variables = {
    after: cursor,
    pageSize: limit,
  };
  const data = await fetchGraphQL(WATERS_QUERY, variables);
  return data?.waters?.waters || [];
}

/**
 * **CORRECTED FUNCTION**
 * Fetches details for a single water item by filtering the `waters` query.
 * @param {string} id - The unique ID for the water item.
 * @returns A single water item object or null if not found.
 */
export async function fetchWaterDetails({ id }: FetchWaterDetailsParams) {
  const variables = {
    // This variable name ('id') must match what's in your WATER_DETAILS_QUERY
    id,
  };

  // This function now uses a query that correctly targets the `waters` field
  const data = await fetchGraphQL(WATER_DETAILS_QUERY, variables);

  // The server returns a list, so we take the first (and only) item from the array.
  const waterItem = data?.waters?.waters?.[0];
  
  return waterItem;
}

