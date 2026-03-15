import { Schema, model } from "mongoose";

const countrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes whitespace from both ends of a string
    },
    code: {
      type: String,
      required: true,
      unique: true, // Ensures the code is unique within the collection
      uppercase: true, // Automatically converts the string to uppercase
      minlength: 2, // Minimum length of 2 characters
      maxlength: 3, // Maximum length of 3 characters
    },
    emoji: {
      type: String,
      required: true,
    },
    unicode: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "default-image-url.png", // Default image URL or path if not provided
    },
  },
  {
    collection: "countries",
    toJSON: { virtuals: true },
    timestamps: true, 
  }
);
export default model("Country", countrySchema);
