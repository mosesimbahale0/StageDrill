import { Schema, model } from "mongoose";

const responseSchema = new Schema(
  {
    _request_id: String,
    _account_id: String,
    _funspot_id: String,
    _index: Number,
    text: String,
    emotion: String,
    is_read: Boolean,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    collection: "responses",
  }
);
export default model("Response", responseSchema);
