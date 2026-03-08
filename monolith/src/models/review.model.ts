import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    _customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    reviewed_by: { type: Schema.Types.ObjectId, ref: "Customer", required: true }
  },
  { timestamps: true, collection: "reviews" }
);

export default model("Review", reviewSchema);
