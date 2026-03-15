import Funspot from "../models/funspot.model.js";
import Request from "../models/request.model.js";
import Response from "../models/response.model.js";
export const funspotResolvers = {
    Query: {
        getOneFunspotById: async (_, { funspotId }) => {
            try {
                const funspot = await Funspot.findById(funspotId);
                return funspot;
            }
            catch (error) {
                throw error;
            }
        },
        getAllFunspotsByCustomerID: async (_, { customerId }) => {
            try {
                const funspots = await Funspot.find({ _account_Id: customerId });
                return funspots;
            }
            catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        // funspots crud
        //-----------------------------------------------
        createFunspot: async (_, { input }) => {
            try {
                const funspot = await Funspot.create(input);
                // pubsub.publish("FUNSPOT_CREATED", { funspotCreated: funspot });
                return funspot;
            }
            catch (error) {
                throw error;
            }
        },
        updateFunspot: async (_, { funspotId, input }) => {
            try {
                const funspot = await Funspot.findByIdAndUpdate(funspotId, input, {
                    new: true,
                });
                // pubsub.publish("FUNSPOT_UPDATED", { funspotUpdated: funspot });
                return funspot;
            }
            catch (error) {
                throw error;
            }
        },
        // deleteFunspot: async (_: any, { funspotId }: any) => {
        //   // Find all requests and responses with this funspot ID and delete
        //   await RequestModel.deleteMany({ _funspot_id: funspotId });
        //   await ResponseModel.deleteMany({ _funspot_id: funspotId });
        //   try {
        //     const funspot = await Funspot.findByIdAndDelete(funspotId);
        //     // pubsub.publish("FUNSPOT_DELETED", { funspotDeleted: funspot });
        //     return funspot;
        //   } catch (error) {
        //     throw error;
        //   }
        // },
        deleteFunspot: async (_, { funspotId }) => {
            // Find all requests and responses with this funspot ID and delete
            await Request.deleteMany({ _funspot_id: funspotId });
            await Response.deleteMany({ _funspot_id: funspotId });
            try {
                const funspot = await Funspot.findByIdAndDelete(funspotId);
                if (!funspot) {
                    throw new Error("Funspot not found"); // Handle not found case
                }
                // pubsub.publish("FUNSPOT_DELETED", { funspotDeleted: funspot });
                return funspot;
            }
            catch (error) {
                console.error(error); // Log the error for debugging
                throw new Error("Error deleting funspot"); // Generic error for client
            }
        },
    },
    Subscription: {},
};
