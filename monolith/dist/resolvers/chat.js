import Chat from "../models/chat.model.js";
import { pubsub } from "../utils/redisDb.js";
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
const CHAT_ADDED = "CHAT_ADDED";
export const chatResolvers = {
    Query: {
        chats: async (_, { pageSize = 20, after, filter, sort }) => {
            let query = {};
            if (filter) {
                if (filter._product_id)
                    query._product_id = filter._product_id;
                if (filter._customer_id)
                    query._customer_id = filter._customer_id;
                if (filter.content)
                    query.content = filter.content;
            }
            if (after) {
                query._id = { $lt: after };
            }
            const limit = pageSize + 1;
            const sortOptions = sort
                ? { [sort.field]: sort.order === "ASC" ? 1 : -1 }
                : { _id: -1 };
            const items = await Chat.find(query).sort(sortOptions).limit(limit);
            const hasMore = items.length === limit;
            const results = hasMore ? items.slice(0, -1) : items;
            const cursor = results.length > 0 ? results[results.length - 1]._id.toString() : null;
            return { chats: results, cursor, hasMore };
        },
        getOneChat: async (_, { _id }) => await Chat.findById(_id),
        // --- RENAMED Chat Query Resolver ---
        chatsByProduct: async (_, { productId }) => Chat.find({ _product_id: productId })
            .populate("_customer_id")
            .populate("_product_id")
            .sort({ createdAt: -1 }),
    },
    Mutation: {
        createChat: async (_, { productId, customerId, content }) => {
            const chat = new Chat({
                _product_id: productId,
                _customer_id: customerId,
                content,
            });
            await chat.save();
            logger.info({ chatId: chat._id, productId, customerId }, "New chat message created");
            return chat.populate(["_customer_id", "_product_id"]);
        },
        updateChat: async (_, { _id, input }) => {
            return await Chat.findByIdAndUpdate(_id, input, { new: true });
        },
        deleteChat: async (_, { _id }) => {
            return await Chat.findByIdAndDelete(_id);
        },
    },
    // --- RENAMED Type Resolver ---
    Chat: {
        // Resolve fields on the 'Chat' type
        product: (parent) => parent._product_id, // Already populated
        customer: (parent) => parent._customer_id, // Already populated
    },
    Subscription: {
        chatAdded: {
            subscribe: () => pubsub.asyncIterator([CHAT_ADDED]),
        },
    },
};
