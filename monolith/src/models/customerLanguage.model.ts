
import { Schema, model } from "mongoose";

const customerlanguageScema = new Schema(
    {
        name: String,
        language_code: String,
      },
      {
        timestamps: true,
        toJSON: { virtuals: true },
        collection: "customerlanguages",
      }
    );
export default model("Customerlanguage", customerlanguageScema);






