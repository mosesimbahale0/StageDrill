import { Schema, model } from "mongoose";

const bidSchema = new Schema(
  {
    _product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    _customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    bid_amount: { type: Number, required: true },
    bid_time: { type: Date, default: Date.now }
  },
  { timestamps: true, collection: "bids" }
);

export default model("Bid", bidSchema);
