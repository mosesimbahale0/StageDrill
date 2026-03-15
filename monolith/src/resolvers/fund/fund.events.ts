// src/fund/fund.events.ts

// Assuming pubsub is a singleton that can be imported
import { pubsub } from '../../utils/redisDb.js'; // Adjust path as per your project structure
import { Fund } from './fund.types.js';

export const FUND_CREATED_EVENT = "FUND_CREATED";
export const FUND_UPDATED_EVENT = "FUND_UPDATED";
export const FUND_DELETED_EVENT = "FUND_DELETED";

export const publishFundCreated = (fund: Fund): void => {
  if (pubsub) {
    pubsub.publish(FUND_CREATED_EVENT, { fundCreated: fund });
  } else {
    console.warn("PubSub not available, skipping FUND_CREATED event publish.");
  }
};

export const publishFundUpdated = (fund: Fund): void => {
  if (pubsub) {
    pubsub.publish(FUND_UPDATED_EVENT, { fundUpdated: fund });
  } else {
    console.warn("PubSub not available, skipping FUND_UPDATED event publish.");
  }
};

export const publishFundDeleted = (fund: Fund | null): void => {
  // Ensure fund is not null if your event expects a payload
  if (pubsub && fund) {
    pubsub.publish(FUND_DELETED_EVENT, { fundDeleted: fund });
  } else if (!pubsub) {
    console.warn("PubSub not available, skipping FUND_DELETED event publish.");
  }
};

// For Subscriptions
export const getFundCreatedAsyncIterator = () => {
  if (!pubsub) throw new Error("PubSub not available for subscriptions.");
  return pubsub.asyncIterator([FUND_CREATED_EVENT]);
};

export const getFundUpdatedAsyncIterator = () => {
  if (!pubsub) throw new Error("PubSub not available for subscriptions.");
  return pubsub.asyncIterator([FUND_UPDATED_EVENT]);
};

// Note: Your original code did not have a FUND_DELETED subscription.
// If you need one, you can add it here:
// export const getFundDeletedAsyncIterator = () => {
//   if (!pubsub) throw new Error("PubSub not available for subscriptions.");
//   return pubsub.asyncIterator([FUND_DELETED_EVENT]);
// };