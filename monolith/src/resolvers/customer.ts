import Customer from "../models/customer.model.js";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Like from "../models/like.model.js";
import { pubsub } from "../utils/redisDb.js";

const CUSTOMER_ADDED = "CUSTOMER_ADDED";
// --- 'likedBy' is no longer populated here ---
const productPopulateOptions = [
  { path: "bidders" },
  {
    path: "bid_history",
    populate: { path: "_customer_id", model: "Customer" },
  },
];



export const customerResolvers = {
  Query: {
    customers: async (_, { pageSize = 20, after, filter, sort }) => {
      let query: any = {};
      if (filter) {
        if (filter.search) {
          query.$or = [
            { _uid: { $regex: filter.search, $options: "i" } },
            { phone_number: { $regex: filter.search, $options: "i" } },
            { user_name: { $regex: filter.search, $options: "i" } },
            { bio: { $regex: filter.search, $options: "i" } },
            { profile_picture: { $regex: filter.search, $options: "i" } },
            { cover_photo: { $regex: filter.search, $options: "i" } },
            { permanent_address: { $regex: filter.search, $options: "i" } },
            { website: { $regex: filter.search, $options: "i" } },
            { facebook: { $regex: filter.search, $options: "i" } },
            { twitter: { $regex: filter.search, $options: "i" } },
            { instagram: { $regex: filter.search, $options: "i" } },
            { linkedin: { $regex: filter.search, $options: "i" } },
            { youtube: { $regex: filter.search, $options: "i" } },
            { tiktok: { $regex: filter.search, $options: "i" } },
            { pinterest: { $regex: filter.search, $options: "i" } },
          ];
        }
        if (filter._uid) query._uid = filter._uid;
        if (filter.phone_number) query.phone_number = filter.phone_number;
        if (filter.kyc_verified) query.kyc_verified = filter.kyc_verified;
        if (filter._kyc_id) query._kyc_id = filter._kyc_id;
        if (filter.user_name) query.user_name = filter.user_name;
        if (filter.bio) query.bio = filter.bio;
        if (filter.profile_picture)
          query.profile_picture = filter.profile_picture;
        if (filter.cover_photo) query.cover_photo = filter.cover_photo;
        if (filter.permanent_address)
          query.permanent_address = filter.permanent_address;
        if (filter.is_active) query.is_active = filter.is_active;
        if (filter.is_blocked) query.is_blocked = filter.is_blocked;
        if (filter.is_verified) query.is_verified = filter.is_verified;
        if (filter.is_moderated) query.is_moderated = filter.is_moderated;
        if (filter.website) query.website = filter.website;
        if (filter.facebook) query.facebook = filter.facebook;
        if (filter.twitter) query.twitter = filter.twitter;
        if (filter.instagram) query.instagram = filter.instagram;
        if (filter.linkedin) query.linkedin = filter.linkedin;
        if (filter.youtube) query.youtube = filter.youtube;
        if (filter.tiktok) query.tiktok = filter.tiktok;
        if (filter.pinterest) query.pinterest = filter.pinterest;
        if (filter.likes) query.likes = filter.likes;
        if (filter.average_rating) query.average_rating = filter.average_rating;
        if (filter.review_count) query.review_count = filter.review_count;
      }
      if (after) {
        query._id = { $lt: after };
      }
      const limit = pageSize + 1;
      const sortOptions: any = sort
        ? { [sort.field]: sort.order === "ASC" ? 1 : -1 }
        : { _id: -1 };
      const items = await Customer.find(query).sort(sortOptions).limit(limit);
      const hasMore = items.length === limit;
      const results = hasMore ? items.slice(0, -1) : items;
      const cursor =
        results.length > 0 ? results[results.length - 1]._id.toString() : null;
      return { customers: results, cursor, hasMore };
    },
    customer: async (_, { _id }) => await Customer.findById(_id),

    customerByPhoneNumber: async (
      _,
      { phone_number } // Fixed argument name
    ) => Customer.findOne({ phone_number }),
  },
  Mutation: {
    createCustomer: async (_, { input }) => {
      const newItem = await Customer.create(input);
      pubsub.publish(CUSTOMER_ADDED, { customerAdded: newItem });
      return newItem;
    },
    updateCustomer: async (_, { _id, input }) => {
      return await Customer.findByIdAndUpdate(_id, input, { new: true });
    },
    deleteCustomer: async (_, { _id }) => {
      return await Customer.findByIdAndDelete(_id);
    },
  },
  


  



  Customer: {
    // Resolve the 'reviews' field on the 'Customer' type
    reviews: (parent) => {
      // Find all reviews *for* this customer (where parent._id is the _customer_id)
      return Review.find({ _customer_id: parent._id })
        .populate(["_customer_id", "reviewed_by"])
        .sort({ createdAt: -1 });
    },

    // --- /!\ NEW Resolver for liking_history /!\ ---
    liking_history: async (parent) => {
      // Find all 'Like' documents by this customer
      const likes = await Like.find({ _customer_id: parent._id }).select(
        "_product_id"
      );
      // Extract the product IDs
      const productIds = likes.map((like) => like._product_id);
      // Fetch the actual Product documents
      return Product.find({ _id: { $in: productIds } }).populate(
        productPopulateOptions
      );
    },




    
  },
  
  Subscription: {
    customerAdded: {
      subscribe: () => pubsub.asyncIterator([CUSTOMER_ADDED]),
    },
  },
};
