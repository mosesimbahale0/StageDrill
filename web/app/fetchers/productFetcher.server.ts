import {
  GET_PRODUCTS,
  GET_PRODUCT_DETAILS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "~/graphql/productQueries";
import { Product } from "~/types";
import { GRAPHQL_API_URL } from "~/utils/config";

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: GET_PRODUCTS }),
  });

  const result = await response.json();
  if (!response.ok || result.errors) {
    throw new Error(result.errors?.[0]?.message || "Failed to fetch funspot.");
  }
  return result.data.products;
}

export async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_PRODUCT_DETAILS,
      variables: { id },
    }),
  });

  const result = await response.json();
  if (!response.ok || result.errors) {
    throw new Error(result.errors?.[0]?.message || "Failed to fetch funspot.");
  }
  return result.data.product;
}

export async function createProduct(input: Partial<Product>): Promise<Product> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_PRODUCT,
      variables: { input },
    }),
  });

  const result = await response.json();
  if (!response.ok || result.errors) {
    throw new Error(result.errors?.[0]?.message || "Failed to fetch funspot.");
  }
  return result.data.createProduct;
}

export async function updateProduct(
  id: string,
  input: Partial<Product>
): Promise<Product> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_PRODUCT,
      variables: { id, input },
    }),
  });

  const result = await response.json();
  if (!response.ok || result.errors) {
    throw new Error(result.errors?.[0]?.message || "Failed to fetch funspot.");
  }
  return result.data.updateProduct;
}

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: DELETE_PRODUCT,
      variables: { id },
    }),
  });

  const result = await response.json();
  if (!response.ok || result.errors) {
    throw new Error(result.errors?.[0]?.message || "Failed to fetch funspot.");
  }
  return result.data.deleteProduct;
}
