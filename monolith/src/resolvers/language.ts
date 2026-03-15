// src/resolvers/client.ts
import Languages from "../models/language.model.js";
// new src/resolvers/client.ts
import { pubsub } from "../utils/redisDb.js";

export const languageResolvers = {
  Query: {
    getAllLanguages: async () => {
      return await Languages.find();
    },
    getOneLanguage: async (_: any, { _id }: any) => {
      return await Languages.findById(_id);
    },
  },
  Mutation: {
    createLanguage: async (_: any, { input }: any) => {
      try {
        const language = await Languages.create(input);
        return language;
      } catch (error) {
        throw error;
      }
    },

    updateLanguage: async (_: any, { _id, input }: any) => {
      try {
        const language = await Languages.findByIdAndUpdate(_id, input, {
          new: true,
        });
        return language;
      } catch (error) {
        throw error;
      }
    },

    deleteLanguage: async (_: any, { _id }: any) => {
      try {
        const language = await Languages.findByIdAndDelete(_id);
        return language;
      } catch (error) {
        throw error;
      }
    },
  },
  Subscription: {},
};
