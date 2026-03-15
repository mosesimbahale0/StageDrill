// src/resolvers/client.ts
import Avatars from "../models/avatar.model.js";
export const avatarResolvers = {
    Query: {
        getAllAvatars: async () => {
            return await Avatars.find();
        },
        getOneAvatar: async (_, { _id }) => {
            return await Avatars.findById(_id);
        },
    },
    Mutation: {
        createAvatar: async (_, { input }) => {
            try {
                const Avatar = await Avatars.create(input);
                return Avatar;
            }
            catch (error) {
                throw error;
            }
        },
        updateAvatar: async (_, { _id, input }) => {
            try {
                const Avatar = await Avatars.findByIdAndUpdate(_id, input, {
                    new: true,
                });
                return Avatar;
            }
            catch (error) {
                throw error;
            }
        },
        deleteAvatar: async (_, { _id }) => {
            try {
                const Avatar = await Avatars.findByIdAndDelete(_id);
                return Avatar;
            }
            catch (error) {
                throw error;
            }
        },
    },
    Subscription: {},
};
