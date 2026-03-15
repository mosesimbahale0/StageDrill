// src/resolvers/client.ts
import Country from "../models/country.model.js";
export const countryResolvers = {
    Query: {
        getAllCountries: async () => {
            try {
                return await Country.find();
            }
            catch (error) {
                console.error("Error fetching all countries:", error);
                throw new Error("Internal server error");
            }
        },
        getOneCountry: async (_, { _id }) => {
            return await Country.findById(_id);
        },
    },
    Mutation: {},
    Subscription: {},
};
