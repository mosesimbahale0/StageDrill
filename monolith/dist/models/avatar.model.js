import { Schema, model } from "mongoose";
const avatarSchema = new Schema({
    name: String,
    photo: String,
    threed_model: String,
    voice_type: String,
    voice_name: String,
    SSML_gender: String,
    language_code: String,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    collection: "avatars",
});
export default model("Avatars", avatarSchema);
