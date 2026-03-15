import { Schema, model } from "mongoose";

const templateSchema = new Schema(
  {
    _account_id: String,

    name: String,
    
    cover: String,
    description: String,

    context: String,
    examples: Array,
    summary: String,

    ml_model: String,
    role: String,

    tags: String,
    licence: String,

    liking: Array,
    rating: Array,
    cloners: Array,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    collection: "templates",
  }
);

export default model("Templates", templateSchema);
