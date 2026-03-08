import Review from "../models/review.model.js";
import Customer from "../models/customer.model.js";
import pino from "pino"; // Using pino for structured logging
import mongoose from "mongoose";
import { GraphQLError } from "graphql";
// --- Setup Logger ---
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

// --- ADDED REVIEW HELPER FUNCTION ---
/**
 * Recalculates and updates a customer's average rating and review count.
 * @param {string | mongoose.Types.ObjectId} customerId - The ID of the customer to update.
 */
async function recalculateCustomerRating(customerId) {
  if (!customerId) return;

  try {
    const reviews = await Review.find({ _customer_id: customerId });
    const review_count = reviews.length;
    const average_rating =
      review_count > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / review_count
        : 0;

    await Customer.findByIdAndUpdate(customerId, {
      review_count,
      average_rating: average_rating.toFixed(2), // Store with 2 decimal places
    });
    logger.info(
      { customerId, review_count, average_rating },
      `Recalculated ratings for customer`
    );
  } catch (error) {
    logger.error({ err: error, customerId }, "Failed to recalculate rating");
    // Don't throw error, just log it. Failing this shouldn't fail the mutation.
  }
}

export const reviewResolvers = {
  Query: {
    // --- ADDED Review Query Resolvers ---
    reviewsForCustomer: async (_, { customerId }) => {
      return Review.find({ _customer_id: customerId })
        .populate(["_customer_id", "reviewed_by"])
        .sort({ createdAt: -1 });
    },
    reviewsByCustomer: async (_, { customerId }) => {
      return Review.find({ reviewed_by: customerId })
        .populate(["_customer_id", "reviewed_by"])
        .sort({ createdAt: -1 });
    },
    review: async (_, { id }) => {
      return Review.findById(id).populate(["_customer_id", "reviewed_by"]);
    },
    reviewsByProduct: async (_, { productId }) => {
      // NOTE: This query is in the schema but not supported by the current
      // database model, as reviews are linked to Customers, not Products.
      // Returning empty array to avoid breaking clients.
      logger.warn(
        `reviewsByProduct query called for ${productId}, but this is not supported by the DB schema.`
      );
      return [];
    },
  },
  Mutation: {
    createReview: async (_, { input }) => {
      const newItem = await Review.create(input);
      return newItem;
    },
    updateReview: async (_, { _id, input }) => {
      return await Review.findByIdAndUpdate(_id, input, { new: true });
    },
    deleteReview: async (_, { _id }) => {
      return await Review.findByIdAndDelete(_id);
    },
  },

  // --- ADDED Type Resolvers ---
  Review: {
    // Resolve fields on the 'Review' type
    customer: (parent) => parent._customer_id, // Already populated
    reviewed_by: (parent) => parent.reviewed_by, // Already populated
  },
};
