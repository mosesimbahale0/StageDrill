import { Schema, model } from "mongoose";
const languageSchema = new Schema({
    name: String,
    language_code: String,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    collection: "languages",
});
export default model("Languages", languageSchema);
