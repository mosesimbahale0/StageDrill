// src/fund/fund.types.ts

// Basic Fund type based on usage
export interface Fund {
  _id: string; // Assuming MongoDB ObjectId as string
  _paypal_id?: string; // Optional based on your schema logic for updates
  _account_id: string;
  is_active?: boolean;
  tokens?: string; // Or appropriate type for tokens
  // Add other fields from your Funds model if necessary

  createdAt?: string; // Assuming ISO string format from service conversion
  updatedAt?: string; // Assuming ISO string format from service conversion
  
}

// Input type for creating/updating a fund via createFund mutation
export interface CreateFundInput {
  _paypal_id: string;
  _account_id: string;
  is_active?: boolean;
  tokens?: number;
}

// Input type for updating a fund via updateFund mutation
export interface UpdateFundDataInput {
  _paypal_id?: string;
  _account_id?: string; // Usually you don't update the account_id this way but included if needed
  is_active?: boolean;
  tokens?: number;
  // Add other updatable fields
}

export interface UpdateFundArgs {
  fundId: string;
  fund: UpdateFundDataInput;
}

// Argument types for queries
export interface GetFundArgs {
  fundId: string;
}

export interface GetFundByPaypalIdArgs {
  paypalId: string;
}

export interface GetFundByAccountIdArgs {
  accountId: string;
}

// Context type (if you have a defined context)
export interface GraphQLContext {
  pubsub?: any; // Replace 'any' with your actual PubSub type if available
  // other context properties
}