import type { LoaderFunctionArgs } from "@remix-run/node";

export async function getUserAccountLoader({ request }: LoaderFunctionArgs) {
  console.log("    [loader-helper] getUserAccountLoader: Fetching user...");
  // Simulated user data
  const data = {
    user: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
  };
  console.log("    [loader-helper] getUserAccountLoader: Returning user data.");
  return data;
}

export async function getUserOrdersLoader({ request }: LoaderFunctionArgs) {
  console.log("    [loader-helper] getUserOrdersLoader: Fetching orders...");
  // Simulated orders data
  const data = {
    orders: [
      { id: "abc-123", date: "2023-10-26", total: 45.99, items: 3 },
      { id: "def-456", date: "2023-10-15", total: 12.5, items: 1 },
      { id: "ghi-789", date: "2023-09-02", total: 125.0, items: 5 },
    ],
  };
  console.log("    [loader-helper] getUserOrdersLoader: Returning orders data.");
  return data;
}