import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    _account_id: String,
    _paypal_id: String,
    _paypal_transaction_id: String,
    transaction_status: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    collection: "transactions",
  }
);
export default model("Transaction", transactionSchema);
