import { Schema, model } from "mongoose";
const fundsSchema = new Schema({
    _account_id: String,
    _paypal_id: String,
    is_active: Boolean,
    tokens: String,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    collection: "funds",
});
export default model("Funds", fundsSchema);
