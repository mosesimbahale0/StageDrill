import { Schema, model } from "mongoose";
const requestSchema = new Schema({
    _account_id: String,
    _funspot_id: String,
    text: String,
    emotion: String,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    collection: "requests",
});
export default model("Request", requestSchema);
