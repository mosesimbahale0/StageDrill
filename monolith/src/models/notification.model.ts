import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    _account_id: String,
    _paypal_id: String,
    _paypal_transaction_id: String,
    transaction_status: String,
    is_read: Boolean,
    text: String,
    from: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    collection: "notifications",
  }
);
export default model("Notification", notificationSchema);
