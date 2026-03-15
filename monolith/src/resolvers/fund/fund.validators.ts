// src/fund/fund.validators.ts

import { CreateFundInput } from './fund.types.js';

export const validateCreateFundInput = (input: CreateFundInput): void => {
  if (!input._account_id) {
    throw new Error("Account ID is required.");
  }
  // The schema's `required: true` for _paypal_id should also enforce its presence.
  // This client-side check adds an early exit.
  if (typeof input._paypal_id !== "string") {
    throw new Error("PayPal ID must be provided as a string.");
  }
  // Add other validation logic as needed
};

export const validateUpdateFundArgs = (fundId: string, fundInput: any): void => {
  if (!fundId) {
    throw new Error("Fund ID is required for an update.");
  }
  if (!fundInput || Object.keys(fundInput).length === 0) {
    throw new Error("Fund data is required for an update.");
  }
  // Add more specific validation for fundInput fields if necessary
};