import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  firstName: string;
  lastName: string;
  address: string;
  streetNumber: string;
  houseNumber: string;
  contact: string;
  email: string;
}

const SupplierSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  streetNumber: { type: String, required: true },
  houseNumber: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.model<ISupplier>('Supplier', SupplierSchema);
