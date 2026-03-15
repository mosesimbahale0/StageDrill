import { Schema, model } from "mongoose";
const cleanresponseSchema = new Schema({
    _request_id: String,
    _account_id: String,
    _funspot_id: String,
    _character_index: Number,
    text: String,
    emotion: String,
    is_read: Boolean,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    collection: "cleanresponses",
});
export default model("Cleanresponse", cleanresponseSchema);
