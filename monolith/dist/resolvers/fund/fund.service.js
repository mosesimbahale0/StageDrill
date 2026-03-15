// src/fund/fund.service.ts (or src/resolvers/fund/fund.service.ts)
// Adjust path to your actual model file and ensure IFundSchema is exported from there
// src/resolvers/fund/fund.service.ts
import Funds from './fund.model.js'; // Adjust path as per your project structure
import { handleFundDuplicateKeyError } from './fund.errors.js';
// Helper function to convert the Mongoose document (IFundSchema) to the Fund interface
const convertDocToFund = (doc) => {
    if (!doc) {
        return null;
    }
    // Explicitly create an object matching the Fund interface
    const fundData = {
        _id: doc._id.toString(), // Convert ObjectId to string
        _paypal_id: doc._paypal_id,
        _account_id: doc._account_id,
        is_active: doc.is_active,
        tokens: doc.tokens,
    };
    // If your Fund interface includes timestamps and you want them as ISO strings:
    if (doc.createdAt) {
        fundData.createdAt = doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt);
    }
    if (doc.updatedAt) {
        fundData.updatedAt = doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt);
    }
    return fundData;
};
export const findFundById = async (fundId) => {
    try {
        // With a typed model, fundDoc will be IFundSchema | null
        const fundDoc = await Funds.findById(fundId);
        return convertDocToFund(fundDoc);
    }
    catch (error) {
        console.error(`Error finding fund by ID ${fundId}:`, error);
        throw error;
    }
};
export const findFundByPaypalId = async (paypalId) => {
    try {
        const fundDoc = await Funds.findOne({ _paypal_id: paypalId });
        return convertDocToFund(fundDoc);
    }
    catch (error) {
        console.error(`Error finding fund by PayPal ID ${paypalId}:`, error);
        throw error;
    }
};
export const findFundByAccountId = async (accountId) => {
    try {
        const fundDoc = await Funds.findOne({ _account_id: accountId });
        return convertDocToFund(fundDoc);
    }
    catch (error) {
        console.error(`Error finding fund by Account ID ${accountId}:`, error);
        throw error;
    }
};
export const createOrUpsertFund = async (input) => {
    const { _account_id, _paypal_id, is_active, tokens } = input;
    try {
        const existingFundDoc = await Funds.findOne({ _account_id });
        if (existingFundDoc) {
            const updatedFundDoc = await Funds.findOneAndUpdate({ _account_id }, { _paypal_id, is_active, tokens }, { new: true } // Important: returns the modified document
            );
            if (!updatedFundDoc) {
                // This case should ideally not be reached if findOneAndUpdate is successful on an existing doc.
                throw new Error("Failed to find and update existing fund by account ID.");
            }
            const fundObject = convertDocToFund(updatedFundDoc);
            // The check below is mostly for type safety / unexpected nulls post-conversion
            if (!fundObject)
                throw new Error("Conversion to Fund object failed for updated fund.");
            return { fund: fundObject, wasCreated: false };
        }
        else {
            // Funds.create returns a fully typed IFundSchema document
            const newFundDoc = await Funds.create({
                _account_id,
                _paypal_id,
                is_active,
                tokens,
            });
            const fundObject = convertDocToFund(newFundDoc);
            // The check below is mostly for type safety / unexpected nulls post-conversion
            if (!fundObject)
                throw new Error("Conversion to Fund object failed for new fund.");
            return { fund: fundObject, wasCreated: true };
        }
    }
    catch (error) {
        handleFundDuplicateKeyError(error, _account_id, _paypal_id);
        throw error; // Re-throw if not a handled duplicate key error
    }
};
export const updateFundInDB = async (fundId, fundData) => {
    try {
        const updatedFundDoc = await Funds.findByIdAndUpdate(fundId, fundData, {
            new: true,
        });
        return convertDocToFund(updatedFundDoc);
    }
    catch (error) {
        console.error(`Error updating fund ${fundId}:`, error);
        throw error;
    }
};
export const deleteFundFromDB = async (fundId) => {
    try {
        const deletedFundDoc = await Funds.findByIdAndDelete(fundId);
        return convertDocToFund(deletedFundDoc);
    }
    catch (error) {
        console.error(`Error deleting fund ${fundId}:`, error);
        throw error;
    }
};
