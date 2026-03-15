import Notification from "../models/notification.model.js";
// new src/resolvers/client.ts
import { pubsub } from "../utils/redisDb.js";
export const notificationResolvers = {
    Query: {
        // Notifications
        // ------------------------------------//------------------------notifications---------------//
        getNotification: async (_, { notificationId }) => {
            try {
                const notification = await Notification.findById(notificationId);
                return notification;
            }
            catch (error) {
                throw error;
            }
        },
        getNotificationByPaypalId: async (_, { paypalId }) => {
            try {
                const notification = await Notification.findOne({
                    _paypal_id: paypalId,
                });
                return notification;
            }
            catch (error) {
                throw error;
            }
        },
        getNotificationByAccountId: async (_, { accountId }) => {
            try {
                const notification = await Notification.findOne({
                    _account_id: accountId,
                });
                return notification;
            }
            catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        // Notifications
        //-----------------------------------------------------
        //------------------------Notifications---------------//
        createNotification: async (_, { _account_id, _paypal_id, _paypal_transaction_id, transaction_status, is_read, text, from, }) => {
            try {
                const notification = await Notification.create({
                    _account_id: _account_id,
                    _paypal_id,
                    _paypal_transaction_id,
                    transaction_status,
                    is_read,
                    text,
                    from,
                });
                pubsub.publish("NOTIFICATION_CREATED", {
                    notificationCreated: notification,
                });
                return notification;
            }
            catch (error) {
                throw error;
            }
        },
        updateNotification: async (_, { notificationId, _account_id, _paypal_id, _paypal_transaction_id, transaction_status, is_read, text, from, }) => {
            try {
                const notification = await Notification.findByIdAndUpdate(notificationId, {
                    _paypal_id,
                    _account_id,
                    _paypal_transaction_id,
                    transaction_status,
                    is_read,
                    text,
                    from,
                }, { new: true });
                pubsub.publish("NOTIFICATION_UPDATED", {
                    notificationUpdated: notification,
                });
                return notification;
            }
            catch (error) {
                throw error;
            }
        },
        deleteNotification: async (_, { notificationId }) => {
            try {
                const notification = await Notification.findByIdAndDelete(notificationId);
                pubsub.publish("NOTIFICATION_DELETED", {
                    notificationDeleted: notification,
                });
                return notification;
            }
            catch (error) {
                throw error;
            }
        },
    },
    Subscription: {
        // Notifications
        //--------------------------------------------------
        notificationCreated: {
            subscribe: () => pubsub.asyncIterator(["NOTIFICATION_CREATED"]),
        },
        notificationUpdated: {
            subscribe: () => pubsub.asyncIterator(["NOTIFICATION_UPDATED"]),
        },
        notificationDeleted: {
            subscribe: () => pubsub.asyncIterator(["NOTIFICATION_DELETED"]),
        },
    },
};
