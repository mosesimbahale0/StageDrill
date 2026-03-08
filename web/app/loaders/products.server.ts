import { json, type LoaderFunctionArgs } from "@remix-run/node";

// --- Type Definitions ---
export interface Product {
  _id: string;
  product_name: string;
  product_cover: string;
  current_bid: number;
  auction_end: string;
  category: string;
  min_bid_increment: number;
}

export interface PaginatedProducts {
  cursor: string | null;
  hasMore: boolean;
  products: Product[];
}

// --- GraphQL Setup ---
const GRAPHQL_URL = process.env.GRAPHQL_URL || "http://localhost:4000/graphql";

// --- GraphQL Queries ---
const GET_PRODUCTS_QUERY = `
  query Products($pageSize: Int, $after: String) {
    products(pageSize: $pageSize, after: $after) {
      cursor
      hasMore
      products { _id, product_name, product_cover, current_bid, auction_end, category, min_bid_increment }
    }
  }
`;

const GET_PAGINATED_PRODUCTS_BY_CATEGORY_QUERY = `
  query ProductsByCategory($category: String!, $pageSize: Int, $after: String) {
    productsByCategory(category: $category, pageSize: $pageSize, after: $after) {
      cursor
      hasMore
      products { _id, product_name, product_cover, current_bid, auction_end, category, min_bid_increment }
    }
  }
`;

const GET_FEATURED_PRODUCTS_QUERY = GET_PRODUCTS_QUERY;
const GET_RECOMMENDED_PRODUCTS_QUERY = GET_PRODUCTS_QUERY;
const GET_NEAR_YOU_PRODUCTS_QUERY = GET_PRODUCTS_QUERY;


async function queryGraphQL(query: string, variables: Record<string, any> = {}) {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from API: ${response.statusText}`);
    }

    const jsonResponse = await response.json();

    if (jsonResponse.errors) {
      console.error("❌ GraphQL Errors:", jsonResponse.errors);
      throw new Error("Error executing GraphQL query.");
    }
    
    return jsonResponse.data;
  } catch (error: any) {
    console.error("💥 CRITICAL ERROR in queryGraphQL:", error.message);
    throw error;
  }
}

// --- Exported Loader Functions ---

export async function getAllProductsLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const after = url.searchParams.get("after");
  const pageSize = 4;

  try {
    const data = await queryGraphQL(GET_PRODUCTS_QUERY, { pageSize, after });
    const paginatedData: PaginatedProducts = data.products || {
      products: [],
      cursor: null,
      hasMore: false,
    };
    
    const result = {
      products: paginatedData.products,
      cursor: paginatedData.cursor,
      hasMore: paginatedData.hasMore,
      category: null,
      error: null,
    };

    return result;
  } catch (error: any) {
    return {
      products: [],
      cursor: null,
      hasMore: false,
      category: null,
      error: error.message,
    };
  }
}

export async function getProductsByCategoryLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category")!;
  const after = url.searchParams.get("after");
  const pageSize = 12;

  try {
    const data = await queryGraphQL(GET_PAGINATED_PRODUCTS_BY_CATEGORY_QUERY, {
      category,
      pageSize,
      after,
    });
    
    const paginatedData: PaginatedProducts & { products: Product[] } = data.productsByCategory || {
      products: [],
      cursor: null,
      hasMore: false,
    };

    const result = {
      products: paginatedData.products,
      cursor: paginatedData.cursor,
      hasMore: paginatedData.hasMore,
      category,
      error: null,
    };
    
    return result;
  } catch (error: any) {
    return {
      products: [],
      cursor: null,
      hasMore: false,
      category,
      error: error.message,
    };
  }
}


// --- Loaders for Specific Page Sections ---

export async function getFeaturedProductsLoader() {
  try {
    const data = await queryGraphQL(GET_FEATURED_PRODUCTS_QUERY, { pageSize: 5 });
    return data.products?.products || [];
  } catch (error) {
    return [];
  }
}

export async function getRecommendedProductsLoader() {
  try {
    const data = await queryGraphQL(GET_RECOMMENDED_PRODUCTS_QUERY, { pageSize: 5 });
    return data.products?.products || [];
  } catch (error) {
    return [];
  }
}

export async function getNearYouProductsLoader() {
  try {
    const data = await queryGraphQL(GET_NEAR_YOU_PRODUCTS_QUERY, { pageSize: 5 });
    return data.products?.products || [];
  } catch (error) {
    return [];
  }
}
