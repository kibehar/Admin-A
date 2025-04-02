import mongoose, { Schema, Document } from "mongoose";

export interface IWarehouse extends Document {
  name: string;
  location: string;
  products: { productId: mongoose.Types.ObjectId; quantity: number }[];
}

const WarehouseSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

export default mongoose.model<IWarehouse>("Warehouse", WarehouseSchema);
