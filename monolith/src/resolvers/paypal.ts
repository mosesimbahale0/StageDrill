import Customer from "../models/customer.model.js";
import Funds from "../models/funds.model.js";
import Transaction from "../models/transaction.model.js";
import Notification from "../models/notification.model.js";

import { pubsub } from "../utils/redisDb.js";

// Pure Functions for Paypal Handlers
export async function processWebhook(event: any) {
  const { event_type, resource_type, resource } = event;
  if (
    event_type === "PAYMENT.CAPTURE.COMPLETED" &&
    resource_type === "capture"
  ) {
    await handlePaymentCaptureCompleted(resource);
  } else if (
    event_type === "CHECKOUT.ORDER.APPROVED" &&
    resource_type === "checkout-order"
  ) {
    await handleCheckoutOrderApproved(resource);
  } else {
    console.log(`Unhandled PayPal event: ${event_type}`);
  }
}

async function handlePaymentCaptureCompleted(resource: any, retryCount = 0) {
  if (resource.resource_type !== "checkout-order") return;

  const pu = resource.purchase_units[0];
  const capture = pu.payments.captures[0];
  const payerId = resource.payment_source.paypal.payer_id;
  const tokens = parseFloat(capture.amount.value) * 100;
  const transactionId = resource.id;

  try {
    const transaction = await Transaction.findOne({
      _paypal_transaction_id: transactionId,
    });

    if (!transaction) {
      console.error("Transaction not found:", transactionId);
      return;
    }

    const updateOps: any = {
      $inc: { tokens: tokens },
      $set: {
        _paypal_id: payerId,
        is_active: true,
      },
    };

    const fund = await Funds.findOneAndUpdate(
      { _account_id: transaction._account_id },
      updateOps,
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    const accountId = fund._account_id;

    pubsub.publish("FUND_UPDATED", { fundUpdated: fund });

    if (!transaction._paypal_id) {
      await Transaction.findByIdAndUpdate(transaction._id, {
        _paypal_id: payerId,
      });
    }

    const note = await Notification.create({
      _account_id: accountId,
      _paypal_id: payerId,
      _paypal_transaction_id: transactionId,
      transaction_status: resource.status,
      is_read: false,
      text: `Payment of ${capture.amount.value} captured successfully.`,
      from: "PayPal",
    });
    pubsub.publish("NOTIFICATION_CREATED", { notificationCreated: note });

    console.log(
      `Capture completed: payer=${payerId}, tx=${transactionId}, tokens=${tokens}`
    );
  } catch (error) {
    if (error.code === 11000 && retryCount < 3) {
      console.error("Duplicate key error - retrying...");
      await new Promise((res) => setTimeout(res, 200)); // Small delay
      return handlePaymentCaptureCompleted(resource, retryCount + 1);
    }
    console.error("Payment processing error:", error);
    throw error;
  }
}

async function handleCheckoutOrderApproved(resource: any) {
  const pu = resource.purchase_units[0];
  const payerId = resource.payer.payer_id;
  const tokens = parseFloat(pu.amount.value) * 100;

  const user = await Customer.findOne({
    _paypal_ids: { $elemMatch: { _paypal_id: payerId } },
  });
  if (!user) return console.error("User not found:", payerId);

  // let fund = await Funds.findOne({ _paypal_id: payerId });
  //
  let fund = await Funds.findOne({ _account_id: user._id });

  if (fund) {
    fund.tokens = (parseFloat(fund.tokens) + tokens).toString();
    await fund.save();
    pubsub.publish("FUND_UPDATED", { fundUpdated: fund });
  } else {
    fund = await Funds.create({
      _paypal_id: payerId,
      _account_id: user._id,
      is_active: true,
      tokens: tokens.toString(),
    });
    pubsub.publish("FUND_CREATED", { fundCreated: fund });
  }

  // if (fund) {
  //   fund.tokens = (parseFloat(fund.tokens) + tokens).toString();
  //   await fund.save();
  //   pubsub.publish("FUND_UPDATED", { fundUpdated: fund });
  // } else {
  //   fund = await Funds.create({
  //     _paypal_id: payerId,
  //     _account_id: user._id,
  //     is_active: true,
  //     tokens: tokens.toString(),
  //   });
  //   pubsub.publish("FUND_CREATED", { fundCreated: fund });
  // }

  await Transaction.create({
    _paypal_id: payerId,
    _account_id: user._id,
    _paypal_transaction_id: resource.id,
    transaction_status: resource.status,
  });
  pubsub.publish("TRANSACTION_CREATED", {
    transactionCreated: {
      _paypal_id: payerId,
      _paypal_transaction_id: resource.id,
      transaction_status: resource.status,
    },
  });

  const note = await Notification.create({
    _account_id: user._id,
    _paypal_id: payerId,
    _paypal_transaction_id: resource.id,
    transaction_status: resource.status,
    is_read: false,
    text: `Order approved for ${pu.amount.value}.`,
    from: "PayPal",
  });
  pubsub.publish("NOTIFICATION_CREATED", { notificationCreated: note });

  console.log(
    `Order approved: payer=${payerId}, tx=${resource.id}, tokens=${tokens}`
  );
}

export const paypalResolvers = {
  Query: {
    getTransactionByPaypalId: async (_: any, { paypalId }: any) => {
      try {
        const transaction = await Transaction.findOne({
          _paypal_id: paypalId,
        });
        return transaction;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    //------------------------------------------------
    // PAYPAL RECORDS
    //---------------------------------------------
    createUserPaypalRecords: async (
      _: any,
      {
        input,
      }: { input: { customer: any; notification: any; transaction: any } }
    ) => {
      try {
        const { customer, notification, transaction } = input;
        console.log(customer, notification, transaction);

        // Check if a customer with the same _uid exists
        const existingCustomer = await Customer.findOne({
          _uid: customer._uid,
        });

        if (!existingCustomer) {
          throw new Error(`Customer with UID ${customer._uid} not found`);
        }

        // Check if the new paypal id exists in the customers paypal ids array
        const existingPaypalId = existingCustomer._paypal_ids.find(
          (paypalId) => paypalId._paypal_id === notification._paypal_id
        );

        if (!existingPaypalId) {
          // Add the new paypal id to the customer's paypal ids array
          existingCustomer._paypal_ids.push({
            _paypal_id: notification._paypal_id,
          });
          await existingCustomer.save();
        }

        // Create a new transaction
        const newTransaction = await Transaction.create(transaction);
        //subscription
        pubsub.publish("TRANSACTION_CREATED", {
          transactionCreated: newTransaction,
        });

        // Create a new notification
        const newNotification = await Notification.create(notification);
        //subscription
        pubsub.publish("NOTIFICATION_CREATED", {
          notificationCreated: newNotification,
        });
        // Return the updated customer
        return existingCustomer;
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
