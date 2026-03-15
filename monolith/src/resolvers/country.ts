// src/resolvers/client.ts
import Country from "../models/country.model.js";
// new src/resolvers/client.ts
import { pubsub } from "../utils/redisDb.js";

export const countryResolvers = {
  Query: {
    getAllCountries: async () => {
      try {
        return await Country.find();
      } catch (error) {
        console.error("Error fetching all countries:", error);
        throw new Error("Internal server error");
      }
    },

    getOneCountry: async (_: any, { _id }: any) => {
      return await Country.findById(_id);
    },
  },
  Mutation: {},
  Subscription: {},
};
