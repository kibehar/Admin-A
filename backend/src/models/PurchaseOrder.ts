import mongoose, { Schema, Document } from "mongoose";

export interface IPurchaseOrder extends Document {
  productId: mongoose.Types.ObjectId;
  supplierId: mongoose.Types.ObjectId;
  quantity: number;
  status: string; 
  orderDate: Date;
  expectedDelivery: Date;
}

const PurchaseOrderSchema: Schema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  orderDate: { type: Date, default: Date.now },
  expectedDelivery: { type: Date, required: true },
});

export default mongoose.model<IPurchaseOrder>("PurchaseOrder", PurchaseOrderSchema);
