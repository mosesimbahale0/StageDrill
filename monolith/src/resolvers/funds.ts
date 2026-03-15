// src/resolvers/client.ts
import Funds from "../models/funds.model.js";
// new src/resolvers/client.ts
import { pubsub } from "../utils/redisDb.js";

export const fundsResolvers = {
  Query: {
    // funds
    //---------------------------------------//
    getFund: async (_: any, { fundId }: any) => {
      try {
        const fund = await Funds.findById(fundId);
        return fund;
      } catch (error) {
        throw error;
      }
    },
    getFundByPaypalId: async (_: any, { paypalId }: any) => {
      try {
        const fund = await Funds.findOne({ _paypal_id: paypalId });
        return fund;
      } catch (error) {
        throw error;
      }
    },
    getFundByAccountId: async (_: any, { accountId }: any) => {
      try {
        const fund = await Funds.findOne({ _account_id: accountId });
        return fund;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    createFund: async (
      _: any,
      { _paypal_id, _account_id, is_active, tokens }: any,
      { pubsub }: any // Assuming pubsub is passed in context
    ) => {
      // Ensure _account_id is provided, as it's key to the logic
      if (!_account_id) {
        throw new Error("Account ID is required.");
      }
      // Ensure _paypal_id is provided (as a string, can be empty if that's valid for your needs)
      // The schema's `required: true` for _paypal_id will also enforce its presence.
      if (typeof _paypal_id !== "string") {
        throw new Error("PayPal ID must be provided as a string.");
      }

      try {
        // Check if a fund with the same _account_id exists
        let existingFundByAccountId = await Funds.findOne({
          _account_id: _account_id,
        });

        if (existingFundByAccountId) {
          // Fund with this _account_id exists. Update it.
          // No need to check for _paypal_id conflicts with other accounts.
          const updatedFund = await Funds.findOneAndUpdate(
            { _account_id: _account_id },
            { _paypal_id, is_active, tokens }, // Update _paypal_id, is_active, tokens
            { new: true } // Returns the updated document
          );
          if (pubsub) {
            pubsub.publish("FUND_UPDATED", { fundUpdated: updatedFund });
          }
          return updatedFund;
        } else {
          // No fund with this _account_id. Attempt to create a new fund.
          // No need to check if _paypal_id is already in use by another account.
          const newFund = await Funds.create({
            _account_id,
            _paypal_id,
            is_active,
            tokens,
          });
          if (pubsub) {
            pubsub.publish("FUND_CREATED", { fundCreated: newFund });
          }
          return newFund;
        }
      } catch (error: any) {
        // Handle potential MongoDB duplicate key errors (code 11000)
        // This should now primarily trigger for _account_id if its unique index is correctly enforced.
        if (error.code === 11000 && error.keyPattern) {
          if (error.keyPattern._account_id) {
            // This error means the unique constraint on _account_id was violated.
            // This typically happens if:
            // 1. The findOne didn't see an existing record (e.g. race condition), and create was attempted.
            // 2. Some other process created an _account_id between findOne and create/update.
            // It also means your manual cleanup of duplicate _account_ids or the unique index setup for _account_id might still need attention.
            throw new Error(
              `Account ID ${_account_id} already exists or a conflict occurred.`
            );
          }
          // If you see this error, it means the unique index on _paypal_id was NOT removed from the database.
          if (error.keyPattern._paypal_id) {
            throw new Error(
              `CRITICAL: Unique constraint violation on _paypal_id. The unique index on the _paypal_id field MUST be removed from the 'funds' collection in MongoDB.`
            );
          }
          throw new Error(
            "A unique constraint violation occurred (most likely on _account_id)."
          );
        }
        // Re-throw other errors or handle them as needed
        throw error;
      }
    },

    updateFund: async (
      _: any,
      { fundId, fund }: { fundId: string; fund: any }
    ) => {
      try {
        const updatedFund = await Funds.findByIdAndUpdate(fundId, fund, {
          new: true,
        });
        if (!updatedFund) {
          throw new Error("Fund not found");
        }
        pubsub.publish("FUND_UPDATED", { fundUpdated: updatedFund });
        return updatedFund;
      } catch (error) {
        console.error(error);
        throw new Error("Error updating fund");
      }
    },

    deleteFund: async (_: any, { fundId }: any) => {
      try {
        const fund = await Funds.findByIdAndDelete(fundId);
        pubsub.publish("FUND_DELETED", { fundDeleted: fund });
        return fund;
      } catch (error) {
        throw error;
      }
    },
  },
  Subscription: {
    fundCreated: {
      subscribe: () => pubsub.asyncIterator(["FUND_CREATED"]),
    },
    fundUpdated: {
      subscribe: () => pubsub.asyncIterator(["FUND_UPDATED"]),
    },
  },
};


