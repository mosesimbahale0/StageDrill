// src/types/graphql.ts

import { Request } from "express";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { RedisClientType } from "redis";
import DataLoader from "dataloader";
import { Types } from "mongoose";

// 🔥 FIX: Import model types from the new single source of truth
import {
  CustomerType,
  ProductType,
  BidType,
  ChatType,
  ReviewType,
  LikeType,
} from "./models.js";

// --- Other Interfaces (Kept from your original file) ---
export interface Template {
  _id: string;
  name: string;
  github_link: string;
  cover: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- End Other Interfaces ---

// 🔥 FIX: All local type definitions have been REMOVED.
// They are now imported from './models.js'

/**
 * Defines the types for the loaders object.
 * This interface now correctly uses the imported types.
 */
export interface DataLoaders {
  customerLoader: DataLoader<string, CustomerType | null>;
  productLoader: DataLoader<string, ProductType | null>;
  bidLoader: DataLoader<string, BidType | null>;
  chatLoader: DataLoader<string, ChatType | null>;
  reviewLoader: DataLoader<string, ReviewType | null>;
  likeLoader: DataLoader<string, LikeType | null>;}

/**
 * Defines the custom Apollo Server context.
 * This interface is now correct because DataLoaders is correct.
 */
export interface MyContext {
  req: Request;
  pubsub: RedisPubSub;
  redisClient: RedisClientType;
  loaders: DataLoaders;
}
