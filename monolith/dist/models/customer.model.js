import { Schema, model } from "mongoose";
const customerSchema = new Schema({
    _uid: { type: String, required: true },
    phone_number: { type: String, required: true },
    kyc_verified: { type: Boolean, default: false },
    _kyc_id: { type: Schema.Types.ObjectId, ref: "Kyc" },
    user_name: { type: String },
    bio: { type: String },
    profile_picture: { type: String },
    cover_photo: { type: String },
    permanent_address: { type: String },
    is_active: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },
    is_moderated: { type: Boolean, default: false },
    website: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    tiktok: { type: String },
    pinterest: { type: String },
    likes: { type: Number },
    average_rating: { type: Number },
    review_count: { type: Number }
}, { timestamps: true, collection: "customers" });
export default model("Customer", customerSchema);
