// src/resolvers/client.ts
import Customerlanguage from "../models/customerLanguage.model.js";
export const customerLanguageResolvers = {
    Query: {
        getAllCustomerLanguages: async () => {
            return await Customerlanguage.find();
        },
        getOneCustomerLanguage: async (_, { _id }) => {
            return await Customerlanguage.findById(_id);
        },
    },
    Mutation: {
        createCustomerlanguage: async (_, { input }) => {
            try {
                const customerlanguage = await Customerlanguage.create(input);
                return customerlanguage;
            }
            catch (error) {
                throw error;
            }
        },
        updateCustomerlanguage: async (_, { _id, input }) => {
            try {
                const customerlanguage = await Customerlanguage.findByIdAndUpdate(_id, input, { new: true });
                return customerlanguage;
            }
            catch (error) {
                throw error;
            }
        },
        deleteCustomerlanguage: async (_, { _id }) => {
            try {
                const customerlanguage = await Customerlanguage.findByIdAndDelete(_id);
                return customerlanguage;
            }
            catch (error) {
                throw error;
            }
        },
    },
    Subscription: {},
};
