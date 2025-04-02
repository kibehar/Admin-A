import mongoose, { Schema, Document } from "mongoose";

export interface ISale extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
  warehouseId: mongoose.Types.ObjectId;
  paymentStatus: string;
  saleDate: Date;
}

const SaleSchema: Schema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: true },
  paymentStatus: { type: String, required: true },
  saleDate: { type: Date, default: Date.now },
});

export default mongoose.model<ISale>("Sale", SaleSchema);
