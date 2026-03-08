import Bid from "../models/bid.model.js";
import Product from "../models/product.model.js";
import { pubsub } from "../utils/redisDb.js";
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
const BID_ADDED = "BID_ADDED";
async function paginateBids({ pageSize = 15, after }) {
    const limit = pageSize + 1;
    let query = {};
    if (after) {
        try {
            query = { _id: { $gt: new mongoose.Types.ObjectId(after) } };
        }
        catch (e) {
            logger.warn({ after, error: e.message }, "Invalid 'after' cursor");
            throw new GraphQLError("Invalid 'after' cursor format.", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }
    }
    const documents = await Bid.find(query)
        .sort({ _id: 1 })
        .limit(limit)
        .populate("_customer_id"); // Populates the 'customer' field in Bid type
    const hasMore = documents.length === limit;
    const nodes = hasMore ? documents.slice(0, -1) : documents;
    const cursor = nodes.length > 0 ? nodes[nodes.length - 1]._id.toString() : null;
    return { cursor, hasMore, bids: nodes };
}
export const bidResolvers = {
    Query: {
        // --- Bid Queries ---
        bids: async (_, args) => paginateBids(args),
        bid: async (_, { id }) => Bid.findById(id).populate("_customer_id"),
        bidsByProduct: async (_, { productId }) => Bid.find({ _product_id: productId }).populate("_customer_id"),
        bidsByCustomer: async (_, { customerId }) => Bid.find({ _customer_id: customerId }).populate("_customer_id"),
    },
    Mutation: {
        // --- Bid Mutation ---
        createBid: async (_, { input }) => {
            const { _product_id, _customer_id, bid_amount } = input;
            const product = await Product.findById(_product_id);
            if (!product) {
                logger.warn({ productId: _product_id }, "createBid failed: Product not found");
                throw new GraphQLError("Product not found.");
            }
            if (new Date() > new Date(product.auction_end)) {
                logger.warn({ productId: _product_id }, "createBid failed: Auction has ended");
                throw new GraphQLError("Auction has ended.");
            }
            if (bid_amount <= (product.current_bid || product.start_bid)) {
                logger.warn({
                    productId: _product_id,
                    bid_amount,
                    current_bid: product.current_bid,
                }, "createBid failed: Bid too low");
                throw new GraphQLError("Bid must be higher than the current bid.");
            }
            const session = await mongoose.startSession();
            let newBid;
            try {
                await session.withTransaction(async () => {
                    product.current_bid = bid_amount;
                    if (!product.bidders.some((bidderId) => bidderId.equals(_customer_id))) {
                        product.bidders.push(_customer_id);
                        product.bidders_count = (product.bidders_count || 0) + 1;
                    }
                    newBid = new Bid(input);
                    product.bid_history.push(newBid._id);
                    await product.save({ session });
                    await newBid.save({ session });
                });
                logger.info({
                    bidId: newBid._id,
                    productId: _product_id,
                    customerId: _customer_id,
                    bid_amount,
                }, "New bid created");
            }
            catch (error) {
                logger.error({ err: error }, "createBid transaction failed");
                throw error; // Re-throw
            }
            finally {
                session.endSession();
            }
            return newBid.populate("_customer_id");
        },
        updateBid: async (_, { _id, input }) => {
            return await Bid.findByIdAndUpdate(_id, input, { new: true });
        },
        deleteBid: async (_, { _id }) => {
            return await Bid.findByIdAndDelete(_id);
        },
    },
    Bid: {
        // Resolve fields on the 'Bid' type
        product: (parent) => Product.findById(parent._product_id), // Needs population
        customer: (parent) => parent._customer_id, // Already populated
    },
    Subscription: {
        bidAdded: {
            subscribe: () => pubsub.asyncIterator([BID_ADDED]),
        },
    },
};
