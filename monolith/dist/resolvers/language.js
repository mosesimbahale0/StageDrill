// src/resolvers/client.ts
import Languages from "../models/language.model.js";
export const languageResolvers = {
    Query: {
        getAllLanguages: async () => {
            return await Languages.find();
        },
        getOneLanguage: async (_, { _id }) => {
            return await Languages.findById(_id);
        },
    },
    Mutation: {
        createLanguage: async (_, { input }) => {
            try {
                const language = await Languages.create(input);
                return language;
            }
            catch (error) {
                throw error;
            }
        },
        updateLanguage: async (_, { _id, input }) => {
            try {
                const language = await Languages.findByIdAndUpdate(_id, input, {
                    new: true,
                });
                return language;
            }
            catch (error) {
                throw error;
            }
        },
        deleteLanguage: async (_, { _id }) => {
            try {
                const language = await Languages.findByIdAndDelete(_id);
                return language;
            }
            catch (error) {
                throw error;
            }
        },
    },
    Subscription: {},
};
