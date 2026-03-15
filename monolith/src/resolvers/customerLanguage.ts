// src/resolvers/client.ts
import Customerlanguage from "../models/customerLanguage.model.js";
// new src/resolvers/client.ts
import { pubsub } from "../utils/redisDb.js";

export const customerLanguageResolvers = {
  Query: {
    getAllCustomerLanguages: async () => {
      return await Customerlanguage.find();
    },
    getOneCustomerLanguage: async (_: any, { _id }: any) => {
      return await Customerlanguage.findById(_id);
    },
  },
  Mutation: {
    createCustomerlanguage: async (_: any, { input }: any) => {
      try {
        const customerlanguage = await Customerlanguage.create(input);
        return customerlanguage;
      } catch (error) {
        throw error;
      }
    },

    updateCustomerlanguage: async (_: any, { _id, input }: any) => {
      try {
        const customerlanguage = await Customerlanguage.findByIdAndUpdate(
          _id,
          input,
          { new: true }
        );
        return customerlanguage;
      } catch (error) {
        throw error;
      }
    },

    deleteCustomerlanguage: async (_: any, { _id }: any) => {
      try {
        const customerlanguage = await Customerlanguage.findByIdAndDelete(_id);
        return customerlanguage;
      } catch (error) {
        throw error;
      }
    },
  },
  Subscription: {},
};
