import { likeResolvers } from "./like.js";
import { reviewResolvers } from "./review.js";
import { chatResolvers } from "./chat.js";
import { bidResolvers } from "./bid.js";
import { productResolvers } from "./product.js";

import { customerResolvers } from "./customer.js";
export default {
  Query: {
    ...likeResolvers.Query,
    ...reviewResolvers.Query,
    ...chatResolvers.Query,
    ...bidResolvers.Query,
    ...productResolvers.Query,
    ...customerResolvers.Query,
  },
  Mutation: {
    ...likeResolvers.Mutation,
    ...reviewResolvers.Mutation,
    ...chatResolvers.Mutation,
    ...bidResolvers.Mutation,
    ...productResolvers.Mutation,
    ...customerResolvers.Mutation,
  },
  Subscription: {
    ...likeResolvers.Subscription,
    ...chatResolvers.Subscription,
    ...bidResolvers.Subscription,
    ...productResolvers.Subscription,
    ...customerResolvers.Subscription,
  },
  Customer: customerResolvers.Customer,
  Product: productResolvers.Product,
  Bid: bidResolvers.Bid,
  Chat: chatResolvers.Chat,
  Review: reviewResolvers.Review,
};
