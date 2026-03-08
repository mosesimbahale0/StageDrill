// src/types/models.ts

import { Types } from "mongoose";

// --- Model Type Definitions ---
// This is now the SINGLE source of truth for your model types.

export interface CustomerType {
  _id: Types.ObjectId;
  _uid: string;
  phone_number: string;
  kyc_verified?: boolean;
  _kyc_id?: Types.ObjectId;
  user_name?: string;
  bio?: string;
  profile_picture?: string;
  cover_photo?: string;
  permanent_address?: string;
  is_active?: boolean;
  is_blocked?: boolean;
  is_verified?: boolean;
  is_moderated?: boolean;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  pinterest?: string;
  likes?: number;
  average_rating?: number;
  review_count?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductType {
  _id: Types.ObjectId;
  product_name: string;
  product_description?: string;
  product_cover?: string;
  product_images?: string[];
  product_video?: string;
  display_location?: string;
  start_bid: number;
  current_bid?: number;
  min_bid_increment?: number;
  must_win_bid?: number;
  auction_start: Date;
  auction_end: Date;
  is_sold?: boolean;
  tags?: string[];
  category?: string;
  sold_price?: number;
  seller: string;
  buyer?: string;
  is_active?: boolean;
  is_verified?: boolean;
  is_moderated?: boolean;
  views?: number;
  likes?: number;
  bidders_count?: number;
  bidders?: Types.ObjectId[];
  bid_history?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BidType {
  _id: Types.ObjectId;
  _product_id: Types.ObjectId;
  _customer_id: Types.ObjectId;
  bid_amount: number;
  bid_time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatType {
  _id: Types.ObjectId;
  _product_id: Types.ObjectId;
  _customer_id: Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReviewType {
  _id: Types.ObjectId;
  _customer_id: Types.ObjectId;
  rating: number;
  comment?: string;
  reviewed_by: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LikeType {
  _id: Types.ObjectId;
  _customer_id: Types.ObjectId;
  _product_id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
