import {
  GET_ONE_FUNSPOT,
  GET_PROFILE,
  GET_BALANCE,
  GET_ALL_FUNSPOTS,
  DELETE_FUNSPOT,
  GET_PROFILE_BY_ACCOUNT_ID,
  GET_ALL_REQUESTS_BY_ID,
  GET_ALL_RESPONSES,
  MESSAGE_RECEIVED,
  MEDIATE_REQUEST_MUTATION,
  REQUEST_CREATED_SUBSCRIPTION,

} from "~/graphql/funspotQueries";
import {
  FunspotSchema,
  ProfileSchema,
  BalanceSchema,
  ErrorSchema,
} from "~/types";
import { GRAPHQL_API_URL } from "~/utils/config";

// Fetch one funspot
// -------------------------------------------------------------------------------------------
export const fetchOneFunspot = async (
  funspotId: string
): Promise<FunspotSchema | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ONE_FUNSPOT,
        variables: { funspotId: funspotId },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(data.errors?.[0]?.message || "Failed to fetch funspot.");
    }

    return data.data.getOneFunspotById as FunspotSchema;
  } catch (error: any) {
    console.error("Error fetching funspot:", error.message);
    return { message: "Failed to fetch funspot", status: 500 };
  }
};




// Fetch balance
// -------------------------------------------------------------------------------------------
export const fetchBalance = async (
  accountId: string
): Promise<BalanceSchema | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_BALANCE,
        variables: { accountId },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(data.errors?.[0]?.message || "Failed to fetch balance.");
    }

    return data.data.getFundByAccountId as BalanceSchema;
  } catch (error: any) {
    console.error("Error fetching balance:", error.message);
    return { message: "Failed to fetch balance", status: 500 };
  }
};




// Fetch all funspots 
export const fetchAllFunspots = async (
  customerId: string
): Promise<FunspotSchema[] | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ALL_FUNSPOTS,
        variables: { customerId: customerId },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to fetch funspots."
      );
    }

    return data.data.getAllFunspotsByCustomerID as FunspotSchema[];
  } catch (error: any) {
    console.error("Error fetching funspots:", error.message);
    return { message: "Failed to fetch funspots", status: 500 };
  }
};



// Delete Funspot
export const deleteFunspot = async (
  funspotId: string
): Promise<FunspotSchema | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: DELETE_FUNSPOT,
        variables: { funspotId: funspotId },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(data.errors?.[0]?.message || "Failed to delete funspot.");
    }

    return data.data.deleteFunspot as FunspotSchema;
  } catch (error: any) {
    console.error("Error deleting funspot:", error.message);
    return { message: "Failed to delete funspot", status: 500 };
  }
};



// Fetch profile
// -------------------------------------------------------------------------------------------

export const fetchProfile = async (
  uid: string
): Promise<ProfileSchema | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_PROFILE,
        variables: { uid: uid },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(data.errors?.[0]?.message || "Failed to fetch profile.");
    }

    return data.data.getCustomerByUid as ProfileSchema;
  } catch (error: any) {
    console.error("Error fetching profile:", error.message);
    return { message: "Failed to fetch profile", status: 500 };
  }
};


// fetch profile by accountid
// -------------------------------------------------------------------------------------------
export const fetchProfileByAccountId = async (
  customerId: string
): Promise<ProfileSchema | ErrorSchema> => {  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_PROFILE_BY_ACCOUNT_ID,
        variables: { customerId: customerId },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to fetch profile."
      );
    }

    return data.data.getCustomer as ProfileSchema;
  } catch (error: any) {
    console.error("Error fetching profile:", error.message);
    return { message: "Failed to fetch profile", status: 500 };
  }
};




//  Fetch all requests by 
export const fetchAllRequestsById = async (
  funspotId: string
): Promise<any[] | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ALL_REQUESTS_BY_ID,
        variables: { funspotId: funspotId },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to fetch requests."
      );
    }

    return data.data.getAllRequestsByFunspotId;
  } catch (error: any) {
    console.error("Error fetching requests:", error.message);
    return { message: "Failed to fetch requests", status: 500 };
  }
};


// Fetch all responses by requestId
export const fetchAllResponsesByRequestId = async (
  requestId: string
): Promise<any[] | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ALL_RESPONSES,
        variables: { requestId: requestId },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to fetch responses."
      );
    }

    return data.data.getAllCleanresponsesByRequestId;
  } catch (error: any) {
    console.error("Error fetching responses:", error.message);
    return { message: "Failed to fetch responses", status: 500 };
  }
};


// Mediate Request
export const mediateRequest = async (input: any): Promise<any | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: MEDIATE_REQUEST_MUTATION,
        variables: { input },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(data.errors?.[0]?.message || "Failed to mediate request.");
    }

    return data.data.mediateRequest;
  } catch (error: any) {
    console.error("Error mediating request:", error.message);
    return { message: "Failed to mediate request", status: 500 };
  }
};


// Subscribe to message received
export const subscribeMessageReceived = async (
  callback: any
): Promise<any | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: MESSAGE_RECEIVED,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to subscribe to message received."
      );
    }
    const subscription = data.data.cleanresponseCreated;
    callback(subscription);
    return subscription;
  } catch (error: any) {
    console.error("Error subscribing to message received:", error.message);
    return {
      message: "Failed to subscribe to message received",
      status: 500,
    };
  }
};


// Subscribe to request created
export const subscribeRequestCreated = async (
  callback: any
): Promise<any | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: REQUEST_CREATED_SUBSCRIPTION,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to subscribe to request created."
      );
    }
    const subscription = data.data.requestCreated;
    callback(subscription);
    return subscription;
  } catch (error: any) {
    console.error("Error subscribing to request created:", error.message);
    return {
      message: "Failed to subscribe to request created",
      status: 500,
    };
  }
};
