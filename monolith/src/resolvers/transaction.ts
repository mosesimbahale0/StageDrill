import Transaction from "../models/transaction.model.js";
import Customer from "../models/customer.model.js";
import Notification from "../models/notification.model.js";

import { pubsub } from "../utils/redisDb.js";

export const transactionResolvers = {
  Query: {
    // Transactions
    //---------------------------------------
    getTransaction: async (_: any, { transactionId }: any) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        throw error;
      }
    },

    getTransactionByAccountId: async (_: any, { accountId }: any) => {
      try {
        const transaction = await Transaction.findOne({
          _account_id: accountId,
        });
        return transaction;
      } catch (error) {
        throw error;
      }
    },

    // getAllTransactionsByAccountId: async (_: any, { accountId }: any) => {
    //   try {
    //     const transactions = await Transaction.find({
    //       _account_id: accountId,
    //     });
    //     return transactions;
    //   } catch (error) {
    //     throw error;
    //   }
    // },

    //Pagination
    // getAllTransactionsByAccountId: async (_: any, { accountId, skip, limit }: any) => {
    //   try {
    //     const transactions = await Transaction.find({
    //       _account_id: accountId,
    //     })
    //       .skip(skip)
    //       .limit(limit);
    //     return transactions;
    //   } catch (error) {
    //     throw error;
    //   }
    // },

    getAllTransactionsByAccountId: async (
      _,
      { accountId, skip = 0, limit = 10 }
    ) => {
      try {
        const transactions = await Transaction.find({ _account_id: accountId })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }); // Sorting by creation date, most recent first
        return transactions;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    countTransactionsByAccountId: async (_, { accountId }) => {
      try {
        return await Transaction.countDocuments({
          _account_id: accountId,
        });
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    //Transactions
    //---------------------------------------//
    createTransaction: async (
      _: any,
      {
        _account_Id,
        _paypal_id,
        _paypal_transaction_id,
        transaction_status,
      }: any
    ) => {
      try {
        const transaction = await Transaction.create({
          _account_id: _account_Id,
          _paypal_id,
          _paypal_transaction_id,
          transaction_status,
        });
        pubsub.publish("TRANSACTION_CREATED", {
          transactionCreated: transaction,
        });
        return transaction;
      } catch (error) {
        throw error;
      }
    },

    updateTransaction: async (
      _: any,
      {
        transactionId,
        _account_id,
        _paypal_id,
        _paypal_transaction_id,
        transaction_status,
      }: any
    ) => {
      try {
        const transaction = await Transaction.findByIdAndUpdate(
          transactionId,
          {
            _account_id,
            _paypal_id,
            _paypal_transaction_id,
            transaction_status,
          },
          { new: true }
        );
        pubsub.publish("TRANSACTION_UPDATED", {
          transactionUpdated: transaction,
        });
        return transaction;
      } catch (error) {
        throw error;
      }
    },

    deleteTransaction: async (_: any, { transactionId }: any) => {
      try {
        const transaction = await Transaction.findByIdAndDelete(transactionId);
        pubsub.publish("TRANSACTION_DELETED", {
          transactionDeleted: transaction,
        });
        return transaction;
      } catch (error) {
        throw error;
      }
    },
  },
  Subscription: {
    //-------------------------------------------------
    transactionCreated: {
      subscribe: () => pubsub.asyncIterator(["TRANSACTION_CREATED"]),
    },

    // Notifications
    //--------------------------------------------------
    notificationCreated: {
      subscribe: () => pubsub.asyncIterator(["NOTIFICATION_CREATED"]),
    },
  },
};
