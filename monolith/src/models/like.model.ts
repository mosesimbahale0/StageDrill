import { Schema, model } from "mongoose";

const likeSchema = new Schema(
  {
    _customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    _product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true }
  },
  { timestamps: true, collection: "likes" }
);

export default model("Like", likeSchema);
