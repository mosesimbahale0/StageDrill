import Response from "../models/response.model.js";
export const responseResolvers = {
    Query: {
        getResponseById: async (_, { _response_id }) => {
            try {
                const response = await Response.findById(_response_id);
                if (!response) {
                    throw new Error("response not found"); // Handle not found case
                }
                return response;
            }
            catch (error) {
                console.error(error); // Log the error for debugging
                throw new Error("Error fetching response"); // Generic error for client
            }
        },
        getAllResponsesByRequestId: async (_, { requestId }) => {
            try {
                const responses = await Response.find({ _request_id: requestId });
                return responses;
            }
            catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        // responses
        //-----------------------------------------------
        createResponse: async (_, { input }) => {
            try {
                // Add validation logic here (optional)
                const response = await Response.create(input);
                return response;
            }
            catch (error) {
                console.error(error); // Log the error for debugging
                throw new Error("Error creating response"); // Generic error for client
            }
        },
    },
    Subscription: {},
};
