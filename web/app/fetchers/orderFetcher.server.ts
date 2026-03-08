import {
  GET_ORDERS,
  GET_ORDER_DETAILS,
  CREATE_ORDER,
  UPDATE_ORDER,
  DELETE_ORDER,
} from "~/graphql/orderQueries";
import { Order } from "~/types";
import { GRAPHQL_API_URL } from "~/utils/config";

export async function fetchOrders(): Promise<Order[]> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: GET_ORDERS }),
  });

  const result = await response.json();
  if (!response.ok || result.errors) {
    throw new Error(result.errors?.[0]?.message || "Failed to fetch funspot.");
  }
  return result.data.orders;
}

export async function fetchOrderDetailsById(id: string): Promise<Order> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_ORDER_DETAILS,
      variables: { id },
    }),
  });

  const result = await response.json();
  if (!response.ok || result.errors) {
    throw new Error(result.errors?.[0]?.message || "Failed to fetch funspot.");
  }
  return result.data.order;
}

export async function createOrder(input: Partial<Order>): Promise<Order> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_ORDER,
      variables: { input },
    }),
  });

  const result = await response.json();
  if (!response.ok || result.errors) {
    throw new Error(result.errors?.[0]?.message || "Failed to fetch funspot.");
  }
  return result.data.createOrder;
}

export async function updateOrder(
  id: string,
  input: Partial<Order>
): Promise<Order> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_ORDER,
      variables: { id, input },
    }),
  });

  const result = await response.json();
  if (!response.ok || result.errors) {
    throw new Error(result.errors?.[0]?.message || "Failed to fetch funspot.");
  }
  return result.data.updateOrder;
}

export async function deleteOrder(id: string): Promise<{ success: boolean }> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: DELETE_ORDER,
      variables: { id },
    }),
  });

  const result = await response.json();

  if (!response.ok || result.errors) {
    throw new Error(result.errors?.[0]?.message || "Failed to fetch funspot.");
  }
  return result.data.deleteOrder;
}
