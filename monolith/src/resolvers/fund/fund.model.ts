// src/models/funds.model.ts
import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IFundSchema extends Document {
  _id: Types.ObjectId;
  _paypal_id?: string;
  _account_id: string;
  is_active?: boolean;
  tokens?: string;
  createdAt?: Date; // Will be added by timestamps: true
  updatedAt?: Date; // Will be added by timestamps: true
}

const fundSchema = new Schema<IFundSchema>(
  {
    _paypal_id: { type: String, required: false },
    _account_id: { type: String, required: true, unique: true },
    is_active: { type: Boolean, default: true },
    tokens: { type: String, required: false },
  },
  { timestamps: true } // This will handle createdAt and updatedAt automatically
);

const Funds: Model<IFundSchema> = mongoose.model<IFundSchema>('Fund', fundSchema);
export default Funds;