// src/utils/loaders.ts

import DataLoader from "dataloader";
import { Types, Model } from "mongoose";
import { RedisClientType } from "redis";

import Customer from "../models/customer.model.js";

import Product from "../models/product.model.js";
import Bid from "../models/bid.model.js";
import Chat from "../models/chat.model.js";
import Review from "../models/review.model.js";
import Like from "../models/like.model.js";
// --- End Model Imports ---

// --- Context Import ---
import { MyContext } from "../types/graphql.js";

// 🔥 FIX: Import model types from the new single source of truth
// Note the relative path ../
import {  CustomerType,  ProductType,  BidType,  ChatType,  ReviewType,  LikeType,} from "../types/models.js";

// 🔥 FIX: All local type definitions have been REMOVED.
// They are now imported from '../types/models.js'

type RedisClient = RedisClientType;
// --- End Type Definitions ---

// --- Caching Constants ---
const CACHE_TTL_SECONDS = 3600; // 1 hour

const CUSTOMER_PREFIX = "customer:";

const PRODUCT_PREFIX = "product:";
const BID_PREFIX = "bid:";
const CHAT_PREFIX = "chat:";
const REVIEW_PREFIX = "review:";
const LIKE_PREFIX = "like:";
// --- End Caching Constants ---

/**
 * Generic batch function creator for a Mongoose model with Redis caching.
 */
const createBatchFn =
  <T extends { _id: Types.ObjectId }>(
    model: Model<any>,
    selectFields: string,
    cachePrefix: string,
    redisClient: RedisClient
  ) =>
  async (keys: readonly string[]): Promise<(T | null)[]> => {
    const uniqueKeys = [...new Set(keys)];
    const cacheKeys = uniqueKeys.map((k) => cachePrefix + k);
    let results: (T | null)[] = [];

    try {
      // 1. Try fetching from cache
      const cachedResults = await redisClient.mGet(cacheKeys);
      const parsedCache: (T | null)[] = cachedResults.map((res) =>
        res ? JSON.parse(res) : null
      );

      const cacheMap = new Map<string, T | null>();
      const keysToFetch: string[] = [];

      uniqueKeys.forEach((key, index) => {
        if (parsedCache[index]) {
          cacheMap.set(key, parsedCache[index]);
        } else {
          keysToFetch.push(key);
        }
      });

      // 2. Fetch missing keys from DB
      if (keysToFetch.length > 0) {
        const dbResults = await model
          .find({
            _id: { $in: keysToFetch.map((k) => new Types.ObjectId(k)) },
          })
          .select(selectFields)
          .lean<T[]>();

        // 3. Populate cache with new results
        const cachePipeline = redisClient.multi();
        for (const doc of dbResults) {
          const docId = String(doc._id);
          cacheMap.set(docId, doc);
          cachePipeline.set(cachePrefix + docId, JSON.stringify(doc), {
            EX: CACHE_TTL_SECONDS,
          });
        }
        await cachePipeline.exec();
      }

      // Map all results (cache + DB) back to the original *unique* keys
      results = uniqueKeys.map((key) => cacheMap.get(key) || null);
    } catch (error) {
      console.error(`Error in batch loader for ${model.modelName}:`, error);
      return keys.map(() => null);
    }

    // 4. Map back to the original *requested* keys order
    const finalResultMap = new Map(
      uniqueKeys.map((key, i) => [key, results[i]])
    );
    return keys.map((key) => finalResultMap.get(key) || null);
  };

/**
 * Creates and returns an object containing all DataLoader instances.
 * This is called from the Apollo context on every request.
 */
export const createLoaders = (redisClient: RedisClient) => {
  const likeFields = "_id _customer_id _product_id createdAt updatedAt";
  const reviewFields = "_id _customer_id rating comment reviewed_by createdAt updatedAt";
  const chatFields = "_id _product_id _customer_id content createdAt updatedAt";
  const bidFields = "_id _product_id _customer_id bid_amount bid_time createdAt updatedAt";
  const productFields = "_id product_name product_description product_cover product_images product_video display_location start_bid current_bid min_bid_increment must_win_bid auction_start auction_end is_sold tags category sold_price seller buyer is_active is_verified is_moderated views likes bidders_count bidders bid_history createdAt updatedAt";
  const customerFields = "_id _uid phone_number kyc_verified _kyc_id user_name bio profile_picture cover_photo permanent_address is_active is_blocked is_verified is_moderated website facebook twitter instagram linkedin youtube tiktok pinterest likes average_rating review_count createdAt updatedAt";
  // Define select fields for each model
  const templateFields =
    "_id github_link cover name description createdAt updatedAt";

  return {
        customerLoader: new DataLoader<string, CustomerType | null>(
      createBatchFn<CustomerType>(
        Customer,
        customerFields,
        CUSTOMER_PREFIX,
        redisClient
      )
    ),
        productLoader: new DataLoader<string, ProductType | null>(
      createBatchFn<ProductType>(
        Product,
        productFields,
        PRODUCT_PREFIX,
        redisClient
      )
    ),
        bidLoader: new DataLoader<string, BidType | null>(
      createBatchFn<BidType>(
        Bid,
        bidFields,
        BID_PREFIX,
        redisClient
      )
    ),
        chatLoader: new DataLoader<string, ChatType | null>(
      createBatchFn<ChatType>(
        Chat,
        chatFields,
        CHAT_PREFIX,
        redisClient
      )
    ),
        reviewLoader: new DataLoader<string, ReviewType | null>(
      createBatchFn<ReviewType>(
        Review,
        reviewFields,
        REVIEW_PREFIX,
        redisClient
      )
    ),
        likeLoader: new DataLoader<string, LikeType | null>(
      createBatchFn<LikeType>(
        Like,
        likeFields,
        LIKE_PREFIX,
        redisClient
      )
    ),
    // Add other loaders here following the same pattern
  };
};
