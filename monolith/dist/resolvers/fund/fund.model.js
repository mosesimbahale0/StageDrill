// src/models/funds.model.ts
import mongoose, { Schema } from 'mongoose';
const fundSchema = new Schema({
    _paypal_id: { type: String, required: false },
    _account_id: { type: String, required: true, unique: true },
    is_active: { type: Boolean, default: true },
    tokens: { type: String, required: false },
}, { timestamps: true } // This will handle createdAt and updatedAt automatically
);
const Funds = mongoose.model('Fund', fundSchema);
export default Funds;
