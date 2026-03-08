import Product from "../models/product.model.js";
import Customer from  "../models/customer.model.js";
import { pubsub } from "../utils/redisDb.js";
import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import pino from "pino"; // Using pino for structured logging
import Like from "../models/like.model.js";

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


const PRODUCT_ADDED = "PRODUCT_ADDED";




const MAX_PRODUCTS = 100;

// --- 'likedBy' is no longer populated here ---
const productPopulateOptions = [
  { path: "bidders" },
  {
    path: "bid_history",
    populate: { path: "_customer_id", model: "Customer" },
  },
];

async function paginateProducts({ pageSize = 12, after, filter = {} }) {
  const limit = pageSize + 1;
  let query = { ...filter };
  if (after) {
    try {
      query = { _id: { $gt: new mongoose.Types.ObjectId(after) }, ...filter };
    } catch (e) {
      logger.warn({ after, error: e.message }, "Invalid 'after' cursor");
      throw new GraphQLError("Invalid 'after' cursor format.", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
  }

  const documents = await Product.find(query)
    .sort({ _id: 1 })
    .limit(limit)
    .populate(productPopulateOptions);

  const hasMore = documents.length === limit;
  const nodes = hasMore ? documents.slice(0, -1) : documents;
  const cursor =
    nodes.length > 0 ? nodes[nodes.length - 1]._id.toString() : null;
  return { cursor, hasMore, products: nodes };
}





export const productResolvers = {

  
  Query: {



        // --- Product Queries ---
    products: async (_, args) => paginateProducts(args),

    
    product: async (_, { id }) => {
      logger.info(`Fetching product with id: ${id}`);
      return Product.findById(id).populate(productPopulateOptions);
    },



    productsByCategory: async (_, { category, pageSize, after }) => {
      return paginateProducts({ pageSize, after, filter: { category } });
    },
    productsByRecommendation: async (_, { customerId, coordinates }) => {
      // Placeholder logic
      return Product.find({})
        .sort({ createdAt: -1 })
        .limit(MAX_PRODUCTS)
        .populate(productPopulateOptions);
    },
    productsByFeatured: async (_, { coordinates }) => {
      // Placeholder logic
      return Product.find({})
        .sort({ likes: -1 })
        .limit(MAX_PRODUCTS)
        .populate(productPopulateOptions);
    },
    productsByNearYou: async (_, { coordinates }) => {
      // Placeholder logic
      return Product.find({})
        .sort({ auction_start: 1 })
        .limit(MAX_PRODUCTS)
        .populate(productPopulateOptions);
    },
    productsBySearch: async (_, { query }) => {
      return Product.find({
        $or: [
          { product_name: { $regex: query, $options: "i" } },
          { product_description: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      })
        .limit(MAX_PRODUCTS)
        .populate(productPopulateOptions);
    },
    productsBySimilar: async (_, { productId }) => {
      const product = await Product.findById(productId);
      if (!product) {
        throw new GraphQLError("Product not found.", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return Product.find({
        category: product.category,
        _id: { $ne: productId },
      })
        .limit(MAX_PRODUCTS)
        .populate(productPopulateOptions);
    },
    productsBySeller: async (_, { seller }) => {
      return Product.find({ seller }).populate(productPopulateOptions);
    },

  },
  Mutation: {
    createProduct: async (_, { input }) => {
      const newItem = await Product.create(input);
      pubsub.publish(PRODUCT_ADDED, { productAdded: newItem });
      return newItem;
    },
    updateProduct: async (_, { _id, input }) => {
      return await Product.findByIdAndUpdate(_id, input, { new: true });
    },
    deleteProduct: async (_, { _id }) => {
      return await Product.findByIdAndDelete(_id);
    },
  },


        // --- Type Resolvers for nested fields ---
  Product: {
    // Resolve the 'bidHistory' field on the 'Product' type
    bidHistory: (parent) => parent.bid_history, // Already populated

    // --- /!\ NEW Resolver for likedBy /!\ ---
    likedBy: async (parent) => {
      // Find all 'Like' documents for this product
      const likes = await Like.find({ _product_id: parent._id }).select(
        "_customer_id"
      );
      // Extract the customer IDs
      const customerIds = likes.map((like) => like._customer_id);
      // Fetch the actual Customer documents
      return Customer.find({ _id: { $in: customerIds } });
    },
  },


  
  Subscription: {
    productAdded: {
      subscribe: () => pubsub.asyncIterator([PRODUCT_ADDED]),
    },
  },
};
