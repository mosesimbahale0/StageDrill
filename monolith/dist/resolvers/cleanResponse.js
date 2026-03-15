// src/resolvers/client.ts
import Cleanresponse from "../models/cleanResponse.model.js";
// new src/resolvers/client.ts
import { pubsub } from "../utils/redisDb.js";
export const cleanResponseResolvers = {
    Query: {
        //------------------------------------------------------------
        // cleanresponse
        //-----------------------------------------------------------------
        getCleanresponseById: async (_, { _response_id }) => {
            try {
                const cleanresponse = await Cleanresponse.findById(_response_id);
                if (!cleanresponse) {
                    throw new Error("Cleanresponse not found"); // Handle not found case
                }
                return cleanresponse;
            }
            catch (error) {
                console.error(error); // Log the error for debugging
                throw new Error("Error fetching Cleanresponse"); // Generic error for client
            }
        },
        getAllCleanresponsesByRequestId: async (_, { requestId }) => {
            try {
                const cleanresponses = await Cleanresponse.find({
                    _request_id: requestId,
                });
                return cleanresponses;
            }
            catch (error) {
                throw error;
            }
        },
        //------------------------------------------------------------
    },
    Mutation: {
        // Cleanresponse
        //---------------------------------------------------
        updateCleanresponse: async (_, { _response_id, input }) => {
            try {
                const cleanresponse = await Cleanresponse.findByIdAndUpdate(_response_id, input, { new: true });
                return cleanresponse;
            }
            catch (error) {
                throw error;
            }
        },
        deleteCleanresponse: async (_, { _response_id }) => {
            try {
                const cleanresponse = await Cleanresponse.findByIdAndDelete(_response_id);
                return cleanresponse;
            }
            catch (error) {
                throw error;
            }
        },
        //---------------------------------------------------
    },
    Subscription: {
        //Cleanresponse
        //-------------------------------
        cleanresponseCreated: {
            subscribe: () => pubsub.asyncIterator(["CLEANRESPONSE_CREATED"]),
        },
    },
};
