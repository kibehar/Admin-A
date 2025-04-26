import mongoose, { Schema, Document } from "mongoose";

export interface ISale extends Document {
  productId: mongoose.Types.ObjectId;
  warehouseId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  saleDate: Date;
  paymentStatus: "Paid" | "Unpaid" | "Partial";
  customerName?: string;
  customerPhoneNumber?: string; 
  snapshot?: {
    name: string;
    category: string;
  };
}

const SaleSchema: Schema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ["Paid", "Unpaid", "Partial"], default: "Paid" },
  customerName: { type: String },
  customerPhoneNumber: { type: String }, 
  snapshot: {
    name: { type: String },
    category: { type: String },
  },
});

export default mongoose.model<ISale>("Sale", SaleSchema);
