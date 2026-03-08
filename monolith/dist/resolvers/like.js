import Like from "../models/like.model.js";
import { pubsub } from "../utils/redisDb.js";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";
import { GraphQLError } from "graphql";
import pino from "pino"; // Using pino for structured logging
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
const LIKE_ADDED = "LIKE_ADDED";
// --- 'likedBy' is no longer populated here ---
const productPopulateOptions = [
    { path: "bidders" },
    {
        path: "bid_history",
        populate: { path: "_customer_id", model: "Customer" },
    },
];
export const likeResolvers = {
    Query: {
        likes: async (_, { pageSize = 20, after, filter, sort }) => {
            let query = {};
            if (filter) {
                if (filter._customer_id)
                    query._customer_id = filter._customer_id;
                if (filter._product_id)
                    query._product_id = filter._product_id;
            }
            if (after) {
                query._id = { $lt: after };
            }
            const limit = pageSize + 1;
            const sortOptions = sort
                ? { [sort.field]: sort.order === "ASC" ? 1 : -1 }
                : { _id: -1 };
            const items = await Like.find(query).sort(sortOptions).limit(limit);
            const hasMore = items.length === limit;
            const results = hasMore ? items.slice(0, -1) : items;
            const cursor = results.length > 0 ? results[results.length - 1]._id.toString() : null;
            return { likes: results, cursor, hasMore };
        },
        getOneLike: async (_, { _id }) => await Like.findById(_id),
    },
    Mutation: {
        // --- /!\ NEW Like Toggle Mutation /!\ ---
        toggleLikeProduct: async (_, { productId, customerId }) => {
            // Check if product and customer exist
            // We can run these in parallel
            const [product, customer] = await Promise.all([
                Product.findById(productId),
                Customer.findById(customerId),
            ]);
            if (!product) {
                logger.warn({ productId, customerId }, "toggleLikeProduct failed: Product not found");
                throw new GraphQLError("Product not found.", {
                    extensions: { code: "NOT_FOUND" },
                });
            }
            if (!customer) {
                logger.warn({ productId, customerId }, "toggleLikeProduct failed: Customer not found");
                throw new GraphQLError("Customer not found.", {
                    extensions: { code: "NOT_FOUND" },
                });
            }
            // Check if the like already exists
            const likeFilter = {
                _product_id: productId,
                _customer_id: customerId,
            };
            const existingLike = await Like.findOne(likeFilter);
            if (existingLike) {
                // --- UNLIKE ---
                // Remove the 'Like' document
                await existingLike.deleteOne();
                // Decrement the denormalized count on the Product
                // Use $inc for an atomic update and ensure it doesn't go below 0
                await Product.updateOne({ _id: productId }, { $inc: { likes: -1 } });
                logger.info({ productId, customerId }, "Product unliked");
            }
            else {
                // --- LIKE ---
                // Create the new 'Like' document
                try {
                    const newLike = new Like(likeFilter);
                    await newLike.save();
                    // Increment the denormalized count on the Product
                    await Product.updateOne({ _id: productId }, { $inc: { likes: 1 } });
                    logger.info({ productId, customerId }, "Product liked");
                }
                catch (error) {
                    // This will likely fail if the user clicks 'like' twice very fast
                    // due to the unique index on the 'Likes' collection.
                    // This is fine, we can just log it and continue.
                    if (error.code === 11000) {
                        // Duplicate key error
                        logger.warn({ productId, customerId }, "Duplicate like attempt blocked by index.");
                    }
                    else {
                        logger.error({ err: error, productId, customerId }, "Error saving like");
                        throw error; // Re-throw other errors
                    }
                }
            }
            // Return the *updated* product, populated
            return Product.findById(productId).populate(productPopulateOptions);
        },
        // --- End of new mutation ---
        createLike: async (_, { input }) => {
            const newItem = await Like.create(input);
            pubsub.publish(LIKE_ADDED, { likeAdded: newItem });
            return newItem;
        },
        updateLike: async (_, { _id, input }) => {
            return await Like.findByIdAndUpdate(_id, input, { new: true });
        },
        deleteLike: async (_, { _id }) => {
            return await Like.findByIdAndDelete(_id);
        },
    },
    Subscription: {
        likeAdded: {
            subscribe: () => pubsub.asyncIterator([LIKE_ADDED]),
        },
    },
};
