import { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    _product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    _customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    content: { type: String, required: true }
  },
  { timestamps: true, collection: "chats" }
);

export default model("Chat", chatSchema);
