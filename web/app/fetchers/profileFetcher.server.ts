import {
  GET_ALL_COUNTRIES,
  GET_ALL_CUSTOMER_LANGUAGES,
  CREATE_USER,
  GET_ALL_TRANSACTIONS_BY_ACCOUNT_ID,
} from "~/graphql/profileQueries";


import {
    ProfileSchema,
    CustomerLanguages,
    Countries,
    ErrorSchema,
  } from "~/types";



import { GRAPHQL_API_URL } from "~/utils/config";


//  Loaders for  Get all contries, get all customer lagunages
// -------------------------------------------------------------------------------------------
export const fetchCountries = async (): Promise<Countries[] | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ALL_COUNTRIES,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(data.errors?.[0]?.message || "Failed to fetch countries.");
    }

    return data.data.getAllCountries as Countries[];
  } catch (error: any) {
    console.error("Error fetching countries:", error.message);
    return { message: "Failed to fetch countries", status: 500 };
  }
};


// -------------------------------------------------------------------------------------------
export const fetchCustomerLanguages = async (): Promise<
  CustomerLanguages[] | ErrorSchema
> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ALL_CUSTOMER_LANGUAGES,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to fetch customer languages."
      );
    }

    return data.data.getAllCustomerLanguages as CustomerLanguages[];
  } catch (error: any) {
    console.error("Error fetching customer languages:", error.message);
    return {
      message: "Failed to fetch customer languages",
      status: 500,
    };
  }
};


// Create User
// -------------------------------------------------------------------------------------------
export const createUser = async (
  input: any
): Promise<ProfileSchema | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CREATE_USER,
        variables: { input },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(data.errors?.[0]?.message || "Failed to create user.");
    }

    return data.data.createCustomer as ProfileSchema;
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    return { message: "Failed to create user", status: 500 };
  }
};



// Fetch all transactions by accountId
export const fetchAllTransactionsByAccountId = async (
  accountId: string,
  skip: number,
  limit: number
): Promise<any | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ALL_TRANSACTIONS_BY_ACCOUNT_ID,
        variables: { accountId, skip, limit },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to fetch transactions."
      );
    }

    return data.data;
  } catch (error: any) {
    console.error("Error fetching transactions:", error.message);
    return { message: "Failed to fetch transactions", status: 500 };
  }
};
