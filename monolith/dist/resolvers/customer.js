// src/resolvers/client.ts
import Customer from "../models/customer.model.js";
import Funds from "../models/funds.model.js";
export const customerResolvers = {
    Query: {
        getCustomer: async (_, { customerId }) => {
            try {
                const customer = await Customer.findById(customerId);
                return customer;
            }
            catch (error) {
                throw error;
            }
        },
        getCustomerByUid: async (_, { uid }) => {
            try {
                const customer = await Customer.findOne({ _uid: uid });
                return customer;
            }
            catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        /**
         * Creates or updates a customer and their associated fund.
         * The fund's _paypal_id is only set on creation, not on subsequent updates.
         * Handles duplicate key errors with a retry mechanism.
         *
         * @param {any} this - The 'this' context (can be important in some GraphQL server setups).
         * @param {any} _ - Placeholder for the parent object, not used here.
         * @param {object} args - The arguments passed to the mutation.
         * @param {object} args.input - The input data for creating/updating the customer.
         * @param {number} retryCount - Internal counter for retry attempts.
         * @returns {Promise<object>} An object containing the customer and fund documents.
         * @throws {Error} If an unrecoverable error occurs.
         */
        async createCustomer(_, { input }, retryCount = 0) {
            let customerDoc; // To store the resolved customer document
            let fundDoc; // To store the resolved fund document
            try {
                // Step 1: Upsert Customer
                console.log(`Attempting to find or create customer with _uid: ${input._uid}`);
                customerDoc = await Customer.findOneAndUpdate({ _uid: input._uid }, input, // Using the entire 'input' for customer update.
                // Ensure 'input' contains only valid Customer schema fields
                // or use specific $set operations for finer control.
                {
                    new: true, // Return the modified document
                    upsert: true, // Create if it doesn't exist
                    setDefaultsOnInsert: true, // Apply schema defaults on insert
                    runValidators: true, // Run schema validators
                });
                if (!customerDoc) {
                    // This path should ideally not be hit if upsert:true and no validation/DB errors occur.
                    console.error(`createCustomer: Failed to create or find customer for _uid: ${input._uid}. This is unexpected with upsert:true.`);
                    // Consider throwing a more specific error if this state is reached.
                    // For now, execution will continue, but subsequent operations might fail if customerDoc is null.
                }
                else {
                    console.log(`Customer operation successful for _uid: ${input._uid}. Customer ID: ${customerDoc._id}`);
                }
                // Step 2: Upsert Fund
                // The _paypal_id will only be set if a new Fund document is inserted.
                // If the Fund document already exists, its _paypal_id will not be changed by this operation.
                console.log(`Attempting to find or create fund for account_id: ${customerDoc._id}`);
                fundDoc = await Funds.findOneAndUpdate({ _account_id: customerDoc._id }, // The query to find the fund using the resolved customer's ID
                {
                    $set: {
                        // Fields to set on update OR insert (if not in $setOnInsert)
                        is_active: true, // Ensure the fund is active
                    },
                    $setOnInsert: {
                        // These values are only set when a new document is created (inserted)
                        _paypal_id: input._paypal_id || "", // Set PayPal ID only on creation
                        tokens: 0, // Initialize tokens to 0 (numeric) if it's a new fund.
                        // Ensure your schema expects a Number for 'tokens'.
                    },
                }, {
                    new: true, // Return the modified or new document
                    upsert: true, // Create if it doesn't exist
                    runValidators: true, // Run schema validators for the Funds model
                });
                if (!fundDoc) {
                    // Similar to customerDoc, this is unexpected with upsert:true.
                    console.error(`createCustomer: Failed to create or find fund for account_id: ${customerDoc._id}. This is unexpected with upsert:true.`);
                    // Handle as per your application's error strategy
                }
                else {
                    console.log(`Fund operation successful for account_id: ${customerDoc._id}. Fund ID: ${fundDoc._id}. PayPal ID: ${fundDoc._paypal_id}`);
                }
                // Both operations were successful (or threw errors that were caught)
                return { customer: customerDoc, fund: fundDoc };
            }
            catch (error) {
                // Handle MongoDB duplicate key error (code 11000) with a retry mechanism
                if (error.code === 11000 && retryCount < 3) {
                    console.error(`createCustomer: Duplicate key error (attempt ${retryCount + 1}/3). Retrying...`, `Error Message: ${error.message}`, // Log the full error message
                    `Conflicting Key: ${JSON.stringify(error.keyValue)}` // Log the specific key/value that caused the duplicate error
                    );
                    // Wait for a short, slightly randomized delay before retrying
                    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 100));
                    // Recursively call createCustomer, ensuring 'this' context is preserved.
                    return await this.createCustomer(_, { input }, retryCount + 1);
                }
                // If the error is not a manageable duplicate key error, or if retries are exhausted
                console.error("createCustomer: Unrecoverable error during customer or fund creation/update:", error // Log the full error object for more details
                );
                // Re-throw the error to be handled by GraphQL error formatting/logging
                throw error;
            }
        },
        updateCustomer: async (_, { customerId, input }) => {
            try {
                // Find the customer by ID
                const existingCustomer = await Customer.findById(customerId);
                // If the customer doesn't exist, throw an error
                if (!existingCustomer) {
                    throw new Error(`Customer with ID ${customerId} not found`);
                }
                // Update the customer with the provided data
                const updatedCustomer = await Customer.findByIdAndUpdate(customerId, input, // Use 'input' here to update with the provided data
                { new: true } // Return the updated document
                );
                // Return the updated customer
                return updatedCustomer;
            }
            catch (error) {
                throw error;
            }
        },
    },
    Subscription: {},
};
