// src/schemas/typeDefs.ts
import { gql } from "graphql-tag";
export default gql `
  type Customer {
    _id: ID!
    _uid: String!
    phone_number: String!
    kyc_verified: Boolean
    _kyc_id: ID
    user_name: String
    bio: String
    profile_picture: String
    cover_photo: String
    permanent_address: String
    is_active: Boolean
    is_blocked: Boolean
    is_verified: Boolean
    is_moderated: Boolean
    website: String
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    tiktok: String
    pinterest: String
    likes: Float
    average_rating: Float
    review_count: Float
    reviews: [Review]
    liking_history: [Product]
    createdAt: String
    updatedAt: String
  }
  input CustomerInput {
    _uid: String
    phone_number: String
    kyc_verified: Boolean
    _kyc_id: ID
    user_name: String
    bio: String
    profile_picture: String
    cover_photo: String
    permanent_address: String
    is_active: Boolean
    is_blocked: Boolean
    is_verified: Boolean
    is_moderated: Boolean
    website: String
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    tiktok: String
    pinterest: String
    likes: Float
    average_rating: Float
    review_count: Float
  }
  type CustomerConnection {
    customers: [Customer!]!
    cursor: ID
    hasMore: Boolean!
  }
  input CustomerFilter {
    search: String
    _uid: String
    phone_number: String
    kyc_verified: Boolean
    _kyc_id: ID
    user_name: String
    bio: String
    profile_picture: String
    cover_photo: String
    permanent_address: String
    is_active: Boolean
    is_blocked: Boolean
    is_verified: Boolean
    is_moderated: Boolean
    website: String
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    tiktok: String
    pinterest: String
    likes: Float
    average_rating: Float
    review_count: Float
  }
  input CustomerSort {
    field: String
    order: String
  }
  type Query {
    customers(
      pageSize: Int
      after: ID
      filter: CustomerFilter
      sort: CustomerSort
    ): CustomerConnection!
    customer(_id: ID!): Customer
    customerByPhoneNumber(phone_number: String!): Customer
  }
  type Mutation {
    createCustomer(input: CustomerInput!): Customer!
    updateCustomer(_id: ID!, input: CustomerInput!): Customer
    deleteCustomer(_id: ID!): Customer
  }
  type Subscription {
    customerAdded: Customer!
  }

  type Product {
    _id: ID!
    product_name: String!
    product_description: String
    product_cover: String
    product_images: [String]
    product_video: String
    display_location: String
    start_bid: Float!
    current_bid: Float
    min_bid_increment: Float
    must_win_bid: Float
    auction_start: String!
    auction_end: String!
    is_sold: Boolean
    tags: [String]
    category: String
    sold_price: Float
    seller: String!
    buyer: String
    is_active: Boolean
    is_verified: Boolean
    is_moderated: Boolean
    views: Float
    likes: Float
    bidders_count: Float
    bidders: [Customer]
    bidHistory: [Bid]
    likedBy: [Customer]
    createdAt: String
    updatedAt: String
  }
  input ProductInput {
    product_name: String
    product_description: String
    product_cover: String
    product_images: [String]
    product_video: String
    display_location: String
    start_bid: Float
    current_bid: Float
    min_bid_increment: Float
    must_win_bid: Float
    auction_start: String
    auction_end: String
    is_sold: Boolean
    tags: [String]
    category: String
    sold_price: Float
    seller: String
    buyer: String
    is_active: Boolean
    is_verified: Boolean
    is_moderated: Boolean
    views: Float
    likes: Float
    bidders_count: Float
    bidders: [ID]
    bid_history: [ID]
  }
  type ProductConnection {
    products: [Product!]!
    cursor: ID
    hasMore: Boolean!
  }
  input ProductFilter {
    search: String
    product_name: String
    product_description: String
    product_cover: String
    product_images: String
    product_video: String
    display_location: String
    start_bid: Float
    current_bid: Float
    min_bid_increment: Float
    must_win_bid: Float
    auction_start: String
    auction_end: String
    is_sold: Boolean
    tags: String
    category: String
    sold_price: Float
    seller: String
    buyer: String
    is_active: Boolean
    is_verified: Boolean
    is_moderated: Boolean
    views: Float
    likes: Float
    bidders_count: Float
    bidders: ID
    bid_history: ID
  }
  input ProductSort {
    field: String
    order: String
  }
  extend type Query {
    products(pageSize: Int, after: String): ProductConnection
    product(id: ID!): Product
    productsByCategory(
      category: String!
      pageSize: Int
      after: String
    ): ProductConnection
    productsByRecommendation(customerId: ID!, coordinates: String!): [Product]
    productsByFeatured(coordinates: String!): [Product]
    productsByNearYou(coordinates: String!): [Product]
    productsBySearch(query: String!): [Product]
    productsBySimilar(productId: ID!): [Product]
    productsBySeller(seller: String!): [Product]
  }
  extend type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(_id: ID!, input: ProductInput!): Product
    deleteProduct(_id: ID!): Product
  }
  extend type Subscription {
    productAdded: Product!
  }

  type Bid {
    _id: ID!
    _product_id: ID!
    _customer_id: ID!
    bid_amount: Float!
    bid_time: String
    createdAt: String
    updatedAt: String
    product: Product!
    customer: Customer!
  }
  input BidInput {
    _product_id: ID
    _customer_id: ID
    bid_amount: Float
    bid_time: String
  }
  type BidConnection {
    bids: [Bid!]!
    cursor: ID
    hasMore: Boolean!
  }
  input BidFilter {
    search: String
    _product_id: ID
    _customer_id: ID
    bid_amount: Float
    bid_time: String
  }
  input BidSort {
    field: String
    order: String
  }
  extend type Query {
    bids(pageSize: Int, after: String): BidConnection
    bid(id: ID!): Bid
    bidsByProduct(productId: ID!): [Bid]
    bidsByCustomer(customerId: ID!): [Bid]
  }
  extend type Mutation {
    createBid(input: BidInput!): Bid!
    updateBid(_id: ID!, input: BidInput!): Bid
    deleteBid(_id: ID!): Bid
  }
  extend type Subscription {
    bidAdded: Bid!
  }

  type Chat {
    _id: ID!
    _product_id: ID!
    _customer_id: ID!
    content: String!
    createdAt: String
    updatedAt: String
    product: Product!
    customer: Customer!
  }
  input ChatInput {
    _product_id: ID
    _customer_id: ID
    content: String
  }
  type ChatConnection {
    chats: [Chat!]!
    cursor: ID
    hasMore: Boolean!
  }
  input ChatFilter {
    search: String
    _product_id: ID
    _customer_id: ID
    content: String
  }
  input ChatSort {
    field: String
    order: String
  }
  extend type Query {
    chats(
      pageSize: Int
      after: ID
      filter: ChatFilter
      sort: ChatSort
    ): ChatConnection!
    getOneChat(_id: ID!): Chat

    chatsByProduct(productId: ID!): [Chat]
  }
  extend type Mutation {
    createChat(input: ChatInput!): Chat!
    updateChat(_id: ID!, input: ChatInput!): Chat
    deleteChat(_id: ID!): Chat
  }
  extend type Subscription {
    chatAdded: Chat!
  }

  type Review {
    _id: ID!
    _customer_id: ID!
    rating: Float!
    comment: String
    reviewed_by: Customer!
    createdAt: String
    updatedAt: String
    customer: Customer!
  }
  input ReviewInput {
    _customer_id: ID
    rating: Float
    comment: String
    reviewed_by: ID
  }
  type ReviewConnection {
    reviews: [Review!]!
    cursor: ID
    hasMore: Boolean!
  }
  input ReviewFilter {
    search: String
    _customer_id: ID
    rating: Float
    comment: String
    reviewed_by: ID
  }
  input ReviewSort {
    field: String
    order: String
  }
  extend type Query {
    reviewsForCustomer(customerId: ID!): [Review] # Get all reviews *for* a customer
    reviewsByCustomer(customerId: ID!): [Review] # Get all reviews *written by* a customer
    reviewsByProduct(productId: ID!): [Review] # Note: DB schema doesn't support this
    review(id: ID!): Review
  }
  extend type Mutation {
    createReview(input: ReviewInput!): Review!
    updateReview(_id: ID!, input: ReviewInput!): Review
    deleteReview(_id: ID!): Review
  }

  type Like {
    _id: ID!
    _customer_id: ID!
    _product_id: ID!
    createdAt: String
    updatedAt: String
  }
  input LikeInput {
    _customer_id: ID
    _product_id: ID
  }
  type LikeConnection {
    likes: [Like!]!
    cursor: ID
    hasMore: Boolean!
  }
  input LikeFilter {
    search: String
    _customer_id: ID
    _product_id: ID
  }
  input LikeSort {
    field: String
    order: String
  }
  extend type Query {
    likes(
      pageSize: Int
      after: ID
      filter: LikeFilter
      sort: LikeSort
    ): LikeConnection!
    getOneLike(_id: ID!): Like
  }
  extend type Mutation {
    # --- /! REPLACED like/unlike with toggleLike /! ---
    toggleLikeProduct(productId: ID!, customerId: ID!): Product
    createLike(input: LikeInput!): Like!
    updateLike(_id: ID!, input: LikeInput!): Like
    deleteLike(_id: ID!): Like
  }
  extend type Subscription {
    likeAdded: Like!
  }
`;
