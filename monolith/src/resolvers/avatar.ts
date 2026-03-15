// src/resolvers/client.ts
import Avatars from "../models/avatar.model.js";
// new src/resolvers/client.ts
import { pubsub } from "../utils/redisDb.js";

export const avatarResolvers = {
  Query: {
    getAllAvatars: async () => {
      return await Avatars.find();
    },
    getOneAvatar: async (_: any, { _id }: any) => {
      return await Avatars.findById(_id);
    },
  },
  Mutation: {
    createAvatar: async (_: any, { input }: any) => {
      try {
        const Avatar = await Avatars.create(input);
        return Avatar;
      } catch (error) {
        throw error;
      }
    },

    updateAvatar: async (_: any, { _id, input }: any) => {
      try {
        const Avatar = await Avatars.findByIdAndUpdate(_id, input, {
          new: true,
        });
        return Avatar;
      } catch (error) {
        throw error;
      }
    },

    deleteAvatar: async (_: any, { _id }: any) => {
      try {
        const Avatar = await Avatars.findByIdAndDelete(_id);
        return Avatar;
      } catch (error) {
        throw error;
      }
    },
  },
  Subscription: {},
};
