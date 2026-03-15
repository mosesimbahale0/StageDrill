import { Schema, model } from "mongoose";
const customerSchema = new Schema({
    _uid: String,
    _paypal_ids: Array,
    name: { type: String, trim: true, maxLength: 100 },
    language: String,
    language_code: String,
    phone: String,
    location: String,
    profession: String,
    sex: String,
    age: String,
    bday: String,
    likes: Array,
    rates: Array,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    collection: "customers"
});
export default model("Customer", customerSchema);
