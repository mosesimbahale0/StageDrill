// src/fund/fund.errors.ts

// Custom error classes (optional, but good practice)
export class FundNotFoundError extends Error {
  constructor(message: string = "Fund not found") {
    super(message);
    this.name = "FundNotFoundError";
  }
}

export class AccountIdRequiredError extends Error {
  constructor(message: string = "Account ID is required.") {
    super(message);
    this.name = "AccountIdRequiredError";
  }
}

export class PaypalIdInvalidError extends Error {
  constructor(message: string = "PayPal ID must be provided as a string.") {
    super(message);
    this.name = "PaypalIdInvalidError";
  }
}

export class DuplicateAccountIdError extends Error {
  constructor(accountId: string) {
    super(`Account ID ${accountId} already exists or a conflict occurred.`);
    this.name = "DuplicateAccountIdError";
  }
}

export class CriticalPaypalIdConstraintError extends Error {
  constructor() {
    super(
      "CRITICAL: Unique constraint violation on _paypal_id. The unique index on the _paypal_id field MUST be removed from the 'funds' collection in MongoDB."
    );
    this.name = "CriticalPaypalIdConstraintError";
  }
}

export class GenericUpdateError extends Error {
    constructor(message: string = "Error updating fund") {
        super(message);
        this.name = "GenericUpdateError";
    }
}

// Helper to handle MongoDB duplicate key errors specifically for funds
export const handleFundDuplicateKeyError = (error: any, accountId?: string, paypalId?: string) => {
  if (error.code === 11000 && error.keyPattern) {
    if (error.keyPattern._account_id && accountId) {
      throw new DuplicateAccountIdError(accountId);
    }
    if (error.keyPattern._paypal_id) {
      // This error should ideally not happen if the unique index on _paypal_id is removed.
      throw new CriticalPaypalIdConstraintError();
    }
    throw new Error(
      "A unique constraint violation occurred (most likely on _account_id)."
    );
  }
  throw error; // Re-throw other errors
};