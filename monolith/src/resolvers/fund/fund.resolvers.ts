// src/fund/fund.resolvers.ts

import * as fundService from './fund.service.js';
import * as fundEvents from './fund.events.js';
import * as fundValidators from './fund.validators.js';
import { FundNotFoundError, GenericUpdateError } from './fund.errors.js';
import {
  GraphQLContext,
  GetFundArgs,
  GetFundByPaypalIdArgs,
  GetFundByAccountIdArgs,
  CreateFundInput,
  UpdateFundArgs,
} from './fund.types.js';

export const fundsResolvers = {
  Query: {
    getFund: async (_: any, { fundId }: GetFundArgs) => {
      try {
        const fund = await fundService.findFundById(fundId);
        // Optionally, throw FundNotFoundError if fund is null and you want to ensure a fund is always returned
        // if (!fund) throw new FundNotFoundError(`Fund with ID ${fundId} not found`);
        return fund;
      } catch (error) {
        console.error(`Resolver error in getFund for ID ${fundId}:`, error);
        // Rethrow or handle as a GraphQL error
        throw error;
      }
    },

    getFundByPaypalId: async (_: any, { paypalId }: GetFundByPaypalIdArgs) => {
      try {
        return await fundService.findFundByPaypalId(paypalId);
      } catch (error) {
        console.error(`Resolver error in getFundByPaypalId for PayPal ID ${paypalId}:`, error);
        throw error;
      }
    },

    getFundByAccountId: async (_: any, { accountId }: GetFundByAccountIdArgs) => {
      try {
        return await fundService.findFundByAccountId(accountId);
      } catch (error) {
        console.error(`Resolver error in getFundByAccountId for Account ID ${accountId}:`, error);
        throw error;
      }
    },
  },

  Mutation: {
    createFund: async (
      _: any,
      args: CreateFundInput,
      context: GraphQLContext // Assuming pubsub might still be needed from context for some reason, though events.ts now imports it
    ) => {
      // The 'pubsub' from context is not directly used here if fundEvents.ts handles it.
      // If fundEvents.ts needed pubsub passed to each function, you'd pass context.pubsub.
      
      fundValidators.validateCreateFundInput(args); // Validator will throw if issues found

      try {
        const { fund, wasCreated } = await fundService.createOrUpsertFund(args);
        
        if (wasCreated) {
          fundEvents.publishFundCreated(fund);
        } else {
          fundEvents.publishFundUpdated(fund);
        }
        return fund;
      } catch (error) {
        console.error(`Resolver error in createFund for Account ID ${args._account_id}:`, error);
        // The service layer (via handleFundDuplicateKeyError) might throw specific errors.
        // Or, catch and transform them into GraphQL formatted errors if needed.
        throw error;
      }
    },

    updateFund: async (_: any, { fundId, fund: fundData }: UpdateFundArgs, context: GraphQLContext) => {
      fundValidators.validateUpdateFundArgs(fundId, fundData);

      try {
        const updatedFund = await fundService.updateFundInDB(fundId, fundData);
        if (!updatedFund) {
          throw new FundNotFoundError(`Fund with ID ${fundId} not found for update.`);
        }
        fundEvents.publishFundUpdated(updatedFund);
        return updatedFund;
      } catch (error) {
        console.error(`Resolver error in updateFund for ID ${fundId}:`, error);
        if (error instanceof FundNotFoundError) throw error;
        throw new GenericUpdateError(); // Or rethrow the original error
      }
    },

    deleteFund: async (_: any, { fundId }: GetFundArgs, context: GraphQLContext) => {
      try {
        const deletedFund = await fundService.deleteFundFromDB(fundId);
        // Check if fund existed before deletion to avoid publishing event for non-existent fund.
        if (deletedFund) {
          fundEvents.publishFundDeleted(deletedFund);
        } else {
            // Depending on requirements, you might want to throw FundNotFoundError here
            // or return null/undefined silently if that's acceptable.
            // For consistency with original code, if findByIdAndDelete returns null, it implies not found.
            // The original code would return null in this case for the resolver.
        }
        return deletedFund; // Matches original behavior of returning the deleted fund or null
      } catch (error) {
        console.error(`Resolver error in deleteFund for ID ${fundId}:`, error);
        throw error;
      }
    },
  },

  Subscription: {
    fundCreated: {
      subscribe: () => fundEvents.getFundCreatedAsyncIterator(),
    },
    fundUpdated: {
      subscribe: () => fundEvents.getFundUpdatedAsyncIterator(),
    },
    // If you add FUND_DELETED subscription:
    // fundDeleted: {
    //   subscribe: () => fundEvents.getFundDeletedAsyncIterator(),
    // },
  },
};